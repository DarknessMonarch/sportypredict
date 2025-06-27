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

    const sports = [
      ...new Set(predictions.map((pred) => pred.sport).filter(Boolean)),
    ].sort();

    const countries = [
      ...new Set(predictions.map((pred) => pred.country).filter(Boolean)),
    ].sort();

    const leagues = [
      ...new Set(predictions.map((pred) => pred.league).filter(Boolean)),
    ].sort();

    const tips = [
      ...new Set(predictions.map((pred) => pred.tip).filter(Boolean)),
    ].sort();

    return {
      sports: sports.length > 0 ? ["All", ...sports] : [],
      countries: countries.length > 0 ? ["All", ...countries] : [],
      leagues: leagues.length > 0 ? ["All", ...leagues] : [],
      tips: tips.length > 0 ? ["All", ...tips] : [],
    };
  }, [predictions]);

  const currentDate = date.format(new Date(), "DD-MM-YYYY");
  const currentDateForInput = date.format(new Date(), "YYYY-MM-DD");

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return currentDate;
    const dateObj = new Date(dateString);
    return date.format(dateObj, "DD-MM-YYYY");
  };

  const getDateDisplayText = () => {
    if (selectedDate) {
      return formatDateForDisplay(selectedDate);
    }
    return currentDate;
  };

  const updateURLParams = (paramName, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "All") {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSportSelect = (sport) => {
    const newSport =
      selectedSport === sport ? null : sport === "All" ? null : sport;
    setSelectedSport(newSport);
    updateURLParams("sport", newSport);
  };

  const handleCountrySelect = (country) => {
    if (country === "All" || selectedCountry === country) {
      setSelectedCountry(null);
      setCountryKey("");
      setLeagueKey("");

      const params = new URLSearchParams(searchParams.toString());
      params.delete("country");
      params.delete("league");

      router.push(`${pathname}?${params.toString()}`);
      return;
    }

    setSelectedCountry(country);
    setCountryKey(country);
    setLeagueKey("");

    const params = new URLSearchParams(searchParams.toString());
    params.set("country", country);
    params.delete("league");

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleLeagueSelect = (league) => {
    if (league === "All" || leagueKey === league) {
      setLeagueKey("");
      setSelectedCountry(null);
      setCountryKey("");

      const params = new URLSearchParams(searchParams.toString());
      params.delete("league");
      params.delete("country");

      router.push(`${pathname}?${params.toString()}`);
      return;
    }

    setLeagueKey(league);
    setSelectedCountry(null);
    setCountryKey("");

    const params = new URLSearchParams(searchParams.toString());
    params.set("league", league);
    params.delete("country");

    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePredictionSelect = (prediction) => {
    const newPrediction =
      selectedPrediction === prediction
        ? null
        : prediction === "All"
        ? null
        : prediction;
    setSelectedPrediction(newPrediction);
    updateURLParams("prediction", newPrediction);
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setSelectedDate(dateValue);
    updateURLParams("date", dateValue);
  };

  const handleDateContainerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (dateInputRef.current) {
      setTimeout(() => {
        dateInputRef.current.focus();
        if (dateInputRef.current.showPicker) {
          try {
            dateInputRef.current.showPicker();
          } catch (error) {
            dateInputRef.current.click();
          }
        } else {
          dateInputRef.current.click();
        }
      }, 10);
    }
  };

  const handleDateInputClick = (e) => {
    e.stopPropagation();
  };

  const handleDateInputFocus = (e) => {
    e.stopPropagation();
    if (e.target.showPicker) {
      try {
        e.target.showPicker();
      } catch (error) {}
    }
  };

  useEffect(() => {
    setSelectedSport(null);
    setSelectedCountry(null);
    setSelectedPrediction(null);
    setLeagueKey("");
    setCountryKey("");

    const existingDateParam = searchParams.get("date");

    if (!existingDateParam) {
      const params = new URLSearchParams();
      params.set("date", currentDateForInput);
      router.replace(`${pathname}?${params.toString()}`);
      setSelectedDate(currentDateForInput);
    } else {
      setSelectedDate(existingDateParam);
    }

    const params = new URLSearchParams();
    if (existingDateParam) {
      params.set("date", existingDateParam);
    } else {
      params.set("date", currentDateForInput);
    }

    if (searchParams.toString() !== params.toString()) {
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [pathname]);

  useEffect(() => {
    const country = searchParams.get("country");
    const league = searchParams.get("league");
    const sport = searchParams.get("sport");
    const prediction = searchParams.get("prediction");
    const dateParam = searchParams.get("date");

    if (country && country !== "All") {
      setSelectedCountry(country);
      setCountryKey(country);
      setLeagueKey("");
    }

    if (league && league !== "All") {
      setLeagueKey(league);
      setSelectedCountry(null);
      setCountryKey("");
    }

    if (sport && sport !== "All") {
      setSelectedSport(sport);
    }

    if (prediction && prediction !== "All") {
      setSelectedPrediction(prediction);
    }

    if (dateParam && dateParam !== selectedDate) {
      setSelectedDate(dateParam);
    }
  }, [searchParams]);

  return (
    <div className={styles.mobileFilterContainer}>
      <div className={styles.mobileFilterHead}>
        <h1>
          {lastParam === "day" ? "Bet of the day" : lastParam} Betting tips and
          prediction
        </h1>
      </div>
      <div className={styles.filterContainer}>
        <h1>Filter by:</h1>
        <div className={styles.filterInner}>
          <div className={styles.filterWrapper}>
            {lastParam === "extra" && filterOptions.tips.length > 1 && (
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

            {filterOptions.countries.length > 2 && (
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

            {filterOptions.leagues.length > 2 && (
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

            {filterOptions.sports.length > 2 && (
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

          <div className={styles.filterDate} onClick={handleDateContainerClick}>
            <CalendarIcon className={styles.filterIcon} alt="calendar icon" />
            <span className={styles.dateDisplay}>{getDateDisplayText()}</span>
            <input
              ref={dateInputRef}
              type="date"
              className={styles.dateInput}
              onChange={handleDateChange}
              onClick={handleDateInputClick}
              onFocus={handleDateInputFocus}
              value={selectedDate || currentDateForInput}
              title="Filter by date"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
