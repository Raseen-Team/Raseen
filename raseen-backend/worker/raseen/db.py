"""Supabase access over its REST API (PostgREST) with the service key."""
from __future__ import annotations

import os

import httpx


class DB:
    def __init__(self, url: str | None = None, key: str | None = None):
        url = (url or os.environ["SUPABASE_URL"]).rstrip("/")
        key = (key or os.environ["SUPABASE_SERVICE_KEY"]).strip()
        kind = "secret" if key.startswith("sb_secret_") else "publishable (wrong key)" if key.startswith("sb_publishable_") \
            else "legacy JWT" if key.startswith("eyJ") else "unknown format"
        print(f"Supabase key: {kind}, {len(key)} chars")
        headers = {"apikey": key, "Content-Type": "application/json"}
        if not key.startswith("sb_"):  # legacy JWT keys also go in Authorization; new sb_secret_ keys go only in apikey
            headers["Authorization"] = f"Bearer {key}"
        self.c = httpx.Client(base_url=f"{url}/rest/v1", timeout=30, headers=headers)

    def select(self, table: str, **params) -> list[dict]:
        r = self.c.get(f"/{table}", params={"select": "*", **params})
        r.raise_for_status()
        return r.json()

    def insert(self, table: str, rows: list[dict] | dict, upsert_on: str | None = None, ignore: bool = False) -> list[dict]:
        if isinstance(rows, dict):
            rows = [rows]
        if not rows:
            return []
        prefer = ["return=representation"]
        params = {}
        if upsert_on:
            prefer.append("resolution=ignore-duplicates" if ignore else "resolution=merge-duplicates")
            params["on_conflict"] = upsert_on
        r = self.c.post(f"/{table}", params=params, json=rows, headers={"Prefer": ",".join(prefer)})
        if r.status_code >= 400:
            print("Supabase said:", r.text[:300])
        r.raise_for_status()
        return r.json()

    def update(self, table: str, values: dict, **filters) -> None:
        r = self.c.patch(f"/{table}", params=filters, json=values)
        r.raise_for_status()

    def delete(self, table: str, **filters) -> None:
        r = self.c.delete(f"/{table}", params=filters)
        r.raise_for_status()
