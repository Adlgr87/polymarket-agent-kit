# Metrics — the formulas behind every number we publish

*Coverage as of 2026-08-16: 1.88B indexed Polygon fills · 2.13M markets · 3.06M scored wallets.*

If a metric here disagrees with a marketing page, this file wins — and the page
should be fixed. Everything is computed from resolved on-chain fills
(`trades`) joined to market resolution, never from a wallet's self-reported
history.

---

## 1. Why the obvious metric is the wrong one

**Raw win rate = wins / resolved bets.** It is the number every leaderboard
shows and it cannot rank anyone:

- **Small samples.** 8 wins from 8 bets is 100% and means nothing. A 90% win rate
  on eight bets is noise.
- **Price asymmetry.** Buying at 99.6¢ means an 99.86% win rate can still finish
  **negative** — 0.4¢ of upside against 99.6¢ of downside.
- **Selection.** Anyone can screen for high win rate after the fact.

Win rate may **filter** a board. It may never **sort** one.

## 2. Skill statistics (V5)

Per wallet, over resolved markets:

| Statistic | Definition | Why it exists |
| --- | --- | --- |
| `ev_per_dollar` | Expected value per dollar staked, estimated from resolved outcomes and entry price. | The thing you actually want: edge per unit risked. |
| `ev_ci_low` | Lower bound of the confidence interval on `ev_per_dollar`. | **The ranking key.** A wide interval is punished, so luck cannot outrank skill. |
| `effective_n` | Kish effective sample size — positions inside one event count as **fully correlated**. | A 50-leg date ladder is one bet, not fifty. Stops correlated runs manufacturing significance. |
| `z_decayed` | z-score with a **90-day half-life** decay. | Recent edge is worth more than a 2023 record. |
| `ev_decayed` | `ev_per_dollar` under the same decay. | Companion to `z_decayed`. |
| `skill_qvalue` | Benjamini–Hochberg false-discovery-rate q-value across tested wallets. | Screening 3M wallets produces false positives by construction; q corrects for the number of tests. |

**Ranking rule everywhere in the product: order by `ev_ci_low` or
`skill_qvalue`.** Never by `z_score` alone, never by win rate.
`wallet_rollup.z_score` is still the older V4 statistic until the rollup is
rebuilt.

## 3. Bot, human or maker — one verdict, with evidence

Every wallet carries exactly one `trader_kind` and a `trader_kind_evidence`
column recording the inputs that produced it:

- **`bot`** — ≥10,000 lifetime fills **and** ≥250 distinct markets.
- **`maker`** — machine flow whose maker rebates run ≥5× its taker rebates.
- **`human`** — has fills and neither machine rule fires.
- **`unknown`** — no verdict yet, rendered as "Unclassified", never as "human".

This matters because a "smart wallet" that is actually an exchange-funded market
maker is not a signal.

## 4. PnL, honestly labelled

`totalPnl` is **resolved-outcome PnL**, written per-fill under a held-to-resolution
model — not netted, not marked to market. It carries `pnlSource` and `pnlAsOf`.
Quote `pnlAsOf`: it is a snapshot, not a live figure. Open positions are shown
separately and are never summed into realised PnL.

## 5. The Insider Score (V4) — gated, not a checklist

A gated 0–100 score: **a trade only scores if the wallet bought an outcome the
market priced at 35¢ or below.** Past that gate, seven components set the number:
entry-depth tier, wallet skill z-score and fresh-wallet concentration, against
four penalties for bot behaviour, negative PnL, oversized funding clusters and
infrastructure funders.

- Weights were fit to measured edge — win rate minus entry price — across roughly
  **6,800 resolved alerts**, not hand-tuned.
- Signals that measured **negative** on resolved outcomes, including bet size,
  market category and timing clusters, were **removed rather than down-weighted**.
- Eligibility is stricter than the score: a flag also needs corroboration — wallet
  skill or a concentrated first bet — unless entry was under 10¢.
- **It is per-alert, not per-wallet.** A wallet has no "insider score"; its alerts do.

The **whale score** is a separate, ungated 0–100 model answering a different
question — how *notable* a position is: bet size, market category,
shrinkage-adjusted win rate, lifetime volume and activity, discounted for bot
behaviour. The two are never merged into one number.

## 6. Funding clusters

Wallets sharing a USDC funder are grouped in `funding_edges` / `funding_sources`.
A cluster is a **relationship, not a verdict**: Polymarket's own infrastructure
funds tens of thousands of proxies. Infra funders are detected and **penalise**
the score rather than boost it; a small cluster of unknown proxies with real edge
is the informative case.

## 7. Entry-timing edge

`get_wallet_timing` asks whether a wallet gets in **before** the crowd and before
the odds move — the difference between having information and following it.
Measured as the wallet's entry price against the market's subsequent price path.

---

## Definitions we refuse to bend

| Term | Means | Does **not** mean |
| --- | --- | --- |
| `trades.outcome` | Which side was bet ("Yes"). | Whether it won. |
| Win / loss | Computed from resolved outcome vs. bet side. | Stored on the trade. |
| Insider score | Per-alert, gated, V4. | Per-wallet, or a checklist count. |
| `totalPnl` | Resolved-outcome, snapshot (`pnlAsOf`). | Live, or mark-to-market. |

Methodology in prose: <https://crowdintel.xyz/methodology>. Glossary:
<https://crowdintel.xyz/glossary>.
