"""Working feed URLs, checked from GitHub on 2026-11-19 (python -m raseen.probe_feeds).
Most Saudi sites have no working RSS, so their news comes through Google News limited to that site.
Each run applies these by source name, so nobody has to edit the table by hand."""
from urllib.parse import quote

G = "https://news.google.com/rss/search?hl=ar&gl=SA&ceid=SA:ar&q="


def site(domain: str, words: str = "الصحة") -> str:
    return G + quote(f"site:{domain} {words}".strip())


FEEDS = {
    "جريدة الرياض": site("alriyadh.com"),
    "صحيفة سبق": site("sabq.org"),
    "صحيفة عكاظ": "https://www.okaz.com.sa/rssFeed/0",
    "صحيفة اليوم": site("alyaum.com"),
    "وكالة الأنباء السعودية": site("spa.gov.sa"),
    "وزارة الصحة": site("moh.gov.sa", ""),
}


def sync_sources(db) -> None:
    for name, url in FEEDS.items():
        db.update("sources", {"feed_url": url}, name=f"eq.{name}")
