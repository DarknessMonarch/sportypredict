"use client";

import Loader from "@/app/components/Loader";
import Nothing from "@/app/components/Nothing";
import ResultImage from "@/public/assets/result.png";
import { useState, useEffect, useCallback, useRef } from "react";
import { useVipResultStore } from "@/app/store/VipResult";
import styles from "@/app/style/vipResults.module.css";
import { useRouter } from "next/navigation";

export default function VipResults({ }) {
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

  const calculateTimeRemaining = useCallback(() => {
    // Return 0:0:0 if matchTime is null, undefined, empty, or inactive
    if (!matchTime || !matchTime.active || !matchTime.time || matchTime.time === "") {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const now = new Date();
    let matchDateTime;

    try {
      const timeStr = matchTime.time.toString().trim();
      
      // Return 0:0:0 if timeStr is empty after trimming
      if (!timeStr) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      
      let hours, minutes = 0;
      
      if (timeStr.includes(':')) {
        const timeParts = timeStr.split(':');
        hours = parseInt(timeParts[0]);
        if (timeParts[1]) {
          const minutesPart = timeParts[1].replace(/[^\d]/g, ''); 
          minutes = parseInt(minutesPart) || 0;
        }
        
        if (timeStr.toLowerCase().includes('pm') && hours < 12) {
          hours += 12;
        } else if (timeStr.toLowerCase().includes('am') && hours === 12) {
          hours = 0;
        }
      } else if (/^\d{3,4}$/.test(timeStr)) {
        hours = Math.floor(parseInt(timeStr) / 100);
        minutes = parseInt(timeStr) % 100;
      } else {
        hours = parseInt(timeStr) || 0;
        minutes = 0;
      }

      matchDateTime = new Date();
      matchDateTime.setHours(hours, minutes, 0, 0);

      if (matchDateTime <= now) {
        matchDateTime.setDate(matchDateTime.getDate() + 1);
      }

    } catch (error) {
      console.error('Error parsing match time:', error);
      return { hours: 0, minutes: 0, seconds: 0 };
    }
    
    const timeDiff = matchDateTime.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const totalSeconds = Math.floor(timeDiff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds };
  }, [matchTime]);

  const startCountdown = useCallback(() => {
    clearTimer();

    if (!matchTime || !matchTime.active || !matchTime.time || matchTime.time === "") {
      setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      
      setTimeRemaining(remaining);

      if (remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0) {
        clearInterval(interval);
        setIsTimerActive(false);
      }
    }, 1000);

    timerRef.current = interval;
    setIsTimerActive(true);

    setTimeRemaining(calculateTimeRemaining());
  }, [matchTime, clearTimer, calculateTimeRemaining]);

  const getStatusIcon = (status) => {
    const statusIcons = {
      win: "✓",
      won: "✓",
      loss: "×",
      refund: "↻",
      cancelled: "/",
      postponed: "⏸",
      draw: "○",
      pending: "○",
    };
    return statusIcons[status] || "○";
  };

  const getStatusClassName = (status) => {
    const statusClasses = {
      win: styles.statusWon,
      won: styles.statusWon,
      loss: styles.statusLoss,
      refund: styles.statusRefund,
      cancelled: styles.statusCancelled,
      postponed: styles.statusPostponed,
      draw: styles.statusPending,
      pending: styles.statusPending,
    };
    return statusClasses[status] || styles.statusPending;
  };

  useEffect(() => {
    fetchResults();
    getMatchTime();

    return () => {
      clearTimer();
    };
  }, [fetchResults, getMatchTime, clearTimer]);

  useEffect(() => {
    if (matchTime && matchTime.active && matchTime.time && matchTime.time !== "") {
      startCountdown();
    } else {
      clearTimer();
      setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
    }
  }, [matchTime, startCountdown, clearTimer]);

  const formattedResults = results
    .slice(0, 6) 
    .map((result) => ({
      day: result.day,
      date: result.date,
      result: result.result,
      status: result.result,
    }));
  
  const hasTimeRemaining = timeRemaining.hours > 0 || timeRemaining.minutes > 0 || timeRemaining.seconds > 0;
  const hasValidMatchTime = matchTime?.active && matchTime?.time && matchTime.time !== "";

  const getDisplayMatchTime = () => {
    if (!matchTime?.time || matchTime.time === "") return "No time set";
    
    const timeStr = matchTime.time.toString().trim();
    
    if (timeStr.includes(':') && (timeStr.includes('AM') || timeStr.includes('PM'))) {
      return timeStr;
    }
    
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
                    className={`${styles.resultBadge} ${getStatusClassName(result.status)}`}
                  >
                    <span className={styles.resultDate}>{result.date}</span>
                    <span className={styles.statusIcon}>
                      {getStatusIcon(result.status)}
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