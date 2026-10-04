"""Every number in the post, in the order the post uses them.

Prints each one and saves them all to output/post_numbers.json, so the text
can be checked against the data after any change.

    python analysis/curry_2015_16/03_post_numbers.py
"""
import json

import numpy as np
import pandas as pd
from scipy import stats

from common import (CURRY, OUTPUT, SEASONS, YEAR, league_by_season, load_box, load_gamelog,
                    load_player_seasons, load_shots, load_team_seasons, section, team_games, to_jsonable)

ps = load_player_seasons()
league = league_by_season(ps)
season = ps[ps.year == YEAR]
curry = season[season.player == CURRY].iloc[0]
out = {}


def show(key, value, note=""):
    out[key] = value
    shown = f"{value:,.4g}" if isinstance(value, (float, np.floating)) else value
    print(f"  {key:<34} {shown}  {note}")


# ── Intro ────────────────────────────────────────────────────────────────
section("Intro")
show("player_seasons", len(ps), "player seasons since 1979-80")
show("curry_fg3", int(curry.fg3))
show("curry_fg3a", int(curry.fg3a))
show("curry_fg3_pct", curry.fg3_pct * 100)

# ── The record moved by 116 ──────────────────────────────────────────────
section("The record moved by 116")
leaders = ps.loc[ps.groupby("year").fg3.idxmax()].set_index("year")
record, progression = 0, []
for y in SEASONS:
    if leaders.fg3[y] > record:
        progression.append((y, leaders.player[y], int(leaders.fg3[y]), int(leaders.fg3[y] - record)))
        record = leaders.fg3[y]
for step in progression:
    print("  record:", step)
old_record = progression[-2][2]
show("old_record", old_record)
show("record_jump", int(curry.fg3 - old_record))
show("record_jump_pct", (curry.fg3 / old_record - 1) * 100)
show("home_run_equivalent", 73 * curry.fg3 / old_record, "73 home runs scaled by the same jump")

# ── Second place was 126 behind ──────────────────────────────────────────
section("Second place was 126 behind")
gaps = []
for y, d in ps.groupby("year"):
    top = d.nlargest(2, "fg3")
    gaps.append((y, top.iloc[0].player, int(top.iloc[0].fg3), top.iloc[1].player, int(top.iloc[1].fg3)))
gaps = pd.DataFrame(gaps, columns=["year", "leader", "fg3", "second", "fg3_second"]).set_index("year")
gaps["gap"] = gaps.fg3 - gaps.fg3_second
show("gap_2016", int(gaps.gap[YEAR]), f"over {gaps.second[YEAR]}, {gaps.fg3_second[YEAR]}")
other = gaps.drop(YEAR)
show("largest_other_gap", int(other.gap.max()), f"{other.leader[other.gap.idxmax()]}, {other.gap.idxmax()}")
show("tied_seasons", int((gaps.gap == 0).sum()))

regulars = season[season.mp >= 1500].fg3
show("regulars_mean_fg3", regulars.mean(), "players with 1,500+ minutes")
show("curry_sd_above", (curry.fg3 - regulars.mean()) / regulars.std(ddof=1))

box = load_box()
big = box[box.fg3 >= 8]
show("games_of_8_threes", len(big))
show("games_of_8_threes_curry", int((big.player == CURRY).sum()))
show("other_players_with_8", int(big[big.player != CURRY].player.nunique()))

# ── Volume and accuracy usually trade off ────────────────────────────────
section("Volume and accuracy")
volume = ps[ps.fg3a >= 700].sort_values("fg3_pct", ascending=False)
show("seasons_700_attempts", len(volume))
print(volume[["year", "player", "fg3", "fg3a", "fg3_pct"]].head(5).to_string(index=False))
best_other = volume[volume.player != CURRY].iloc[0]
show("best_other_pct_on_700", best_other.fg3_pct * 100, f"{best_other.player}, {best_other.year}")
maa = ps.nlargest(3, "makes_above_avg")[["year", "player", "makes_above_avg"]]
print(maa.to_string(index=False))
show("curry_makes_above_avg", curry.makes_above_avg)

shots = load_shots()
threes = shots[shots.is_three]
deep = shots[(shots.distance >= 28) & (shots.distance < 35)]
deep_curry = deep[deep.player_name == CURRY]
deep_rest = deep[deep.player_name != CURRY]
show("deep_curry_made", int(deep_curry.shot_made.sum()))
show("deep_curry_att", len(deep_curry))
show("deep_curry_pct", deep_curry.shot_made.mean() * 100)
show("deep_rest_pct", deep_rest.shot_made.mean() * 100)
show("deep_second_most_att", int(deep_rest.groupby("player_name").size().max()))
lg = league.loc[YEAR]
show("league_two_point_pct", (lg.fg - lg.fg3) / (lg.fga - lg.fg3a) * 100)

bins = pd.cut(threes.distance, [0, 24, 26, 28, 35], right=False, labels=["Under 24 ft", "24-26 ft", "26-28 ft", "28-35 ft"])
by_distance = threes.assign(bin=bins, curry=threes.player_name == CURRY).groupby(["bin", "curry"], observed=True).shot_made.agg(["sum", "count"])
print(by_distance)

# ── It wasn't only the threes ────────────────────────────────────────────
section("Scoring")
show("curry_ppg", curry.ppg)
show("curry_mpg", curry.mp / curry.games)
show("curry_ts", curry.ts * 100)
show("league_ts", curry.lg_ts * 100)
show("curry_ts_vs_league", curry.ts_vs_league)
# Scoring leaders: highest points per game among players with 58+ games.
scoring_leaders = ps[ps.games >= 58].sort_values("ppg", ascending=False).groupby("year").head(1)
runner_up = scoring_leaders[scoring_leaders.year != YEAR].nlargest(1, "ts_vs_league").iloc[0]
show("next_scoring_leader_margin", runner_up.ts_vs_league, f"{runner_up.player}, {runner_up.year}")
show("curry_fg_pct", curry.fg_pct * 100)
show("curry_ft_pct", curry.ft_pct * 100)
bird = ps[(ps.player == "Larry Bird") & (ps.year == 1988)].iloc[0]
show("bird_1988_ppg", bird.ppg, "the closest 50-40-90 season to 30 points")

# ── Ten seasons of trying ────────────────────────────────────────────────
section("Since 2016")
teams = load_team_seasons()
tg = team_games(ps, teams)
rate = league.fg3a / tg
show("team_3pa_per_game_2016", rate[2016])
show("team_3pa_per_game_2025", rate[2025])
show("increase_pct", (league.fg3a[2025] / league.fg3a[2016] - 1) * 100)
show("seasons_of_300_before_2016", int(((ps.fg3 >= 300) & (ps.year < YEAR)).sum()))
after = ps[(ps.fg3 >= 300) & (ps.year > YEAR)]
show("seasons_of_300_after_2016", len(after), f"{int((after.player == CURRY).sum())} by Curry")
harden = ps[(ps.player == "James Harden") & (ps.year == 2019)].iloc[0]
show("harden_2019_fg3", int(harden.fg3), f"on {int(harden.fg3a)} attempts")
show("leader_2026", int(leaders.fg3[2026]), leaders.player[2026])
show("curry_share_of_league", curry.fg3 / lg.fg3 * 100)
show("leader_2026_share", leaders.fg3[2026] / league.fg3[2026] * 100)
show("same_share_in_2026", curry.fg3 / lg.fg3 * league.fg3[2026])

# ── What it would take ───────────────────────────────────────────────────
section("What it would take")
for p in (curry.fg3_pct, 0.42, 0.40, 0.38, harden.fg3_pct):
    need = int(np.ceil(403 / round(p, 3)))
    print(f"  shoot {p:.1%}: {need:,} attempts, {need / 82:.1f} a game")
show("seasons_of_900_attempts", int((ps.fg3a >= 900).sum()))
# Coin-flip model: makes ~ Binomial(886 attempts, p).
n = int(curry.fg3a)
show("p_402_at_40pct", stats.binom.sf(401, n, 0.40), "about 1 in %d" % round(1 / stats.binom.sf(401, n, 0.40)))
show("p_402_at_42pct", stats.binom.sf(401, n, 0.42))
other_seasons = ps[(ps.player == CURRY) & (ps.year != YEAR)]
p_other = other_seasons.fg3.sum() / other_seasons.fg3a.sum()
show("curry_other_seasons_pct", p_other * 100)
show("p_402_at_curry_other_rate", stats.binom.sf(401, n, p_other), "about 1 in %d" % round(1 / stats.binom.sf(401, n, p_other)))

# ── What I'd be careful about ────────────────────────────────────────────
section("Caveats")
per_game = ps[ps.games >= 50].assign(fg3_pg=lambda d: d.fg3 / d.games).nlargest(3, "fg3_pg")
print(per_game[["year", "player", "games", "fg3", "fg3_pg"]].to_string(index=False))
c21 = ps[(ps.player == CURRY) & (ps.year == 2021)].iloc[0]
show("curry_2021_rate_over_79_games", c21.fg3 / c21.games * curry.games)
g84 = ps[(ps.year == 1984) & (ps.mp >= 1500)].fg3
show("regulars_mean_fg3_1984", g84.mean(), "Darrell Griffith made 91")
barkley = ps[(ps.player == "Charles Barkley") & (ps.year == 1988)].iloc[0]
show("barkley_1988_ts_vs_league", barkley.ts_vs_league, f"on {barkley.ppg:.1f} points a game")
curry_threes = threes[threes.player_name == CURRY]
show("shot_file_curry_attempts", len(curry_threes), f"of {int(curry.fg3a)} official")
show("shot_file_league_missing_pct", (1 - len(threes) / lg.fg3a) * 100)
gl = load_gamelog()
show("games_with_a_three", int((gl.fg3 > 0).sum()), f"of {len(gl)}")

OUTPUT.mkdir(exist_ok=True)
(OUTPUT / "post_numbers.json").write_text(json.dumps(to_jsonable(out), indent=2) + "\n")
print(f"\nsaved {len(out)} numbers to output/post_numbers.json")
