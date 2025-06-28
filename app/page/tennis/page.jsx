"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Banner from "@/app/components/Banner";
import SportCard from "@/app/components/Card";
import Nothing from "@/app/components/Nothing";
import styles from "@/app/style/sport.module.css";
import VipResults from "@/app/components/VipResults";
import MobileFilter from "@/app/components/MobileFilter";
import { usePredictionStore } from "@/app/store/Prediction";
import EmptySportImage from "@/public/assets/emptysport.png";
import ExclusiveOffers from "@/app/components/ExclusiveOffer";
import { IoIosArrowForward as RightIcon } from "react-icons/io";
import { usePathname, useSearchParams } from "next/navigation";

export default function Sport() {
  const emptyCardCount = 12;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobile, setMobile] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [leagueKey, setLeagueKey] = useState("");
  const [countryKey, setCountryKey] = useState("");

  const currentCategory = decodeURIComponent(pathname.split("/").pop());

  const { predictions, loading, error, fetchPredictions, clearError } =
    usePredictionStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMobile(true);
      } else {
        setMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const loadPredictions = async () => {
      const urlDate = searchParams.get("date");

      if (!urlDate) return;

      const category = currentCategory.toLowerCase();
      const result = await fetchPredictions(urlDate, category);

      if (!result.success && result.message) {
        toast.error(result.message);
      }
    };

    loadPredictions();
  }, [searchParams, currentCategory, fetchPredictions]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    const urlCountry = searchParams.get("country");
    const urlLeague = searchParams.get("league");
    const urlSearch = searchParams.get("search");

    if (urlCountry) setCountryKey(urlCountry);
    if (urlLeague) setLeagueKey(urlLeague);
    if (urlSearch) setSearchKey(urlSearch);
  }, [searchParams]);

  const filteredPredictions = predictions.filter((prediction) => {
    const matchesSearch =
      !searchKey ||
      prediction.teamA.toLowerCase().includes(searchKey.toLowerCase()) ||
      prediction.teamB.toLowerCase().includes(searchKey.toLowerCase()) ||
      prediction.tip.toLowerCase().includes(searchKey.toLowerCase());

    const matchesLeague =
      !leagueKey ||
      prediction.league.toLowerCase().includes(leagueKey.toLowerCase());

    const matchesCountry =
      !countryKey ||
      prediction.country.toLowerCase().includes(countryKey.toLowerCase());

    const matchesCategory =
      prediction.category.toLowerCase() === currentCategory.toLowerCase();

    const predictionType = searchParams.get("prediction");
    const matchesPredictionType =
      !predictionType ||
      prediction.tip.toLowerCase().includes(predictionType.toLowerCase());

    return (
      matchesSearch &&
      matchesLeague &&
      matchesCountry &&
      matchesCategory &&
      matchesPredictionType
    );
  });

  const shouldShowNothing = !loading && filteredPredictions.length === 0;

  const renderPredictionInfo = () => {
    return (
    <div className={styles.predictionInfo}>
  <h1>Tennis Predictions</h1>
  <p>
    Tennis predictions involve analyzing upcoming matches to forecast likely
    winners, set scores, or betting outcomes. Predicting tennis results can be
    used for fun, sports analysis, or betting. Common prediction types include:
    match-winner predictions, correct score, over/under games, total sets,
    handicap bets, and even in-play betting based on momentum shifts. Good
    tennis predictions rely on deep understanding of player form, surfaces, and
    match dynamics.
  </p>

  <h2>Everything You Need to Know About Tennis Predictions</h2>
  <p>
    At SportyPredict, our team of tennis analysts and betting specialists
    delivers daily reliable tennis predictions and free tennis tips so you can
    place smarter wagers and target higher returns. Whether you’re a casual
    follower or a seasoned punter, this comprehensive guide will teach you how
    to turn form data, surface analysis, and odds evaluation into a consistent
    winning strategy.
  </p>

  <h2>How to Check the Reliability of a Tennis Prediction</h2>
  <p>
    <strong>Select Your Match:</strong> Choose the fixture you want to analyze—
    e.g., Carlos Alcaraz vs. Novak Djokovic in a Grand Slam fourth round.
  </p>
  <p>
    <strong>Estimate True Win Probability:</strong> Combine recent form,
    head‑to‑head record, surface preference, fitness, and mental edge to assign
    each player a percentage chance. For instance, you might believe Alcaraz has
    a 55% chance to beat Djokovic on clay.
  </p>
  <p>
    <strong>Compare to Bookmaker Odds:</strong> If a sportsbook like Megapari
    offers Alcaraz at 2.00, that implies a 50% chance (since 1 ÷ 2.00 = 0.50).
    Your 55% estimate exceeds the implied bookmaker probability, revealing a
    value tennis prediction worth backing.
  </p>

  <h2>Our 5 Key Strategies for Successful Tennis Predictions</h2>

  <h3>1. Leverage Bookmaker Bonuses & Promotions</h3>
  <ul>
    <li>
      <strong>Welcome Offers:</strong> Sign up with top sites (Megapari, Melbet,
      BetWinner) and claim free bets, deposit matches, or risk‑free first bets.
    </li>
    <li>
      <strong>Ongoing Promotions:</strong> Look for enhanced odds on tournaments
      like Wimbledon or the US Open, and accumulator boosts on ATP Masters 1000
      events.
    </li>
    <li>
      <strong>Bankroll Management:</strong> Use bonus funds to explore markets
      such as correct‑set score (e.g., 3–1 to Alcaraz vs. Djokovic) or
      over/under total games, while saving your main stake for your strongest
      convictions.
    </li>
  </ul>

  <h3>2. Analyze Player Form & Motivation</h3>
  <p>
    Motivation and current form often dictate outcomes more than rankings:
    tournament stakes, surface suitability, momentum, and even off-court factors
    can impact performance.
  </p>
  <p>
    Tip: Monitor press conferences and social media for hints—if Novak Djokovic
    speaks about peak fitness and focus, his motivation level is likely very
    high.
  </p>

  <h3>3. Stay Updated on Fitness, Draws & Scheduling</h3>
  <p>
    Late-breaking news can make or break a tennis tip. Watch out for:
  </p>
  <ul>
    <li>
      <strong>Injury Reports:</strong> Even minor physical issues can influence
      performance.
    </li>
    <li>
      <strong>Match Scheduling:</strong> Fatigue from previous rounds can affect
      stamina.
    </li>
    <li>
      <strong>Weather Conditions:</strong> Wind, humidity, and court speed affect
      match dynamics.
    </li>
  </ul>
  <p>
    Strategy: Wait until the official draw and order-of-play are released before
    placing high-confidence bets.
  </p>

  <h3>4. Assess Playing Styles & Head‑to‑Head Trends</h3>
  <p>
    Every matchup carries its own stylistic narrative. Look at:
  </p>
  <ul>
    <li>
      <strong>Big Server vs. Returner:</strong> Surface speed may tilt the
      balance.
    </li>
    <li>
      <strong>Historical Records:</strong> H2H data reveals mental or stylistic
      advantages.
    </li>
    <li>
      <strong>Upset Potential:</strong> Early rounds can bring surprises—watch
      for in-form underdogs.
    </li>
  </ul>

  <h3>5. Quantify Value with Odds & Expected Value (EV)</h3>
  <p>
    Always back only positive-value bets:
  </p>
  <ul>
    <li>
      <strong>Convert Odds to Implied Probability:</strong> 1.65 = 60.6%
    </li>
    <li>
      <strong>Compare to Your Estimate:</strong> If you estimate 70%, the value
      margin is clear.
    </li>
    <li>
      <strong>Calculate EV:</strong> (70% – 60.6%) ÷ 60.6% ≈ +15.5%
    </li>
    <li>
      <strong>Stake Accordingly:</strong> Use confidence levels to size bets
      smartly.
    </li>
  </ul>

  <h2>Is There Such a Thing as a “Sure Tip” in Tennis Predictions?</h2>
  <p>
    No outcome in tennis is 100% guaranteed—even Federer or Świątek can lose a
    set. But you can edge closer to success by:
  </p>
  <ul>
    <li>Prioritizing high EV bets</li>
    <li>Diversifying your betting markets</li>
    <li>Following a disciplined, data-driven approach</li>
  </ul>

  <p>
    At SportyPredict, our free tennis tips and detailed match previews include:
  </p>
  <ul>
    <li>Form analysis (clay, grass, hard)</li>
    <li>Head-to-head breakdown and tactical insights</li>
    <li>Coach/support staff influences</li>
    <li>Key stats (first-serve %, break-point conversion)</li>
    <li>Value-driven predictions (e.g. over 22.5 games, set score)</li>
    <li>Confidence ratings to guide stake size</li>
  </ul>

  <p>
    While no tip can promise slam-level certainty, these methods bring your
    tennis predictions as close as possible to a winning edge—helping you cash
    in more often and maximize your returns.
  </p>
</div>

    );
  };

  const renderEmptyCards = () => {
    return Array(emptyCardCount)
      .fill(0)
      .map((_, index) => (
        <div
          className={`${styles.emptyCard} skeleton`}
          key={`empty-${index}`}
        />
      ));
  };

  const handleCardClick = (teamA, teamB, id) => {
    if (id !== "empty") {
      let selectedDate = searchParams.get("date");

      if (!selectedDate) {
        const today = new Date();
        selectedDate = today.toISOString().split("T")[0];
      }

      const cleanTeamA =
        teamA
          ?.toString()
          ?.trim()
          ?.replace(/\s+/g, "-")
          ?.replace(/[^\w\-]/g, "")
          ?.replace(/--+/g, "-")
          ?.replace(/^-|-$/g, "") || "team-a";

      const cleanTeamB =
        teamB
          ?.toString()
          ?.trim()
          ?.replace(/\s+/g, "-")
          ?.replace(/[^\w\-]/g, "")
          ?.replace(/--+/g, "-")
          ?.replace(/^-|-$/g, "") || "team-b";

      const matchSlug = `${cleanTeamA}-vs-${cleanTeamB}`;
      const baseUrl = `/page/${currentCategory}/single/${matchSlug}`;
      const fullUrl = `${baseUrl}?date=${selectedDate}`;

      router.push(fullUrl, { scroll: false });
    }
  };

  if (loading) {
    return (
      <div className={styles.sportContainer}>
        <Banner />
        <div className={styles.filtersContainer}>
          <MobileFilter
            searchKey={searchKey}
            setSearchKey={setSearchKey}
            leagueKey={leagueKey}
            setLeagueKey={setLeagueKey}
            countryKey={countryKey}
            setCountryKey={setCountryKey}
          />
        </div>
        <ExclusiveOffers />
        <div className={styles.content}>{renderEmptyCards()}</div>
      </div>
    );
  }

  if (shouldShowNothing) {
    return (
      <div className={styles.sportContainer}>
        <Banner />
        <div className={styles.filtersContainer}>
          <MobileFilter
            searchKey={searchKey}
            setSearchKey={setSearchKey}
            leagueKey={leagueKey}
            setLeagueKey={setLeagueKey}
            countryKey={countryKey}
            setCountryKey={setCountryKey}
          />
        </div>
        <ExclusiveOffers />
        <div className={styles.content}>
          <Nothing
            Alt="No prediction"
            NothingImage={EmptySportImage}
            Text={
              searchKey ||
              leagueKey ||
              countryKey ||
              searchParams.get("prediction")
                ? `No ${currentCategory} predictions match your filters${
                    searchParams.get("date")
                      ? ` for ${new Date(
                          searchParams.get("date")
                        ).toLocaleDateString()}`
                      : ""
                  }`
                : `No ${currentCategory} predictions yet! Check back later.`
            }
          />
        </div>
        {renderPredictionInfo()}
      </div>
    );
  }

  return (
    <div className={styles.sportContainer}>
      <Banner />
      <div className={styles.filtersContainer}>
        <MobileFilter
          searchKey={searchKey}
          setSearchKey={setSearchKey}
          leagueKey={leagueKey}
          setLeagueKey={setLeagueKey}
          countryKey={countryKey}
          setCountryKey={setCountryKey}
        />
      </div>
      <ExclusiveOffers />
      <div
        className={`${styles.content} ${
          predictions ? styles.predictionMinHeight : ""
        }`}
      >
        {filteredPredictions.map((data, index) => (
          <SportCard
            key={data._id || index}
            formationA={data.formationA}
            formationB={data.formationB}
            leagueImage={data.leagueImage}
            teamAImage={data.teamAImage}
            teamBImage={data.teamBImage}
            tip={data.tip}
            league={data.league}
            teamA={data.teamA}
            teamB={data.teamB}
            teamAscore={data.teamAscore}
            teamBscore={data.teamBscore}
            time={data.time}
            status={data.status}
            sport={data.sport}
            showScore={data.showScore}
            showBtn={data.showBtn}
            component={
              <div
                className={styles.matchPreview}
                onClick={() =>
                  handleCardClick(data.teamA, data.teamB, data._id)
                }
              >
                <span>Match Preview </span>
                <RightIcon
                  className={styles.matchArrowIcon}
                  alt="arrow icon"
                  height={20}
                />
              </div>
            }
          />
        ))}
        {isMobile && <VipResults />}
      </div>
      {renderPredictionInfo()}
    </div>
  );
}
