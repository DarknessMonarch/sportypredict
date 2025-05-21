"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useEffect, useState } from "react";
import Nothing from "@/app/components/Nothing";
import styles from "@/app/style/single.module.css";
import EmptySportImg from "@/public/assets/nothing.png";
import { useSearchParams, usePathname } from "next/navigation";

const mockMatches = [
  {
    formationA: ["w", "d", "l", "w", "w"],
    formationB: ["l", "w", "l", "d", "d"],
    leagueImage:
      "https://res.cloudinary.com/dttvkmjpd/image/upload/v1725776054/cgejwicwont8intkmqvf.png",
    teamAImage:
      "https://res.cloudinary.com/dttvkmjpd/image/upload/v1725776055/nbzjfqluexu3re6ocvec.png",
    teamBImage:
      "https://res.cloudinary.com/dttvkmjpd/image/upload/v1725776056/lwp2ughqcabnfcekieu0.png",
    tip: "GG (yes)",
    league: "UEFA Nations League",
    teamA: "Croatia",
    teamB: "Poland",
    teamAscore: 2,
    teamBscore: 1,
    time: "2024-09-15T16:00:00.000Z",
    status: "",
    showScore: true,
    bonusInfo: {
      title: "Special Promotion",
      description:
        "Get a €100 bonus on your first deposit when you bet on UEFA Nations League matches! Limited time offer.",
      code: "UEFA100",
      expiry: "2024-09-30",
    },
    adverts: [
      {
        title: "Premium Betting Tips",
        image:
          "https://res.cloudinary.com/dttvkmjpd/image/upload/v1725776057/premium_tips.png",
        description: "Access expert predictions with 85% success rate",
        link: "#premium-tips",
      },
      {
        title: "Enhanced Odds",
        image:
          "https://res.cloudinary.com/dttvkmjpd/image/upload/v1725776058/enhanced_odds.png",
        description: "Get 3x odds on selected matches this weekend",
        link: "#enhanced-odds",
      },
    ],
    showBtn: false,
    _id: 1,
  },
];

export default function SingleSport() {
  const [isLoading, setIsLoading] = useState(true);
  const [match, setMatch] = useState(null);
  const [activeTab, setActiveTab] = useState("standing");

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const idParam = searchParams.get("id");
  const matchId = Number(idParam);

  const pathParts = pathname.split("/");
  const currentSport = pathParts[1] || "football";

  useEffect(() => {
    if (!matchId) {
      setIsLoading(false);
      return;
    }

    // Simulate loading for better UX
    setTimeout(() => {
      const foundMatch = mockMatches.find((m) => m._id === matchId);

      if (!foundMatch) {
        toast.error("Match not found");
      }

      setMatch(foundMatch || null);
      setIsLoading(false);
    }, 600);
  }, [matchId]);

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

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.pulsingLoader}></div>
          <p>Loading match details...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <Nothing
        Alt="No predictions"
        NothingImage={EmptySportImg}
        Text={"No predictions available for this match"}
      />
    );
  }

  const statA = calculateTeamStats(match, "A");
  const statB = calculateTeamStats(match, "B");

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <div className={styles.singleContainer}>
          {/* Match Header with Gradient Background */}
          <div className={styles.matchHeader}>
            <div className={styles.leagueInfo}>
              <Image
                src={match.leagueImage}
                alt={match.league}
                width={30}
                height={30}
                className={styles.leagueLogo}
              />
              <span>{match.league}</span>
              <span className={styles.matchTime}>
                {formatMatchDate(match.time)}
              </span>
            </div>

            <div className={styles.matchupContainer}>
              <div className={styles.teamInfo}>
                <Image
                  src={match.teamAImage}
                  alt={match.teamA}
                  width={80}
                  height={80}
                  className={getTeamImageClass(match.sport)}
                />
                <h2>{match.teamA}</h2>
              </div>

              <div className={styles.scoreDisplay}>
                {match.showScore ? (
                  <>
                    <span className={styles.scoreNumber}>
                      {match.teamAscore}
                    </span>
                    <span className={styles.scoreSeparator}>-</span>
                    <span className={styles.scoreNumber}>
                      {match.teamBscore}
                    </span>
                  </>
                ) : (
                  <div className={styles.matchStatus}>
                    {match.status === "upcoming" ? (
                      <span className={styles.upcomingBadge}>UPCOMING</span>
                    ) : (
                      <span className={styles.vsSeparator}>VS</span>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.teamInfo}>
                <Image
                  src={match.teamBImage}
                  alt={match.teamB}
                  width={80}
                  height={80}
                  className={getTeamImageClass(match.sport)}
                />
                <h2>{match.teamB}</h2>
              </div>
            </div>

            {match.tip && (
              <div className={styles.tipBadge}>
                <span>TIP:</span> {match.tip}
              </div>
            )}
          </div>

          {/* Tabs Navigation */}
          <div className={styles.tabsNavigation}>
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
              Formation
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "preview" ? styles.activeTab : ""
              }`}
              onClick={() => handleTabChange("preview")}
            >
              Preview
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {/* Standing Tab */}
            <div
              className={`${styles.tabPanel} ${
                activeTab === "standing" ? styles.activePanel : ""
              }`}
            >
              <div className={styles.sectionHeading}>
                <h2>Team Standing</h2>
                <div className={styles.headingLine}></div>
              </div>

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
                        const teamName =
                          team === "A" ? match.teamA : match.teamB;
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
                            (statA.draws / (statA.draws + statB.draws || 1)) *
                            100
                          }%`,
                        }}
                      ></div>
                      <div
                        className={styles.statBarRight}
                        style={{
                          width: `${
                            (statB.draws / (statA.draws + statB.draws || 1)) *
                            100
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
                            (statA.losses /
                              (statA.losses + statB.losses || 1)) *
                            100
                          }%`,
                        }}
                      ></div>
                      <div
                        className={styles.statBarRight}
                        style={{
                          width: `${
                            (statB.losses /
                              (statA.losses + statB.losses || 1)) *
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
                            (statA.points /
                              (statA.points + statB.points || 1)) *
                            100
                          }%`,
                        }}
                      ></div>
                      <div
                        className={styles.statBarRight}
                        style={{
                          width: `${
                            (statB.points /
                              (statA.points + statB.points || 1)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formation Tab */}
            <div
              className={`${styles.tabPanel} ${
                activeTab === "formation" ? styles.activePanel : ""
              }`}
            >
              <div className={styles.sectionHeading}>
                <h2>Team Formation</h2>
                <div className={styles.headingLine}></div>
              </div>

              <div className={styles.formationCard}>
                <div className={styles.formationTeam}>
                  <div className={styles.teamHeaderWithLogo}>
                    <Image
                      src={match.teamAImage}
                      alt={match.teamA}
                      width={40}
                      height={40}
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

                  <div className={styles.formationLegend}>
                    <span>Latest match →</span>
                  </div>
                </div>

                <div className={styles.formationDivider}>
                  <div className={styles.formationVs}>VS</div>
                </div>

                <div className={styles.formationTeam}>
                  <div className={styles.teamHeaderWithLogo}>
                    <Image
                      src={match.teamBImage}
                      alt={match.teamB}
                      width={40}
                      height={40}
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

                  <div className={styles.formationLegend}>
                    <span>Latest match →</span>
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

            {/* Preview Tab */}
            <div
              className={`${styles.tabPanel} ${
                activeTab === "preview" ? styles.activePanel : ""
              }`}
            >
              <div className={styles.sectionHeading}>
                <h2>Match Preview</h2>
                <div className={styles.headingLine}></div>
              </div>

              <div className={styles.previewCard}>
                <div className={styles.matchAnalysis}>
                  {match?.description ? (
                    <p>{match.description}</p>
                  ) : (
                    <>
                      <p>
                        This UEFA Nations League clash brings together two
                        strong European sides with Croatia and Poland both
                        looking to improve their position in the standings.
                        Croatia enters this match with impressive recent form,
                        having won three of their last five matches. Their
                        offensive strategies have proven effective, particularly
                        in home fixtures.
                      </p>

                      <p>
                        Poland, on the other hand, has struggled with
                        consistency, managing only one win in their previous
                        five outings. Their defensive organization has been
                        questionable, which could prove problematic against
                        Croatia&apos;s clinical attacking line.
                      </p>

                      <p>
                        Historical meetings between these teams have typically
                        produced goals on both sides, which supports the
                        recommended tip of GG (both teams to score). With the
                        attacking talent on display and considering the
                        defensive vulnerabilities of both teams, we expect an
                        entertaining match with multiple scoring opportunities.
                      </p>

                      <p>
                        Key players to watch include Croatia&apos;s midfield maestros
                        who consistently create chances, while Poland will be
                        relying heavily on their star striker to convert the
                        limited opportunities they may create.
                      </p>
                    </>
                  )}
                </div>

                <div className={styles.headToHead}>
                  <h3>Head to Head</h3>
                  <div className={styles.h2hStats}>
                    <div className={styles.h2hStatItem}>
                      <span className={styles.h2hValue}>3</span>
                      <span className={styles.h2hLabel}>Matches</span>
                    </div>
                    <div className={styles.h2hStatItem}>
                      <span className={styles.h2hValue}>1</span>
                      <span className={styles.h2hLabel}>
                        {match.teamA} wins
                      </span>
                    </div>
                    <div className={styles.h2hStatItem}>
                      <span className={styles.h2hValue}>1</span>
                      <span className={styles.h2hLabel}>Draws</span>
                    </div>
                    <div className={styles.h2hStatItem}>
                      <span className={styles.h2hValue}>1</span>
                      <span className={styles.h2hLabel}>
                        {match.teamB} wins
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sideContent}>
        {/* Bonus Section */}
        {match.bonusInfo && (
          <div className={styles.bonusCard}>
            <div className={styles.bonusHeader}>
              <div className={styles.bonusIcon}>🎁</div>
              <h3>Special Bonus</h3>
            </div>

            <div className={styles.bonusContent}>
              <h4>{match.bonusInfo.title}</h4>
              <p>{match.bonusInfo.description}</p>

              <div className={styles.bonusCode}>
                <span>Use Code:</span>
                <div className={styles.codeBox}>{match.bonusInfo.code}</div>
              </div>

              <div className={styles.bonusExpiry}>
                <span>Expires:</span> {match.bonusInfo.expiry}
              </div>

              <button className={styles.bonusButton}>Claim Bonus</button>
            </div>
          </div>
        )}

        {/* Adverts Section */}
        {match.adverts && match.adverts.length > 0 && (
          <div className={styles.advertsSection}>
            <div className={styles.sectionHeading}>
              <h3>Featured Offers</h3>
              <div className={styles.headingLine}></div>
            </div>

            <div className={styles.advertsContainer}>
              {match.adverts.map((advert, index) => (
                <div key={`advert-${index}`} className={styles.advertCard}>
                  <div className={styles.advertImageContainer}>
                    <Image
                      src="https://res.cloudinary.com/dttvkmjpd/image/upload/v1712787636/n83nja0ktpivsatsmcu6.gif"
                      alt={advert.title}
                      width={400}
                      height={200}
                      className={styles.advertImage}
                    />
                  </div>

                  <div className={styles.advertContent}>
                    <h4>{advert.title}</h4>
                    <p>{advert.description}</p>
                    <a href={advert.link} className={styles.advertLink}>
                      Learn More
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
