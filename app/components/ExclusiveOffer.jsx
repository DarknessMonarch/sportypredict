"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useBonusStore } from "@/app/store/Bonus";
import styles from "@/app/style/exclusiveOffers.module.css";
import { IoIosArrowDroprightCircle as RightIcon } from "react-icons/io";

export default function ExclusiveOffers() {
  const { exclusiveBonuses, exclusiveLoading, error, fetchExclusiveBonuses } = useBonusStore();

  useEffect(() => {
    fetchExclusiveBonuses("location=FrontBanner");
  }, [fetchExclusiveBonuses]);

  const offer = (bonusLink) => {
    if (bonusLink) {
      window.open(bonusLink, "_blank");
    }
  };

  if (exclusiveLoading || error || exclusiveBonuses.length === 0) {
    return null;
  }

  return (
    <div className={styles.exclusiveContainer}>
      {exclusiveBonuses.map((bonus, index) => (
        <div key={index} className={styles.offerContainer} onClick={() => offer(bonus.bonusLink)}>
          <div className={styles.offerWrap}>
            <h1>Exclusive offer</h1>
            <div className={styles.offerInner}>
              <div className={styles.imageContainer}>
                <Image
                  src={bonus.bonusImg}
                  fill
                  alt="offer logo"
                  priority={true}
                  className={styles.offerlogo}
                  sizes="80px"
                />
              </div>
              <h2>{bonus.title}</h2>
              <RightIcon className={styles.arrowIcon} alt="right icon" />
            </div>
          </div>
          <span>
            New customers only / Commercial content / 18+ age limit / T&C apply
          </span>
        </div>
      ))}
    </div>
  );
}