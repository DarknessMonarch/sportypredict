"use client";

import Image from "next/image";
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

    const countries = [
      ...new Set(predictions.map((pred) => pred.country)),
    ].sort();
    const leagues = [...new Set(predictions.map((pred) => pred.league))].sort();

    const leagueImages = {};
    predictions.forEach((pred) => {
      if (pred.league && pred.leagueImage && !leagueImages[pred.league]) {
        leagueImages[pred.league] = pred.leagueImage;
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

      <div className={styles.filterWrapper}>
        {filterOptions.leagues.length > 0 &&
          renderFilterSection("leagues", "Filter Leagues")}
        {filterOptions.countries.length > 0 &&
          renderFilterSection("countries", "Filter Countries")}
      </div>
    </div>
  );
}
