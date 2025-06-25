"use client";

import Image from "next/image";
import { useAuthStore } from "@/app/store/Auth";
import { useState, useEffect, useMemo } from "react";
import styles from "@/app/style/filter.module.css";
import VipResults from "@/app/components/VipResults";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { usePredictionStore } from "@/app/store/Prediction";

export default function FilterComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { predictions } = usePredictionStore();
  const { isVip, isAuth, isVipActive } = useAuthStore();

  const isVipPage = pathname.startsWith("/page/vip");
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const filterOptions = useMemo(() => {
    if (!predictions || predictions.length === 0) {
      return {
        countries: [],
        leagues: [],
        leagueImages: {},
      };
    }

    const normalizeText = (text) => {
      if (!text) return '';
      return text.toString()
        .trim()
        .replace(/\s+/g, ' ') 
        .toLowerCase()
    };

    const countryMap = new Map();
    predictions.forEach(pred => {
      if (pred.country) {
        const originalCountry = pred.country.toString().trim();
        const normalizedKey = normalizeText(pred.country);
        if (normalizedKey && !countryMap.has(normalizedKey)) {
          countryMap.set(normalizedKey, originalCountry);
        }
      }
    });

    // Process leagues with normalization  
    const leagueMap = new Map();
    predictions.forEach(pred => {
      if (pred.league) {
        const originalLeague = pred.league.toString().trim();
        const normalizedKey = normalizeText(pred.league);
        if (normalizedKey && !leagueMap.has(normalizedKey)) {
          leagueMap.set(normalizedKey, originalLeague);
        }
      }
    });

    const countries = Array.from(countryMap.values()).sort();
    const leagues = Array.from(leagueMap.values()).sort();

    console.log('Final countries after Map deduplication:', countries);
    console.log('Final leagues after Map deduplication:', leagues);

    const leagueImages = {};
    predictions.forEach((pred) => {
      if (pred.league && pred.leagueImage) {
        const normalizedLeague = pred.league.toString().trim();
        if (normalizedLeague && !leagueImages[normalizedLeague]) {
          leagueImages[normalizedLeague] = pred.leagueImage;
        }
      }
    });

    return {
      countries,
      leagues,
      leagueImages,
    };
  }, [predictions]);

  useEffect(() => {
    const country = searchParams.get("country");
    const league = searchParams.get("league");

    if (country) {
      setSelectedCountry(country);
    }
    if (league) {
      setSelectedLeague(league);
    }
  }, [searchParams]);

  const handleLeagueSelection = (leagueName) => {
    const newLeague = selectedLeague === leagueName ? null : leagueName;
    setSelectedLeague(newLeague);
    updateURLParams("league", newLeague);
  };

  const handleCountrySelection = (countryName) => {
    const newCountry = selectedCountry === countryName ? null : countryName;
    setSelectedCountry(newCountry);
    updateURLParams("country", newCountry);
  };

  const updateURLParams = (paramName, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const renderFilterSection = (type, title) => {
    const isLeagueSection = type === "leagues";

    const allItems = isLeagueSection
      ? filterOptions.leagues
      : filterOptions.countries;

    const selectedItem = isLeagueSection ? selectedLeague : selectedCountry;
    const items = selectedItem ? [selectedItem] : allItems;

    return (
      <div className={styles.filterWrapperInner}>
        <div className={styles.filterHeader}>
          <h1>{title}</h1>
          {selectedItem && (
            <span
              onClick={() => {
                if (isLeagueSection) {
                  setSelectedLeague(null);
                  updateURLParams("league", null);
                } else {
                  setSelectedCountry(null);
                  updateURLParams("country", null);
                }
              }}
            >
              Clear Filter
            </span>
          )}
        </div>
        <div className={styles.leagueFilterContainer}>
          {items.length > 0 ? (
            items.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`${styles.leagueCard} ${
                    (
                      isLeagueSection
                        ? selectedLeague === item
                        : selectedCountry === item
                    )
                      ? styles.selectedCard
                      : ""
                  }`}
                  onClick={() =>
                    isLeagueSection
                      ? handleLeagueSelection(item)
                      : handleCountrySelection(item)
                  }
                >
                  {isLeagueSection && (
                    <Image
                      className={styles.leagueImg}
                      priority={true}
                      src={filterOptions.leagueImages[item]}
                      alt={item}
                      height={50}
                      width={50}
                    />
                  )}
                  <div className={styles.leagueCardText}>
                    <h2>{item}</h2>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noResults}>
              No {isLeagueSection ? "leagues" : "countries"} found
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.filterContainer}>
      <VipResults />

      {(!isVipPage || (isVip && isAuth && isVipActive)) && (
        <div className={styles.filterWrapper}>
          {filterOptions.leagues.length >= 2 &&
            renderFilterSection("leagues", "Filter Leagues")}
          {filterOptions.countries.length >= 2 &&
            renderFilterSection("countries", "Filter Countries")}
        </div>
      )} 
    </div>
  );
}