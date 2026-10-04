"""Write the data the post's charts read.

    src/posts/curry-2015-16/data.js      imported by the post
    public/data/curry-2015-16-*.csv      the downloads linked at the bottom of the post

    python analysis/curry_2015_16/06_export_site.py
"""
import json

import pandas as pd

from common import CURRY, REPO, load_player_seasons, load_shots

ps = load_player_seasons()


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
    threes = load_shots().query("is_three")
    labels = ["Under 24 ft", "24–26 ft", "26–28 ft", "28–35 ft"]
    threes = threes.assign(bin=pd.cut(threes.distance, [0, 24, 26, 28, 35], right=False, labels=labels))
    rows = []
    for label in labels:
        d = threes[threes.bin == label]
        mine, rest = d[d.player_name == CURRY], d[d.player_name != CURRY]
        rows.append([label, int(mine.shot_made.sum()), len(mine), int(rest.shot_made.sum()), len(rest)])
    return rows


EXPORTS = {
    "TOP10": (top_ten, "[season end year, threes made, player] — ten highest totals each season"),
    "GAPS": (gaps, "[season end year, leader, threes, runner-up, threes]"),
    "VOLUME": (volume, "[3PA, 3P%, player, season end year, 3PM] — every season with 400+ attempts"),
    "SCORERS": (scorers, "[points per game, TS% minus league TS%, player, season end year, TS%] — 25+ ppg, 58+ games"),
    "DISTANCE": (distance, "[range, Curry makes, Curry attempts, rest-of-league makes, attempts] — threes in 2015–16"),
}

if __name__ == "__main__":
    data = {name: build() for name, (build, _) in EXPORTS.items()}

    js = ("// Generated from Basketball-Reference season totals (1979–80 to 2025–26) and\n"
          "// NBA.com shot charts (2015–16). Regular season only. Do not edit by hand.\n\n")
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
