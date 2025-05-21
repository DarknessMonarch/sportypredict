"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import MobileDropdown from "@/app/components/MobileDropdown";
import styles from "@/app/style/mobileFilter.module.css";
import date from "date-and-time";
import { useState } from "react";

import { BiWorld as CountryIcon } from "react-icons/bi";
import { TbStars as ExtraIcon } from "react-icons/tb";
import { IoFootball as SportIcon } from "react-icons/io5";



export default function MobileFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  const lastParam = decodeURIComponent(pathname.split("/").pop());

  const sportOptions = ["Tennis", "Football", "Basketball"];
  const countryOptions = ["England", "Spain", "Germany", "Italy", "France"];
  const predictionData = [
    "Double Chance",
    "Over 2.5 Goals",
    "Over 1.5 Goals",
    "Both Teams To Score",
    "Under 2.5 Goals",
  ];

  const currentDate = date.format(new Date(), "DD-MM-YYYY");

  const updateURLParams = (paramName, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSportSelect = (sport) => {
    const newSport = selectedSport === sport ? null : sport;
    setSelectedSport(newSport);
    updateURLParams("sport", newSport);
  };

  const handleCountrySelect = (country) => {
    const newCountry = selectedCountry === country ? null : country;
    setSelectedCountry(newCountry);
    updateURLParams("country", newCountry);
  };

  const handlePredictionSelect = (prediction) => {
    const newPrediction = selectedPrediction === prediction ? null : prediction;
    setSelectedPrediction(newPrediction);
    updateURLParams("prediction", newPrediction);
  };

  const handleDateChange = (e) => {
    const rawDate = new Date(e.target.value);
    const formattedDate = date.format(rawDate, "DD-MM-YYYY");
    setSelectedDate(formattedDate);
    updateURLParams("date", formattedDate);
  };

  return (
    <div className={styles.mobileFilterContainer}>
      <div className={styles.mobileFilterHead}>
        <h1>{lastParam} Betting tips and prediction</h1>
        <h2>({selectedDate || currentDate})</h2>
      </div>
      <div className={styles.filterContainer}>
        <h1>Filter by:</h1>
        <div className={styles.filterInner}>
          {lastParam === "extra" && (
            <MobileDropdown
              options={predictionData}
              Icon={<ExtraIcon className={styles.filterIcon} alt="extra icon" />}
              dropPlaceHolder="Extra"
              onSelect={handlePredictionSelect}
            />
          )}

          <MobileDropdown
            options={countryOptions}
            Icon={<CountryIcon className={styles.filterIcon} alt="country icon" />}
            dropPlaceHolder="Country"
            onSelect={handleCountrySelect}
          />

          <MobileDropdown
            options={sportOptions}
            Icon={<SportIcon className={styles.filterIcon} alt="sport icon" />}
            dropPlaceHolder="Sport"
            onSelect={handleSportSelect}
          />

          <div className={styles.filterDate}>
            <input
              type="date"
              className={styles.dateInput}
              onChange={handleDateChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
