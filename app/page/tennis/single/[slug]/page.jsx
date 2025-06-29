"use client";

import { toast } from "sonner";
import Image from "next/image";
import DOMPurify from "dompurify";
import Loading from "@/app/components/LoadingLogo";
import OfferCard from "@/app/components/SingleOfferCard";
import SingleCard from "@/app/components/SingleCard";
import { useEffect, useState } from "react";
import Nothing from "@/app/components/Nothing";
import styles from "@/app/style/single.module.css";
import EmptySportImage from "@/public/assets/emptysport.png";
import { useSearchParams, usePathname } from "next/navigation";
import { usePredictionStore } from "@/app/store/Prediction";
import { useAdvertStore } from "@/app/store/Advert";

export default function SingleSport() {
  const [activeTab, setActiveTab] = useState("preview");
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const idParam = searchParams.get("id");
  const pathParts = pathname.split("/");

  const currentSport = pathParts[2];
  const slug = pathParts[4] || "";

  const teamNames = slug.split("-vs-");

  const teamAFromUrl = teamNames[0]
    ? decodeURIComponent(teamNames[0]).replace(/[-]/g, " ").replace(/[+]/g, " ").trim()
    : "";
  const teamBFromUrl = teamNames[1]
    ? decodeURIComponent(teamNames[1]).replace(/[-]/g, " ").replace(/[+]/g, " ").trim()
    : "";

  const selectedDate = searchParams.get("date");

  const {
    singlePrediction: match,
    loading: isLoading,
    error,
    fetchSinglePrediction,
    clearError,
  } = usePredictionStore();

  const { adverts, fetchAdverts, loading: advertLoading } = useAdvertStore();

  const innerBannerAds = adverts.filter((ad) => ad.location === "InnerBanner");
  const currentAd = innerBannerAds[currentAdIndex];

  useEffect(() => {
    fetchAdverts();
  }, [fetchAdverts]);

  useEffect(() => {
    if (innerBannerAds.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex(
          (prevIndex) => (prevIndex + 1) % innerBannerAds.length
        );
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [innerBannerAds.length]);

  const getSportCategory = (sport) => {
    const sportCategoryMap = {
      football: "football",
      basketball: "basketball",
      tennis: "tennis",
      extra: "extra",
      day: "day",
      vip: "vip",
    };

    return (
      sportCategoryMap[sport?.toLowerCase()] ||
      sport?.toLowerCase() ||
      "football"
    );
  };

  useEffect(() => {
    const loadSinglePrediction = async () => {
      clearError();

      if (!teamAFromUrl || !teamBFromUrl) {
        toast.error("Invalid team names in URL");
        return;
      }

      if (!currentSport) {
        toast.error("Sport category is missing");
        return;
      }

      if (!selectedDate) {
        toast.error("Date parameter is missing");
        return;
      }

      try {
        const category = getSportCategory(currentSport);

        const result = await fetchSinglePrediction(
          category,
          teamAFromUrl,
          teamBFromUrl,
          selectedDate
        );

        if (!result.success && result.message) {
          toast.error(result.message);
        }
      } catch (err) {
        toast.error("Failed to load match details");
      }
    };

    if (teamAFromUrl && teamBFromUrl && currentSport && selectedDate) {
      loadSinglePrediction();
    }
  }, [
    currentSport,
    fetchSinglePrediction,
    clearError,
    teamAFromUrl,
    teamBFromUrl,
    selectedDate,
    slug,
  ]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const calculateTeamStats = (match, team) => {
    const formation = team === "A" ? match?.formationA : match?.formationB;
    if (!Array.isArray(formation))
      return { wins: 0, draws: 0, losses: 0, points: 0 };

    const wins = formation.filter((f) => f.toLowerCase() === "w").length;
    const draws = formation.filter((f) => f.toLowerCase() === "d").length;
    const losses = formation.filter((f) => f.toLowerCase() === "l").length;
    const points = wins * 3 + draws;

    return { wins, draws, losses, points };
  };

  const getFormationColorClass = (formation) => {
    switch (formation?.toLowerCase()) {
      case "w":
        return styles.win;
      case "d":
        return styles.draw;
      case "l":
        return styles.lose;
      default:
        return styles.defaultColor;
    }
  };

  const getTeamImageClass = (sport) => {
    return `${styles.teamImage} ${
      sport === "Tennis" || sport === "Basketball" ? styles.circularShape : ""
    }`;
  };

  const formatMatchDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAdClick = () => {
    if (currentAd?.link) {
      window.open(currentAd.link, "_blank", "noopener,noreferrer");
    }
  };

  const InnerBannerAdsSection = () => {
    if (!currentAd || advertLoading) {
      return null;
    }

    return (
      <div className={styles.advertCardContainer}>
        <div className={styles.infoHeader}>
          <h3>Sponsored</h3>
        </div>
        <div className={styles.advertCard} onClick={handleAdClick}>
          <Image
            className={styles.advertImage}
            src={currentAd.image}
            alt={currentAd.title}
            fill
            sizes="100%"
            quality={100}
            style={{
              objectFit: "cover",
            }}
            priority={true}
          />
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.singleSportEmpty}>
        <Loading />
      </div>
    );
  }

  if (!match) {
    return (
      <div className={styles.singleSportEmpty}>
        <Nothing
          Alt="No predictions"
          NothingImage={EmptySportImage}
          Text={"No predictions details available for this match"}
        />
      </div>
    );
  }

  const statA = calculateTeamStats(match, "A");
  const statB = calculateTeamStats(match, "B");

  return (
    <div className={styles.singleSportContainer}>
      <div className={styles.singleSportWrapper}>
        <SingleCard
          leagueImage={match.leagueImage}
          teamAImage={match.teamAImage}
          teamBImage={match.teamBImage}
          tip={match.tip}
          league={match.league}
          teamA={match.teamA}
          teamB={match.teamB}
          teamAscore={match.teamAscore}
          teamBscore={match.teamBscore}
          time={match.time}
          status={match.status}
          sport={match.sport}
          showScore={match.showScore}
          showBtn={false}
        />

        <div className={styles.tabsNavigation}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "preview" ? styles.activeTab : ""
            }`}
            onClick={() => handleTabChange("preview")}
          >
            Preview
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "standing" ? styles.activeTab : ""
            }`}
            onClick={() => handleTabChange("standing")}
          >
            Standing
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "formation" ? styles.activeTab : ""
            }`}
            onClick={() => handleTabChange("formation")}
          >
             Recent Formation
          </button>
        </div>

        <div className={styles.tabContent}>
          <div
            className={`${styles.tabPanel} ${
              activeTab === "standing" ? styles.activePanel : ""
            }`}
          >
            <div className={styles.standingCard}>
              <div className={styles.standingTable}>
                <table>
                  <thead>
                    <tr>
                      <th>Team</th>
                      <th>W</th>
                      <th>D</th>
                      <th>L</th>
                      <th>P</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["A", "B"].map((team, index) => {
                      const stats = calculateTeamStats(match, team);
                      const teamName = team === "A" ? match.teamA : match.teamB;
                      const teamImage =
                        team === "A" ? match.teamAImage : match.teamBImage;

                      return (
                        <tr
                          key={`team-${team}`}
                          className={index === 0 ? styles.highlightedRow : ""}
                        >
                          <td className={styles.tableData}>
                            <span className={styles.rankNumber}>
                              {index + 1}
                            </span>
                            <div className={styles.tableInner}>
                              <Image
                                src={teamImage}
                                alt={`${teamName} logo`}
                                width={30}
                                height={30}
                                priority={true}
                                className={getTeamImageClass(match.sport)}
                              />
                              <span className={styles.teamName}>
                                {teamName}
                              </span>
                            </div>
                          </td>
                          <td>{stats.wins}</td>
                          <td>{stats.draws}</td>
                          <td>{stats.losses}</td>
                          <td className={styles.pointsColumn}>
                            {stats.points}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className={styles.statsComparison}>
                <div className={styles.statBarContainer}>
                  <div className={styles.statLabel}>
                    <span>{statA.wins}</span>
                    <span>Wins</span>
                    <span>{statB.wins}</span>
                  </div>
                  <div className={styles.statBarWrapper}>
                    <div
                      className={styles.statBarLeft}
                      style={{
                        width: `${
                          (statA.wins / (statA.wins + statB.wins || 1)) * 100
                        }%`,
                      }}
                    ></div>
                    <div
                      className={styles.statBarRight}
                      style={{
                        width: `${
                          (statB.wins / (statA.wins + statB.wins || 1)) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className={styles.statBarContainer}>
                  <div className={styles.statLabel}>
                    <span>{statA.draws}</span>
                    <span>Draws</span>
                    <span>{statB.draws}</span>
                  </div>
                  <div className={styles.statBarWrapper}>
                    <div
                      className={styles.statBarLeft}
                      style={{
                        width: `${
                          (statA.draws / (statA.draws + statB.draws || 1)) * 100
                        }%`,
                      }}
                    ></div>
                    <div
                      className={styles.statBarRight}
                      style={{
                        width: `${
                          (statB.draws / (statA.draws + statB.draws || 1)) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className={styles.statBarContainer}>
                  <div className={styles.statLabel}>
                    <span>{statA.losses}</span>
                    <span>Losses</span>
                    <span>{statB.losses}</span>
                  </div>
                  <div className={styles.statBarWrapper}>
                    <div
                      className={styles.statBarLeft}
                      style={{
                        width: `${
                          (statA.losses / (statA.losses + statB.losses || 1)) *
                          100
                        }%`,
                      }}
                    ></div>
                    <div
                      className={styles.statBarRight}
                      style={{
                        width: `${
                          (statB.losses / (statA.losses + statB.losses || 1)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className={styles.statBarContainer}>
                  <div className={styles.statLabel}>
                    <span>{statA.points}</span>
                    <span>Points</span>
                    <span>{statB.points}</span>
                  </div>
                  <div className={styles.statBarWrapper}>
                    <div
                      className={styles.statBarLeft}
                      style={{
                        width: `${
                          (statA.points / (statA.points + statB.points || 1)) *
                          100
                        }%`,
                      }}
                    ></div>
                    <div
                      className={styles.statBarRight}
                      style={{
                        width: `${
                          (statB.points / (statA.points + statB.points || 1)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`${styles.tabPanel} ${
              activeTab === "formation" ? styles.activePanel : ""
            }`}
          >
            <div className={styles.formationCard}>
              <div className={styles.formationTeam}>
                <div className={styles.formationLogo}>
                  <Image
                    src={match.teamAImage}
                    alt={match.teamA}
                    width={40}
                    height={40}
                    priority={true}
                    className={getTeamImageClass(match.sport)}
                  />
                  <h3>{match.teamA}</h3>
                </div>

                <div className={styles.formationResults}>
                  {match.formationA?.map((result, idx) => (
                    <div
                      key={`teamA-formation-${idx}`}
                      className={`${
                        styles.formationCircle
                      } ${getFormationColorClass(result)}`}
                      title={
                        result.toUpperCase() === "W"
                          ? "Win"
                          : result.toUpperCase() === "D"
                          ? "Draw"
                          : "Loss"
                      }
                    >
                      <span>{result.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formationDivider}>
                <div className={styles.formationVs}>VS</div>
              </div>

              <div className={styles.formationTeam}>
                <div className={styles.formationLogo}>
                  <Image
                    src={match.teamBImage}
                    alt={match.teamB}
                    width={40}
                    height={40}
                    priority={true}
                    className={getTeamImageClass(match.sport)}
                  />
                  <h3>{match.teamB}</h3>
                </div>

                <div className={styles.formationResults}>
                  {match.formationB?.map((result, idx) => (
                    <div
                      key={`teamB-formation-${idx}`}
                      className={`${
                        styles.formationCircle
                      } ${getFormationColorClass(result)}`}
                      title={
                        result.toUpperCase() === "W"
                          ? "Win"
                          : result.toUpperCase() === "D"
                          ? "Draw"
                          : "Loss"
                      }
                    >
                      <span>{result.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.formationLegendBox}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendCircle} ${styles.win}`}>
                  <span>W</span>
                </div>
                <span>Win</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendCircle} ${styles.draw}`}>
                  <span>D</span>
                </div>
                <span>Draw</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendCircle} ${styles.lose}`}>
                  <span>L</span>
                </div>
                <span>Loss</span>
              </div>
            </div>
          </div>

          <div
            className={`${styles.tabPanel} ${
              activeTab === "preview" ? styles.activePanel : ""
            }`}
          >
            <div className={styles.previewCard}>
              <div className={styles.matchAnalysis}>
                {match?.description ? (
                  <div
                    className={styles.htmlContent}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(match.description),
                    }}
                  />
                ) : (
                  <p>No match preview available.</p>
                )}
              </div>

              <div className={styles.headToHead}>
                <h3>Recent Form Comparison</h3>
                <div className={styles.h2hStats}>
                  <div className={styles.h2hStatItem}>
                    <span className={styles.h2hValue}>{statA.wins}</span>
                    <span className={styles.h2hLabel}>{match.teamA} wins</span>
                  </div>
                  <div className={styles.h2hStatItem}>
                    <span className={styles.h2hValue}>
                      {statA.draws + statB.draws}
                    </span>
                    <span className={styles.h2hLabel}>Combined Draws</span>
                  </div>
                  <div className={styles.h2hStatItem}>
                    <span className={styles.h2hValue}>{statB.wins}</span>
                    <span className={styles.h2hLabel}>{match.teamB} wins</span>
                  </div>
                  <div className={styles.h2hStatItem}>
                    <span className={styles.h2hValue}>{match.tip}</span>
                    <span className={styles.h2hLabel}>Recommended Tip</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sideContent}>
        <div className={styles.infoCard}>
          <div className={styles.infoHeader}>
            <h3>Betting Signup Offers</h3>
          </div>
          <OfferCard />
        </div>
        <InnerBannerAdsSection />
      </div>
    </div>
  );
}