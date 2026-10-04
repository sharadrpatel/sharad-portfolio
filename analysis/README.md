# Analysis

The statistics behind the blog posts, in Python. Each post gets its own folder
of scripts. They download the data, compute every number the post quotes, and
write the data file the post's charts read.

## Setup

```sh
conda create -n blog python=3.12
conda activate blog
pip install -r analysis/requirements.txt
```

## Curry 2015-16

Run these from the repo root, in order.

| Script | What it does |
|---|---|
| `01_fetch.py` | Downloads the raw data into `analysis/data/raw`. About three minutes the first time, because Basketball-Reference asks for no more than 20 requests a minute. Later runs skip what is already there. |
| `02_build.py` | Parses the downloads into tidy tables in `analysis/data/processed`. |
| `03_post_numbers.py` | Prints every number in the post, section by section, and saves them to `output/post_numbers.json`. |
| `04_new_stats.py` | Angles that are not in the post yet. One function per idea. Saves `output/new_stats.json`. |
| `05_simulation.py` | Replays the ten seasons since 2015-16 to see how often the record falls. Saves `output/simulation.json`. |
| `06_export_site.py` | Writes `src/posts/curry-2015-16/data.js` and the CSVs in `public/data`. |

```sh
python analysis/curry_2015_16/01_fetch.py
python analysis/curry_2015_16/02_build.py
python analysis/curry_2015_16/03_post_numbers.py
python analysis/curry_2015_16/04_new_stats.py
python analysis/curry_2015_16/05_simulation.py
python analysis/curry_2015_16/06_export_site.py
```

`analysis/data` is not committed. The scripts rebuild it. The small JSON files
in `output/` are committed so the numbers can be read without running anything.

## Data

- Basketball-Reference: season totals for every player from 1979-80 through
  2025-26, and Curry's 2015-16 game log.
- NBA.com shot charts for 2015-16, from
  [DomSamangy/NBA_Shots_04_25](https://github.com/DomSamangy/NBA_Shots_04_25).
  The file has 884 of Curry's 886 three-point attempts and is missing about
  0.3% of the league's.
- ESPN box scores for 2015-16, from
  [sportsdataverse-data](https://github.com/sportsdataverse/sportsdataverse-data).

Regular season only. Seasons are labeled by the year they ended, so 2016 means
2015-16.

## Adding a post

Copy the folder, keep `common.py` for paths and loaders, and have the last
script write the post's `data.js`. Keeping one script that prints every quoted
number makes it easy to recheck the text when the data changes.
