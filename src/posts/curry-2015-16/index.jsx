// The text of the post. Each chart is a component in figures.jsx, wrapped here
// in a <ChartFigure> with its title and caption. Paragraphs and figure blocks
// can be reordered freely: figure numbers are assigned in order as they appear.
import { Link } from "../../lib/router.jsx";
import { ChartFigure } from "../../components/charts.jsx";
import {
  RecordChart, GapChart, RulerChart, GameStripsChart, ThreeQuartersChart, PaceChart, TeamsChart,
  VolumeChart, ShotMaps, DistanceChart, ShotValueChart, ScoringChart, TrendChart,
} from "./figures.jsx";

/* ── Sections (also used for the table of contents) ─────────────────────── */
export const SECTIONS = [
  { id: "record", label: "The record moved by 116" },
  { id: "field", label: "Second place was 126 behind" },
  { id: "parts", label: "Parts of the season were enough" },
  { id: "teams", label: "One player against whole teams" },
  { id: "tradeoff", label: "Volume and accuracy" },
  { id: "scoring", label: "It wasn't only the threes" },
  { id: "since", label: "Ten seasons of trying" },
  { id: "takes", label: "What it would take" },
  { id: "caveats", label: "What I'd be careful about" },
  { id: "verdict", label: "So can it happen again?" },
];

const STATS = [
  { value: "402", label: "Threes made", text: "The record going into the season was 286, and it was his." },
  { value: "126", label: "Ahead of second place", text: "Klay Thompson made 276. No other leader has finished more than 73 ahead." },
  { value: "45.4%", label: "On 886 attempts", text: "Nobody else has topped 41.6% on 700 or more." },
  { value: "+12.8", label: "True shooting vs. the league", text: "The widest margin for a scoring leader since at least 1979–80." },
];

const NEEDS = [
  ["45.4%", "Curry, 2015–16", "888", "10.8"],
  ["42%", "", "960", "11.7"],
  ["40%", "", "1,008", "12.3"],
  ["38%", "", "1,061", "12.9"],
  ["36.8%", "Harden, 2018–19", "1,096", "13.4"],
];

// Share of 100,000 replays of 2016–17 through 2025–26 in which someone reaches 402.
const REPLAYS = [
  ["With the attempts each player really took", "4.6%", "3.6%"],
  ["If every player had played all 82 games", "Nearly 100%", "30%"],
];

export default function Curry2016() {
  let fig = 0; // figures number themselves, so blocks can be moved around freely
  return (
    <>
      <div className="post__prose">
        <p className="post__lead">
          In 2014–15 Stephen Curry broke the record for threes in a season with 286. The next season he made 402.
        </p>
        <p>
          This is the first post on this blog, and I wanted to start with the craziest season I know of. I've written
          about it once already. In <Link to="/work/shot-dna">Shot DNA</Link> I compared players by where they shoot
          from, and 2015–16 was the one year the league had nobody who shot like Curry. That piece was about what kind
          of shots he took. This one is about how many went in, and about a claim I wanted to test: nobody is going to
          have that season again.
        </p>
        <p>
          To check it I pulled every player season since the NBA added the three-point line in 1979–80. That's 20,550
          of them. Most of the claim held up. One part didn't, and I get to it near the end.
        </p>
      </div>

      <dl className="outcomes post__stats">
        {STATS.map((s) => (
          <div key={s.label} className="has-value">
            <dt>
              <span className="outcomes__value">{s.value}</span>
              <span className="label label--muted">{s.label}</span>
            </dt>
            <dd>{s.text}</dd>
          </div>
        ))}
      </dl>

      <section className="post__prose" aria-labelledby="record">
        <h2 id="record">The record moved by 116</h2>
        <p>
          For most of the three-point era the record went up slowly. Dennis Scott made 267 in 1995–96, during the three
          seasons when the league moved the line in to 22 feet. It took ten years for Ray Allen to pass him, and he did
          it by two. Curry got to 272 in 2012–13 and 286 in 2014–15. So over 19 seasons the record went up by 19 threes.
        </p>
        <p>
          Then it went up by 116 in one season. That's a 41% jump. If somebody did that to the home run record, they
          would hit 103.
        </p>
        <p>
          Put another way, the record moved more in that one season than it had in the previous 24 combined. From
          1990–91 to 2014–15 it went from 172 to 286, which is 114.
        </p>
      </section>

      <ChartFigure
        n={++fig}
        title="One season left the pack"
        sub="Threes made, the ten highest totals in each season"
        legend={[
          { kind: "field", label: "Top ten each season" },
          { kind: "line", label: "Record at the time" },
          { kind: "accent", label: "Curry, 2015–16" },
        ]}
        caption="Seasons are labeled by the year they ended, so 2016 is 2015–16. The shaded band is 1994–95 through 1996–97, when the three-point line was 22 feet all the way around. Hover or tap a dot for the player."
      >
        <RecordChart />
      </ChartFigure>

      <section className="post__prose">
        <p>
          For 35 years the top of the league moves up together, a few threes at a time. In 2015–16 one dot leaves the
          group.
        </p>
      </section>

      <section className="post__prose" aria-labelledby="field">
        <h2 id="field">Second place was 126 behind</h2>
        <p>
          A record can jump because the whole league changed, which is what happened when the line moved in. That isn't
          what happened here. Klay Thompson finished second in 2015–16 with 276. At the time that would have been the
          second-highest total ever. Curry beat him by 126.
        </p>
      </section>

      <ChartFigure
        n={++fig}
        title="The biggest lead any three-point leader has had"
        sub="Threes made by the league leader minus the runner-up, by season"
        caption="Three seasons ended in a tie for first, so they have no bar. Hover or tap for the two players."
      >
        <GapChart />
      </ChartFigure>

      <section className="post__prose">
        <p>
          In the other 46 seasons, the biggest gap between first and second is 73. That was also Curry, in 2023–24.
        </p>
        <p>
          Here's another way to look at it. Among players who logged at least 1,500 minutes in 2015–16, the average was
          79 threes. Curry was five standard deviations above that.
        </p>
      </section>

      <ChartFigure
        n={++fig}
        title="Five standard deviations, drawn to scale"
        sub="Threes made in 2015–16, every player with at least 1,500 minutes"
        caption="Each dot is one of 191 players. The ruler starts at the average and marks one standard deviation at a time. Hover or tap a dot for the player."
      >
        <RulerChart />
      </ChartFigure>

      <section className="post__prose">
        <p>
          It shows up in single games too. A player made eight or more threes in a game 36 times that season. Curry
          had 16 of those. The other 20 were split among 14 players.
        </p>
        <p>
          The ordinary nights add up the same way. He made five or more threes in 43 of his 79 games. Thompson did it
          23 times, and nobody else did it more than 17. Curry also made at least one in every game he played. Each of
          the next seven shooters had at least three games with none.
        </p>
      </section>

      <ChartFigure
        n={++fig}
        title="Every game of the top eight shooters"
        sub="One row per player, one cell per game, darker for more threes"
        caption="The number beside each name is his season total. Rows are different lengths because players missed different numbers of games. Hover or tap a cell for the game."
      >
        <GameStripsChart />
      </ChartFigure>

      <section className="post__prose" aria-labelledby="parts">
        <h2 id="parts">Parts of the season were enough</h2>
        <p>
          Here's a different way to size it up. Take pieces of the season away and see how much is left.
        </p>
        <p>
          Start with fourth quarters. Golden State won a lot of games early, and in 21 of his 79 games Curry didn't
          take a shot after the third quarter. So I counted only the threes he made in the first three quarters.
          That's 337. The old record, set over full games, was 286.
        </p>
      </section>

      <ChartFigure
        n={++fig}
        title="Three quarters would have broken the record"
        sub="Threes made in 2015–16"
        caption="If every game that season had ended after the third quarter, he still breaks the record by 51. Counted from the shot-location data, which has 401 of his 402 makes."
      >
        <ThreeQuartersChart />
      </ChartFigure>

      <section className="post__prose">
        <p>
          His first quarters are a season on their own. He made 144 threes in first quarters, and only 23 other
          players in the league made more than that all year.
        </p>
        <p>
          It works by building too. He made 207 threes in 39 road games and 195 in 40 home games. His road games alone
          would have ranked sixth in the league.
        </p>
        <p>
          His slow stretches don't change the picture either. His coldest 20 games ran from November 20 to January 5.
          He averaged 4.1 threes a game over that stretch and shot 43.9%. Thompson averaged 3.45 for the season. At the
          pace of his worst 20 games, Curry makes 324 over his 79 games and still breaks the record by 38.
        </p>
      </section>

      <ChartFigure
        n={++fig}
        title="He had the title won in February"
        sub="Running total of threes by game, 2015–16"
        legend={[
          { kind: "line-accent", label: "Curry" },
          { kind: "line-muted", label: "Klay Thompson, who finished second" },
        ]}
        caption="The shaded band is his 20 games with the fewest threes. Hover or tap for each game."
      >
        <PaceChart />
      </ChartFigure>

      <section className="post__prose">
        <p>
          He matched Thompson's final total on February 25, in his 55th game, with 24 still to play. Two days later he
          passed his own record. He could have stopped in February and still led the league.
        </p>
        <p>
          Nobody was ever chasing him. He led the league in threes on 158 of the season's 161 game days, which is every
          day from October 31 on. His lead over second place was 50 by December 6 and 100 by February 27.
        </p>
      </section>

      <section className="post__prose" aria-labelledby="teams">
        <h2 id="teams">One player against whole teams</h2>
        <p>
          Curry made 5.09 threes a game. As recently as 2000–01, the average NBA team made 4.85.
        </p>
      </section>

      <ChartFigure
        n={++fig}
        title="More threes than the average team used to make"
        sub="Threes made per game by the average team, by season"
        caption="The shaded band is the three seasons with the shorter line. Hover or tap for each season."
      >
        <TeamsChart />
      </ChartFigure>

      <section className="post__prose">
        <p>
          Since the line came in, 44% of the teams that played a full 82-game season finished with fewer than 402
          threes. The most recent was Memphis in 2012–13, with 382. That was three seasons before Curry did it alone.
        </p>
        <p>
          It holds for the deep ones too. From 28 to 35 feet he made 44. No other team made more than 27.
        </p>
        <p>
          His own team shows it as well. The Warriors made 1,077 threes, the most any team had made in a season to that
          point and 197 more than anyone else that year. Take Curry's away and they have 675, which would have ranked
          18th of 30. He made 37% of his team's threes.
        </p>
      </section>

      <section className="post__prose" aria-labelledby="tradeoff">
        <h2 id="tradeoff">Volume and accuracy usually trade off</h2>
        <p>
          Making 402 takes two things that don't normally go together. You have to shoot a lot, and you have to keep
          making them.
        </p>
        <p>
          The players who shoot 45% from three are usually specialists. They take open shots that someone else creates,
          and not that many of them. Kyle Korver shot 49.2% in 2014–15 on 449 attempts. The players who take 800 or
          more are stars making their own shots off the dribble, and they land in the high 30s. James Harden took 1,028
          in 2018–19 and made 36.8%.
        </p>
        <p>Curry took 886 and made 45.4%.</p>
      </section>

      <ChartFigure
        n={++fig}
        title="Nobody else has been near the 402 line"
        sub="Attempts and accuracy, every season with at least 400 three-point attempts"
        legend={[
          { kind: "field", label: "One player season" },
          { kind: "ref", label: "Curry's other seasons" },
          { kind: "accent", label: "Curry, 2015–16" },
        ]}
        caption="Each curve shows the combinations of attempts and accuracy that add up to the same number of makes. 707 seasons, 1979–80 through 2025–26."
      >
        <VolumeChart />
      </ChartFigure>

      <section className="post__prose">
        <p>
          There have been 23 seasons with 700 or more attempts. Curry's 45.4% is the best of them, and the next two are
          also his. The best by anyone else is Malik Beasley's 41.6% in 2024–25.
        </p>
        <p>
          The player who takes the most threes is usually not one of the most accurate. Since 1992–93 the league's
          attempts leader has typically ranked around 38th in three-point percentage among qualified shooters. Curry
          took 229 more than anyone else and ranked second out of 103. No attempts leader other than Curry has finished
          higher than fifth.
        </p>
        <p>
          A number I like for this is makes above average. It's how many more threes a player made than a
          league-average shooter would have made on the same attempts. Curry was 89 above average in 2015–16. Second on
          the all-time list is Curry again, at 66 in 2018–19. The best season by anyone else is Korver's, at 64.
        </p>
        <p>
          And these weren't easy shots. In{" "}
          <a href="https://sharadrpatel.github.io/shot-dna/analysis/story.html">the Shot DNA piece</a> I found that he
          took 85 shots from 28 feet and beyond,
          almost twice as many as anyone else, and made 44 of them.
        </p>
      </section>

      <ChartFigure
        n={++fig}
        title="Every three they made"
        sub="Made threes in 2015–16. Red dots are from 28 feet and beyond."
        caption="Curry and Thompson, who finished second. The basket is at the bottom. A few makes from near half court are off the top of the map. Hover or tap a dot for the distance."
      >
        <ShotMaps />
      </ChartFigure>

      <ChartFigure
        n={++fig}
        title="He got better where everyone else falls off"
        sub="Three-point percentage by distance, 2015–16"
        legend={[
          { kind: "accent", label: "Curry" },
          { kind: "ref", label: "Rest of the league" },
          { kind: "refline", label: "League average on two-pointers, 49%" },
        ]}
        caption="Distances are measured from the shot coordinates. Heaves from 35 feet and beyond are left out. Hover or tap for makes and attempts."
      >
        <DistanceChart />
      </ChartFigure>

      <section className="post__prose">
        <p>
          From 28 feet and out he shot 52%. The rest of the league shot 25% from there. The league as a whole made 49%
          of its two-pointers that year, so a Curry three from four feet behind the line went in more often than an
          average two.
        </p>
        <p>
          Put that in points. A Curry three was worth 1.36 points every time he took one. The league's average shot at
          the rim was worth 1.20.
        </p>
      </section>

      <ChartFigure
        n={++fig}
        title="A Curry three was worth more than a shot at the rim"
        sub="Points per shot, 2015–16"
        caption="Shots at the rim are those in the restricted area. The top bar is 85 shots, so I wouldn't lean on its second decimal."
      >
        <ShotValueChart />
      </ChartFigure>

      <section className="post__prose">
        <p>
          His shots from 28 feet and out were worth 1.55 each. Sending an average shooter to the line for two free
          throws costs you 1.51. So fouling an ordinary player was cheaper than letting Curry shoot from 28 feet.
        </p>
      </section>

      <section className="post__prose" aria-labelledby="scoring">
        <h2 id="scoring">It wasn't only the threes</h2>
        <p>
          He also led the league in scoring, at 30.1 points a game, and he did it in 34.2 minutes a night.
        </p>
        <p>
          True shooting percentage rolls twos, threes, and free throws into one efficiency number. Curry's was 66.9% in
          a league that averaged 54.1%. That 12.8-point margin is the widest for any scoring leader since 1979–80,
          which is as far back as I looked. The next closest is Adrian Dantley in 1983–84, at 10.9.
        </p>
      </section>

      <ChartFigure
        n={++fig}
        title="The most efficient 30-point season"
        sub="True shooting percentage minus the league average, by points per game"
        legend={[
          { kind: "field", label: "Every 25-point scorer since 1979–80" },
          { kind: "accent", label: "Curry, 2015–16" },
        ]}
        caption="313 seasons of at least 25 points per game and 58 games played. Further up means more efficient than the league that year."
      >
        <ScoringChart />
      </ChartFigure>

      <section className="post__prose">
        <p>
          He shot 50.4% from the field, 45.4% from three, and 90.8% at the line. It's the only 50–40–90 season by a
          player who averaged 30 points. Larry Bird came closest, at 29.9 in 1987–88.
        </p>
        <p>
          He led the league in four things that season: points per game, threes, steals, and free-throw percentage. He
          was 26th in minutes per game.
        </p>
        <p>The Warriors went 73–9, which is still the best record ever, and he was the first unanimous MVP.</p>
      </section>

      <section className="post__prose" aria-labelledby="since">
        <h2 id="since">Ten seasons of trying</h2>
        <p>
          This is the part that convinced me. The league didn't stay where it was. In 2015–16 teams took 24.1 threes a
          game. In 2024–25 they took 37.6, which is 56% more.
        </p>
        <p>
          Some of that shows up at the top. Before 2015–16 nobody had made 300 threes in a season. Since then it has
          happened nine more times, and five of those are Curry.
        </p>
        <p>
          But 400 has still happened once. The closest anyone has come is Harden's 378 in 2018–19, and he needed 142
          more attempts than Curry to finish 24 short. After that it's Curry himself, with 357 in 2023–24. The leader
          in 2025–26 was Kon Knueppel, a rookie, with 273.
        </p>
        <p>
          The extra threes didn't go to one player. They got spread around. Curry made 1.9% of all the threes in the
          league in 2015–16. Knueppel led the league with 0.8%. To take the share Curry took, a player in 2025–26 would
          have needed about 630.
        </p>
        <p>
          I also asked what the league leader should have made in 2015–16. Since 1997–98 the leader's total has tracked
          how many threes teams take. Each extra attempt per team per game has been worth about 5.5 more threes for
          the leader. For 2015–16 that line says 268. Curry was 134 over it, and a typical miss is about 33.
        </p>
      </section>

      <ChartFigure
        n={++fig}
        title="By the trend, 402 is still a long way off"
        sub="The league leader's threes against how many threes teams take, each season since 1997–98"
        caption="The line is fit to every season except 2015–16. The dashed part is beyond anything the league has done. Shortened seasons are scaled to 82 games."
      >
        <TrendChart />
      </ChartFigure>

      <section className="post__prose">
        <p>
          The line doesn't reach 402 until teams are taking 48 threes a game. They took 37 in 2025–26, slightly fewer
          than the season before.
        </p>
      </section>

      <section className="post__prose" aria-labelledby="takes">
        <h2 id="takes">What it would take</h2>
        <p>Getting to 403 is a multiplication problem: attempts times accuracy.</p>
      </section>

      <div className="post__table">
        <table>
          <caption className="visually-hidden">Three-point attempts needed to make 403 at different accuracies</caption>
          <thead>
            <tr>
              <th scope="col">If you shoot</th>
              <th scope="col" className="is-num">
                Attempts needed
              </th>
              <th scope="col" className="is-num">
                Per game, 82 games
              </th>
            </tr>
          </thead>
          <tbody>
            {NEEDS.map(([p, who, att, per]) => (
              <tr key={p}>
                <th scope="row">
                  {p}
                  {who && <span>{who}</span>}
                </th>
                <td className="is-num">{att}</td>
                <td className="is-num">{per}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="post__prose">
        <p>
          Only one player has ever taken 900 threes in a season, and that was Harden. Only Curry has shot 42% on 700 or
          more. Breaking the record means doing both in the same year, or being Curry.
        </p>
        <p>
          I also tried it as a probability problem. Treat every three as a coin flip with a fixed chance of going in,
          and give a shooter the same 886 attempts. A true 40% shooter gets to 402 about once in 1,500 seasons. A 42%
          shooter gets there about 2% of the time.
        </p>
        <p>
          Curry made 41.9% of his threes across all of his other seasons. Plug that in and even he gets to 402 about
          once in 50 tries. So 2015–16 was the best three-point shooter ever, taking more threes than in any other
          season of his career, in the best shooting year of his life. All three had to line up.
        </p>
        <p>
          The last thing I did was replay the ten seasons since. Every player with 300 or more attempts keeps the
          attempts he really took and gets a true three-point percentage based on his career. His makes are then drawn
          at random. I ran that 100,000 times. The record fell in 4.6% of the replays, and only two seasons ever got
          there: Harden's 2018–19, about 3.5% of the time, and Curry's 2023–24, about 1%.
        </p>
      </section>

      <section className="post__prose" aria-labelledby="caveats">
        <h2 id="caveats">What I'd be careful about</h2>
        <p>
          The number 402 isn't safe, and this is the part of the claim that didn't hold up. Per game, Curry has beaten
          his 2015–16 pace twice. He made 5.35 a game in 2020–21 and 5.13 in 2018–19, against 5.09 in 2015–16. He just
          didn't play enough games either time. At his 2020–21 rate over the 79 games he played in 2015–16, he makes
          423. So the record has been within reach for exactly one player, and he turns 39 in March 2027.
        </p>
        <p>
          The replays say the same thing. If I give every player a full 82 games at his own rate, the record falls
          almost every time, and it's nearly always Curry in 2020–21. Take Curry out and it falls in 30% of the
          replays, nearly all of them Harden in 2018–19.
        </p>
      </section>

      <div className="post__table">
        <table>
          <caption className="visually-hidden">How often the record falls in 100,000 replays of the ten seasons since</caption>
          <thead>
            <tr>
              <th scope="col">Replaying 2016–17 to 2025–26</th>
              <th scope="col" className="is-num">
                Record falls
              </th>
              <th scope="col" className="is-num">
                Without Curry
              </th>
            </tr>
          </thead>
          <tbody>
            {REPLAYS.map(([scenario, all, without]) => (
              <tr key={scenario}>
                <th scope="row">{scenario}</th>
                <td className="is-num">{all}</td>
                <td className="is-num">{without}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="post__prose">
        <p>
          Measures like standard deviations get strange when almost nobody shoots. By that measure Darrell Griffith in
          1983–84 was further from the pack than Curry, because he made 91 threes when the average regular made about
          six. I read those early seasons as a league that hadn't figured out the shot yet. But it does mean "biggest
          outlier ever" depends on where you start counting.
        </p>
        <p>
          On efficiency, Charles Barkley in 1987–88 is close to a tie. He was 12.7 points above the league's true
          shooting on 28.3 points a game. He just wasn't the scoring leader.
        </p>
        <p>
          The coin-flip model is crude. Shots aren't independent and they aren't equally hard, and a defense treats a
          player differently once he's making everything. I'd trust the order of magnitude and not the decimals.
        </p>
        <p>
          League averages here are added up from player totals, and true shooting uses the usual 0.44 weight on free
          throws. The shot-location data is missing 2 of Curry's 886 three-point attempts and about 0.3% of the
          league's, so the quarter-by-quarter counts could each be one low. Everything is regular season only.
        </p>
      </section>

      <section className="post__prose" aria-labelledby="verdict">
        <h2 id="verdict">So can it happen again?</h2>
        <p>
          Somebody might make 403 threes one day. It would take a full, healthy season from a shooter as good as Curry
          who takes more threes than Curry ever took. Nobody like that has shown up in ten seasons of the league
          shooting far more threes than it used to.
        </p>
        <p>
          What I don't think happens again is the season. He broke the record by 41%. He finished 126 ahead of second
          place. He shot 45% on the most three-point attempts anyone had ever taken, and he led the league in scoring
          more efficiently than any scoring leader of the three-point era. Any one of those is a career year, and he
          did all four at once.
        </p>
      </section>

      <p className="post__source">
        Statistics are from Basketball-Reference season totals, 1979–80 through 2025–26, plus NBA.com shot charts and
        ESPN box scores for 2015–16. Regular season only. The numbers behind the charts:{" "}
        <a href="/data/curry-2015-16-top10-by-season.csv">top ten by season</a>,{" "}
        <a href="/data/curry-2015-16-volume-accuracy.csv">attempts and accuracy</a>,{" "}
        <a href="/data/curry-2015-16-scorers.csv">scoring and efficiency</a>.
      </p>
    </>
  );
}
