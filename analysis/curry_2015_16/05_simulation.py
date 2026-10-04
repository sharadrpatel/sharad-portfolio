"""Replay the ten seasons since 2015-16 and count how often 402 falls.

Each player with 300+ attempts in a season keeps his real number of attempts
and gets a "true" three-point percentage: his career rate, pulled toward the
average of high-volume shooters (empirical Bayes). His makes are then drawn
from a binomial. A replay breaks the record if anyone reaches 402.

Two versions:
  as played   everyone takes the attempts he actually took
  full health everyone plays all 82 games at his own attempts per game
              (the two shortened seasons are treated as full length too)

    python analysis/curry_2015_16/05_simulation.py
"""
import json

import numpy as np

from common import CURRY, OUTPUT, YEAR, load_player_seasons, section, to_jsonable

N_REPLAYS = 100_000
RECORD = 402
ps = load_player_seasons()


def true_talent(ps):
    """Career 3P%, shrunk toward the mean with a beta prior fit to careers of 500+ attempts."""
    career = ps.groupby("pid")[["fg3", "fg3a"]].sum()
    big = career[career.fg3a >= 500]
    p = big.fg3 / big.fg3a
    sampling_noise = (p * (1 - p) / big.fg3a).mean()
    spread = max(p.var() - sampling_noise, 1e-6)  # variance in real talent
    k = p.mean() * (1 - p.mean()) / spread - 1
    alpha, beta = p.mean() * k, (1 - p.mean()) * k
    print(f"  prior: mean {p.mean():.3f}, sd {np.sqrt(spread):.3f} (alpha {alpha:.0f}, beta {beta:.0f})")
    return (career.fg3 + alpha) / (career.fg3a + alpha + beta)


def replay(ps, talent, full_health=False, exclude=None, seed=7):
    rng = np.random.default_rng(seed)
    broke_any = np.zeros(N_REPLAYS, bool)
    by_season = {}
    for year in range(YEAR + 1, int(ps.year.max()) + 1):
        d = ps[(ps.year == year) & (ps.fg3a >= 300)]
        if exclude:
            d = d[d.player != exclude]
        attempts = d.fg3a / d.games * 82 if full_health else d.fg3a
        best = np.zeros(N_REPLAYS)
        for n, p in zip(attempts.round().astype(int), talent[d.pid]):
            best = np.maximum(best, rng.binomial(n, p, N_REPLAYS))
        by_season[year] = (best >= RECORD).mean()
        broke_any |= best >= RECORD
    return {"any_season": broke_any.mean(), "by_season": by_season}


if __name__ == "__main__":
    section("True talent")
    talent = true_talent(ps)
    results = {}
    for label, kwargs in {
        "as_played": {},
        "as_played_without_curry": {"exclude": CURRY},
        "full_health": {"full_health": True},
        "full_health_without_curry": {"full_health": True, "exclude": CURRY},
    }.items():
        results[label] = r = replay(ps, talent, **kwargs)
        section(label)
        print(f"  record falls at some point in the ten seasons: {r['any_season']:.1%}")
        print("  by season:", {y: round(float(v), 3) for y, v in r["by_season"].items() if v > 0.0005})
    OUTPUT.mkdir(exist_ok=True)
    (OUTPUT / "simulation.json").write_text(json.dumps(to_jsonable(results), indent=2) + "\n")
    print("\nsaved output/simulation.json")
