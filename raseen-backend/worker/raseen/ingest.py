"""Fetch RSS feeds and keep the articles that match a topic."""
from __future__ import annotations

import calendar
import datetime as dt
from dataclasses import dataclass

import feedparser
import httpx

from .text import content_hash, matches, strip_html

UA = "RaseenBot/0.1 (media monitoring prototype)"


@dataclass
class Article:
    url: str
    title: str
    summary: str
    published_at: dt.datetime | None
    source_id: str | None = None
    source_name: str = ""
    is_official: bool = False
    id: str | None = None

    @property
    def text(self) -> str:
        return f"{self.title}. {self.summary}"

    @property
    def hash(self) -> str:
        return content_hash(self.title, self.summary)


def _when(entry) -> dt.datetime | None:
    for k in ("published_parsed", "updated_parsed"):
        v = entry.get(k)
        if v:
            return dt.datetime.fromtimestamp(calendar.timegm(v), tz=dt.timezone.utc)
    return None


def parse_feed(raw: bytes | str, source: dict | None = None) -> list[Article]:
    source = source or {}
    feed = feedparser.parse(raw)
    out = []
    for e in feed.entries:
        url = e.get("link") or e.get("id")
        title = strip_html(e.get("title", ""))
        if not url or not title:
            continue
        out.append(Article(
            url=url.strip(),
            title=title,
            summary=strip_html(e.get("summary", "") or e.get("description", ""))[:1200],
            published_at=_when(e),
            source_id=source.get("id"),
            source_name=source.get("name", ""),
            is_official=bool(source.get("is_official")),
        ))
    return out


def fetch_source(client: httpx.Client, source: dict) -> tuple[list[Article], str]:
    """Returns (articles, status). Never raises: a broken feed must not stop the run."""
    try:
        r = client.get(source["feed_url"], timeout=20, follow_redirects=True)
        if r.status_code != 200:
            return [], f"http {r.status_code}"
        items = parse_feed(r.content, source)
        return items, f"ok {len(items)}"
    except Exception as e:  # noqa: BLE001
        return [], f"error {type(e).__name__}"


def for_topic(items: list[Article], topic: dict) -> list[Article]:
    kw, ex = topic.get("keywords") or [topic["name"]], topic.get("exclude") or []
    seen, out = set(), []
    for a in items:
        if a.url in seen or not matches(a.text, kw, ex):
            continue
        seen.add(a.url)
        out.append(a)
    return out
