"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Banner from "@/app/components/Banner";
import SportCard from "@/app/components/Card";
import Nothing from "@/app/components/Nothing";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/style/sport.module.css";
import VipResults from "@/app/components/VipResults";
import MobileFilter from "@/app/components/MobileFilter";
import { usePredictionStore } from "@/app/store/Prediction";
import EmptySportImage from "@/public/assets/emptysport.png";
import ExclusiveOffers from "@/app/components/ExclusiveOffer";
import { usePathname, useSearchParams } from "next/navigation";
import SubscriptionImage from "@/public/assets/subscriptions.png";

import { FaRegUser as UserIcon } from "react-icons/fa";

export default function Sport() {
  const emptyCardCount = 12;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobile, setMobile] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [leagueKey, setLeagueKey] = useState("");
  const [countryKey, setCountryKey] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const currentCategory = decodeURIComponent(pathname.split("/").pop());

  const { isAuth, isVip, user } = useAuthStore();

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
    const urlDate = searchParams.get("date");
    if (urlDate) {
      setSelectedDate(urlDate);
    } else {
      const today = new Date().toISOString().split("T")[0];
      setSelectedDate(today);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadPredictions = async () => {
      if (!selectedDate) return;

      const category = currentCategory.toLowerCase();

      const result = await fetchPredictions(selectedDate, category);

      if (!result.success && result.message) {
        toast.error(result.message);
      }
    };

    if (isAuth && (isVip || user?.isAdmin) && selectedDate) {
      loadPredictions();
    }
  }, [
    selectedDate,
    currentCategory,
    fetchPredictions,
    isAuth,
    isVip,
    user?.isAdmin,
  ]);

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

  const handleDateChange = async (date) => {
    setSelectedDate(date);

    const params = new URLSearchParams(searchParams);
    if (date) {
      params.set("date", date);
    } else {
      params.delete("date");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const getFilteredPredictions = () => {
    if (!isAuth || !isVip) return [];

    let filtered = predictions.filter((prediction) => {
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

    return filtered;
  };

  const filteredPredictions = getFilteredPredictions();
  const shouldShowNothing =
    !loading &&
    isAuth &&
    (isVip || user?.isAdmin) &&
    filteredPredictions.length === 0;

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

  if (!isAuth) {
    return (
      <div className={styles.sportContainer}>
        <Banner />
        <ExclusiveOffers />

        <AuthPrompt
          message={`Login to access ${currentCategory} predictions`}
          buttonText="Login"
          onClick={() => router.push("/authentication/login")}
        />
      </div>
    );
  }

  if (isAuth && isVip) {
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

        <VipUpgradePrompt
          message={`Upgrade to VIP to access ${currentCategory} predictions`}
          buttonText="Upgrade to VIP"
          onClick={() => router.push("/payment")}
        />
      </div>
    );
  }
  if (isAuth && user && !user.isVip) {
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
        <VipUpgradePrompt
          message={`Join vip to access ${currentCategory} predictions`}
          buttonText="Join now"
          onClick={() => router.push("/payment")}
        />
      </div>
    );
  }

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

      {shouldShowNothing ? (
        <Nothing
          Alt="No prediction"
          NothingImage={EmptySportImage}
          Text={
            searchKey ||
            leagueKey ||
            countryKey ||
            searchParams.get("prediction")
              ? `No ${currentCategory} predictions match your filters${
                  selectedDate
                    ? ` for ${new Date(selectedDate).toLocaleDateString()}`
                    : ""
                }`
              : `No ${currentCategory} predictions yet! Check back later.`
          }
        />
      ) : (
        <div className={styles.content}>
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
            />
          ))}

          {isMobile && <VipResults />}
        </div>
      )}
    </div>
  );
}

const AuthPrompt = ({ message, buttonText, onClick }) => (
  <div className={styles.defaultContainer}>
    <div className={styles.defaultContain}>
      <UserIcon className={styles.loginIcon} alt="login" aria-label="login" />
      <h1>{message}</h1>
      <button onClick={onClick} className={styles.defaultButton} role="button">
        {buttonText}
      </button>
    </div>
  </div>
);

const VipUpgradePrompt = ({ message, buttonText, onClick }) => (
  <div className={styles.defaultContainer}>
    <div className={styles.defaultContain}>
      <Image
        src={SubscriptionImage}
        alt="subscription"
        width={200}
        height={100}
        priority={true}
        className={styles.leagueImage}
      />
      <h1>{message}</h1>
      <button onClick={onClick} className={styles.defaultButton} role="button">
        {buttonText}
      </button>
    </div>
  </div>
);
