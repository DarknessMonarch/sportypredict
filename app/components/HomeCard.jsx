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

export default function HomeCard({
  sport, 
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
  showSportHeader = false, 
  previousSport, 
}) {
  const router = useRouter();

  const formattedTime = useMemo(() => {
    if (!time) return "00:00";
    const localTime = DateTime.fromISO(time).setZone(DateTime.local().zoneName);
    return localTime.toFormat("HH:mm");
  }, [time]);

  const formattedDate = useMemo(() => {
    if (!date) return "";
    const localDate = DateTime.fromISO(date).setZone(DateTime.local().zoneName);
    return localDate.toFormat("dd MMM");
  }, [date]);

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

  const handleSportHeaderClick = (e) => {
    e.stopPropagation(); 
    const sportPath = sport.toLowerCase();
    router.push(`/page/${sportPath}`);
  };

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
    } else {
      const matchSlug = `${teamA.toLowerCase().replace(/\s+/g, '-')}-vs-${teamB.toLowerCase().replace(/\s+/g, '-')}`;
      router.push(`/match/${sport.toLowerCase()}/${matchSlug}`);
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

  const shouldShowHeader = showSportHeader || (previousSport && previousSport !== sport);

  return (
    <div className={styles.cardContainer}>
      {shouldShowHeader && (
        <div 
          className={styles.sportHeader} 
          onClick={handleSportHeaderClick}
        >
          <div className={styles.sportInfo}>
            <span className={styles.sportIcon}>{getSportIcon(sport)}</span>
            <h2>{sport} betting tips & predictions</h2>
          </div>
          <div className={styles.expandIcon}>
            <ChevronIcon size={20} />
          </div>
        </div>
      )}

      <div className={styles.card} onClick={handleCardClick}>
        {shouldShowHeader && (
          <div className={styles.mobileMatchDetails}>
            <span>
              ({formattedDate}) ({formattedTime})
            </span>
          </div>
        )}

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
      
    </div>
  );
}