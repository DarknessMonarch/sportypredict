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
        <h1>Basketball Predictions</h1>
        <p>
          Basketball predictions involve forecasting the outcomes of games
          across professional leagues like the NBA, EuroLeague, FIBA, and
          national circuits. From predicting who wins to total points or
          standout player performances, basketball predictions require in-depth
          analysis of form, stats, injuries, and team tactics—not just gut
          feeling.
        </p>

        <h2>Everything You Need to Know On Winning Basketball Predictions</h2>
        <p>
          Welcome to SportyPredict, your trusted destination for accurate
          basketball predictions and expert betting tips across the world’s top
          leagues and competitions. Whether you&apos;re following the NBA,
          EuroLeague, FIBA tournaments, or domestic leagues like the NBL or ACB,
          understanding how to bet on basketball requires more than just
          guessing which team has the best players.
        </p>
        <p>
          From team stats to player rotations, rest days to coaching styles—this
          guide will show you what separates guesswork from a winning strategy.
          Let’s explore how to maximize value in basketball betting with a deep
          dive into the nuances of the game.
        </p>

        <h2>What Makes a Basketball Prediction Reliable?</h2>
        <ul>
          <li>
            <strong>Contextual Understanding:</strong> Knowing *why* a team is
            favored—not just that they are.
          </li>
          <li>
            <strong>Statistical Trends:</strong> Metrics like pace, defensive
            efficiency, and three-point rate impact outcomes.
          </li>
          <li>
            <strong>Situational Awareness:</strong> Consider fatigue, travel,
            and even officiating tendencies.
          </li>
        </ul>
        <p>
          <em>Example:</em> If the Denver Nuggets are on a four-game East Coast
          road trip and face a well-rested Miami Heat team at home, Denver may
          underperform due to fatigue—making Miami a value bet even if Denver
          has the better form.
        </p>

        <h2>Our 5 Core Tips to Check Before Placing A Basketball Bet</h2>

        <h3>1. Shop for Odds & Line Movement</h3>
        <ul>
          <li>
            Register with bookmakers like Megapari, Melbet, Stake, and 1Xbet.
          </li>
          <li>Compare odds on spreads or totals across platforms.</li>
          <li>
            Track line movement—e.g., if Bucks -4.5 shifts to -6, find out why
            before betting.
          </li>
          <li>
            Totals Betting: Fast-paced teams are great targets for over/under
            markets.
          </li>
        </ul>

        <h3>2. Analyze Team Performance Metrics</h3>
        <ul>
          <li>
            <strong>Offensive & Defensive Ratings:</strong> Points
            scored/allowed per 100 possessions.
          </li>
          <li>
            <strong>Rebounding %:</strong> Key in second-chance point scenarios.
          </li>
          <li>
            <strong>Pace Factor:</strong> Higher pace means more scoring—great
            for totals bets.
          </li>
          <li>
            <strong>Turnover Rates:</strong> Vulnerable teams struggle against
            aggressive defenses.
          </li>
        </ul>

        <h3>3. Evaluate Key Player Impact</h3>
        <ul>
          <li>
            <strong>Injuries/Suspensions:</strong> Missing stars (e.g., Luka
            Dončić) alters team dynamics.
          </li>
          <li>
            <strong>Usage Rates:</strong> High-usage players have big impact;
            their absence matters.
          </li>
          <li>
            <strong>Role Players:</strong> Players like Brook Lopez or Malik
            Monk can swing close games.
          </li>
        </ul>
        <p>
          <strong>Pro Tip:</strong> Don&apos;t just check who’s injured—see who
          steps up in their absence.
        </p>

        <h3>4. Understand Matchups & Styles</h3>
        <ul>
          <li>
            <strong>Paint vs. Perimeter:</strong> Different teams thrive in
            different areas—style clashes matter.
          </li>
          <li>
            <strong>Defensive Schemes:</strong> Zone defense can neutralize
            certain offenses.
          </li>
          <li>
            <strong>Tempo Conflicts:</strong> Slow-paced vs. fast-paced clashes
            impact total scores.
          </li>
        </ul>
        <p>
          Example: Knicks vs. Kings—expect the pace to skew the expected points
          market.
        </p>

        <h3>5. Factor in Scheduling & Fatigue</h3>
        <ul>
          <li>
            <strong>Rest Advantage:</strong> Well-rested teams tend to
            outperform.
          </li>
          <li>
            <strong>Altitude Impact:</strong> Teams visiting Denver often fade
            in the fourth quarter.
          </li>
          <li>
            <strong>Lookahead Games:</strong> Teams might underperform when
            saving energy for tougher matchups.
          </li>
        </ul>

        <h2>Types of Basketball Bets You Should Consider</h2>
        <ul>
          <li>
            <strong>Moneyline:</strong> Bet on a straight win—great for
            confident underdog picks.
          </li>
          <li>
            <strong>Spread Betting:</strong> Can the favorite cover the handicap
            (e.g., Celtics -9.5)?
          </li>
          <li>
            <strong>Totals:</strong> Bet on over/under combined points (e.g.,
            over 225.5 for Kings vs. Warriors).
          </li>
          <li>
            <strong>Player Props:</strong> Bet on player stats (e.g., SGA to
            score 30+ or 5+ rebounds).
          </li>
          <li>
            <strong>Quarter/Half Markets:</strong> Focus on specific game
            segments for more strategic bets.
          </li>
        </ul>

        <h2>Can You Get “Sure Bets” in Basketball Betting?</h2>
        <p>
          Even with perfect research, basketball remains unpredictable.
          Injuries, buzzer-beaters, or shooting variance can shift outcomes
          instantly.
        </p>
        <p>But with:</p>
        <ul>
          <li>Disciplined research</li>
          <li>Smart bankroll management</li>
          <li>Accurate data interpretation</li>
          <li>Support from SportyPredict’s expert analysis</li>
        </ul>
        <p>…you can significantly increase your hit rate and betting ROI.</p>

        <h2>Why Choose SportyPredict for Basketball Betting Tips?</h2>
        <p>
          At SportyPredict, we go beyond guesswork. Our daily basketball
          previews and expert tips include:
        </p>
        <ul>
          <li>Team analysis across NBA, EuroLeague, BBL, and more</li>
          <li>Predicted lineups and rest-day impact</li>
          <li>Data-backed betting angles and player insights</li>
          <li>Match-winner, spread, over/under, and player prop picks</li>
        </ul>
        <p>
          Whether you’re chasing slam dunks in the NBA or buzzer-beaters in
          Europe, SportyPredict has your basketball betting strategy covered.
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

      const encodedSlug = encodeURIComponent(matchSlug);

      const baseUrl = `/${currentCategory}/prediction/${encodedSlug}`;
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
