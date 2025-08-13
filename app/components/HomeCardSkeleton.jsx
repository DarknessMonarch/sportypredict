"use client";

import styles from "@/app/style/homecard.module.css";

export default function HomeCardSkeleton({ count = 4 }) {
  return (
    <div className={styles.cardContainer}>
      <div className={`${styles.sportHeader} skeleton`}>
        <div className={styles.sportInfo}>
          <span className={`${styles.sportIcon} skeleton`}></span>
          <div className={`${styles.titleSkeleton} skeleton`}></div>
        </div>
      </div>

      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={`skeleton-${index}`} className={styles.card}>
            <div className={styles.matchRowInner}>
              <div className={styles.matchRow}>
                <div className={styles.teamSection}>
                  <div className={styles.teamInfo}>
                    <div className={`${styles.teamImage} skeleton`}></div>
                    <div className={`${styles.teamNameSkeleton} skeleton`}></div>
                  </div>
                  <div className={styles.formation}>
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={`formation-${i}`}
                          className={`${styles.formationCircle} skeleton`}
                        ></div>
                      ))}
                  </div>
                </div>
                <div className={`${styles.matchDetails} skeleton`}></div>
                <div className={styles.teamSection}>
                  <div className={styles.teamInfo}>
                    <div className={`${styles.teamImage} skeleton`}></div>
                    <div className={`${styles.teamNameSkeleton} skeleton`}></div>
                  </div>
                  <div className={styles.formation}>
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={`formation-${i}`}
                          className={`${styles.formationCircle} skeleton`}
                        ></div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}