"""Write the data the post's charts read.

    src/posts/curry-2015-16/data.js      imported by the post
    public/data/curry-2015-16-*.csv      the downloads linked at the bottom of the post

    python analysis/curry_2015_16/06_export_site.py
"""
import json

import pandas as pd

from common import (CURRY, REPO, YEAR, coldest_window, leader_trend, league_by_season, load_box, load_gamelog,
                    load_player_seasons, load_shots, load_team_seasons, season_label, team_games)

ps = load_player_seasons()
shots = load_shots()
teams = load_team_seasons()
season = ps[ps.year == YEAR]
curry = season[season.player == CURRY].iloc[0]
runner_up = season[season.player != CURRY].nlargest(1, "fg3").iloc[0]


def top_ten():
    """[season end year, threes made, player]: the ten highest totals each season."""
    rows = []
    for year, d in ps.groupby("year"):
        rows += [[int(year), int(p.fg3), p.player] for p in d.nlargest(10, "fg3").itertuples()]
    return rows


def gaps():
    """[season end year, leader, threes, runner-up, threes]"""
    rows = []
    for year, d in ps.groupby("year"):
        a, b = d.nlargest(2, "fg3").itertuples()
        rows.append([int(year), a.player, int(a.fg3), b.player, int(b.fg3)])
    return rows


def volume():
    """[3PA, 3P%, player, season end year, 3PM]: every season with 400+ attempts."""
    d = ps[ps.fg3a >= 400]
    return [[int(p.fg3a), round(p.fg3_pct * 100, 1), p.player, int(p.year), int(p.fg3)] for p in d.itertuples()]


def scorers():
    """[points per game, TS% minus league TS%, player, season end year, TS%]: 25+ ppg, 58+ games."""
    d = ps[(ps.ppg >= 25) & (ps.games >= 58)]
    return [[round(p.ppg, 1), round(p.ts_vs_league, 1), p.player, int(p.year), round(p.ts * 100, 1)] for p in d.itertuples()]


def distance():
    """[range, Curry makes, Curry attempts, rest-of-league makes, attempts]: threes in 2015-16."""
    threes = shots[shots.is_three]
    labels = ["Under 24 ft", "24–26 ft", "26–28 ft", "28–35 ft"]
    threes = threes.assign(bin=pd.cut(threes.distance, [0, 24, 26, 28, 35], right=False, labels=labels))
    rows = []
    for label in labels:
        d = threes[threes.bin == label]
        mine, rest = d[d.player_name == CURRY], d[d.player_name != CURRY]
        rows.append([label, int(mine.shot_made.sum()), len(mine), int(rest.shot_made.sum()), len(rest)])
    return rows


def three_quarters():
    """[label, threes, is Curry]: threes before the fourth quarter against full-game totals."""
    made = shots[shots.is_three & shots.shot_made & (shots.quarter <= 3)].groupby("player_name").size()
    surname = runner_up.player.split()[-1]
    return [
        ["Curry, first three quarters", int(made[CURRY]), True],
        [f"Old record, full games ({season_label(YEAR - 1)})", int(ps[ps.year < YEAR].fg3.max()), False],
        [f"{surname}, full games", int(runner_up.fg3), False],
        [f"{surname}, first three quarters", int(made[runner_up.player]), False],
    ]


def pace():
    """[game number, Curry's running total, runner-up's running total, date, Curry's threes that game]"""
    log = load_gamelog()
    box = load_box()
    other = box[box.player == runner_up.player].sort_values("game_date").fg3.cumsum().astype(int).tolist()
    mine = log.fg3.cumsum().tolist()
    rows = []
    for i in range(max(len(mine), len(other))):
        have = i < len(mine)
        rows.append([i + 1, mine[i] if have else None, other[i] if i < len(other) else None,
                     log.date[i].strftime("%b %-d, %Y") if have else None, int(log.fg3[i]) if have else None])
    return rows


def coldest():
    """[first game, last game, threes per game, 3P%]: his 20 games with the fewest threes."""
    log = load_gamelog()
    first, last = coldest_window(log, 20)
    stretch = log[log.game.between(first, last)]
    return [first, last, round(stretch.fg3.sum() / 20, 2), round(stretch.fg3.sum() / stretch.fg3a.sum() * 100, 1)]


def team_average():
    """[season end year, threes per game by the average team]"""
    per_game = league_by_season(ps).fg3 / team_games(ps, teams)
    return [[int(y), round(v, 2)] for y, v in per_game.items()]


def shot_value():
    """[label, points per shot, is Curry]: 2015-16"""
    lg = league_by_season(ps).loc[YEAR]
    deep = shots[(shots.distance >= 28) & (shots.distance < 35) & (shots.player_name == CURRY)]
    rim = shots[shots.basic_zone == "Restricted Area"]
    rows = [
        ["Curry, from 28 feet and out", 3 * deep.shot_made.mean(), True],
        ["Two free throws, league average", 2 * lg.ft / lg.fta, False],
        ["Curry, all threes", 3 * curry.fg3 / curry.fg3a, True],
        ["League, shots at the rim", 2 * rim.shot_made.mean(), False],
        ["League, all threes", 3 * lg.fg3 / lg.fg3a, False],
        ["League, all twos", 2 * (lg.fg - lg.fg3) / (lg.fga - lg.fg3a), False],
    ]
    return [[label, round(float(v), 2), flag] for label, v, flag in rows]


def trend():
    """[season end year, team 3PA per game, leader's threes per 82 games, leader]: since 1997-98"""
    table, _ = leader_trend(ps, teams)
    return [[int(y), round(r.team_attempts, 1), round(r.leader_per_82), r.leader] for y, r in table.iterrows()]


def trend_fit():
    """[intercept, slope]: leader's threes = intercept + slope x team 3PA per game, fit without 2015-16"""
    _, fit = leader_trend(ps, teams)
    return [round(fit.intercept, 2), round(fit.slope, 3)]


EXPORTS = {
    "TOP10": (top_ten, "[season end year, threes made, player] — ten highest totals each season"),
    "GAPS": (gaps, "[season end year, leader, threes, runner-up, threes]"),
    "VOLUME": (volume, "[3PA, 3P%, player, season end year, 3PM] — every season with 400+ attempts"),
    "SCORERS": (scorers, "[points per game, TS% minus league TS%, player, season end year, TS%] — 25+ ppg, 58+ games"),
    "DISTANCE": (distance, "[range, Curry makes, Curry attempts, rest-of-league makes, attempts] — threes in 2015–16"),
    "THREE_QUARTERS": (three_quarters, "[label, threes, is Curry] — threes before the fourth quarter against full-game totals"),
    "PACE": (pace, "[game number, Curry's running total, runner-up's running total, date, Curry's threes that game]"),
    "COLDEST": (coldest, "[first game, last game, threes per game, 3P%] — his 20 games with the fewest threes"),
    "TEAM_AVERAGE": (team_average, "[season end year, threes per game by the average team]"),
    "SHOT_VALUE": (shot_value, "[label, points per shot, is Curry] — 2015–16"),
    "TREND": (trend, "[season end year, team 3PA per game, leader's threes per 82 games, leader] — since 1997–98"),
    "TREND_FIT": (trend_fit, "[intercept, slope] — leader's threes = intercept + slope x team 3PA per game, fit without 2015–16"),
}

if __name__ == "__main__":
    data = {name: build() for name, (build, _) in EXPORTS.items()}

    js = ("// Generated from Basketball-Reference season totals (1979–80 to 2025–26) and\n"
          "// NBA.com shot charts and ESPN box scores (2015–16). Regular season only.\n"
          "// Written by analysis/curry_2015_16/06_export_site.py. Do not edit by hand.\n\n")
    for name, (_, description) in EXPORTS.items():
        body = json.dumps(data[name], ensure_ascii=False, separators=(",", ":"))
        js += f"// {description}\nexport const {name} = {body};\n\n"
    target = REPO / "src" / "posts" / "curry-2015-16" / "data.js"
    target.write_text(js, encoding="utf-8")
    print("wrote", target.relative_to(REPO))

    public = REPO / "public" / "data"
    public.mkdir(parents=True, exist_ok=True)
    for name, columns, file in [
        ("TOP10", ["season_end", "fg3", "player"], "curry-2015-16-top10-by-season.csv"),
        ("VOLUME", ["fg3a", "fg3_pct", "player", "season_end", "fg3"], "curry-2015-16-volume-accuracy.csv"),
        ("SCORERS", ["ppg", "ts_vs_league", "player", "season_end", "ts_pct"], "curry-2015-16-scorers.csv"),
    ]:
        pd.DataFrame(data[name], columns=columns).to_csv(public / file, index=False)
        print("wrote", (public / file).relative_to(REPO))
