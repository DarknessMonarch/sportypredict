"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Banner from "@/app/components/Banner";
import SportCard from "@/app/components/Card";
import Nothing from "@/app/components/Nothing";
import styles from "@/app/style/sport.module.css";
import VipResults from "@/app/components/VipResults";
import { createMatchSlug } from "@/app/utility/UrlSlug"; 
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
        <h1>Football Predictions</h1>
        <p>
          Football predictions involve trying to predict the outcome of football
          (soccer) matches. People make football predictions for various
          purposes, including betting, sports analysis, or simply for fun. Some
          common types of football predictions include: Match Outcome
          Predictions (1 for home team, 2 for away team, X for draw, Over/Under
          Predictions (i.e over 1.5 goals under 2.5 goals), Both Teams to Score
          (BTTS) Predictions (i.e BTTS-Yes and BTTS-No), Double Chance
          Predictions (1X, 12, X2), and many more.
        </p>
        <p>
          When making football predictions, it&apos;s essential to consider
          factors like team form, player injuries, head-to-head statistics,
          home-field advantage, weather conditions, and other relevant data.
          Keep in mind that predicting the outcome of sports events always
          carries an element of uncertainty, and responsible betting is crucial.
          Additionally, some people make predictions for fun or as part of
          sports analysis without involving betting.
        </p>

        <h2>Everything You Need to Know for Winning Football Predictions</h2>
        <p>
          At SportyPredict, our dedicated team of football analysts and betting
          specialists delivers daily reliable football predictions and free
          football tips so you can place smarter bets and target higher returns.
          Whether you&apos;re a casual bettor or a seasoned punter, this
          comprehensive guide will teach you how to transform data, motivation,
          and odds analysis into consistent betting success.
        </p>

        <h2>How to Check the Reliability of a Football Prediction</h2>
        <p>
          <strong>Pick Your Match:</strong> Choose a fixture to analyze—say
          Manchester United vs. Liverpool.
        </p>
        <p>
          <strong>Estimate True Win Chances:</strong> Consider recent form,
          head‑to‑head history, squad news and tactical matchups. Suppose you
          believe City have a 70% chance of winning.
        </p>
        <p>
          <strong>Compare to Bookmaker Odds:</strong> If Megapari offers City at
          1.57, that implies about a 64% chance (because 1 divided by 1.57 ≈
          0.64). Since your 70% estimate exceeds the bookmaker&apos;s 64% figure,
          you&apos;ve found a value football prediction worth backing.
        </p>

        <h2>Our 5 Must‑Have Strategies for Successful Football Predictions</h2>

        <h3>1. Leverage Bookmaker Bonuses & Promotions</h3>
        <ul>
          <li>
            <strong>Welcome Offers:</strong> Sign up with Megapari, Melbet,
            Stake or BetWinner and grab free bets or deposit matches.
          </li>
          <li>
            <strong>Ongoing Deals:</strong> Use enhanced odds on matches like
            Real Madrid vs. Barcelona or boosted accumulators on Premier League
            weekends.
          </li>
          <li>
            <strong>Bankroll Management:</strong> Reserve bonus funds for
            experimenting with markets—perhaps a correct‑score bet on Arsenal
            vs. Chelsea—while using your main bank for value bets.
          </li>
        </ul>

        <h3>2. Analyze Team Motivation & Psychological Factors</h3>
        <p>
          Motivation can swing matches more than raw talent. Consider season
          stakes, contract situations, managerial changes, or off-field issues.
        </p>
        <p>
          Tip: Watch press conferences for clues on team spirit—an upbeat camp
          at Bayern Munich often translates to strong performances.
        </p>

        <h3>3. Stay Updated on Squad News & Fitness</h3>
        <p>
          The best football forecasts are made in the final hour. Wait for
          confirmed lineups, monitor key injuries and suspensions, and apply
          context to recent form.
        </p>

        <h3>4. Assess Tactical Matchups & Historical Trends</h3>
        <p>
          Every team has unique strengths and weaknesses. Consider home vs. away
          form, fixture congestion, H2H records, playing styles, and derby
          intensity.
        </p>

        <h3>5. Quantify Value with Odds Analysis</h3>
        <p>
          Only back bets where your estimated chance exceeds the bookmaker&apos;s
          implied chance. That&apos;s how you build a profitable strategy.
        </p>
        <ul>
          <li>
            <strong>Example 1:</strong> Arsenal vs. Tottenham — Odds: 2.20
            (45.5% implied), Your estimate: 60% → value.
          </li>
          <li>
            <strong>Example 2:</strong> Bayern vs. Dortmund — Odds: 1.80 (56%
            implied), Your estimate: 65% → strong value.
          </li>
        </ul>

        <h2>Is There Such a Thing as a &apos;Sure Win&apos; In Football?</h2>
        <p>
          No football prediction is ever 100% guaranteed—upsets happen. However,
          you can approach near-certainty by:
        </p>
        <ul>
          <li>
            Focusing on positive‑value bets where your analysis clearly shows an
            edge.
          </li>
          <li>
            Diversifying bet types like match winners, over/under, or BTTS on
            high-profile fixtures.
          </li>
          <li>
            Sticking to data-driven bets and avoiding emotional decisions.
          </li>
        </ul>

        <p>
          At SportyPredict, our free football tips and detailed match previews
          include:
        </p>
        <ul>
          <li>Form Breakdown (home, away, recent run)</li>
          <li>Probable Starting Line‑Ups and Key Absentees</li>
          <li>Key Player Matchups and Statistical Insights</li>
          <li>
            Value‑Driven Predictions (correct score, first goalscorer, BTTS)
          </li>
          <li>Confidence Levels to guide your stake size</li>
        </ul>

        <p>
          While &apos;sure wins&apos; don&apos;t exist, these methods bring your football
          predictions as close as possible to certainty—helping you win more
          often and cash higher amounts.
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
    if (id === "empty" || !teamA || !teamB) return;

    let selectedDate = searchParams.get("date");
    if (!selectedDate) {
      const today = new Date();
      selectedDate = today.toISOString().split("T")[0];
    }

    const matchSlug = createMatchSlug(teamA, teamB);
    const encodedSlug = encodeURIComponent(matchSlug);
    
    const baseUrl = `/${currentCategory}/prediction/${encodedSlug}`;
    const fullUrl = `${baseUrl}?date=${selectedDate}`;

    router.push(fullUrl, { scroll: false });
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