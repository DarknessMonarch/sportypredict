"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useBonusStore } from "@/app/store/Bonus";
import styles from "@/app/style/exclusiveOffers.module.css";
import { IoIosArrowDroprightCircle as RightIcon } from "react-icons/io";

export default function ExclusiveOffers() {
  const { bonuses, loading, error, fetchBonuses } = useBonusStore();

  useEffect(() => {
    fetchBonuses();
  }, [fetchBonuses]);

  const firstBonus = bonuses.length > 0 ? bonuses[0] : null;

  const offer = () => {
    if (firstBonus?.bonusLink) {
      window.open(firstBonus.bonusLink, "_blank");
    }
  };

  if (loading || error || !firstBonus) {
    return null;
  }

  return (
    <div className={styles.exclusiveContainer}>
      <div className={styles.offerContainer} onClick={offer}>
        <div className={styles.offerWrap}>
          <h1>Exclusive offer</h1>
          <div className={styles.offerInner}>
            <Image
              src={firstBonus.bonusImg}
              height={50}
              width={100}
              alt="offer logo"
              priority={true}
              className={styles.offerlogo}
         
            />
            <h2>{firstBonus.title}</h2>
            <RightIcon className={styles.arrowIcon} alt="right icon" />
          </div>
        </div>
        <span>
          New customers only / Commercial content / 18+ age limit / T&C apply
        </span>
      </div>
    </div>
  );
}
