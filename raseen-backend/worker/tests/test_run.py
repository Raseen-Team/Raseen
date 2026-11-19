"""End-to-end run against an in-memory stand-in for Supabase."""
import os
import sys
import uuid

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import raseen.run as run  # noqa: E402
from raseen.ingest import parse_feed  # noqa: E402
from raseen.stories import TfidfEmbedder  # noqa: E402

from fixtures import FEEDS  # noqa: E402


class FakeDB:
    def __init__(self):
        self.t = {k: [] for k in ["topics", "sources", "articles", "stories", "story_articles", "briefs", "runs"]}

    def _match(self, row, filters):
        for k, v in filters.items():
            if k in ("select", "order", "limit", "on_conflict"):
                continue
            op, _, val = v.partition(".")
            x = row.get(k)
            if op == "eq" and str(x).lower() != val.lower():
                return False
            if op == "in" and str(x) not in val.strip("()").split(","):
                return False
            if op == "gte" and (x is None or x < val):
                return False
        return True

    def select(self, table, **p):
        rows = [dict(r) for r in self.t[table] if self._match(r, p)]
        if "select" in p and p["select"] != "*":
            keep = p["select"].split(",")
            rows = [{k: r.get(k) for k in keep} for r in rows]
        return rows

    def insert(self, table, rows, upsert_on=None, ignore=False):
        rows = [rows] if isinstance(rows, dict) else rows
        out = []
        for r in rows:
            if upsert_on:
                keys = upsert_on.split(",")
                if any(all(e.get(k) == r.get(k) for k in keys) for e in self.t[table]):
                    continue
            r = {"id": str(uuid.uuid4()), "reviewed_at": None, **r}
            self.t[table].append(r)
            out.append(r)
        return out

    def update(self, table, values, **f):
        for r in self.t[table]:
            if self._match(r, f):
                r.update(values)

    def delete(self, table, **f):
        self.t[table] = [r for r in self.t[table] if not self._match(r, f)]
        if table == "stories":  # cascade
            ids = {r["id"] for r in self.t["stories"]}
            self.t["story_articles"] = [r for r in self.t["story_articles"] if r["story_id"] in ids]


def setup(monkeypatch):
    db = FakeDB()
    db.insert("topics", {"name": "وزارة الصحة", "keywords": ["وزارة الصحة", "الصحة", "مستشفى"], "exclude": [], "active": True})
    for key, (src, raw) in FEEDS.items():
        db.insert("sources", {"id": src["id"], "name": src["name"], "is_official": src["is_official"], "feed_url": f"https://{key}.example/rss", "active": True})
    monkeypatch.setattr(run, "DB", lambda: db)
    monkeypatch.setattr(run, "default_embedder", TfidfEmbedder)
    by_feed = {f"https://{k}.example/rss": v for k, v in FEEDS.items()}
    monkeypatch.setattr(run, "fetch_source", lambda c, s: (parse_feed(by_feed[s["feed_url"]][1], s), "ok"))
    monkeypatch.setattr(run, "WINDOW_DAYS", 100000)
    monkeypatch.delenv("GROQ_API_KEY", raising=False)
    return db


def test_full_run_and_stable_ids(monkeypatch):
    db = setup(monkeypatch)
    run.main()
    assert len(db.t["articles"]) == 9
    stories = db.t["stories"]
    assert len(stories) == 3
    fees = next(s for s in stories if "رسوم" in s["title"])
    assert fees["status"] == "unsupported" and fees["article_count"] == 5
    assert len(db.t["briefs"]) == 1 and db.t["briefs"][0]["claims"]
    assert db.t["runs"][0]["finished_at"]

    # the specialist keeps it under review; the next run must keep the id and the decision
    db.update("stories", {"status": "review", "reviewed_at": "2026-11-19T10:00:00+00:00", "reviewed_by": "نورة"}, id=f"eq.{fees['id']}")
    run.main()
    assert len(db.t["articles"]) == 9            # no duplicates on re-fetch
    again = next(s for s in db.t["stories"] if "رسوم" in s["title"])
    assert again["id"] == fees["id"]
    assert again["status"] == "review"
    assert len(db.t["briefs"]) == 1              # the draft is replaced, not piled up
    assert len([l for l in db.t["story_articles"] if l["story_id"] == fees["id"]]) == 5
