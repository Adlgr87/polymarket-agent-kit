"""Screen for wallets with statistically real category edge.

CrowdIntel's edge screener compares a wallet's win rate inside one category
against its global win rate and requires a minimum number of **resolved** bets,
so a 5-for-5 fluke cannot top the list. Raw win rate can filter a board but can
never sort one — see docs/pitfalls.md.

    export CROWDINTEL_TOKEN=cint_...   # free key, no card: crowdintel.xyz -> Settings -> API
    python3 screen_sharp_wallets.py politics

Only the standard library, so it runs anywhere.
"""

import json
import os
import sys
import urllib.parse
import urllib.request

BASE = "https://crowdintel.xyz/api/v1"


def get(path: str, **params) -> dict:
    token = os.environ.get("CROWDINTEL_TOKEN")
    if not token:
        sys.exit("set CROWDINTEL_TOKEN (mint a free key at crowdintel.xyz -> Settings -> API)")
    url = f"{BASE}{path}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def main(category: str = "politics", min_edge: float = 0.15, min_bets: int = 50) -> None:
    page = get("/signals/screen", category=category, min_edge=min_edge, min_bets=min_bets, limit=25)
    rows = page.get("data", [])

    print(f"{len(rows)} wallets with edge >= {min_edge} over >= {min_bets} resolved bets in '{category}'\n")
    print(f"{'wallet':44} {'edge':>7} {'cat WR':>7} {'gbl WR':>7} {'bets':>6} {'pnl':>12}")
    for w in rows:
        print(
            f"{(w.get('polymarket_name') or w['address'])[:43]:44} "
            f"{w.get('edge') or 0:7.3f} "
            f"{w.get('category_win_rate') or 0:7.3f} "
            f"{w.get('global_win_rate') or 0:7.3f} "
            f"{w.get('bets') or 0:6d} "
            f"{w.get('total_pnl') or 0:12,.0f}"
        )

    # The dossier behind the top row — the same call the terminal makes.
    if rows:
        top = rows[0]
        dossier = get(f"/wallets/{top['address']}")
        stats = dossier.get("wallet_stats") or dossier.get("stats") or {}
        print(f"\ntop wallet {top['address']}")
        print(f"  trader_kind         {stats.get('trader_kind')} ({stats.get('trader_kind_evidence')})")
        print(f"  bayesian_win_rate   {stats.get('bayesian_win_rate')}")
        print(f"  ev_ci_low           {stats.get('ev_ci_low')}")
        print(f"  pnl as of           {stats.get('pnl_as_of')}")


if __name__ == "__main__":
    main(*sys.argv[1:])
