"use client";

import { useRouter } from "next/navigation";
import styles from "@/app/style/banner.module.css";

import { PiTelegramLogoDuotone as TelegramIcon } from "react-icons/pi";
import { FaMoneyBill as PaymentIcon } from "react-icons/fa";
import { RiVipCrownLine as VipIcon } from "react-icons/ri";

export default function Banner() {
  const router = useRouter();

  const openTelegram = () => {
    window.open("https://t.me/sportyPredictTG", "_blank");
  };

  const openVip = () => {
    router.push("/vip", { scroll: false });
  };

  const openPricing = () => {
    router.push("/payment", { scroll: false });
  };

  return (
    <div className={styles.homeBanner}>
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
   
    </div>
  );
}
