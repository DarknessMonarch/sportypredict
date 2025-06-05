"use client";

import { useAdvertStore } from "@/app/store/Advert";
import styles from "@/app/style/pageLayout.module.css";
import Telegram from "@/app/components/TelegramAdvert";
import SideNav from "@/app/components/SideNav";
import Navbar from "@/app/components/Navbar";
import { useState, useEffect } from "react";
import Popup from "@/app/components/Popup";

export default function PageLayout({ children }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false); 
  const { adverts } = useAdvertStore();

  const popupBannerAds = adverts.filter((ad) => ad.location === "PopupBanner");
  const hasPopupAds = popupBannerAds.length > 0;

  useEffect(() => {
    if (hasPopupAds) {
      setIsPopupOpen(true);
    }
  }, [hasPopupAds]);

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className={styles.pageLayout}>
      <SideNav />
      <div className={styles.pageContent}>
        <Navbar />
        {children}
      </div>
      {hasPopupAds && (
        <Popup
          Top={0}
          Right={0}
          Left={0}
          Bottom={0}
          OnClose={closePopup}
          Blur={5}
          Zindex={9999}
          IsOpen={isPopupOpen}
          Content={<Telegram />}
          BorderRadiusTopLeft={15}
          BorderRadiusTopRight={15}
          BorderRadiusBottomRight={15}
          BorderRadiusBottomLeft={15}
        />
      )}
    </div>
  );
}