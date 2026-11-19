# رسين · الباك إند (النسخة الأولى)

Raseen monitors one topic from text sources, every hour:

1. **Collect**: reads the RSS feeds in the `sources` table and keeps the articles that match the topic's keywords.
2. **Stories**: groups duplicate articles into one story (multilingual-e5-small embeddings, with a TF-IDF fallback).
3. **Update or republish**: an article that repeats the first one is a republish. One that adds new figures or wording is an update.
4. **First source**: suggests the candidate first source, with its clues (earliest time, wording similarity, who cites it, gap to the next source, official or not). When Raseen isn't sure, the story stays «قيد المراجعة».
5. **Status**: `verified` when an official source published it, `unsupported` when it spread with no official source or an official source denied it, `review` otherwise. The specialist approves from the website.
6. **Brief**: a short brief where every claim is linked to its evidence `[n]`. Groq writes it when `GROQ_API_KEY` is set, otherwise an extractive brief is used. A claim without evidence is dropped.
7. **Coverage**: the `coverage_hourly` view (articles per hour).

## Files

| File | What it is |
|---|---|
| `supabase/migrations/001_init.sql` | The tables, the read permissions, and `review_story()` |
| `supabase/seed.sql` | The first topic and the sources |
| `worker/raseen/` | `ingest` collect · `stories` group + first source · `brief` brief · `run` one full run |
| `worker/tests/` | Tests on fictional news (no internet needed) |
| `../.github/workflows/raseen-worker.yml` | Runs everything every hour on GitHub |

## Setup

1. In Supabase, open **SQL Editor** and run `001_init.sql`, then `seed.sql`.
2. In GitHub, go to **Settings → Secrets and variables → Actions**:
   - Variable `SUPABASE_URL`
   - Secret `SUPABASE_SERVICE_KEY`: the secret key (service_role or sb_secret_…)
   - Secret `GROQ_API_KEY`: optional, for the AI-written brief
3. Under **Actions → «رسين · جمع الأخبار وتحليلها» → Run workflow**, run it once. After that it runs every hour.
4. The website (`raseen-app`) reads with the public key: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

To change the topic, edit the `topics` table (name and `keywords`). To add a source, add a row to `sources` with its `feed_url`.

## Run locally

```sh
cd worker
pip install -r requirements.txt pytest
python -m pytest -q tests
SUPABASE_URL=... SUPABASE_SERVICE_KEY=... python -m raseen.run
```
