"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import MobileDropdown from "@/app/components/MobileDropdown";
import styles from "@/app/style/mobileFilter.module.css";
import date from "date-and-time";
import { useState, useEffect, useMemo, useRef } from "react";
import { usePredictionStore } from "@/app/store/Prediction";

import { BiWorld as CountryIcon } from "react-icons/bi";
import { TbStars as ExtraIcon } from "react-icons/tb";
import { IoFootball as SportIcon } from "react-icons/io5";
import { BiCalendar as CalendarIcon } from "react-icons/bi";

export default function MobileFilter({
  leagueKey,
  setLeagueKey,
  setCountryKey,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { predictions } = usePredictionStore();
  
  // Add ref for the date input
  const dateInputRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  const lastParam = decodeURIComponent(pathname.split("/").pop());

  const filterOptions = useMemo(() => {
    if (!predictions || predictions.length === 0) {
      return {
        sports: [],
        countries: [],
        leagues: [],
        tips: [],
      };
    }

    const sports = [...new Set(predictions.map((pred) => pred.sport))].sort();
    const countries = [
      ...new Set(predictions.map((pred) => pred.country)),
    ].sort();
    const leagues = [...new Set(predictions.map((pred) => pred.league))].sort();
    const tips = [...new Set(predictions.map((pred) => pred.tip))].sort();

    return {
      sports,
      countries,
      leagues,
      tips,
    };
  }, [predictions]);

  // Format today's date for display and input value
  const currentDate = date.format(new Date(), "DD-MM-YYYY");
  const currentDateForInput = date.format(new Date(), "YYYY-MM-DD");

  // Function to format date for display (DD-MM-YYYY)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return currentDate;
    const dateObj = new Date(dateString);
    return date.format(dateObj, "DD-MM-YYYY");
  };

  // Function to get display text for the date picker
  const getDateDisplayText = () => {
    if (selectedDate) {
      return formatDateForDisplay(selectedDate);
    }
    return currentDate; // Show today's date as default
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

  const handleSportSelect = (sport) => {
    const newSport = selectedSport === sport ? null : sport;
    setSelectedSport(newSport);
    updateURLParams("sport", newSport);
  };

  const handleCountrySelect = (country) => {
    const newCountry = selectedCountry === country ? null : country;
    setSelectedCountry(newCountry);
    setCountryKey(newCountry || "");
    updateURLParams("country", newCountry);
  };

  const handleLeagueSelect = (league) => {
    const newLeague = leagueKey === league ? null : league;
    setLeagueKey(newLeague || "");
    updateURLParams("league", newLeague);
  };

  const handlePredictionSelect = (prediction) => {
    const newPrediction = selectedPrediction === prediction ? null : prediction;
    setSelectedPrediction(newPrediction);
    updateURLParams("prediction", newPrediction);
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setSelectedDate(dateValue);
    updateURLParams("date", dateValue);
  };

  // Add function to handle date container click
  const handleDateContainerClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker?.() || dateInputRef.current.focus();
    }
  };

  // Initialize with today's date on component mount
  useEffect(() => {
    if (!selectedDate && !searchParams.get("date")) {
      setSelectedDate(currentDateForInput);
    }
  }, []);

  useEffect(() => {
    const country = searchParams.get("country");
    const league = searchParams.get("league");
    const sport = searchParams.get("sport");
    const prediction = searchParams.get("prediction");
    const dateParam = searchParams.get("date");

    if (country) {
      setSelectedCountry(country);
      setCountryKey(country);
    }
    if (league) {
      setLeagueKey(league);
    }
    if (sport) {
      setSelectedSport(sport);
    }
    if (prediction) {
      setSelectedPrediction(prediction);
    }
    if (dateParam) {
      setSelectedDate(dateParam);
    } else if (!selectedDate) {
      // Set today's date if no date param and no selected date
      setSelectedDate(currentDateForInput);
    }
  }, [searchParams, setCountryKey, setLeagueKey]);

  return (
    <div className={styles.mobileFilterContainer}>
      <div className={styles.mobileFilterHead}>
        <h1>{lastParam} Betting tips and prediction</h1>
        <h2>
          ({getDateDisplayText()})
        </h2>
      </div>
      <div className={styles.filterContainer}>
        <h1>Filter by:</h1>
        <div className={styles.filterInner}>
          <div className={styles.filterWrapper}>
            {lastParam === "extra" && filterOptions.tips.length > 0 && (
              <MobileDropdown
                options={filterOptions.tips}
                Icon={
                  <ExtraIcon className={styles.filterIcon} alt="extra icon" />
                }
                dropPlaceHolder="Prediction Type"
                onSelect={handlePredictionSelect}
                selectedValue={selectedPrediction}
              />
            )}

            {filterOptions.countries.length > 0 && (
              <MobileDropdown
                options={filterOptions.countries}
                Icon={
                  <CountryIcon
                    className={styles.filterIcon}
                    alt="country icon"
                  />
                }
                dropPlaceHolder="Country"
                onSelect={handleCountrySelect}
                selectedValue={selectedCountry}
              />
            )}
            {filterOptions.leagues.length > 0 && (
              <MobileDropdown
                options={filterOptions.leagues}
                Icon={
                  <SportIcon className={styles.filterIcon} alt="league icon" />
                }
                dropPlaceHolder="League"
                onSelect={handleLeagueSelect}
                selectedValue={leagueKey}
              />
            )}

            {filterOptions.sports.length > 1 && (
              <MobileDropdown
                options={filterOptions.sports}
                Icon={
                  <SportIcon className={styles.filterIcon} alt="sport icon" />
                }
                dropPlaceHolder="Sport"
                onSelect={handleSportSelect}
                selectedValue={selectedSport}
              />
            )}
          </div>

          <div 
            className={styles.filterDate} 
            onClick={handleDateContainerClick}
          >
            <CalendarIcon className={styles.filterIcon} alt="calendar icon" />
            <span className={styles.dateDisplay}>
              {getDateDisplayText()}
            </span>
            <input
              ref={dateInputRef}
              type="date"
              className={styles.dateInput}
              onChange={handleDateChange}
              value={selectedDate || currentDateForInput}
              title="Filter by date"
            />
          </div>
        </div>
      </div>
    </div>
  );
}