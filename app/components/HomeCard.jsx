"use client";

import Image from "next/image";
import { DateTime } from "luxon";
import { useMemo } from "react";
import styles from "@/app/style/homecard.module.css";

export default function HomeCard({
  sport, // "Football", "Basketball", "Tennis"
  teamAImage,
  teamBImage,
  league,
  teamA,
  teamB,
  time,
  date,
  teamAForm = [],
  teamBForm = [],
  onCardClick,
}) {
  const formattedTime = useMemo(() => {
    if (!time) return "00:00";
    const localTime = DateTime.fromISO(time).setZone(DateTime.local().zoneName);
    return localTime.toFormat("HH:mm");
  }, [time]);

  const formattedDate = useMemo(() => {
    if (!date) return "";
    const localDate = DateTime.fromISO(date).setZone(DateTime.local().zoneName);
    return localDate.toFormat("dd/MM");
  }, [date]);

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick({
        sport,
        league,
        teamA,
        teamB,
        time,
        date,
      });
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

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.cardHeader}>
        <h2>{sport} betting tips & predictions</h2>
        <div className={styles.expandIcon}>&gt;&gt;</div>
      </div>

      <div className={styles.matchRow}>
        <div className={styles.teamSection}>
          <div className={styles.teamInfo}>
            <Image
              src={teamAImage || ""}
              alt={teamA || "Team A"}
              width={30}
              height={30}
              className={`${styles.teamImage} ${
                sport === "Tennis" || sport === "Basketball"
                  ? " " + styles.circularShape
                  : ""
              }`}
            />
            <span>{teamA}</span>
          </div>
          <div className={styles.formation}>
            {renderFormIndicators(teamAForm)}
          </div>
        </div>

        <div className={styles.matchDetails}>
            <span>
              ({formattedDate}) ({formattedTime})
            </span>
        
        </div>

        {/* Team B */}
        <div className={styles.teamSection}>
          <div className={styles.teamInfo}>
            <Image
              src={teamBImage || ""}
              alt={teamB || "Team B"}
              width={30}
              height={30}
              className={`${styles.teamImage} ${
                sport === "Tennis" || sport === "Basketball"
                  ? " " + styles.circularShape
                  : ""
              }`}
            />
            <span className={styles.teamName}>{teamB}</span>
          </div>
          <div className={styles.formation}>
            {renderFormIndicators(teamBForm)}
          </div>
        </div>
      </div>
    </div>
  );
}
