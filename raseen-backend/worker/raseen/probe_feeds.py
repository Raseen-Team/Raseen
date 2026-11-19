"""Try candidate feed URLs and print how many items each returns. Run: python -m raseen.probe_feeds"""
import feedparser
import httpx

from .ingest import UA

G = "https://news.google.com/rss/search?hl=ar&gl=SA&ceid=SA:ar&q="
CANDIDATES = {
    "الرياض": ["https://www.alriyadh.com/rss", "https://www.alriyadh.com/rss.xml", "https://www.alriyadh.com/section.rss", G + "site:alriyadh.com"],
    "سبق": ["https://sabq.org/rss", "https://sabq.org/rss.xml", "https://sabq.org/feed", G + "site:sabq.org"],
    "عكاظ": ["https://www.okaz.com.sa/rss", "https://www.okaz.com.sa/rssFeed/0", "https://www.okaz.com.sa/rss.xml", G + "site:okaz.com.sa"],
    "اليوم": ["https://www.alyaum.com/rss", "https://www.alyaum.com/rss.xml", "https://www.alyaum.com/feed", G + "site:alyaum.com"],
    "واس": ["https://www.spa.gov.sa/rss.xml", "https://www.spa.gov.sa/ar/rss", "https://www.spa.gov.sa/rss", G + "site:spa.gov.sa"],
    "الصحة": ["https://www.moh.gov.sa/Ministry/MediaCenter/News/Pages/rss.aspx", "https://www.moh.gov.sa/_layouts/15/listfeed.aspx", G + "site:moh.gov.sa"],
}

with httpx.Client(headers={"User-Agent": UA}, follow_redirects=True, timeout=20) as c:
    for name, urls in CANDIDATES.items():
        for u in urls:
            try:
                r = c.get(u)
                n = len(feedparser.parse(r.content).entries)
                print(f"{name}\t{r.status_code}\t{n} items\t{r.headers.get('content-type','')[:30]}\t{u}")
            except Exception as e:
                print(f"{name}\terror {type(e).__name__}\t{u}")
