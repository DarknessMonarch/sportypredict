"use client";

import styles from "@/app/style/card.module.css";

export default function CardSkeleton({ count = 4 }) {
  return (
    <>
      {Array(count).fill(0).map((_, index) => (
        <div key={`skeleton-${index}`} className={styles.cardContainer}>
          <div className={styles.cardTop}>
            <div className={styles.leagueInfo}>
              <div className={`${styles.circularShape} skeleton`} 
                   style={{ width: '30px', height: '30px' }} 
              />
              <div className="skeleton" style={{ width: '120px', height: '20px' }} />
            </div>
            <div className={`${styles.cardStatus} skeleton`} style={{ width: '80px', height: '20px' }} />
          </div>

          <div className={styles.cardMiddle}>
            <div className={styles.teamContainer}>
              <div className={styles.teamInner}>
                <div className={`${styles.circularShape} skeleton`} 
                     style={{ width: '70px', height: '70px' }} 
                />
                <div className="skeleton" style={{ width: '100px', height: '20px' }} />
                <div className={styles.formation}>
                  {Array(5).fill(0).map((_, i) => (
                    <div key={`formation-a-${i}`} 
                         className={`${styles.formationCircle} skeleton`} 
                    />
                  ))}
                </div>
              </div>

              <div className={styles.matchInfo}>
                <div className="skeleton" style={{ width: '60px', height: '20px' }} />
                <div className="skeleton" style={{ width: '40px', height: '24px' }} />
              </div>

              <div className={styles.teamInner}>
                <div className={`${styles.circularShape} skeleton`} 
                     style={{ width: '70px', height: '70px' }} 
                />
                <div className="skeleton" style={{ width: '100px', height: '20px' }} />
                <div className={styles.formation}>
                  {Array(5).fill(0).map((_, i) => (
                    <div key={`formation-b-${i}`} 
                         className={`${styles.formationCircle} skeleton`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.cardBottom}>
            <div className="skeleton" style={{ width: '100%', height: '20px' }} />
          </div>
        </div>
      ))}
    </>
  );
}