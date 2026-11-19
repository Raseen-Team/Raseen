"""A documented brief: short claims, each linked to numbered evidence [n].
Uses Groq (OpenAI-compatible API) when GROQ_API_KEY is set; otherwise an extractive brief.
Any claim the model writes without valid evidence is dropped, so nothing reaches the reader unbacked."""
from __future__ import annotations

import json
import os
import re

import httpx

from .stories import Story

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = os.getenv("RASEEN_LLM_MODEL", "openai/gpt-oss-120b")

STATUS_AR = {"verified": "موثّق", "review": "قيد المراجعة", "unsupported": "ادعاء غير مدعوم"}

SYSTEM = """أنت محرر رصد إعلامي في منصة رسين. تكتب موجزًا قصيرًا بالعربية الفصحى البسيطة.
القواعد:
- اكتب فقط ما تقوله الأدلة المرقمة. لا تضف أي معلومة من عندك.
- كل جملة لازم تنتهي بأرقام أدلتها، وتكون الأرقام من القائمة فقط.
- فرّق بين ما أكده مصدر رسمي وما هو منتشر بدون مصدر رسمي.
- لا تحكم على صحة الادعاء؛ قل فقط من نشر ماذا ومتى.
أعد JSON فقط بالشكل: {"title": "...", "claims": [{"text": "...", "evidence": [1,2], "story": 0}]}"""


def evidence_list(stories: list[Story], per_story: int = 4) -> list[dict]:
    ev, n = [], 1
    for si, s in enumerate(stories):
        picks = [s.first] + [a for a in s.articles if a is not s.first and s.roles.get(a.url) == "update"]
        picks += [a for a in s.articles if a not in picks]
        for a in picks[:per_story]:
            ev.append({
                "n": n, "story": si, "article_id": a.id, "source": a.source_name, "official": a.is_official,
                "title": a.title, "url": a.url,
                "published_at": a.published_at.isoformat() if a.published_at else None,
                "role": s.roles.get(a.url),
            })
            n += 1
    return ev


def _validate(claims: list[dict], ev: list[dict]) -> list[dict]:
    ok_n = {e["n"] for e in ev}
    out = []
    for c in claims:
        text = re.sub(r"\s*\[\d+(?:\s*,\s*\d+)*\]\s*$", "", str(c.get("text", "")).strip())
        nums = [int(x) for x in c.get("evidence", []) if str(x).isdigit() and int(x) in ok_n]
        if text and nums:
            out.append({"text": text, "evidence": sorted(set(nums)), "story": c.get("story")})
    return out


def count(n: int, one: str, two: str, few: str, many: str) -> str:
    """Arabic number agreement: 1 خبر واحد, 2 خبرين, 3-10 أخبار, 11+ خبرًا."""
    if n == 1:
        return one
    if n == 2:
        return two
    return f"{n} {few if n <= 10 else many}"


def extractive(topic: str, stories: list[Story], ev: list[dict]) -> dict:
    claims = []
    for si, s in enumerate(stories):
        mine = [e for e in ev if e["story"] == si]
        first = mine[0]
        n_src = len({a.source_name for a in s.articles})
        txt = (f"«{s.title}»: أول من نشره {first['source'] or 'مصدر غير معروف'}، "
               f"وتناقله {count(n_src, 'مصدر واحد', 'مصدران', 'مصادر', 'مصدرًا')} "
               f"في {count(len(s.articles), 'خبر واحد', 'خبرين', 'أخبار', 'خبرًا')}. الحالة: {STATUS_AR[s.status]}.")
        claims.append({"text": txt, "evidence": [e["n"] for e in mine], "story": si})
    return {"title": f"موجز رصد: {topic}", "claims": claims, "model": "extractive"}


def write_brief(topic: str, stories: list[Story], max_stories: int = 5) -> dict:
    stories = stories[:max_stories]
    ev = evidence_list(stories)
    if not stories:
        return {"title": f"موجز رصد: {topic}", "claims": [], "evidence": [], "model": "none"}
    key = os.getenv("GROQ_API_KEY")
    result = None
    if key:
        lines = []
        for si, s in enumerate(stories):
            lines.append(f"\nقصة {si}: {s.title} (الحالة: {STATUS_AR[s.status]}، {len(s.articles)} خبرًا)")
            for e in [e for e in ev if e["story"] == si]:
                tag = "مصدر رسمي" if e["official"] else "مصدر غير رسمي"
                lines.append(f"[{e['n']}] {e['source']} ({tag}) {e['published_at'] or ''}: {e['title']}")
        try:
            r = httpx.post(GROQ_URL, timeout=60, headers={"Authorization": f"Bearer {key}"}, json={
                "model": MODEL,
                "temperature": 0.2,
                "response_format": {"type": "json_object"},
                "messages": [
                    {"role": "system", "content": SYSTEM},
                    {"role": "user", "content": f"الموضوع: {topic}\nالأدلة:\n" + "\n".join(lines)},
                ],
            })
            r.raise_for_status()
            data = json.loads(r.json()["choices"][0]["message"]["content"])
            claims = _validate(data.get("claims", []), ev)
            if claims:
                result = {"title": data.get("title") or f"موجز رصد: {topic}", "claims": claims, "model": MODEL}
        except Exception as e:  # noqa: BLE001
            print(f"brief: AI failed ({type(e).__name__}), using extractive brief")
    result = result or extractive(topic, stories, ev)
    result["evidence"] = ev
    return result
