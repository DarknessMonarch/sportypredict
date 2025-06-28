"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { useBonusStore } from "@/app/store/Bonus";
import styles from "@/app/style/homeBonus.module.css";

export default function BettingBonuses({ onItemClick }) {
  const { bonuses, loading, error, fetchBonuses } = useBonusStore();
  const router = useRouter();

  useEffect(() => {
    fetchBonuses("");
  }, [fetchBonuses]);

  const handleCardClick = () => {
    router.push('/page/offers');
  };

  if (error) {
    toast.error(error);
  }

  if (loading) {
    return <div className={styles.cardLoading}>
      <div className={`${styles.cardLoadingItem} skeleton`}></div>

    </div>;
  }

  if (bonuses.length === 0) {
    return null;
  }

  const items = [
    { name: "Betting bonuses and offers", id: "bonuses", isHeader: true },
    ...bonuses.map((bonus, index) => ({
      name: bonus.title,
      id: bonus.id || `bonus-${index}`,
      bonus: bonus,
    })),
    { name: "More offers", id: "more-offers", isFooter: true },
  ];

  return (
    <div className={styles.card} onClick={handleCardClick}>
      {items.map((item, index) => (
        <div
          key={item.id || index}
          className={`${styles.bonusItem} ${
            item.isHeader ? styles.headerItem : ""
          } ${item.isFooter ? styles.footerItem : ""}`}
        >
          {item.bonus && item.bonus.bonusImg && (
            <div className={styles.imageContainer}>
            <Image
              src={item.bonus.bonusImg}
              alt={item.bonus.title}
              fill
              sizes="100%"
              quality={100}
              objectFit="cover"
              priority={true}
              className={styles.bonusImage}
            />
            </div>
          )}

          <div className={styles.bonusContent}>
            {item.isHeader && (
              <span className={styles.headerTitle}>{item.name}</span>
            )}
            {item.isFooter && (
              <span className={styles.footerTitle}>{item.name}</span>
            )}
            {item.bonus && item.bonus.description && (
              <span className={styles.bonusDescription}>{item.bonus.description}</span>
            )}
            
            {item.bonus && !item.bonus.description && (
              <span className={styles.bonusTitle}>{item.name}</span>
            )}
          </div>

        </div>
      ))}
    </div>
  );
}