"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Banner from "@/app/components/Banner";
import { usePathname } from "next/navigation";
import SportCard from "@/app/components/Card";
import Nothing from "@/app/components/Nothing";
import styles from "@/app/style/sport.module.css";
import VipResults from "@/app/components/VipResults";
import NothingImage from "@/public/assets/nothing.png";
import MobileFilter from "@/app/components/MobileFilter";
import ExclusiveOffers from "@/app/components/ExclusiveOffer";
import { IoIosArrowForward as RightIcon } from "react-icons/io";

const mockData = [
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
    showBtn: true,
    _id: 1,
  },
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
    status: "upcoming",
    showScore: true,
    showBtn: true,
    _id: 2,
  },
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
    status: "upcoming",
    showScore: false,
    showBtn: true,
    _id: 3,
  },
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
    showScore: false,
    showBtn: true,
    _id: 4,
  },
];

export default function Football() {
  const emptyCardCount = 12;
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shouldShowNothing, setShouldShowNothing] = useState(false);
  const currentSport = decodeURIComponent(pathname.split("/").pop());

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
      router.push(`${currentSport}/single/${teamA}-vs-${teamB}?id=${id}`, { scroll: false });
    }
  };

  if (loading) {
    return (
      <div className={styles.sportContainer}>
        <Banner />
        <MobileFilter />
        <ExclusiveOffers />
        <div className={styles.content}>{renderEmptyCards()}</div>
      </div>
    );
  }

  return (
    <div className={styles.sportContainer}>
      <Banner />
      <MobileFilter />
      <ExclusiveOffers />

      {shouldShowNothing ? (
        <Nothing
          Alt="No prediction"
          NothingImage={NothingImage}
          Text={
            searchKey || leagueKey || countryKey
              ? "No predictions match"
              : "No predictions yet! Check back later."
          }
        />
      ) : (
      <div className={styles.content}>
        {mockData.map((data, index) => (
          <SportCard
            key={index}
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
            sport={currentSport}
            showScore={data.showScore}
            showBtn={data.showBtn}
            component={
              <div className={styles.matchPreview} onClick={() => handleCardClick(data.teamA, data.teamB, data._id)}>
                <span>Match Preview </span>
                <RightIcon
                  className={styles.matchArrowIcon}
                  alt="arrow icon"
                  height={20}
                />{" "}
              </div>
            }
          />
        ))}
        {isMobile && <VipResults />}
      </div>
      )}
    </div>
  );
}
