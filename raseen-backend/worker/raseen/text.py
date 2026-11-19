"""Arabic text helpers: normalization, keyword matching, numbers and attribution clues."""
import hashlib
import re

_DIACRITICS = re.compile(r"[ؐ-ًؚ-ٰٟۖ-ۭـ]")  # tashkeel + tatweel
_PUNCT = re.compile(r"[^\w\s%]", re.UNICODE)
_SPACES = re.compile(r"\s+")
_ARABIC_DIGITS = str.maketrans("٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹", "01234567890123456789")


def normalize(text: str) -> str:
    """Lowercase, strip tashkeel, unify alef/ya/ta-marbuta and digits, drop punctuation."""
    if not text:
        return ""
    t = text.translate(_ARABIC_DIGITS)
    t = _DIACRITICS.sub("", t)
    t = re.sub("[إأآٱ]", "ا", t)
    t = t.replace("ى", "ي").replace("ة", "ه").replace("ؤ", "و").replace("ئ", "ي")
    t = _PUNCT.sub(" ", t.lower())
    return _SPACES.sub(" ", t).strip()


def strip_html(text: str) -> str:
    return _SPACES.sub(" ", re.sub(r"<[^>]+>", " ", text or "")).strip()


def content_hash(title: str, summary: str = "") -> str:
    return hashlib.sha1(normalize(f"{title} {summary}").encode()).hexdigest()


def matches(text: str, keywords: list[str], exclude: list[str] | None = None) -> bool:
    """True when any keyword appears as a phrase (after normalization) and no excluded phrase does."""
    t = f" {normalize(text)} "
    if exclude and any(f" {normalize(x)} " in t for x in exclude if x.strip()):
        return False
    for k in keywords:
        k = normalize(k)
        if not k:
            continue
        # allow Arabic prefixes like و/ب/ل/ال before the keyword
        if re.search(rf"(?:^|\s)(?:و|ب|ل|ف|ك)?(?:ال)?{re.escape(k)}", t):
            return True
    return False


_NUM = re.compile(r"\d+(?:[.,]\d+)?\s*%?")


def numbers(text: str) -> set[str]:
    """The figures an article states (40%, 1.2, 2026...). New figures mark a real update."""
    t = (text or "").translate(_ARABIC_DIGITS)
    return {re.sub(r"\s+", "", n).replace(",", ".") for n in _NUM.findall(t)}


_ATTRIB = re.compile(r"(?:نقلا|نقلاً|نقل)\s+عن|بحسب|وفقا\s+ل|وفقاً\s+ل|حسب\s+ما|أفاد|افاد|ذكر(?:ت)?|according to|citing", re.I)


def attribution_mentions(text: str, source_names: list[str]) -> list[str]:
    """Source names mentioned in an attribution phrase ('نقلاً عن سبق'). Used as a first-source clue."""
    t = text or ""
    if not _ATTRIB.search(t):
        return []
    nt = normalize(t)
    return [n for n in source_names if n and normalize(n) in nt]


_DENY = re.compile(r"\b(?:تنفي|نفت|ينفي|نفى|نفي|لا صحه|غير صحيح|عار عن الصحه|شائعه|مضلل)", re.U)


def denies(text: str) -> bool:
    """An official text that denies a claim ('الوزارة تنفي...', 'لا صحة لما يتداول')."""
    return bool(_DENY.search(normalize(text)))
