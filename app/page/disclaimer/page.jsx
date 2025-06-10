"use client";

import { useEffect } from "react";
import Footer from "@/app/components/Footer";
import styles from "@/app/style/info.module.css";

export default function Policy() {
  useEffect(() => {
    const sections = document.querySelectorAll(`.${styles.section}`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(20px)";
      section.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.termsContainer}>
      <div className={styles.termsCard}>
        <h1>Disclaimer</h1>

        <div className={styles.section}>
          <p>
            sportypredict.com is not a bookmaker or betting platform and does
            not accept bets. We provide predictions, techniques, guides, and
            recommendations to the best of our ability, but please note that
            errors may occur.
          </p>
        </div>

        <div className={styles.section}>
          <p>
            It is important to consider our predictions as recommendations and
            not as encouragement to engage in betting activities. Gambling
            should be viewed as a form of entertainment. The visitor and user of
            sportypredict are solely responsible for their actions and
            decisions, and the site and its employees cannot be held accountable
            for the information provided on sportypredict.
          </p>
        </div>
        <div className={styles.section}>
          <p>
            It is important to consider our predictions as recommendations and
            not as encouragement to engage in betting activities. Gambling
            should be viewed as a form of entertainment. The visitor and user of
            sportypredict are solely responsible for their actions and
            decisions, and the site and its employees cannot be held accountable
            for the information provided on sportypredict.
          </p>
        </div>
        <Footer />
      </div>
    </div>
  );
}
