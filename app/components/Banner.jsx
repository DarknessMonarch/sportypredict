"use client";

import Image from "next/image";
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
    router.push("/page/vip", { scroll: false });
  };

  const openPricing = () => {
    router.push("/page/pricing", { scroll: false });
  };

  return (
    <div className={`${styles.advertContainer} skeleton `}>
      <Image
        className={styles.advertImage}
        src="https://res.cloudinary.com/dttvkmjpd/image/upload/v1712787636/n83nja0ktpivsatsmcu6.gif"
        alt="Advertisement"
        fill
        sizes="100%"
        objectFit="cover"
        priority={true}
      />
      <div className={styles.bannerContent}>
        <h1>
          Enjoy our <span>daily top-notch </span>Sports <span>Predictions</span>{" "}
          and <span>Tips</span>{" "}
        </h1>
        <p>
          We provide the best betting tips and predictions for football,
          basketball, and tennis. Sit back, relax, and enjoy the benefits. We&apos;ve
          taken care of all the hard work for you
        </p>
      </div>
      <div className={styles.btnContainer}>
        <div className={styles.bannerBtn} onClick={openVip}>
          <VipIcon className={styles.bannerIcon} alt="vip icon" />
        </div>
        <div className={styles.bannerBtn} onClick={openTelegram}>
          <TelegramIcon className={styles.bannerIcon} alt="telegram icon" />
        </div>
        <div className={styles.bannerBtn} onClick={openPricing}>
          <PaymentIcon className={styles.bannerIcon} alt="payment icon" />
        </div>
      </div>
    </div>
  );
}
