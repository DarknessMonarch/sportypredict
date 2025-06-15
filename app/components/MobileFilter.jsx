"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import MobileDropdown from "@/app/components/MobileDropdown";
import styles from "@/app/style/mobileFilter.module.css";
import date from "date-and-time";
import { useState, useEffect, useMemo, useRef } from "react";
import { usePredictionStore } from "@/app/store/Prediction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

  const datePickerRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false); // Add state to control open/close

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

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const dateValue = date ? date.toISOString().split("T")[0] : null;
    updateURLParams("date", dateValue);
    
    // Close the calendar after date selection
    if (date) {
      setIsDatePickerOpen(false);
    }
  };

  const handleDateContainerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDatePickerOpen(true);
  };

  const CustomDateInput = ({ value, onClick }) => (
    <div
      className={styles.dateInputDisplay}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
      }}
      style={{
        cursor: "pointer",
        width: "100%",
        minWidth: "110px",
        position: "static",
        display: "flex",
        alignItems: "center",
      }}
    >
      {value || "Select Date"}
    </div>
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
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
      setSelectedDate(new Date(dateParam));
    }
  }, [searchParams, setCountryKey, setLeagueKey]);

  return (
    <div className={styles.mobileFilterContainer}>
      <div className={styles.mobileFilterHead}>
        <h1>{lastParam} Betting tips and prediction</h1>
      </div>
      <div className={styles.filterContainer}>
        <h1>Filter by:</h1>
        <div className={styles.filterInner}>
          <div
            className={styles.filterDate}
            onClick={handleDateContainerClick}
            style={{ cursor: "pointer" }}
          >
            <CalendarIcon className={styles.filterIcon} alt="calendar icon" />
            <DatePicker
              ref={datePickerRef}
              selected={selectedDate}
              onChange={handleDateChange}
              customInput={<CustomDateInput />}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select Date"
              isClearable
              className={styles.dateInput}
              withPortal={isMobile}
              open={isDatePickerOpen}
              onClickOutside={() => setIsDatePickerOpen(false)}
              onSelect={() => setIsDatePickerOpen(false)} // Alternative: close on select
              popperPlacement={isMobile ? "auto" : "bottom-end"}
              popperModifiers={
                isMobile
                  ? []
                  : [
                      {
                        name: "preventOverflow",
                        options: {
                          rootBoundary: "viewport",
                          tether: false,
                          altAxis: true,
                        },
                      },
                      {
                        name: "flip",
                        options: {
                          fallbackPlacements: [
                            "top-end",
                            "bottom-start",
                            "top-start",
                          ],
                        },
                      },
                    ]
              }
            />
          </div>
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
        </div>
      </div>
    </div>
  );
}