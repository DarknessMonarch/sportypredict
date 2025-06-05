"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAdvertStore } from "@/app/store/Advert";
import styles from "@/app/style/telegram.module.css";

export default function Telegram() {
  const { adverts, fetchAdverts, loading } = useAdvertStore();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const popupBannerAds = adverts.filter((ad) => ad.location === "PopupBanner");
  const currentAd = popupBannerAds[currentAdIndex];

  useEffect(() => {
    fetchAdverts();
  }, [fetchAdverts]);

  useEffect(() => {
    if (popupBannerAds.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex(
          (prevIndex) => (prevIndex + 1) % popupBannerAds.length
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [popupBannerAds.length]);

  const handleAdClick = () => {
    if (currentAd?.link) {
      window.open(currentAd.link, "_blank", "noopener,noreferrer");
    }
  };

  if (loading || !currentAd) {
    return (
      <div className={`${styles.telegramAds} skeleton`}>
      </div>
    );
  }

  return (
    <div 
      className={styles.telegramAds} 
      onClick={handleAdClick}
    >
      <Image
        className={styles.advertImage}
        src={currentAd.image}
        alt={currentAd.title}
        fill
        sizes="100%"
        quality={100}
        style={{
          objectFit: "cover",
        }}
        priority={true}
      />
    </div>
  );
}