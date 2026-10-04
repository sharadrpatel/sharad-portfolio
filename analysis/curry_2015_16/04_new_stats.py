"""The numbers for the sections added to the post after the first draft:
parts of the season, whole teams, shot value, the attempts leader, the trend
line. Plus a few that did not make it in.

Each function is one idea. It prints what it finds and returns the numbers,
which are saved to output/new_stats.json.

    python analysis/curry_2015_16/04_new_stats.py
"""
import json

import numpy as np
import pandas as pd
from scipy import stats

from common import (CURRY, OUTPUT, SHORT_SEASONS, YEAR, coldest_window, leader_trend, league_by_season, load_box,
                    load_gamelog, load_player_seasons, load_shots, load_team_seasons, section, team_games,
                    to_jsonable)

ps = load_player_seasons()
league = league_by_season(ps)
season = ps[ps.year == YEAR]
curry = season[season.player == CURRY].iloc[0]
runner_up = season[season.player != CURRY].nlargest(1, "fg3").iloc[0]  # Klay Thompson, 276
OLD_RECORD = int(ps[ps.year < YEAR].fg3.max())  # 286
shots = load_shots()
threes = shots[shots.is_three]
gamelog = load_gamelog()
teams = load_team_seasons()


def three_quarters():
    """What if every game had ended after the third quarter?

    The shot file has 401 of his 402 makes, so each count could be one low.
    """
    section("Three quarters would have been enough")
    c = threes[(threes.player_name == CURRY) & threes.shot_made]
    by_quarter = c.groupby("quarter").size()
    through_three = int(by_quarter.loc[:3].sum())
    others = threes[(threes.player_name != CURRY) & threes.shot_made & (threes.quarter <= 3)]
    next_best = others.groupby("player_name").size().nlargest(1)
    # Games in which he never took a shot after the third quarter.
    last_quarter = shots[shots.player_name == CURRY].groupby("game_id").quarter.max()
    no_fourth = int((last_quarter < 4).sum())
    print(f"  makes by quarter: {by_quarter.to_dict()}")
    print(f"  through three quarters: {through_three} (old record {OLD_RECORD}, runner-up's full season {int(runner_up.fg3)})")
    print(f"  next best through three quarters: {next_best.index[0]}, {int(next_best.iloc[0])}")
    print(f"  games with no shot attempt after the third quarter: {no_fourth} of {last_quarter.size}")
    return {"by_quarter": by_quarter.to_dict(), "through_three": through_three,
            "margin_over_old_record": through_three - OLD_RECORD, "next_best_through_three": int(next_best.iloc[0]),
            "games_without_a_fourth_quarter_shot": no_fourth}


def one_quarter():
    """His first quarters alone, ranked against everyone's full season."""
    section("His first quarters alone")
    c = threes[(threes.player_name == CURRY) & threes.shot_made]
    first = int((c.quarter == 1).sum())
    third = int((c.quarter == 3).sum())
    totals = season[season.player != CURRY].fg3
    out = {"first_quarter_makes": first, "first_quarter_rank": int((totals > first).sum()) + 1,
           "third_quarter_makes": third, "third_quarter_rank": int((totals > third).sum()) + 1,
           "players_in_league": len(season)}
    print(f"  first quarters: {first} threes, which would rank {out['first_quarter_rank']} of {len(season)} players")
    print(f"  third quarters: {third} threes, which would rank {out['third_quarter_rank']}")
    return out


def coldest_stretch(window=20):
    """His worst run of games, compared with everyone else's best."""
    section(f"His coldest {window} games")
    first, last = coldest_window(gamelog, window)
    stretch = gamelog[gamelog.game.between(first, last)]
    worst_pg = stretch.fg3.sum() / window
    worst_pct = stretch.fg3.sum() / stretch.fg3a.sum() * 100
    start_date, end_date = stretch.date.iloc[0], stretch.date.iloc[-1]
    out = {"window": window, "first_game": first, "last_game": last, "makes_per_game": worst_pg, "pct": worst_pct,
           "from": start_date, "to": end_date,
           "pace_over_his_79_games": worst_pg * curry.games,
           "runner_up_season_per_game": runner_up.fg3 / runner_up.games}
    print(f"  {start_date:%b %d} to {end_date:%b %d}: {worst_pg:.2f} a game at {worst_pct:.1f}%")
    print(f"  that pace over his 79 games: {worst_pg * curry.games:.0f} (old record {OLD_RECORD})")
    print(f"  {runner_up.player}'s season average: {runner_up.fg3 / runner_up.games:.2f} a game")
    for w in (10, 15, 30):
        m = gamelog.fg3.rolling(w).sum().min() / w
        print(f"  worst {w} games: {m:.2f} a game")
    return out


def clinched():
    """The date he had the three-point title won."""
    section("He could have stopped in February")
    cum = gamelog.fg3.cumsum()
    tie = gamelog[cum >= runner_up.fg3].iloc[0]
    passed = gamelog[cum > OLD_RECORD].iloc[0]
    rest = int(curry.fg3 - cum[tie.name])
    out = {"matched_runner_up_total_in_game": int(tie.game), "date": tie.date,
           "games_left": int(len(gamelog) - tie.game), "threes_after": rest,
           "rank_of_threes_after": int((season[season.player != CURRY].fg3 > rest).sum()) + 1,
           "broke_old_record_in_game": int(passed.game), "broke_old_record_date": passed.date}
    print(f"  reached {int(runner_up.fg3)} (the runner-up's final total) in game {tie.game}, {tie.date:%b %d, %Y}, with {out['games_left']} games left")
    print(f"  the {rest} he made after that would rank {out['rank_of_threes_after']} in the league on their own")
    print(f"  passed the old record of {OLD_RECORD} in game {passed.game}, {passed.date:%b %d, %Y}")
    return out


def versus_teams():
    """One player against whole rosters."""
    section("Curry against entire teams")
    full = teams[~teams.year.isin([*SHORT_SEASONS, 2020])]  # 82-game seasons only
    fewer = full[full.fg3 < curry.fg3]
    latest = fewer[fewer.year == fewer.year.max()]
    tg = team_games(ps, teams)
    avg_team_pg = league.fg3 / tg
    curry_pg = curry.fg3 / curry.games
    last_below = int(avg_team_pg[avg_team_pg < curry_pg - 0.05].index.max())
    deep = shots[(shots.distance >= 28) & (shots.distance < 35) & shots.shot_made]
    deep_curry = int((deep.player_name == CURRY).sum())
    deep_teams = deep[deep.player_name != CURRY].groupby("team_name").size().sort_values(ascending=False)
    out = {"team_seasons_with_fewer": len(fewer), "team_seasons": len(full), "share": len(fewer) / len(full) * 100,
           "latest_team_with_fewer": f"{latest.team.iloc[0]} {latest.year.iloc[0]}", "latest_team_fg3": int(latest.fg3.iloc[0]),
           "curry_per_game": curry_pg, "last_season_avg_team_below": last_below,
           "avg_team_per_game_then": avg_team_pg[last_below],
           "deep_curry": deep_curry, "deep_best_other_team": deep_teams.index[0], "deep_best_other_team_made": int(deep_teams.iloc[0])}
    print(f"  {len(fewer)} of {len(full)} team seasons ({out['share']:.0f}%) made fewer than {int(curry.fg3)} threes in 82 games")
    print(f"  most recent: {out['latest_team_with_fewer']} with {out['latest_team_fg3']}")
    print(f"  Curry: {curry_pg:.2f} a game. Average team in {last_below}: {avg_team_pg[last_below]:.2f} a game")
    print(f"  from 28-35 feet: Curry {deep_curry}, best other team {deep_teams.index[0]} {int(deep_teams.iloc[0])}")
    return out


def shot_value():
    """Points per shot, which is what a defense is actually giving up."""
    section("What a Curry three was worth")
    lg = league.loc[YEAR]
    at_rim = shots[shots.basic_zone == "Restricted Area"].shot_made.mean()
    deep = shots[(shots.distance >= 28) & (shots.distance < 35) & (shots.player_name == CURRY)]
    out = {"curry_three": 3 * curry.fg3 / curry.fg3a,
           "curry_from_28_feet": 3 * deep.shot_made.mean(), "curry_from_28_feet_attempts": len(deep),
           "league_at_the_rim": 2 * at_rim,
           "league_three": 3 * lg.fg3 / lg.fg3a,
           "league_two_free_throws": 2 * lg.ft / lg.fta}
    for k, v in out.items():
        print(f"  {k:<28} {v:.3f}")
    return out


def threes_alone():
    """His points from threes, ranked against everyone's total points."""
    section("His threes alone")
    pts = int(3 * curry.fg3)
    others = season[season.player != CURRY].sort_values("pts", ascending=False)
    below = others[others.pts < pts].head(6)
    out = {"points_from_threes": pts, "rank_in_scoring": int((others.pts > pts).sum()) + 1,
           "notable_totals_below": dict(zip(below.player, below.pts.astype(int)))}
    print(f"  {pts} points on threes would rank {out['rank_in_scoring']} of {len(season)} in total points")
    print(f"  just below: {out['notable_totals_below']}")
    return out


def accuracy_ceiling():
    """Everyone who has ever shot as well, and how many they took."""
    section("Nobody who shot better took half as many")
    better = ps[(ps.fg3_pct >= curry.fg3_pct) & (ps.fg3a >= 200) & ~((ps.player == CURRY) & (ps.year == YEAR))]
    top = better.nlargest(1, "fg3a").iloc[0]
    out = {"seasons_as_accurate": len(better), "most_attempts_among_them": int(top.fg3a),
           "by": f"{top.player} {top.year}", "curry_attempts": int(curry.fg3a)}
    print(f"  {len(better)} other seasons at {curry.fg3_pct:.1%} or better (200+ attempts)")
    print(f"  the most attempts among them: {int(top.fg3a)} ({top.player}, {top.year}). Curry took {int(curry.fg3a)}.")
    return out


def volume_leader_accuracy():
    """Where the league's attempts leader usually ranks in accuracy."""
    section("The attempts leader is not supposed to be accurate")
    rows = []
    for y, d in ps[ps.year >= 1993].groupby("year"):
        qualified = d[d.fg3 >= 82 * SHORT_SEASONS.get(y, 82) / 82]  # the league's minimum to qualify
        rank = qualified.fg3_pct.rank(ascending=False, method="min")
        lead = qualified.fg3a.idxmax()
        rows.append((y, qualified.player[lead], int(rank[lead]), len(qualified)))
    r = pd.DataFrame(rows, columns=["year", "player", "accuracy_rank", "qualified"]).set_index("year")
    second = season[season.player != CURRY].fg3a.max()
    best_other = r[r.player != CURRY].accuracy_rank.min()
    out = {"median_rank": float(r.accuracy_rank.median()), "curry_2016_rank": int(r.accuracy_rank[YEAR]),
           "qualified_2016": int(r.qualified[YEAR]), "best_rank_by_anyone_else": int(best_other),
           "attempts_lead_over_second": int(curry.fg3a - second)}
    print(f"  median accuracy rank of the attempts leader since 1992-93: {out['median_rank']:.0f}")
    print(f"  Curry in 2015-16: {out['curry_2016_rank']} of {out['qualified_2016']}, with {out['attempts_lead_over_second']} more attempts than anyone")
    print(f"  best by any other attempts leader: {best_other}")
    return out


def ahead_of_schedule():
    """How many threes the league leader 'should' have had.

    Regress the leader's total on how many threes teams take per game, using
    every season since 1997-98 except 2015-16, then ask what league it would
    take for the line to reach 402.
    """
    section("Ahead of schedule")
    table, fit = leader_trend(ps, teams)
    predicted = fit.intercept + fit.slope * table.team_attempts
    rest = table.drop(YEAR)
    resid_sd = (rest.leader_per_82 - predicted[rest.index]).std(ddof=2)
    needed = (curry.fg3 - fit.intercept) / fit.slope
    out = {"intercept": fit.intercept, "slope": fit.slope, "r_squared": fit.rvalue ** 2,
           "expected_leader_2016": predicted[YEAR], "residual": curry.fg3 - predicted[YEAR],
           "typical_miss": resid_sd, "residual_in_sds": (curry.fg3 - predicted[YEAR]) / resid_sd,
           "team_attempts_needed_for_402": needed, "team_attempts_2016": table.team_attempts[YEAR],
           "team_attempts_2025": table.team_attempts[2025], "team_attempts_2026": table.team_attempts[2026]}
    print(f"  fit: leader = {fit.intercept:.0f} + {fit.slope:.2f} x team attempts per game (r2 = {fit.rvalue ** 2:.2f})")
    print(f"  expected leader in 2015-16: {predicted[YEAR]:.0f}. Curry was {out['residual']:.0f} over; a typical miss is {resid_sd:.0f}")
    print(f"  the line reaches 402 at {needed:.0f} attempts per team per game. 2015-16: {table.team_attempts[YEAR]:.1f}. 2025-26: {table.team_attempts[2026]:.1f}")
    return out


def how_rare(n_boot=2000, seed=0):
    """A return period from extreme-value theory. Treat this one as rough.

    For each season take the leader's total divided by the average of the next
    ten players, which removes the era. Fit a Gumbel distribution to every
    season since 1989-90 except 2015-16 and ask how often it produces a ratio
    as large as Curry's. Thirty-six points is not much to fit a tail with, so
    the bootstrap interval matters more than the point estimate.
    """
    section("How rare, as a return period")
    ratio = {}
    for y, d in ps[ps.year >= 1990].groupby("year"):
        top = d.fg3.nlargest(11).values
        ratio[y] = top[0] / top[1:].mean()
    ratio = pd.Series(ratio)
    rest = ratio.drop(YEAR)
    loc, scale = stats.gumbel_r.fit(rest)
    period = 1 / stats.gumbel_r.sf(ratio[YEAR], loc, scale)
    rng = np.random.default_rng(seed)
    boots = []
    for _ in range(n_boot):
        sample = rng.choice(rest.values, len(rest))
        boots.append(1 / stats.gumbel_r.sf(ratio[YEAR], *stats.gumbel_r.fit(sample)))
    lo, hi = np.percentile(boots, [5, 95])
    out = {"ratio_2016": ratio[YEAR], "next_highest_ratio": rest.max(), "next_highest_year": int(rest.idxmax()),
           "return_period_seasons": period, "interval_90": [lo, hi]}
    print(f"  leader / average of the next ten: {ratio[YEAR]:.2f} in 2015-16, next highest {rest.max():.2f} ({rest.idxmax()})")
    print(f"  Gumbel return period: one season in {period:.0f} (90% interval {lo:.0f} to {hi:.0f})")
    return out


def record_in_context():
    """One season against the decades before it."""
    section("The jump against history")
    record = ps.groupby("year").fg3.max().cummax()
    jump = int(record[YEAR] - record[YEAR - 1])
    # How far back do you have to go before the record had moved by more than that?
    back = next(y for y in range(YEAR - 2, 1979, -1) if record[YEAR - 1] - record[y] > jump)
    since = back + 1
    out = {"jump": jump, "previous_seasons_that_moved_it_less": YEAR - 1 - since,
           "record_then": int(record[since]), "from_season": since, "moved_over_that_span": int(record[YEAR - 1] - record[since])}
    print(f"  the record rose {jump} in 2015-16")
    print(f"  from {since} to {YEAR - 1} ({out['previous_seasons_that_moved_it_less']} seasons) it rose {out['moved_over_that_span']}, from {out['record_then']} to {int(record[YEAR - 1])}")
    return out


def wire_to_wire():
    """Who led the league in threes on each day of the season."""
    section("Wire to wire")
    box = load_box()
    daily = box.groupby(["game_date", "player"]).fg3.sum().unstack(fill_value=0).sort_index().cumsum()
    mine = daily[CURRY]
    best_other = daily.drop(columns=CURRY).max(axis=1)
    lead = mine - best_other
    ahead = lead > 0
    for_good = ahead[::-1].cummin()[::-1].idxmax()  # first day he led and never gave it back
    out = {"game_days": len(lead), "days_in_first": int(ahead.sum()), "led_for_good_from": for_good,
           "lead_of_50_on": lead[lead >= 50].index[0], "lead_of_100_on": lead[lead >= 100].index[0], "final_lead": int(lead.iloc[-1])}
    print(f"  in first on {out['days_in_first']} of {len(lead)} game days, and every day from {for_good}")
    print(f"  lead reached 50 on {out['lead_of_50_on']}, 100 on {out['lead_of_100_on']}, finished at {out['final_lead']}")
    return out


def night_after_night(top=8):
    """How often each of the top shooters had a big night, and a blank one."""
    section("Night after night")
    box = load_box()
    leaders = box.groupby("player").fg3.sum().nlargest(top).index
    rows = {}
    for name in leaders:
        g = box[box.player == name].fg3
        rows[name] = {"games": len(g), "five_or_more": int((g >= 5).sum()), "without_a_three": int((g == 0).sum()), "median": float(g.median())}
        print(f"  {name:<16} {len(g)} games, 5+ in {rows[name]['five_or_more']}, none in {rows[name]['without_a_three']}, median {g.median():.0f}")
    others = [v for k, v in rows.items() if k != CURRY]
    all_five = box.groupby("player").fg3.apply(lambda g: int((g >= 5).sum())).drop(CURRY)
    out = {"players": rows, "most_five_plus_by_anyone_else": int(all_five.max()), "third_most_five_plus": int(all_five.nlargest(2).iloc[1]),
           "fewest_blank_games_among_the_rest": min(v["without_a_three"] for v in others)}
    print(f"  most 5+ games by anyone else: {out['most_five_plus_by_anyone_else']}, then {out['third_most_five_plus']}")
    return out


def home_and_road():
    section("Home and road")
    road = gamelog[gamelog.game_location == "@"]
    home = gamelog[gamelog.game_location != "@"]
    others = season[season.player != CURRY].fg3
    out = {"road_threes": int(road.fg3.sum()), "road_games": len(road), "home_threes": int(home.fg3.sum()), "home_games": len(home),
           "road_alone_rank": int((others > road.fg3.sum()).sum()) + 1}
    print(f"  road: {out['road_threes']} in {len(road)} games. home: {out['home_threes']} in {len(home)} games")
    print(f"  his road games alone would rank {out['road_alone_rank']} in the league")
    return out


def warriors_without_him():
    section("The Warriors without him")
    t = teams[teams.year == YEAR].sort_values("fg3", ascending=False).reset_index(drop=True)
    gsw = int(t[t.team == "GSW"].fg3.iloc[0])
    without = gsw - int(curry.fg3)
    before = int(teams[teams.year < YEAR].fg3.max())
    out = {"warriors": gsw, "second_most": int(t.fg3.iloc[1]), "second_team": t.team.iloc[1], "without_curry": without,
           "rank_without_curry": int((t.fg3 > without).sum()) + 1, "teams": len(t), "curry_share": curry.fg3 / gsw * 100,
           "most_by_any_team_before": before}
    print(f"  Warriors {gsw}, next {out['second_team']} {out['second_most']}. Most by any team before that season: {before}")
    print(f"  without Curry's threes: {without}, which ranks {out['rank_without_curry']} of {len(t)}. He made {out['curry_share']:.0f}% of them")
    return out


def four_categories():
    """What else he led the league in."""
    section("Four categories at once")
    played = season[season.games >= 58]
    out = {
        "points_per_game_leader": played.loc[played.ppg.idxmax()].player,
        "threes_leader": season.loc[season.fg3.idxmax()].player,
        "steals_leader": season.loc[season.stl.idxmax()].player, "steals": int(curry.stl),
        "steals_per_game_leader": played.loc[(played.stl / played.games).idxmax()].player,
        "free_throw_pct_leader": season[season.ft >= 125].nlargest(1, "ft_pct").player.iloc[0],  # the league minimum
        "free_throw_pct": curry.ft_pct * 100,
        "minutes_per_game_rank": int(((played.mp / played.games) > curry.mp / curry.games).sum()) + 1,
    }
    for k, v in out.items():
        print(f"  {k:<26} {v}")
    return out


if __name__ == "__main__":
    results = {f.__name__: f() for f in (three_quarters, one_quarter, coldest_stretch, clinched, versus_teams,
                                         shot_value, threes_alone, accuracy_ceiling, volume_leader_accuracy,
                                         ahead_of_schedule, how_rare, record_in_context, wire_to_wire,
                                         night_after_night, home_and_road, warriors_without_him, four_categories)}
    OUTPUT.mkdir(exist_ok=True)
    (OUTPUT / "new_stats.json").write_text(json.dumps(to_jsonable(results), indent=2) + "\n")
    print("\nsaved output/new_stats.json")
