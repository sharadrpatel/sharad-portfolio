"""Turn the raw downloads into tidy tables in analysis/data/processed.

    player_seasons.csv        one row per player per season (traded players get their combined line)
    team_seasons.csv          threes made and attempted by each team in each season
    curry_gamelog_2016.csv    Curry's 79 games
    shots_2016.csv.gz         every shot of 2015-16, with exact distance
    box_2016.csv              threes by player and game, regular season only

    python analysis/curry_2015_16/02_build.py
"""
import zipfile

import numpy as np
import pandas as pd
from bs4 import BeautifulSoup

from common import PROCESSED, RAW, SEASONS, YEAR

NUMERIC = ["age", "games", "mp", "fg", "fga", "fg3", "fg3a", "ft", "fta", "stl", "pts"]


def parse_totals(year: int) -> list[dict]:
    html = (RAW / "bbref" / f"totals_{year}.html").read_text(encoding="utf-8")
    table = BeautifulSoup(html, "lxml").find("table", id="totals_stats")
    rows = []
    for tr in table.tbody.find_all("tr"):
        if "thead" in (tr.get("class") or []):
            continue
        row = {"year": year}
        for cell in tr.find_all(["th", "td"]):
            stat = cell.get("data-stat")
            row[stat] = cell.get_text(strip=True)
            if stat == "name_display":
                row["pid"] = cell.get("data-append-csv")  # Basketball-Reference player id
        rows.append(row)
    return rows


def build_seasons() -> None:
    raw = pd.DataFrame([r for y in SEASONS for r in parse_totals(y)])
    raw = raw[raw.pid.notna()].copy()  # drops the "League Average" row
    for c in NUMERIC:
        raw[c] = pd.to_numeric(raw[c], errors="coerce").fillna(0)
    raw = raw.rename(columns={"name_display": "player", "team_name_abbr": "team"})

    # A traded player has one row per team plus a combined row labeled 2TM, 3TM, ...
    raw["combined"] = raw.team.str.fullmatch(r"\dTM|TOT")
    stints = raw.groupby(["year", "pid"]).pid.transform("size")
    players = raw[(stints == 1) | raw.combined]
    assert not players.duplicated(["year", "pid"]).any()
    players[["year", "pid", "player", "team", *NUMERIC]].to_csv(PROCESSED / "player_seasons.csv", index=False)

    teams = raw[~raw.combined].groupby(["year", "team"], as_index=False)[["fg3", "fg3a"]].sum()
    teams.to_csv(PROCESSED / "team_seasons.csv", index=False)
    print(f"player_seasons.csv  {len(players):,} rows")
    print(f"team_seasons.csv    {len(teams):,} rows")


def build_gamelog() -> None:
    html = (RAW / "bbref" / f"curry_gamelog_{YEAR}.html").read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "lxml")
    table = next(t for t in soup.find_all("table") if t.find(attrs={"data-stat": "fg3"}))
    rows = []
    for tr in table.tbody.find_all("tr"):
        row = {c.get("data-stat"): c.get_text(strip=True) for c in tr.find_all(["th", "td"])}
        if row.get("fg3", "").isdigit():  # skips games he did not play
            rows.append(row)
    g = pd.DataFrame(rows)[["date", "opp_name_abbr", "game_location", "fg3", "fg3a", "pts"]]
    g = g.rename(columns={"opp_name_abbr": "opp"})
    g[["fg3", "fg3a", "pts"]] = g[["fg3", "fg3a", "pts"]].astype(int)
    g.insert(0, "game", range(1, len(g) + 1))
    g.to_csv(PROCESSED / f"curry_gamelog_{YEAR}.csv", index=False)
    print(f"curry_gamelog_{YEAR}.csv  {len(g)} games, {g.fg3.sum()} threes")


def build_shots() -> None:
    with zipfile.ZipFile(RAW / "shots" / f"NBA_{YEAR}_Shots.csv.zip") as z:
        s = pd.read_csv(z.open(f"NBA_{YEAR}_Shots.csv"))
    s = s.rename(columns=str.lower)
    s["is_three"] = s.shot_type.str.startswith("3")
    # Coordinates are in feet with the basket at (0, 5.25).
    s["distance"] = np.hypot(s.loc_x, s.loc_y - 5.25)
    keep = ["game_id", "game_date", "team_name", "player_name", "quarter", "shot_made",
            "is_three", "action_type", "basic_zone", "distance", "loc_x", "loc_y"]
    s[keep].to_csv(PROCESSED / f"shots_{YEAR}.csv.gz", index=False)
    print(f"shots_{YEAR}.csv.gz  {len(s):,} shots")


def build_box() -> None:
    b = pd.read_csv(RAW / f"espn_player_box_{YEAR}.csv", low_memory=False)
    b = b[b.season_type == 2]                                       # regular season
    b = b[~b.team_display_name.str.contains("All-Stars", na=False)]  # ESPN files the All-Star Game here
    b = b[["game_id", "game_date", "athlete_display_name", "three_point_field_goals_made"]]
    b.columns = ["game_id", "game_date", "player", "fg3"]
    b = b[b.fg3.notna()]
    b.to_csv(PROCESSED / f"box_{YEAR}.csv", index=False)
    print(f"box_{YEAR}.csv  {b.game_id.nunique():,} games")


if __name__ == "__main__":
    PROCESSED.mkdir(parents=True, exist_ok=True)
    build_seasons()
    build_gamelog()
    build_shots()
    build_box()
