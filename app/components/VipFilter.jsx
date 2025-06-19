"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import styles from "@/app/style/mobileFilter.module.css";
import date from "date-and-time";
import { useState, useEffect, useMemo, useRef } from "react";

import { BiCalendar as CalendarIcon } from "react-icons/bi";

export default function VipFilter({
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dateInputRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState("");

  const lastParam = decodeURIComponent(pathname.split("/").pop());

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

  // Initialize date parameter only if it doesn't exist
  useEffect(() => {
    const existingDateParam = searchParams.get("date");

    if (!existingDateParam) {
      // Use the existing searchParams and only add the date
      const params = new URLSearchParams(searchParams.toString());
      params.set("date", currentDateForInput);
      router.replace(`${pathname}?${params.toString()}`);
      setSelectedDate(currentDateForInput);
    } else {
      setSelectedDate(existingDateParam);
    }
  }, []); // Empty dependency array - only run once on mount

  // Sync selectedDate with URL parameter changes
  useEffect(() => {
    const dateParam = searchParams.get("date");

    if (dateParam && dateParam !== selectedDate) {
      setSelectedDate(dateParam);
    }
  }, [searchParams]);

  return (
    <div className={styles.mobileFilterContainer}>
      <div className={styles.mobileFilterHead}>
        <h1>{lastParam} Betting tips and prediction</h1>
      </div>
      <div className={styles.filterContainer}>
        <h1>Filter by:</h1>
        <div className={styles.filterInner}>
          <div className={styles.filterWrapper}>
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