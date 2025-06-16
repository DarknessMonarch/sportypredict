"use client";

import Loader from "@/app/components/Loader";
import Nothing from "@/app/components/Nothing";
import ResultImage from "@/public/assets/result.png";
import { useState, useEffect, useCallback, useRef } from "react";
import { useVipResultStore } from "@/app/store/VipResult";
import styles from "@/app/style/vipResults.module.css";

export default function VipResults({ accuracy = 96, profitPercentage = 100 }) {
  const { results, matchTime, loading, fetchResults, getMatchTime } =
    useVipResultStore();

  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const timerRef = useRef(null);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsTimerActive(false);
    }
  }, []);

  const startCountdown = useCallback(() => {
    clearTimer(); 

    if (!matchTime || !matchTime.active) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        let newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }

        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }

        if (newHours <= 0 && newMinutes <= 0 && newSeconds <= 0) {
          clearInterval(interval);
          setIsTimerActive(false);
          return { hours: 0, minutes: 0, seconds: 0 };
        }

        return {
          hours: Math.max(0, newHours),
          minutes: Math.max(0, newMinutes),
          seconds: Math.max(0, newSeconds),
        };
      });
    }, 1000);

    timerRef.current = interval;
    setIsTimerActive(true);
  }, [matchTime, clearTimer]);

  useEffect(() => {
    fetchResults();
    getMatchTime();

    return () => {
      clearTimer();
    };
  }, [fetchResults, getMatchTime, clearTimer]);

  useEffect(() => {
    if (matchTime) {
      const hours = matchTime.hours || 0;
      const minutes = matchTime.minutes || 0;
      const seconds = matchTime.seconds || 0;

      setTimeRemaining({ hours, minutes, seconds });

      if (matchTime.active && (hours > 0 || minutes > 0 || seconds > 0)) {
        startCountdown();
      } else {
        clearTimer();
      }
    } else {
      setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
      clearTimer();
    }
  }, [matchTime, startCountdown, clearTimer]);

  const formattedResults = results.map((result) => ({
    day: result.day,
    date: result.date,
    success: result.result === "win",
    failure: result.result === "loss",
    pending: result.result === "draw" || result.result === "pending",
  }));

  const hasTimeRemaining = timeRemaining.hours > 0 || timeRemaining.minutes > 0 || timeRemaining.seconds > 0;

  return (
    <div className={styles.vipContainer}>
      <h1>DON&apos;T GAMBLE, INVEST INSTEAD</h1>
      <div className={styles.infoBox}>
        <p>
          Make {profitPercentage}% profits with up to {accuracy}% accuracy on
          our sure VIP football subscription.
        </p>

        <button className={styles.subscriptionButton}>VIP SUBSCRIPTION</button>
      </div>

      <div className={styles.resultsSection}>
        <h2>Vip results</h2>

        {loading ? (
          <div className={styles.resultsLoading}>
            <Loader />
          </div>
        ) : (
          <div className={styles.resultsGrid}>
            {formattedResults.length > 0 ? (
              formattedResults.map((result, index) => (
                <div key={index} className={styles.resultItem}>
                  <h3>{result.day}</h3>
                  <div
                    className={`${styles.resultBadge} ${
                      result.pending
                        ? styles.pending
                        : result.success
                        ? styles.success
                        : styles.failure
                    }`}
                  >
                    {result.date}
                    <span className={styles.statusIcon}>
                      {result.pending ? "○" : result.success ? "✓" : "×"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.resultsLoading}>
                <Nothing Alt="No results" NothingImage={ResultImage} />
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.countdownSection}>
        <h2>
          {hasTimeRemaining 
            ? "Today's match starts:" 
            : matchTime?.active 
              ? "Match time has ended" 
              : "No match scheduled"
          }
        </h2>
        <div className={styles.countdownDisplay}>
          <div className={styles.timeUnit}>
            <h4>{String(timeRemaining.hours).padStart(2, '0')}</h4>
            <p>Hours</p>
          </div>

          <div className={styles.timeUnit}>
            <h4>{String(timeRemaining.minutes).padStart(2, '0')}</h4>
            <p>Minutes</p>
          </div>

          <div className={styles.timeUnit}>
            <h4>{String(timeRemaining.seconds).padStart(2, '0')}</h4>
            <p>Seconds</p>
          </div>
        </div>
        
        {matchTime && !matchTime.active && (
          <p className={styles.inactiveMessage}>
            Match timer is currently inactive
          </p>
        )}
      </div>
    </div>
  );
}