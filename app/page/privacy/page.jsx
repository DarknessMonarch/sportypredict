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
        <h1>Privacy policy</h1>
      </div>

      <div className={styles.section}>
        <p>
          At sportypredict we are deeply committed to protecting your privacy
          and ensuring the security of your personal information. This privacy
          policy explains how we collect and utilize your information when you
          use our website.
        </p>
      </div>

      <div className={styles.section}>
        <p>
          We may ask for your name, contact information (such as email address
          and phone number), and date of birth. Additionally, we may gather
          other relevant information through customer surveys and special
          offers. The sole purpose of collecting this information is to provide
          you with enhanced service and improve our products and services.
        </p>
      </div>

      <div className={styles.section}>
        <p>
          On occasion, we may send you promotional emails and SMS messages
          containing information about new products, exclusive offers, or other
          relevant updates. If you no longer wish to receive such
          communications, please contact us
        </p>
      </div>
      <div className={styles.section}>
        <p>
          If you believe that any of the information we have collected is
          incorrect or incomplete, please contact us, and we will promptly
          rectify any inaccuracies. According to Data Protection Laws, you have
          the right to request information about the personal data we hold about
          you.
        </p>
      </div>
      <div className={styles.section}>
        <p>
          If you decide to delete your sportypredict account, please be aware
          that all associated data and content, including active subscriptions,
          will be permanently lost. However, you can still access sportypredict
          services by registering with a new email address and phone number.
        </p>
      </div>
      <div className={styles.section}>
        <p>
          Please note that this privacy policy may be updated periodically, and
          We encourage you to regularly review this page for any changes or
          updates.
        </p>
      </div>
    </div>
  );
}
