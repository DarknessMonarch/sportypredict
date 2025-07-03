"use client";

import { useEffect } from "react";
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
      <div className={styles.termHeader}>
        <h1>Refund Policy</h1>
      </div>
      <div className={styles.section}>
        <p>
          The information provided is intended solely for individuals or
          entities who are above the age of 18. SportyPredict does not offer
          refunds for subscription payments and assumes no liability for any
          financial losses or gains. It is advised that individuals from
          countries where betting is illegal refrain from subscribing to our
          plans.
        </p>
      </div>

      <div className={styles.section}>
        <p>
          And if you wish cancel or stop from automatic subscriptions Kindly
          contact us not less than 3 days before the next payment date, then
          we’ll cancel or stop your
          <a href="https://sportypredict.com/vip" target="_blank">
            VIP PLAN subscription
          </a>
          , Failing to inform us earlier we shall not be able to refund the
          subscription fee and you’ll have to finish the charged subscription
          period, kindly adhere to this.
        </p>
      </div>
      <div className={styles.section}>
        <p>
          For further details about SportyPredict, please refer to our
          comprehensive
          <a href="https://sportypredict.com/terms" target="_blank">
            {" "}
            Terms and Conditions.{" "}
          </a>
        </p>
      </div>
    </div>
  );
}
