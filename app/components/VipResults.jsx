"use client";

import { useState, useEffect } from "react";
import { useVipResultStore } from "@/app/store/VipResult";
import styles from "@/app/style/vipResults.module.css";

export default function VipResults({ accuracy = 96, profitPercentage = 100 }) {
  const { results, matchTime, loading, fetchResults, getMatchTime } = useVipResultStore();
  
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const [timerInterval, setTimerInterval] = useState(null);

  const startCountdown = () => {
    if (timerInterval) clearInterval(timerInterval);
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
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

        if (newHours === 0 && newMinutes === 0 && newSeconds === 0) {
          clearInterval(interval);
        }

        return {
          hours: Math.max(0, newHours),
          minutes: Math.max(0, newMinutes),
          seconds: Math.max(0, newSeconds),
        };
      });
    }, 1000);

    setTimerInterval(interval);
  };

  useEffect(() => {
    fetchResults();
    getMatchTime();
    
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [fetchResults, getMatchTime, timerInterval]);

  useEffect(() => {
    if (matchTime) {
      setTimeRemaining({
        hours: matchTime.hours || 0,
        minutes: matchTime.minutes || 0,
        seconds: matchTime.seconds || 0,
      });

      if (matchTime.active && !timerInterval) {
        startCountdown();
      }
    }
  }, [matchTime, timerInterval]);

  const formattedResults = results.map(result => ({
    day: result.day,
    date: result.date,
    success: result.result === "win",
    failure: result.result === "loss",
    pending: result.result === "draw" || result.result === "pending",
  }));

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
          <p>Loading results...</p>
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
              <p>No results available</p>
            )}
          </div>
        )}
      </div>

      <div className={styles.countdownSection}>
        <h2>Today&apos;s match starts:</h2>
        <div className={styles.countdownDisplay}>
          <div className={styles.timeUnit}>
            <h4>{timeRemaining.hours}</h4>
            <p>Hours</p>
          </div>

          <div className={styles.timeUnit}>
            <h4>{timeRemaining.minutes}</h4>
            <p>Minutes</p>
          </div>

          <div className={styles.timeUnit}>
            <h4>{timeRemaining.seconds}</h4>
            <p>Seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
}