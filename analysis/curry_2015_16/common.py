"""Shared paths, constants, and loaders for the Curry 2015-16 analysis."""
from pathlib import Path

import numpy as np
import pandas as pd

HERE = Path(__file__).resolve().parent
ANALYSIS = HERE.parent
REPO = ANALYSIS.parent
RAW = ANALYSIS / "data" / "raw"
PROCESSED = ANALYSIS / "data" / "processed"
OUTPUT = HERE / "output"

FIRST_SEASON = 1980  # 1979-80, the first season with a three-point line
LAST_SEASON = 2026   # 2025-26
SEASONS = range(FIRST_SEASON, LAST_SEASON + 1)

CURRY = "Stephen Curry"
YEAR = 2016  # seasons are labeled by the year they ended

# Games per team in the seasons that were not 82 games long.
# 2019-20 was uneven (63 to 75 games), so it is handled from minutes instead.
SHORT_SEASONS = {1999: 50, 2012: 66, 2021: 72}


def season_label(year: int) -> str:
    """2016 -> '2015-16' (with an en dash, as the post writes it)."""
    return f"{year - 1}–{str(year)[2:]}"


def load_player_seasons() -> pd.DataFrame:
    """One row per player per season, with the rates the post uses."""
    ps = pd.read_csv(PROCESSED / "player_seasons.csv")
    league = league_by_season(ps)
    ps = ps.join(league[["lg_fg3_pct", "lg_ts"]], on="year")
    ps["fg3_pct"] = ps.fg3 / ps.fg3a.replace(0, np.nan)
    ps["fg_pct"] = ps.fg / ps.fga.replace(0, np.nan)
    ps["ft_pct"] = ps.ft / ps.fta.replace(0, np.nan)
    ps["ppg"] = ps.pts / ps.games
    # True shooting: points per scoring attempt, with 0.44 free throws
    # counted as one attempt.
    ps["ts"] = ps.pts / (2 * (ps.fga + 0.44 * ps.fta))
    ps["ts_vs_league"] = (ps.ts - ps.lg_ts) * 100
    # Makes above average: threes made minus what a league-average shooter
    # would have made on the same number of attempts.
    ps["makes_above_avg"] = ps.fg3 - ps.fg3a * ps.lg_fg3_pct
    return ps


def league_by_season(ps: pd.DataFrame) -> pd.DataFrame:
    """League totals per season, added up from player totals."""
    lg = ps.groupby("year")[["fg", "fga", "fg3", "fg3a", "ft", "fta", "pts", "mp"]].sum()
    lg["lg_fg3_pct"] = lg.fg3 / lg.fg3a
    lg["lg_ts"] = lg.pts / (2 * (lg.fga + 0.44 * lg.fta))
    return lg


def load_team_seasons() -> pd.DataFrame:
    return pd.read_csv(PROCESSED / "team_seasons.csv")


def team_games(ps: pd.DataFrame, teams: pd.DataFrame) -> pd.Series:
    """Total team-games played in each season (two per game)."""
    n_teams = teams.groupby("year").size()
    out = {}
    for y in SEASONS:
        if y == 2020:
            out[y] = ps[ps.year == y].mp.sum() / 240  # 5 players x 48 minutes
        else:
            out[y] = n_teams[y] * SHORT_SEASONS.get(y, 82)
    return pd.Series(out)


def load_shots() -> pd.DataFrame:
    """Every shot of 2015-16, with distance computed from the coordinates."""
    return pd.read_csv(PROCESSED / "shots_2016.csv.gz")


def load_gamelog() -> pd.DataFrame:
    return pd.read_csv(PROCESSED / "curry_gamelog_2016.csv", parse_dates=["date"])


def load_box() -> pd.DataFrame:
    return pd.read_csv(PROCESSED / "box_2016.csv")


def section(title: str) -> None:
    print(f"\n== {title}")


def to_jsonable(obj):
    """Turn numpy types into plain Python so json.dump accepts them."""
    if isinstance(obj, dict):
        return {str(k): to_jsonable(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [to_jsonable(v) for v in obj]
    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.floating,)):
        return round(float(obj), 6)
    if isinstance(obj, pd.Timestamp):
        return obj.strftime("%Y-%m-%d")
    return obj
