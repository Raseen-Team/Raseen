"""Group duplicate articles into stories, tell updates from republishes, and suggest the first source."""
from __future__ import annotations

import datetime as dt
from dataclasses import dataclass, field

import numpy as np

from .ingest import Article
from .text import attribution_mentions, denies, normalize, numbers


# ---------- embeddings ----------

class Embedder:
    name = "base"
    same_story = 0.5      # similarity needed to join a story
    denial_story = 0.35   # an official denial joins the claim it answers at this lower similarity
    republish = 0.8       # similarity above which an article only repeats the first one

    def encode(self, texts: list[str]) -> np.ndarray:  # rows are L2-normalized
        raise NotImplementedError


class E5Embedder(Embedder):
    """intfloat/multilingual-e5-small, as in the team's tech plan."""
    name = "multilingual-e5-small"
    # e5 scores everything on one topic high (0.84-0.88 across different stories in tests),
    # so a story needs 0.91+; same-story articles score 0.94-1.0
    same_story = 0.91
    denial_story = 0.9
    republish = 0.95

    def __init__(self):
        from sentence_transformers import SentenceTransformer
        self.m = SentenceTransformer("intfloat/multilingual-e5-small")

    def encode(self, texts):
        return np.asarray(self.m.encode([f"query: {t}" for t in texts], normalize_embeddings=True))


class TfidfEmbedder(Embedder):
    """Character n-grams on normalized Arabic. Works offline, used for tests and as a fallback."""
    name = "tfidf-char"
    same_story = 0.42
    denial_story = 0.29
    republish = 0.75

    def encode(self, texts):
        from sklearn.feature_extraction.text import TfidfVectorizer
        v = TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5), sublinear_tf=True)
        X = v.fit_transform([normalize(t) for t in texts])
        return X.toarray()  # TfidfVectorizer rows are already L2-normalized


def default_embedder() -> Embedder:
    try:
        return E5Embedder()
    except Exception:  # noqa: BLE001  (no model or no internet)
        return TfidfEmbedder()


# ---------- clustering ----------

@dataclass
class Story:
    articles: list[Article]
    first: Article
    roles: dict[str, str]                # url -> first | republish | update
    similarity: dict[str, float]         # url -> similarity to the first
    confidence: float
    reasons: list[dict]
    status: str
    key: str = field(default="")         # stable key: url of the earliest article

    @property
    def title(self) -> str:
        return self.first.title


def _t(a: Article) -> dt.datetime:
    return a.published_at or dt.datetime.max.replace(tzinfo=dt.timezone.utc)


def cluster(articles: list[Article], emb: Embedder) -> tuple[list[list[int]], np.ndarray]:
    """Greedy single pass in time order: an article joins the story it is most similar to
    (average similarity to the story's articles), or starts a new one."""
    if not articles:
        return [], np.zeros((0, 0))
    order = sorted(range(len(articles)), key=lambda i: _t(articles[i]))
    S = emb.encode([articles[i].text for i in range(len(articles))])
    sim = S @ S.T
    groups: list[list[int]] = []
    for i in order:
        # an official denial belongs with the claim it answers, even when worded differently
        a = articles[i]
        best, best_s = None, emb.denial_story if a.is_official and denies(a.text) else emb.same_story
        for g in groups:
            s = float(np.mean([sim[i, j] for j in g]))
            if s >= best_s:
                best, best_s = g, s
        if best is None:
            groups.append([i])
        else:
            best.append(i)
    return groups, sim


# ---------- first source ----------

def _hhmm(d: dt.datetime | None) -> str:
    if not d:
        return "—"
    return d.astimezone(dt.timezone(dt.timedelta(hours=3))).strftime("%H:%M")  # Riyadh time


def first_source(arts: list[Article], idx: list[int], sim: np.ndarray, emb: Embedder) -> tuple[int, float, list[dict]]:
    """Pick the candidate first source and explain why.
    Clues: earliest time, how close later wording is to it, who cites it, official status."""
    timed = [i for i in idx if arts[i].published_at]
    pool = timed or idx
    pool = sorted(pool, key=lambda i: _t(arts[i]))
    names = sorted({arts[i].source_name for i in idx if arts[i].source_name})

    cites: dict[str, int] = {}
    for i in idx:
        for n in attribution_mentions(arts[i].text, names):
            if n != arts[i].source_name:
                cites[n] = cites.get(n, 0) + 1

    def score(i: int) -> float:
        rank = pool.index(i)
        others = [j for j in idx if j != i]
        echo = float(np.mean([sim[i, j] for j in others])) if others else 0.0
        return (1.0 / (1 + rank)) + 0.5 * echo + 0.3 * min(cites.get(arts[i].source_name, 0), 5) / 5

    best = max(pool[:5], key=score)
    a = arts[best]
    others = [j for j in idx if j != best]
    echo = float(np.mean([sim[best, j] for j in others])) if others else 1.0
    later = [j for j in pool if j != best and arts[j].source_name != a.source_name]
    gap_min = None
    if a.published_at and later and arts[later[0]].published_at:
        gap_min = (arts[later[0]].published_at - a.published_at).total_seconds() / 60

    reasons = [
        {"key": "earliest", "label": "أقدم توقيت", "value": _hhmm(a.published_at)},
        {"key": "similarity", "label": "تشابه الصياغة", "value": f"{round(echo * 100)}%"},
        {"key": "cited", "label": "نقلوا عنه", "value": cites.get(a.source_name, 0)},
    ]
    if gap_min is not None:
        reasons.append({"key": "gap", "label": "سبق أقرب مصدر بـ", "value": f"{round(gap_min)} دقيقة"})
    if a.is_official:
        reasons.append({"key": "official", "label": "مصدر رسمي", "value": "نعم"})

    conf = 0.35
    if a.published_at:
        conf += 0.2
    if gap_min is not None:
        conf += 0.25 if gap_min >= 10 else (0.1 if gap_min > 0 else -0.1)
    if cites.get(a.source_name):
        conf += 0.15
    if len(idx) == 1:
        conf = 0.5
    return best, max(0.05, min(conf, 0.97)), reasons


def build_stories(articles: list[Article], emb: Embedder | None = None) -> list[Story]:
    emb = emb or default_embedder()
    if not articles:
        return []
    groups, sim = cluster(articles, emb)
    out = []
    for g in groups:
        f, conf, reasons = first_source(articles, g, sim, emb)
        first = articles[f]
        seen_nums = numbers(first.text)
        roles, sims = {first.url: "first"}, {first.url: 1.0}
        for i in sorted(g, key=lambda i: _t(articles[i])):
            if i == f:
                continue
            a = articles[i]
            s = float(sim[f, i])
            new_nums = numbers(a.text) - seen_nums
            roles[a.url] = "republish" if (s >= emb.republish and not new_nums) else "update"
            sims[a.url] = round(s, 3)
            seen_nums |= numbers(a.text)
        arts = [articles[i] for i in g]
        official = [a for a in arts if a.is_official]
        if official and any(denies(a.text) for a in official):
            status = "unsupported"   # an official source denies what is spreading
        elif official:
            status = "verified"
        elif conf < 0.6:
            status = "review"      # Raseen is not sure: stays under review
        else:
            status = "unsupported" if len(arts) >= 3 else "review"
        earliest = min(arts, key=_t)
        out.append(Story(arts, first, roles, sims, round(conf, 2), reasons, status, key=earliest.url))
    out.sort(key=lambda s: len(s.articles), reverse=True)
    return out
