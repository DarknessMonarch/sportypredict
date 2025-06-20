"use client";

import Loader from "@/app/components/Loader";
import Nothing from "@/app/components/Nothing";
import ResultImage from "@/public/assets/result.png";
import { useState, useEffect, useCallback, useRef } from "react";
import { useVipResultStore } from "@/app/store/VipResult";
import styles from "@/app/style/vipResults.module.css";
import { useRouter } from "next/navigation";

export default function VipResults({ accuracy = 96, profitPercentage = 100 }) {
  const { results, matchTime, loading, fetchResults, getMatchTime } = useVipResultStore();

  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const timerRef = useRef(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const router = useRouter();

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsTimerActive(false);
    }
  }, []);

  // Function to parse time string and calculate countdown
  const calculateTimeRemaining = useCallback(() => {
    if (!matchTime || !matchTime.active || !matchTime.time) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const now = new Date();
    let matchDateTime;

    try {
      // Handle different time formats
      const timeStr = matchTime.time.toString().trim();
      
      // Parse various time formats
      let hours, minutes = 0;
      
      if (timeStr.includes(':')) {
        // Format: "14:30" or "2:30 PM"
        const timeParts = timeStr.split(':');
        hours = parseInt(timeParts[0]);
        if (timeParts[1]) {
          const minutesPart = timeParts[1].replace(/[^\d]/g, ''); // Remove non-digit characters
          minutes = parseInt(minutesPart) || 0;
        }
        
        // Handle AM/PM format
        if (timeStr.toLowerCase().includes('pm') && hours < 12) {
          hours += 12;
        } else if (timeStr.toLowerCase().includes('am') && hours === 12) {
          hours = 0;
        }
      } else if (/^\d{3,4}$/.test(timeStr)) {
        // Format: "1430" (military time)
        hours = Math.floor(parseInt(timeStr) / 100);
        minutes = parseInt(timeStr) % 100;
      } else {
        // Format: just hours "14" or any number
        hours = parseInt(timeStr) || 0;
        minutes = 0;
      }

      // Create match time for today
      matchDateTime = new Date();
      matchDateTime.setHours(hours, minutes, 0, 0);

      // If the match time has already passed today, set it for tomorrow
      if (matchDateTime <= now) {
        matchDateTime.setDate(matchDateTime.getDate() + 1);
      }

    } catch (error) {
      console.error('Error parsing match time:', error);
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    // Calculate difference in milliseconds
    const timeDiff = matchDateTime.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    // Convert to hours, minutes, seconds
    const totalSeconds = Math.floor(timeDiff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds };
  }, [matchTime]);

  const startCountdown = useCallback(() => {
    clearTimer();

    if (!matchTime || !matchTime.active || !matchTime.time) return;

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      
      setTimeRemaining(remaining);

      // Stop timer when countdown reaches zero
      if (remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0) {
        clearInterval(interval);
        setIsTimerActive(false);
      }
    }, 1000);

    timerRef.current = interval;
    setIsTimerActive(true);

    // Set initial time immediately
    setTimeRemaining(calculateTimeRemaining());
  }, [matchTime, clearTimer, calculateTimeRemaining]);

  useEffect(() => {
    fetchResults();
    getMatchTime();

    return () => {
      clearTimer();
    };
  }, [fetchResults, getMatchTime, clearTimer]);

  useEffect(() => {
    if (matchTime) {
      if (matchTime.active && matchTime.time) {
        startCountdown();
      } else {
        clearTimer();
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
      }
    } else {
      setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
      clearTimer();
    }
  }, [matchTime, startCountdown, clearTimer]);

  // Get only the last 6 results
  const formattedResults = results
    .slice(-6) // Take the last 6 results
    .map((result) => ({
      day: result.day,
      date: result.date,
      success: result.result === "win",
      failure: result.result === "loss",
      pending: result.result === "draw" || result.result === "pending",
    }));

  const hasTimeRemaining = timeRemaining.hours > 0 || timeRemaining.minutes > 0 || timeRemaining.seconds > 0;
  const hasValidMatchTime = matchTime?.active && matchTime?.time;

  // Format display time for better UX
  const getDisplayMatchTime = () => {
    if (!matchTime?.time) return "No time set";
    
    const timeStr = matchTime.time.toString().trim();
    
    // If it's already in a nice format, return as is
    if (timeStr.includes(':') && (timeStr.includes('AM') || timeStr.includes('PM'))) {
      return timeStr;
    }
    
    // Try to format it nicely
    try {
      let hours, minutes = 0;
      
      if (timeStr.includes(':')) {
        const timeParts = timeStr.split(':');
        hours = parseInt(timeParts[0]);
        if (timeParts[1]) {
          const minutesPart = timeParts[1].replace(/[^\d]/g, '');
          minutes = parseInt(minutesPart) || 0;
        }
      } else if (/^\d{3,4}$/.test(timeStr)) {
        hours = Math.floor(parseInt(timeStr) / 100);
        minutes = parseInt(timeStr) % 100;
      } else {
        hours = parseInt(timeStr) || 0;
      }
      
      // Format as 24-hour time
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } catch (error) {
      return timeStr;
    }
  };

  return (
    <div className={styles.vipContainer}>
      <h1>Our Exclusive 2-5 Odds VIP PLAN 💰</h1>
      <div className={styles.infoBox}>
        <h3>🔥What You Get in Our VIP Club:🔥</h3>
        <p>
          ✅ 2–5 expert picks daily<br/>
          ✅ 2-5 Odds per slip/bet<br/>
          ✅ Banker of the Day<br/>
          ✅ Tennis & Basketball tips<br/>
          ✅ Combo tickets + staking guides<br/>
          ✅ 90%+ win rate<br/>
          ✅ Live odds (bets)+ expert insights<br/>
          ✅ Full support from the SportyPredict team
        </p>
        <button className={styles.subscriptionButton} onClick={() => router.push("vip")}>VIP SUBSCRIPTION</button>
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
          {hasValidMatchTime && hasTimeRemaining 
            ? `match starts at ${getDisplayMatchTime()}:` 
            : hasValidMatchTime && !hasTimeRemaining
              ? "Match is starting now!"
              : matchTime?.active 
                ? "No match time set" 
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
      
      </div>
    </div>
  );
}