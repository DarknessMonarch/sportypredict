"use client";

import Image from "next/image";
import { DateTime } from "luxon";
import WaterMarkImage from "@/public/assets/watermark.png";
import { useMemo, useState, useEffect } from "react";
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
  times,
  odd,
  status,
  stake,
  totalOdds,
  isGrouped = false,
  originalPredictions = [],
  onEdit,
  onDelete,
  itemData,
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
      }, [cardBannerAds.length]);

      return () => clearInterval(interval);
    }
  }, [cardBannerAds.length]);

  const getStatusIcon = (status) => {
    const statusIcons = {
      won: "✓",
      loss: "x",
      refund: "↻",
      cancelled: "/",
      postponed: "⏸",
    };
    return statusIcons[status] || "";
  };

  const calculateOverallStatus = (predictions) => {
    if (!predictions || predictions.length === 0) return null;

    const statuses = predictions.map((p) => p.status).filter(Boolean);
    if (statuses.length === 0) return null;

    if (statuses.includes("loss")) return "loss";

    if (statuses.includes("cancelled")) return "cancelled";

    if (statuses.includes("postponed")) return "postponed";

    if (statuses.every((s) => s === "won")) return "won";

    if (statuses.includes("won") && statuses.includes("refund")) return "won";

    if (statuses.every((s) => s === "refund")) return "refund";

    return null;
  };

  const getStatusClassName = (status) => {
    const statusClasses = {
      won: styles.statusWon,
      loss: styles.statusLoss,
      refund: styles.statusRefund,
      cancelled: styles.statusCancelled,
      postponed: styles.statusPostponed,
    };
    return statusClasses[status] || "";
  };

  const handleAdClick = () => {
    if (currentAd?.link) {
      window.open(currentAd.link, "_blank", "noopener,noreferrer");
    }
  };

  const handleEdit = (predictionData = null) => {
    if (onEdit) {
      onEdit(predictionData || itemData);
    }
  };

  const handleDelete = (predictionData = null) => {
    if (onDelete) {
      onDelete(predictionData || itemData);
    }
  };

  const renderAdBanner = () => {
    if (!currentAd) {
      return null;
    }

    if (loading) {
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
          objectFit="contain"
          priority={true}
        />
      </div>
    );
  };

  const formatIndividualTime = (timeValue) => {
    if (!timeValue) return "00:00";
    const localTime = DateTime.fromISO(timeValue).setZone(
      DateTime.local().zoneName
    );
    return localTime.toFormat("HH:mm");
  };

  const renderSingleMatch = (
    matchData,
    showOdds = true,
    individualTime = null,
    showIndividualActions = false
  ) => {
    const matchTime = individualTime
      ? formatIndividualTime(individualTime)
      : matchData.time
      ? formatIndividualTime(matchData.time)
      : formattedTime;

    const matchStatus = matchData.status || status;

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
              <div className={styles.oddWithStatus}>
                <h3>Odd: {matchData.odd || odd || "N/A"}</h3>
                {matchStatus && (
                  <span
                    className={`${styles.statusIcon} ${getStatusClassName(
                      matchStatus
                    )}`}
                  >
                    {getStatusIcon(matchStatus)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const overallStatus = isGrouped
    ? calculateOverallStatus(originalPredictions)
    : status;

  return (
    <div className={styles.card}>
      <Image
        className={styles.watermarkImage}
        src={WaterMarkImage}
        alt={"Watermark"}
        fill
        sizes="100%"
        quality={100}
        objectFit="contain"
        priority={true}
      />
      {isGrouped && originalPredictions.length > 0 ? (
        <>
          {originalPredictions.map((prediction, index) => {
            const individualTime =
              times && times[index] ? times[index] : prediction.time;
            return (
              <div key={prediction._id || index}>
                {renderSingleMatch(prediction, true, individualTime)}
                {index < originalPredictions.length - 1 && (
                  <div className={styles.divider} />
                )}
              </div>
            );
          })}
          <div
            className={`${styles.totalSection} ${getStatusClassName(
              overallStatus
            )}`}
          >
            <div className={styles.totalSectionInner}>
              <span>Total Odds: {totalOdds || "N/A"}</span>
            </div>
            <div className={styles.totalSectionInner}>
              <span>(Stake: {stake || "N/A"})</span>
            </div>
            {overallStatus && (
              <div className={styles.totalSectionInner}>
                <span className={styles.overallStatus}>
                  Status:{" "}
                  {overallStatus.charAt(0).toUpperCase() +
                    overallStatus.slice(1)}
                </span>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {renderSingleMatch({}, true, null)}
          <div className={styles.totalSection}>
            <div className={styles.totalSectionInner}>
              <span>Odds: {odd || "N/A"}</span>
            </div>
            <div className={styles.totalSectionInner}>
              <span>(Stake: {stake || "N/A"})</span>
            </div>
            {overallStatus && (
              <div className={styles.totalSectionInner}>
                <span
                  className={`${styles.overallStatus} ${getStatusClassName(
                    overallStatus
                  )}`}
                >
                  Status:{" "}
                  {overallStatus.charAt(0).toUpperCase() +
                    overallStatus.slice(1)}
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
