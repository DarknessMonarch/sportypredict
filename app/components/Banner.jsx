"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "@/app/style/banner.module.css";
import { useAdvertStore } from "@/app/store/Advert";

import { PiTelegramLogoDuotone as TelegramIcon } from "react-icons/pi";
import { FaMoneyBill as PaymentIcon } from "react-icons/fa";
import { RiVipCrownLine as VipIcon } from "react-icons/ri";

export default function Banner() {
  const router = useRouter();
  const { adverts, fetchAdverts, loading } = useAdvertStore();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const frontBannerAds = adverts.filter((ad) => ad.location === "FrontBanner");
  const currentAd = frontBannerAds[currentAdIndex];

  useEffect(() => {
    fetchAdverts();
  }, [fetchAdverts]);

  useEffect(() => {
    if (frontBannerAds.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex(
          (prevIndex) => (prevIndex + 1) % frontBannerAds.length
        );
      }, 10000); // Change ad every 10 seconds

      return () => clearInterval(interval);
    }
  }, [frontBannerAds.length]);

  const openTelegram = () => {
    window.open("https://t.me/sportyPredictTG", "_blank");
  };

  const openVip = () => {
    router.push("/vip", { scroll: false });
  };

  const openPricing = () => {
    router.push("/payment", { scroll: false });
  };

  const getStatus = (status) => {
    switch (status) { 
      case "pending":
        return "Pending";
      case "won":
        return "Won";
      case "lost":
        return "Lost";
      default:
        return "Unknown";
    }
  }


  const handleAdClick = () => {
    if (currentAd?.link) {
      window.open(currentAd.link, "_blank", "noopener,noreferrer");
    }
  };

  if (loading || !currentAd) {
    return <div className={`${styles.advertContainer} skeleton`}></div>;
  }

  return (
    <div className={`${styles.advertContainer} skeleton`}>
      <div
        className={styles.advertImageContainer}
        onClick={handleAdClick}
        style={{ cursor: currentAd.link ? "pointer" : "default" }}
      >
        <Image
          className={styles.advertImage}
          src={currentAd.image}
          alt={currentAd.title}
          fill
          sizes="100%"
          quality={100}
          objectFit="cover"
          priority={true}
        />
      </div>

      <div className={styles.bannerContent}>
        <h1>{currentAd.title}</h1>
        <p>{currentAd.description}</p>
      </div>

      <div className={styles.btnContainer}>
        <div className={styles.bannerBtn} onClick={openVip} title="VIP">
          <VipIcon className={styles.bannerIcon} alt="vip icon" />
          <h1>Vip tips</h1>
        </div>
        <div
          className={styles.bannerBtn}
          onClick={openTelegram}
          title="Telegram"
        >
          <TelegramIcon className={styles.bannerIcon} alt="telegram icon" />
          <h1>Telegram</h1>
        </div>
        <div className={styles.bannerBtn} onClick={openPricing} title="Pricing">
          <PaymentIcon className={styles.bannerIcon} alt="payment icon" />
          <h1>Payment</h1>
        </div>
      </div>

      {frontBannerAds.length > 1 && (
        <div className={styles.adIndicators}>
          {frontBannerAds.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${
                index === currentAdIndex ? styles.active : ""
              }`}
              onClick={() => setCurrentAdIndex(index)}
              aria-label={`Show ad ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
