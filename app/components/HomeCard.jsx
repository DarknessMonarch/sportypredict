"use client";

import Image from "next/image";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { RiBasketballLine as BasketballIcon } from "react-icons/ri";
import { IoFootball as FootballIcon } from "react-icons/io5";
import { MdOutlineSportsTennis as TennisIcon } from "react-icons/md";
import { PiCourtBasketball as BetOfTheDayIcon } from "react-icons/pi";
import { IoChevronForwardOutline as ChevronIcon } from "react-icons/io5";
import styles from "@/app/style/homecard.module.css";

export default function HomeCard({ sport, predictions = [], onCardClick }) {
  const router = useRouter();

  const getSportIcon = (sportType) => {
    switch (sportType?.toLowerCase()) {
      case "football":
        return <FootballIcon size={24} />;
      case "basketball":
        return <BasketballIcon size={24} />;
      case "tennis":
        return <TennisIcon size={24} />;
      case "bet-of-the-day":
        return <BetOfTheDayIcon size={24} />;
      default:
        return <FootballIcon size={24} />;
    }
  };

  const getSportDisplayName = (sportType) => {
    switch (sportType?.toLowerCase()) {
      case "football":
        return "Football";
      case "basketball":
        return "Basketball";
      case "tennis":
        return "Tennis";
      case "bet-of-the-day":
        return "Bet of the Day";
      default:
        return sportType || "Unknown";
    }
  };

  const handleSportHeaderClick = (e) => {
    e.stopPropagation();
    const sportPath =
      sport === "bet-of-the-day" ? "bet-of-the-day" : sport.toLowerCase();
    router.push(`/page/${sportPath}`);
  };

  const formatTime = (time) => {
    if (!time) return "00:00";
    const localTime = DateTime.fromISO(time).setZone(DateTime.local().zoneName);
    return localTime.toFormat("HH:mm");
  };

  const formatDate = (date) => {
    if (!date) return "";
    const localDate = DateTime.fromISO(date).setZone(DateTime.local().zoneName);
    return localDate.toFormat("dd MMM");
  };

  const handlePredictionClick = (prediction) => {
    if (onCardClick) {
      onCardClick({
        sport: prediction.sport,
        league: prediction.league,
        teamA: prediction.teamA,
        teamB: prediction.teamB,
        time: prediction.time,
        date: prediction.time,
      });
    } else {
      const matchSlug = `${prediction.teamA
        .toLowerCase()
        .replace(/\s+/g, "-")}-vs-${prediction.teamB
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
      const actualSport = prediction.sport?.toLowerCase() || "football";
      router.push(`/match/${actualSport}/${matchSlug}`);
    }
  };

  const getFormationColorClass = (formation) => {
    switch (formation.toUpperCase()) {
      case "W":
        return styles.win;
      case "D":
        return styles.draw;
      case "L":
        return styles.lose;
      default:
        return styles.defaultColor;
    }
  };

  const renderFormIndicators = (form) => {
    if (!form || !Array.isArray(form)) return null;
    return form.map((result, index) => (
      <div
        key={index}
        className={`${styles.formationCircle} ${getFormationColorClass(
          result
        )}`}
      >
        <span>{result.toUpperCase()}</span>
      </div>
    ));
  };

  if (!predictions || predictions.length === 0) {
    return null;
  }

  return (
    <div className={styles.cardContainer}>
      <div className={styles.sportHeader} onClick={handleSportHeaderClick}>
        <div className={styles.sportInfo}>
          <span className={styles.sportIcon}>{getSportIcon(sport)}</span>
          <h2>{getSportDisplayName(sport)} predictions</h2>
        </div>
        <div className={styles.expandIcon}>
          <ChevronIcon size={20} />
        </div>
      </div>

      {predictions.map((prediction, index) => (
        <div
          key={prediction._id || index}
          className={styles.card}
          onClick={() => handlePredictionClick(prediction)}
        >
          <div className={styles.mobileMatchDetails}>
            <span>
              ({formatDate(prediction.time)}) ({formatTime(prediction.time)})
            </span>
            <div className={styles.chevronSection}>
              <ChevronIcon size={20} />
            </div>
          </div>

          <div className={styles.matchRowInner}>
            <div className={styles.matchRow}>
              <div className={styles.teamSection}>
                <div className={styles.teamInfo}>
                  <Image
                    src={prediction.teamAImage || ""}
                    alt={prediction.teamA || "Team A"}
                    width={30}
                    height={30}
                    className={`${styles.teamImage} ${
                      sport === "Tennis" || sport === "Basketball"
                        ? " " + styles.circularShape
                        : ""
                    }`}
                  />
                  <span className={styles.teamName}>{prediction.teamA}</span>
                </div>
                <div className={styles.formation}>
                  {renderFormIndicators(prediction.formationA)}
                </div>
              </div>
              {/*- desktop only */}
              <div className={styles.matchDetails}>
                <span>
                  ({formatDate(prediction.time)}) ({formatTime(prediction.time)}
                  )
                </span>
              </div>
              <div className={styles.teamSection}>
                <div className={styles.teamInfo}>
                  <Image
                    src={prediction.teamBImage || ""}
                    alt={prediction.teamB || "Team B"}
                    width={30}
                    height={30}
                    className={`${styles.teamImage} ${
                      sport === "Tennis" || sport === "Basketball"
                        ? " " + styles.circularShape
                        : ""
                    }`}
                  />
                  <span className={styles.teamName}>{prediction.teamB}</span>
                </div>
                <div className={styles.formation}>
                  {renderFormIndicators(prediction.formationB)}
                </div>
              </div>
            </div>
            <div className={styles.chevronSection}>
              <ChevronIcon size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
