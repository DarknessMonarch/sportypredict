"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { DateTime } from "luxon";
import { useAdvertStore } from "@/app/store/Advert";
import styles from "@/app/style/vipcard.module.css";

export default function VipCard({
  leagueImage,
  teamAImage,
  teamBImage,
  tip = "No tip",
  league,
  teamA,
  teamB,
  time,
  odd,
  status,
  stake,
  totalOdds,
  isGrouped = false,
  originalPredictions = [],
}) {
  const { adverts, fetchAdverts, loading } = useAdvertStore();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const cardBannerAds = adverts.filter((ad) => ad.location === "CardBanner");
  const currentAd = cardBannerAds[currentAdIndex];

  const formattedTime = useMemo(() => {
    if (!time) return "00:00";
    const localTime = DateTime.fromISO(time).setZone(DateTime.local().zoneName);
    return localTime.toFormat("HH:mm");
  }, [time]);

  useEffect(() => {
    fetchAdverts();
  }, [fetchAdverts]);

  useEffect(() => {
    if (cardBannerAds.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex(
          (prevIndex) => (prevIndex + 1) % cardBannerAds.length
        );
      }, 5000); // Change ad every 5 seconds

      return () => clearInterval(interval);
    }
  }, [cardBannerAds.length]);

  const handleAdClick = () => {
    if (currentAd?.link) {
      window.open(currentAd.link, "_blank", "noopener,noreferrer");
    }
  };

  const renderAdBanner = () => {
    if (loading || !currentAd) {
      return (
        <div className={`${styles.adBanner} skeleton`}>
          <div className={styles.adBannerImage}></div>
        </div>
      );
    }

    return (
      <div
        className={styles.adBanner}
        onClick={handleAdClick}
        style={{ cursor: currentAd.link ? "pointer" : "default" }}
      >
        <Image
          className={styles.advertImage}
          src={currentAd.image}
          alt={currentAd.title || "Advertisement"}
          fill
          sizes="100%"
          quality={100}
          style={{ objectFit: "contain" }}
          priority={true}
        />
      </div>
    );
  };

  const renderSingleMatch = (
    matchData,
    showOdds = true,
    useFormattedTime = true
  ) => {
    const matchTime = useFormattedTime
      ? formattedTime
      : matchData.time
      ? DateTime.fromISO(matchData.time)
          .setZone(DateTime.local().zoneName)
          .toFormat("HH:mm")
      : "00:00";

    return (
      <div className={styles.matchRow}>
        <div className={styles.matchInfo}>
          <div className={styles.leagueSection}>
            <Image
              src={matchData.leagueImage || leagueImage || ""}
              alt={matchData.league || league || "League"}
              width={30}
              height={30}
              className={styles.leagueIcon}
            />
            <h1>{matchData.league || league || "League"}</h1>
          </div>
          {(matchData.status || status) && <span>{matchData.status || status}</span>}
        </div>
        <div className={styles.teamsSection}>
          <div className={styles.teamContainer}>
            <Image
              src={matchData.teamAImage || teamAImage || ""}
              alt={matchData.teamA || teamA || "Team A"}
              width={40}
              height={40}
              className={styles.teamIcon}
            />
            <h2>{matchData.teamA || teamA || "Team A"}</h2>
          </div>
          <div className={styles.timeSection}>
            <span>{matchTime}</span>
          </div>
          <div className={styles.teamContainer}>
            <Image
              src={matchData.teamBImage || teamBImage || ""}
              alt={matchData.teamB || teamB || "Team B"}
              width={40}
              height={40}
              className={styles.teamIcon}
            />
            <h2>{matchData.teamB || teamB || "Team B"}</h2>
          </div>
        </div>
        <div className={styles.betSection}>
          <div className={styles.betSectioninner}>
            <h3>Tip: {matchData.tip || tip || "No tip"}</h3>
          </div>
          {renderAdBanner()}
          {showOdds && (
            <div className={styles.betSectioninner}>
              <h3>Odd: {matchData.odd || odd || "N/A"}</h3>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.card}>
      {isGrouped && originalPredictions.length > 0 ? (
        <>
          {originalPredictions.map((prediction, index) => (
            <div key={prediction._id || index}>
              {renderSingleMatch(prediction, false, false)}
              {index < originalPredictions.length - 1 && (
                <div className={styles.divider} />
              )}
            </div>
          ))}
          <div className={styles.totalSection}>
            <div className={styles.totalSectionInner}>
              <span>Total Odds: {totalOdds || "N/A"}</span>
            </div>
            <div className={styles.totalSectionInner}>
              <span>(Stake: {stake || "N/A"})</span>
            </div>
          </div>
        </>
      ) : (
        <>
          {renderSingleMatch({}, true, true)}
          <div className={styles.totalSection}>
            <div className={styles.totalSectionInner}>
              <span>Odds: {odd || "N/A"}</span>
            </div>
            <div className={styles.totalSectionInner}>
              <span>(Stake: {stake || "N/A"})</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}