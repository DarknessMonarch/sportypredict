"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import VipCard from "@/app/components/VipCard";
import Nothing from "@/app/components/Nothing";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/style/sport.module.css";
import VipFilter from "@/app/components/VipFilter";
import { usePredictionStore } from "@/app/store/Prediction";
import EmptySportImage from "@/public/assets/emptysport.png";
import { usePathname, useSearchParams } from "next/navigation";
import SubscriptionImage from "@/public/assets/subscriptions.png";
import { useEffect, useState, useMemo, useCallback } from "react";
import { FaRegUser as UserIcon } from "react-icons/fa";

const vipSlipOptions = [
  "All VIP Slips",
  "Banker Slip",
  "Tennis Slip",
  "Basketball Slip",
  "3+ Odds Slip",
  "Extras",
];

const vipSlipMapping = {
  "All VIP Slips": "",
  "Banker Slip": "banker",
  "Tennis Slip": "tennis",
  "Basketball Slip": "basketball",
  "3+ Odds Slip": "3odds",
  Extras: "extras",
};

const useVipStatus = () => {
  const {
    isVip,
    expires,
    isAdmin,
    isVipActive,
    getVipDaysRemaining,
    addVipStatusListener,
    getVipTimeRemaining,
    isAuth,
    isInitialized,
  } = useAuthStore();

  const [localVipStatus, setLocalVipStatus] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(true);

  // Initialize VIP status when auth is ready
  useEffect(() => {
    if (isInitialized && isAuth) {
      const currentStatus = isVipActive();
      setLocalVipStatus(currentStatus);
      setIsStatusLoading(false);
    } else if (!isAuth) {
      setLocalVipStatus(false);
      setIsStatusLoading(false);
    }
  }, [isInitialized, isAuth, isVipActive]);

  useEffect(() => {
    const unsubscribe = addVipStatusListener((newStatus, oldStatus) => {
      setLocalVipStatus(newStatus);
      if (oldStatus && !newStatus) {
        toast.error("Your VIP subscription has expired");
      } else if (!oldStatus && newStatus) {
        toast.success("VIP subscription activated!");
      }
    });

    const handleVipStatusChange = (event) => {
      setLocalVipStatus(event.detail.newStatus);
    };

    const handleUserStatusUpdate = (event) => {
      if (isInitialized && isAuth) {
        setLocalVipStatus(isVipActive());
      }
    };

    window.addEventListener("vipStatusChanged", handleVipStatusChange);
    window.addEventListener("userStatusUpdated", handleUserStatusUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener("vipStatusChanged", handleVipStatusChange);
      window.removeEventListener("userStatusUpdated", handleUserStatusUpdate);
    };
  }, [addVipStatusListener, isVipActive, isInitialized, isAuth]);

  useEffect(() => {
    if (isInitialized && isAuth) {
      setLocalVipStatus(isVipActive());
    }
  }, [isVip, expires, isAdmin, isVipActive, isInitialized, isAuth]);

  const daysRemaining = useMemo(() => {
    if (!isAuth || !isInitialized) return null;

    if (isAdmin && !expires) return null;
    const days = getVipDaysRemaining();
    return days > 0 ? days : null;
  }, [isAdmin, expires, getVipDaysRemaining, isAuth, isInitialized]);

  const timeRemaining = useMemo(() => {
    if (!isAuth || !isInitialized) return null;

    if (isAdmin && !expires) return null;
    return getVipTimeRemaining();
  }, [isAdmin, expires, getVipTimeRemaining, isAuth, isInitialized]);

  const isExpired = useMemo(() => {
    if (!isAuth || !isInitialized) return false;
    if (isAdmin && !expires) return false;
    if (isVip && !expires) return false;
    return isVip && expires && new Date(expires) <= new Date();
  }, [isVip, expires, isAdmin, isAuth, isInitialized]);

  const isSuperAdmin = useMemo(() => {
    if (!isAuth || !isInitialized) return false;
    return isAdmin && isVip && !expires;
  }, [isAdmin, isVip, expires, isAuth, isInitialized]);

  const isExpiringSoon = useMemo(() => {
    if (!isAuth || !isInitialized) return false;
    if (isAdmin && !expires) return false;
    if (!daysRemaining) return false;
    return daysRemaining <= 7;
  }, [isAdmin, expires, daysRemaining, isAuth, isInitialized]);

  const isCriticalExpiry = useMemo(() => {
    if (!isAuth || !isInitialized) return false;
    if (isAdmin && !expires) return false;
    if (!daysRemaining) return false;
    return daysRemaining <= 3;
  }, [isAdmin, expires, daysRemaining, isAuth, isInitialized]);

  return {
    isVipActive: localVipStatus,
    daysRemaining,
    timeRemaining,
    isExpired,
    isSuperAdmin,
    isExpiringSoon,
    isCriticalExpiry,
    isStatusLoading,
  };
};

const VipStatusBanner = ({
  daysRemaining,
  isSuperAdmin,
  isExpiringSoon,
  isCriticalExpiry,
  onRenewClick,
  isAuth,
  isInitialized,
  isVipActive,
}) => {
  if (!isAuth || !isInitialized) return null;

  if (isSuperAdmin) return null;

  if (!isVipActive) return null;

  if (!daysRemaining || daysRemaining <= 0) return null;

  return (
    <div
      className={`${styles.vipBanner} ${
        isExpiringSoon ? styles.expiring : ""
      } ${isCriticalExpiry ? styles.critical : ""}`}
    >
      <div className={styles.vipBannerContent}>
        <span className={styles.vipText}>
          {isExpiringSoon
            ? `VIP expires in ${daysRemaining} day${
                daysRemaining !== 1 ? "s" : ""
              }`
            : `VIP active • ${daysRemaining} days remaining`}
        </span>
        {isExpiringSoon && (
          <button className={styles.renewButton} onClick={onRenewClick}>
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
  const [vipSlipFilter, setVipSlipFilter] = useState("");

  const currentCategory = decodeURIComponent(pathname.split("/").pop());

  const {
    isAuth,
    isInitialized,
    initializeAuth,
    startVipExpirationMonitor,
    forceVipStatusRefresh,
  } = useAuthStore();

  const {
    isVipActive,
    daysRemaining,
    isExpired,
    isSuperAdmin,
    isExpiringSoon,
    isCriticalExpiry,
  } = useVipStatus();

  const { predictions, loading, error, fetchPredictions, clearError } =
    usePredictionStore();

  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized, initializeAuth]);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isAuth && isVipActive) {
      startVipExpirationMonitor();
    }
  }, [isAuth, isVipActive, startVipExpirationMonitor]);

  useEffect(() => {
    if (isAuth && isVipActive && isInitialized) {
      const refreshTimer = setTimeout(() => {
        forceVipStatusRefresh();
      }, 1000);

      return () => clearTimeout(refreshTimer);
    }
  }, [isAuth, isVipActive, isInitialized, forceVipStatusRefresh]);

  useEffect(() => {
    const urlSearch = searchParams.get("search");
    const urlVipSlip = searchParams.get("vipSlip");

    setSearchKey(urlSearch || "");

    if ((urlVipSlip || "") !== vipSlipFilter) {
      setVipSlipFilter(urlVipSlip || "");
    }
  }, [searchParams, vipSlipFilter]);

  useEffect(() => {
    const loadPredictions = async () => {
      const urlDate = searchParams.get("date");
      const urlVipSlip = searchParams.get("vipSlip");

      if (!urlDate || !isAuth || !isVipActive || !isInitialized) return;

      const category = currentCategory.toLowerCase();

      try {
        const result = await fetchPredictions(urlDate, category, urlVipSlip);

        if (!result.success && result.message) {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error loading VIP predictions:", error);
        toast.error("Failed to load VIP predictions");
      }
    };

    loadPredictions();
  }, [
    searchParams,
    currentCategory,
    fetchPredictions,
    isAuth,
    isVipActive,
    isInitialized,
  ]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleVipSlipFilterChange = useCallback(
    (vipSlipValue) => {
      // Update local state immediately for UI responsiveness
      setVipSlipFilter(vipSlipValue);

      // Update URL parameters
      const params = new URLSearchParams(searchParams.toString());
      if (vipSlipValue) {
        params.set("vipSlip", vipSlipValue);
      } else {
        params.delete("vipSlip");
      }

      const newUrl = `${pathname}?${params.toString()}`;
      router.push(newUrl, { scroll: false });

      // Don't manually refresh here - let the useEffect handle it
      // The useEffect watching searchParams will trigger the fetch
    },
    [searchParams, pathname, router]
  );

  const filteredPredictions = useMemo(() => {
    return predictions.filter((prediction) => {
      let searchableData = {
        teamA: prediction.teamA || "",
        teamB: prediction.teamB || "",
        tip: prediction.tip || "",
        league: prediction.league || "",
        country: prediction.country || "",
      };

      if (prediction.isGrouped && prediction.originalPredictions) {
        const combinedData = prediction.originalPredictions.reduce(
          (acc, orig) => {
            return {
              teamA: acc.teamA + " " + (orig.teamA || ""),
              teamB: acc.teamB + " " + (orig.teamB || ""),
              tip: acc.tip + " " + (orig.tip || ""),
              league: acc.league + " " + (orig.league || ""),
              country: acc.country + " " + (orig.country || ""),
            };
          },
          searchableData
        );
        searchableData = combinedData;
      }

      const matchesSearch =
        !searchKey ||
        searchableData.teamA.toLowerCase().includes(searchKey.toLowerCase()) ||
        searchableData.teamB.toLowerCase().includes(searchKey.toLowerCase()) ||
        searchableData.tip.toLowerCase().includes(searchKey.toLowerCase());

      const matchesCategory =
        prediction.category.toLowerCase() === currentCategory.toLowerCase();

      const predictionType = searchParams.get("prediction");
      const matchesPredictionType =
        !predictionType ||
        searchableData.tip.toLowerCase().includes(predictionType.toLowerCase());

      const matchesVipSlip =
        !vipSlipFilter ||
        (prediction.vipSlip && prediction.vipSlip === vipSlipFilter);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPredictionType &&
        matchesVipSlip
      );
    });
  }, [predictions, searchKey, currentCategory, searchParams, vipSlipFilter]);

  const shouldShowNothing =
    !loading && filteredPredictions.length === 0 && isAuth && isVipActive;

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

  const handleRenewClick = useCallback(() => {
    router.push("payment");
  }, [router]);

  const handleLoginClick = useCallback(() => {
    router.push("/authentication/login");
  }, [router]);

  if (!isInitialized) {
    return (
      <div className={styles.sportContainer}>
        <div className={styles.filtersContainer}>
          <VipFilter
            leagueKey={leagueKey}
            setLeagueKey={setLeagueKey}
            setCountryKey={setCountryKey}
          />
        </div>
        <div className={styles.content}>{renderEmptyCards()}</div>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className={styles.sportContainer}>
        <AuthPrompt
          message={`Login to access ${currentCategory} predictions`}
          buttonText="Login"
          onClick={handleLoginClick}
        />
      </div>
    );
  }

  if (isAuth && !isVipActive) {
    return (
      <div className={styles.sportContainer}>
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
        <div className={styles.filtersContainer}>
          <VipFilter
            leagueKey={leagueKey}
            setLeagueKey={setLeagueKey}
            setCountryKey={setCountryKey}
          />
        </div>
        <div className={styles.content}>{renderEmptyCards()}</div>
      </div>
    );
  }

  if (shouldShowNothing) {
    return (
      <div className={styles.sportContainer}>
        <div className={styles.sportContainerHeader}>
          <VipStatusBanner
            daysRemaining={daysRemaining}
            isSuperAdmin={isSuperAdmin}
            isExpiringSoon={isExpiringSoon}
            isCriticalExpiry={isCriticalExpiry}
            onRenewClick={handleRenewClick}
            isAuth={isAuth}
            isInitialized={isInitialized}
            isVipActive={isVipActive}
          />
        </div>
        <div className={styles.vipSlider}>
          {vipSlipOptions.map((option) => {
            const vipSlipValue = vipSlipMapping[option] || "";
            const isActive = vipSlipFilter === vipSlipValue;

            return (
              <button
                key={option}
                className={`${styles.vipSlipButton} ${
                  isActive ? styles.active : ""
                }`}
                onClick={() => handleVipSlipFilterChange(vipSlipValue)}
              >
                {option}
              </button>
            );
          })}
        </div>
        <VipFilter
          leagueKey={leagueKey}
          setLeagueKey={setLeagueKey}
          setCountryKey={setCountryKey}
        />

        <div className={styles.content}>
          <Nothing
            Alt="No prediction"
            NothingImage={EmptySportImage}
            Text={
              searchKey || vipSlipFilter || searchParams.get("prediction")
                ? `No ${currentCategory} predictions match your filters${
                    searchParams.get("date")
                      ? ` for ${new Date(
                          searchParams.get("date")
                        ).toLocaleDateString()}`
                      : ""
                  }`
                : `No ${currentCategory} predictions yet! Check back later.`
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sportContainer}>
      <div className={styles.sportContainerHeader}>
        <VipStatusBanner
          daysRemaining={daysRemaining}
          isSuperAdmin={isSuperAdmin}
          isExpiringSoon={isExpiringSoon}
          isCriticalExpiry={isCriticalExpiry}
          onRenewClick={handleRenewClick}
          isAuth={isAuth}
          isInitialized={isInitialized}
          isVipActive={isVipActive}
        />
      </div>
      <div className={styles.vipSlider}>
        {vipSlipOptions.map((option) => {
          const vipSlipValue = vipSlipMapping[option] || "";
          const isActive = vipSlipFilter === vipSlipValue;

          return (
            <button
              key={option}
              className={`${styles.vipSlipButton} ${
                isActive ? styles.active : ""
              }`}
              onClick={() => handleVipSlipFilterChange(vipSlipValue)}
            >
              {option}
            </button>
          );
        })}
      </div>
      <div className={styles.filtersContainer}>
        <VipFilter
          leagueKey={leagueKey}
          setLeagueKey={setLeagueKey}
          setCountryKey={setCountryKey}
        />
      </div>
      <div
        className={`${styles.content} ${
          predictions.length > 0 ? styles.predictionMinHeight : ""
        }`}
      >
        {filteredPredictions.map((data, index) => (
          <VipCard
            key={data._id || `prediction-${index}`}
            leagueImage={data.leagueImage}
            teamAImage={data.teamAImage}
            teamBImage={data.teamBImage}
            tip={data.tip}
            league={data.league}
            teamA={data.teamA}
            teamB={data.teamB}
            time={data.time}
            odd={data.odd}
            stake={data.stake}
            status={data.status}
            totalOdds={data.totalOdds}
            isGrouped={data.isGrouped || false}
            originalPredictions={data.originalPredictions || []}
          />
        ))}
      </div>
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
