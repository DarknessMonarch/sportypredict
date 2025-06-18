"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
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
import { IoIosArrowForward as RightIcon } from "react-icons/io";

import { FaRegUser as UserIcon } from "react-icons/fa";

const useVipStatus = () => {
  const { isVip, expires, user } = useAuthStore();
  
  const isVipActive = useMemo(() => {
    if (user?.isAdmin) return true;
    if (isVip) {
      if (!expires) return true;
      return new Date(expires) > new Date();
    }
    
    return false;
  }, [isVip, expires, user?.isAdmin]);

  const daysRemaining = useMemo(() => {
    if (user?.isAdmin || !expires) return null;
    
    const remaining = Math.ceil((new Date(expires) - new Date()) / (1000 * 60 * 60 * 24));
    return Math.max(0, remaining);
  }, [expires, user?.isAdmin]);

  const isExpired = useMemo(() => {
    if (user?.isAdmin) return false;
    if (isVip && !expires) return false;
    return isVip && expires && new Date(expires) <= new Date();
  }, [isVip, expires, user?.isAdmin]);

  const isSuperAdmin = useMemo(() => {
    return user?.isAdmin && isVip && !expires;
  }, [user?.isAdmin, isVip, expires]);

  return { isVipActive, daysRemaining, isExpired, isSuperAdmin };
};

const VipStatusBanner = ({ daysRemaining, isSuperAdmin, onRenewClick }) => {
  if (isSuperAdmin) return null;
  if (!daysRemaining) return null;
  
  const isExpiring = daysRemaining <= 7;
  
  return (
    <div className={`${styles.vipBanner} ${isExpiring ? styles.expiring : ''}`}>
      <div className={styles.vipBannerContent}>
        <span className={styles.vipText}>
          {isExpiring 
            ? `Vip expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`
            : `Vip active • ${daysRemaining} days remaining`
          }
        </span>
        {isExpiring && (
          <button 
            className={styles.renewButton}
            onClick={onRenewClick}
          >
            Renew
          </button>
        )}
      </div>
    </div>
  );
};

export default function Vip() {
  const emptyCardCount = 12;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobile, setMobile] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [leagueKey, setLeagueKey] = useState("");
  const [countryKey, setCountryKey] = useState("");

  const currentCategory = decodeURIComponent(pathname.split("/").pop());

  const { isAuth, user } = useAuthStore();
  const { isVipActive, daysRemaining, isExpired, isSuperAdmin } = useVipStatus();

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

  // Main prediction loading effect - similar to Sport component
  useEffect(() => {
    const loadPredictions = async () => {
      const urlDate = searchParams.get("date");
      
      // Only proceed if we have auth, VIP access, and a date
      if (!urlDate || !isAuth || !isVipActive) return;

      const category = currentCategory.toLowerCase();
      const result = await fetchPredictions(urlDate, category);

      if (!result.success && result.message) {
        toast.error(result.message);
      }
    };

    loadPredictions();
  }, [searchParams, currentCategory, fetchPredictions, isAuth, isVipActive]);

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

  const shouldShowNothing = !loading && filteredPredictions.length === 0 && isAuth && isVipActive;

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

  const handleRenewClick = () => {
    router.push("payment");
  };

  const handleCardClick = (teamA, teamB, id) => {
    if (id !== "empty") {
      const selectedDate = searchParams.get("date");
      router.push(
        `/vip/${currentCategory}/single/${teamA}-vs-${teamB}?date=${selectedDate}`,
        { scroll: false }
      );
    }
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

  // Authenticated but VIP expired or not VIP
  if (isAuth && !isVipActive) {
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
          message={
            isExpired 
              ? `Your VIP subscription has expired. Renew to access ${currentCategory} predictions`
              : `Join VIP to access ${currentCategory} predictions`
          }
          buttonText={isExpired ? "Renew VIP" : "Join VIP"}
          onClick={handleRenewClick}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.sportContainer}>
        <Banner />
        <VipStatusBanner 
          daysRemaining={daysRemaining} 
          isSuperAdmin={isSuperAdmin}
          onRenewClick={handleRenewClick}
        />
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
      <VipStatusBanner 
        daysRemaining={daysRemaining} 
        isSuperAdmin={isSuperAdmin}
        onRenewClick={handleRenewClick}
      />
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
                      ? ` for ${new Date(searchParams.get("date")).toLocaleDateString()}`
                      : ""
                  }`
                : `No ${currentCategory} predictions yet! Check back later.`
            }
          />
        </div>
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