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
        <h1>Football Predictions</h1>
        <p>
          {" "}
          Football predictions involve trying to predict the outcome of football
          (soccer) matches. People make football predictions for various
          purposes, including betting, sports analysis, or simply for fun. Some
          common types of football predictions include: Match Outcome
          Predictions (1 for home team, 2 for away team, X for draw, Over/Under
          Predictions (i.e 0ver 1.5 goals under 2.5 goals), Both Teams to Score
          (BTTS) Predictions (i.e BTTS-Yes and BTTS-No), Double Chance
          Predictions (1X, 12,X2), and many more.
        </p>
        <p>
          {" "}
          When making football predictions, it&apos;s essential to consider
          factors like team form, player injuries, head-to-head statistics,
          home-field advantage, weather conditions, and other relevant data.
          Keep in mind that predicting the outcome of sports events always
          carries an element of uncertainty, and responsible betting is crucial.
          Additionally, some people make predictions for fun or as part of
          sports analysis without involving betting.
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
