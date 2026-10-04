"""Download the raw data. Files that already exist are skipped.

Sources
  Basketball-Reference   season totals for every player, 1979-80 to 2025-26,
                         and Curry's 2015-16 game log
  NBA.com shot charts    via github.com/DomSamangy/NBA_Shots_04_25
  ESPN box scores        via github.com/sportsdataverse/sportsdataverse-data

Basketball-Reference asks for no more than 20 requests a minute, so this
waits between pages. The first run takes about three minutes.

    python analysis/curry_2015_16/01_fetch.py
"""
import shutil
import subprocess
import time

import requests

from common import RAW, SEASONS, YEAR

HEADERS = {"User-Agent": "Mozilla/5.0"}
BBREF = "https://www.basketball-reference.com"


def get(url: str) -> bytes | None:
    """Fetch a URL. Basketball-Reference sometimes refuses Python's HTTP client
    outright (a 403) while accepting curl, so fall back to curl when that happens."""
    r = requests.get(url, headers=HEADERS, timeout=120)
    if r.status_code == 200:
        return r.content
    if shutil.which("curl"):
        done = subprocess.run(["curl", "-sSL", "--fail", "-A", HEADERS["User-Agent"], url], capture_output=True)
        if done.returncode == 0:
            return done.stdout
    print(f"  {url} returned {r.status_code}")
    return None


def download(url: str, path, min_bytes: int = 10_000, pause: float = 0.0) -> None:
    if path.exists() and path.stat().st_size >= min_bytes:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    for attempt in range(3):
        content = get(url)
        if content and len(content) >= min_bytes:
            path.write_bytes(content)
            print(f"saved {path.relative_to(RAW)}")
            time.sleep(pause)
            return
        time.sleep(15)  # most often a rate limit, so wait before trying again
    raise RuntimeError(f"could not download {url}")


def main() -> None:
    for year in SEASONS:
        download(f"{BBREF}/leagues/NBA_{year}_totals.html", RAW / "bbref" / f"totals_{year}.html", pause=3.5)
    download(f"{BBREF}/players/c/curryst01/gamelog/{YEAR}", RAW / "bbref" / f"curry_gamelog_{YEAR}.html", pause=3.5)
    download(
        f"https://raw.githubusercontent.com/DomSamangy/NBA_Shots_04_25/main/NBA_{YEAR}_Shots.csv.zip",
        RAW / "shots" / f"NBA_{YEAR}_Shots.csv.zip",
    )
    download(
        "https://github.com/sportsdataverse/sportsdataverse-data/releases/download/"
        f"espn_nba_player_boxscores/player_box_{YEAR}.csv",
        RAW / f"espn_player_box_{YEAR}.csv",
    )
    print("raw data is in", RAW)


if __name__ == "__main__":
    main()
