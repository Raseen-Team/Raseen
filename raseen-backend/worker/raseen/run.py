"""One monitoring run: fetch → keep topic articles → stories → first source → brief.
Run: python -m raseen.run   (needs SUPABASE_URL, SUPABASE_SERVICE_KEY; GROQ_API_KEY optional)"""
from __future__ import annotations

import datetime as dt
import os

import httpx

from .brief import write_brief
from .db import DB
from .ingest import UA, Article, fetch_source, for_topic
from .stories import build_stories, default_embedder

WINDOW_DAYS = int(os.getenv("RASEEN_WINDOW_DAYS", "7"))
BRIEF_HOURS = int(os.getenv("RASEEN_BRIEF_HOURS", "48"))


def now() -> dt.datetime:
    return dt.datetime.now(dt.timezone.utc)


def _parse(ts: str | None) -> dt.datetime | None:
    return dt.datetime.fromisoformat(ts.replace("Z", "+00:00")) if ts else None


def save_stories(db: DB, topic_id: str, stories, by_url: dict[str, str]) -> int:
    """Keep story ids stable between runs: a new group takes over the old story it shares most articles with.
    A specialist's review stays on the story."""
    old = db.select("stories", topic_id=f"eq.{topic_id}")
    links = db.select("story_articles", select="story_id,article_id",
                      story_id=f"in.({','.join(s['id'] for s in old)})") if old else []
    members: dict[str, set[str]] = {}
    for l in links:
        members.setdefault(l["story_id"], set()).add(l["article_id"])
    reviewed = {s["id"]: s for s in old if s.get("reviewed_at")}
    used = set()
    for s in stories:
        ids = {by_url[a.url] for a in s.articles}
        match = max((o for o in old if o["id"] not in used), key=lambda o: len(members.get(o["id"], set()) & ids), default=None)
        if match and not (members.get(match["id"], set()) & ids):
            match = None
        row = {
            "topic_id": topic_id, "title": s.title, "status": s.status,
            "first_article_id": by_url[s.first.url], "first_confidence": s.confidence, "first_reasons": s.reasons,
            "article_count": len(s.articles), "source_count": len({a.source_name for a in s.articles}),
            "update_count": sum(1 for r in s.roles.values() if r == "update"),
            "republish_count": sum(1 for r in s.roles.values() if r == "republish"),
            "first_seen": min((a.published_at for a in s.articles if a.published_at), default=None),
            "last_seen": max((a.published_at for a in s.articles if a.published_at), default=None),
            "updated_at": now().isoformat(),
        }
        for k in ("first_seen", "last_seen"):
            row[k] = row[k].isoformat() if row[k] else None
        if match:
            used.add(match["id"])
            if match["id"] in reviewed:      # the specialist's decision wins over Raseen's suggestion
                row["status"] = reviewed[match["id"]]["status"]
            db.update("stories", row, id=f"eq.{match['id']}")
            sid = match["id"]
            db.delete("story_articles", story_id=f"eq.{sid}")
        else:
            sid = db.insert("stories", row)[0]["id"]
        db.insert("story_articles", [
            {"story_id": sid, "article_id": by_url[a.url], "role": s.roles[a.url], "similarity": s.similarity.get(a.url)}
            for a in s.articles
        ])
    for o in old:
        if o["id"] not in used:
            db.delete("stories", id=f"eq.{o['id']}")
    return len(stories)


def main() -> None:
    db = DB()
    run = db.insert("runs", {"stats": {}})[0]
    stats: dict = {"sources": {}, "topics": {}}
    topics = db.select("topics", active="eq.true")
    sources = db.select("sources", active="eq.true")
    src_by_id = {s["id"]: s for s in sources}

    fetched: list[Article] = []
    with httpx.Client(headers={"User-Agent": UA}) as c:
        for s in sources:
            if not s.get("feed_url"):
                continue
            items, status = fetch_source(c, s)
            fetched += items
            stats["sources"][s["name"]] = status
            db.update("sources", {"last_fetch": now().isoformat(), "last_status": status}, id=f"eq.{s['id']}")
            print(f"{s['name']}: {status}")

    emb = default_embedder()
    print("embedder:", emb.name)
    since = (now() - dt.timedelta(days=WINDOW_DAYS)).isoformat()
    for t in topics:
        mine = for_topic(fetched, t)
        db.insert("articles", [{
            "topic_id": t["id"], "source_id": a.source_id, "url": a.url, "title": a.title, "summary": a.summary,
            "published_at": a.published_at.isoformat() if a.published_at else None, "content_hash": a.hash,
        } for a in mine], upsert_on="topic_id,url", ignore=True)

        rows = db.select("articles", topic_id=f"eq.{t['id']}", published_at=f"gte.{since}", order="published_at.asc", limit="1500")
        arts = []
        for r in rows:
            src = src_by_id.get(r["source_id"], {})
            arts.append(Article(url=r["url"], title=r["title"], summary=r["summary"] or "", published_at=_parse(r["published_at"]),
                                source_id=r["source_id"], source_name=src.get("name", ""), is_official=bool(src.get("is_official")), id=r["id"]))
        stories = build_stories(arts, emb)
        n = save_stories(db, t["id"], stories, {a.url: a.id for a in arts})

        recent = [s for s in stories if s.articles and max((a.published_at for a in s.articles if a.published_at), default=now()) >= now() - dt.timedelta(hours=BRIEF_HOURS)]
        b = write_brief(t["name"], recent or stories)
        if b["claims"]:
            db.delete("briefs", topic_id=f"eq.{t['id']}", status="eq.draft")
            db.insert("briefs", {
                "topic_id": t["id"], "period_from": (now() - dt.timedelta(hours=BRIEF_HOURS)).isoformat(), "period_to": now().isoformat(),
                "title": b["title"], "claims": b["claims"], "evidence": b["evidence"], "model": b["model"], "status": "draft",
            })
        stats["topics"][t["name"]] = {"new_matches": len(mine), "articles": len(arts), "stories": n, "brief": b["model"]}
        print(t["name"], stats["topics"][t["name"]])

    stats["embedder"] = emb.name
    db.update("runs", {"finished_at": now().isoformat(), "stats": stats}, id=f"eq.{run['id']}")


if __name__ == "__main__":
    main()
