import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from raseen.brief import write_brief  # noqa: E402
from raseen.ingest import for_topic, parse_feed  # noqa: E402
from raseen.stories import TfidfEmbedder, build_stories  # noqa: E402
from raseen.text import denies, matches, normalize, numbers  # noqa: E402

from fixtures import FEEDS, TOPIC  # noqa: E402


def articles():
    out = []
    for src, raw in FEEDS.values():
        out += parse_feed(raw, src)
    return for_topic(out, TOPIC)


def stories():
    return build_stories(articles(), TfidfEmbedder())


def test_normalize_and_match():
    assert normalize("الصِّحَّة") == "الصحه"
    assert matches("قالت وزارة الصحة اليوم", ["وزارة الصحة"])
    assert matches("والصحة تؤكد", ["الصحة"])
    assert not matches("الأهلي يفوز على الهلال", ["الصحة"])
    assert numbers("رسوم ٥٠ ريالا و 40%") == {"50", "40%"}
    assert denies("وزارة الصحة تنفي فرض رسوم")


def test_topic_filter_drops_unrelated():
    urls = {a.url for a in articles()}
    assert "https://sabq.example/sport" not in urls
    assert len(urls) == 9


def test_duplicates_grouped():
    ss = stories()
    by_first = {s.first.url: s for s in ss}
    fees = next(s for s in ss if "رسوم" in s.title)
    assert {a.url for a in fees.articles} >= {"https://blog.example/fees", "https://sabq.example/1", "https://okaz.example/a", "https://riyadh.example/x"}
    flu = next(s for s in ss if "الإنفلونزا" in s.title)
    assert {"https://moh.example/flu", "https://sabq.example/2", "https://okaz.example/b"} <= {a.url for a in flu.articles}
    assert "https://riyadh.example/y" not in {a.url for a in fees.articles} | {a.url for a in flu.articles}
    assert len(by_first) == len(ss)


def test_first_source_and_evidence():
    fees = next(s for s in stories() if "رسوم" in s.title)
    assert fees.first.url == "https://blog.example/fees"
    keys = {r["key"]: r["value"] for r in fees.reasons}
    assert keys["earliest"] == "07:42"          # Riyadh time
    assert keys["cited"] >= 2                   # sabq and okaz cite the blog
    assert fees.confidence >= 0.6


def test_status_official_denial_and_confirmation():
    ss = stories()
    fees = next(s for s in ss if "رسوم" in s.title)
    flu = next(s for s in ss if "الإنفلونزا" in s.title)
    assert fees.status == "unsupported"   # the ministry denies it
    assert flu.status == "verified"       # the ministry announced it
    assert flu.first.url == "https://moh.example/flu"


def test_update_vs_republish():
    ss = stories()
    flu = next(s for s in ss if "الإنفلونزا" in s.title)
    assert flu.roles["https://okaz.example/b"] == "update"      # adds 3 million / 2400 centres
    fees = next(s for s in ss if "رسوم" in s.title)
    assert fees.roles["https://riyadh.example/x"] == "republish"


def test_extractive_brief_claims_have_evidence():
    os.environ.pop("GROQ_API_KEY", None)
    b = write_brief("وزارة الصحة", stories())
    assert b["model"] == "extractive"
    assert b["claims"] and all(c["evidence"] for c in b["claims"])
    ns = {e["n"] for e in b["evidence"]}
    assert all(set(c["evidence"]) <= ns for c in b["claims"])


def test_ai_claims_without_evidence_are_dropped():
    from raseen.brief import _validate
    ev = [{"n": 1}, {"n": 2}]
    out = _validate([{"text": "ok [1]", "evidence": [1]}, {"text": "no proof", "evidence": []}, {"text": "bad", "evidence": [9]}], ev)
    assert out == [{"text": "ok", "evidence": [1], "story": None}]
