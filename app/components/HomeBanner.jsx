"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "@/app/style/homeBanner.module.css";
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

  const openTelegram = () => {
    window.open("https://t.me/sportyPredictTG", "_blank");
  };

  const openVip = () => {
    router.push("/page/vip", { scroll: false });
  };

  const openPricing = () => {
    router.push("/page/payment", { scroll: false });
  };

  if (loading || !currentAd) {
    return <div className={`${styles.advertContainer} skeleton`}></div>;
  }

  return (
    <div className={`${styles.advertContainer}`}>
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
      <div className={styles.bannerContent}>
        <h1>{currentAd.title}</h1>
        <p>{currentAd.description}</p>
      </div>
    </div>
  );
}
