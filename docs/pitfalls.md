# Pitfalls — seven ways Polymarket wallet data lies to you

Every one of these is a bug someone has shipped, in public, with a confident
chart attached. Read this before quoting any wallet statistic.

---

## 1. Raw win rate ranks luck

A wallet at 100% over 8 resolved bets and a wallet at 61% over 4,000 both show
"win rate". One is a coin flip, the other is an edge. **Without an effective
sample size the two are indistinguishable** — and positions inside one event are
correlated, so twenty legs of one date ladder are one opinion, not twenty bets.
Fix: rank on the confidence-interval lower bound of EV per dollar, with
event-clustered effective n (see [metrics.md](metrics.md)).

## 2. High win rate, negative PnL

Buying at 99.6¢ wins ~99.86% of the time and still loses money: you risk 99.6¢ to
make 0.4¢. Any screen sorted on win rate surfaces these first. This is not an
edge case; it is a strategy.

## 3. Wash trading and volume theatre

Two wallets trading the same market back and forth manufacture volume, "activity"
and a flattering win rate at negligible cost. Volume is the easiest number to
fake on-chain. Treat volume as a *filter* on relevance, never as evidence of skill.

## 4. Survivorship in your own screen

Testing the wallets that are on today's leaderboard is not a backtest — it is
choosing your winners after the race. A strategy is only measured by replaying
its **selection rule** over history and letting the losers in.

## 5. Proxy nonces are not freshness

**Every Polymarket proxy wallet starts at `nonce = 1`.** "Fresh wallet via low
nonce" is therefore meaningless — every wallet looks fresh. Use fill count and
first-seen timestamps for age.

## 6. Infrastructure looks exactly like a conspiracy

A 100+ wallet cluster funded from one address sounds like coordination. Usually it
is Polymarket's own plumbing, a bridge, or an exchange hot wallet. If the funder
is known infrastructure, a big cluster is **evidence of nothing** — and should
lower suspicion, not raise it. Small clusters of unknown proxies are the
interesting case.

## 7. "Unclassified" is not "human"

A missing bot/human verdict is a missing verdict. Reporting it as "human" turns an
absence of evidence into a claim. Three separate legacy classifiers
(`wallet_type`, `wallet_class`, `bot_signals`) still exist in the schema — the
verdict the product reads is `trader_kind`, and a NULL there renders as
"Unclassified".

---

## Also worth knowing

- **Resolution attribution.** PnL is resolved-outcome based; open positions are
  never summed into realised PnL. A live position can evaporate after the snapshot.
- **Correlated entries across wallets.** Ten wallets buying the same side in the
  same minute may share an operator — or a public signal. Cluster it, then judge
  the funder before you judge the wallets.
- **Category edge ≠ overall edge.** A wallet can be genuinely sharp in politics
  and net-negative everywhere else. Screen per category.
- **Snapshots drift.** Every stat has an `asOf`. Quote it, or someone will read a
  stale number as live.

## The one-line rule

> **Win rate can filter a board. It can never sort one.**

Rank on EV-per-dollar lower bound or an FDR-corrected skill q-value, state the
effective sample size, and say when the number was taken.
