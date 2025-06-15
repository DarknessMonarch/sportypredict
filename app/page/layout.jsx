"use client";

import { useAdvertStore } from "@/app/store/Advert";
import styles from "@/app/style/pageLayout.module.css";
import Telegram from "@/app/components/TelegramAdvert";
import SideNav from "@/app/components/SideNav";
import Navbar from "@/app/components/Navbar";
import { useState, useEffect, useRef } from "react";
import { useDrawerStore } from "@/app/store/Drawer";
import Popup from "@/app/components/Popup";
import { initViewportFix } from "@/app/utility/viewportFix";

export default function PageLayout({ children }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { adverts } = useAdvertStore();
  const { isOpen, setClose } = useDrawerStore();
  const sideNavRef = useRef(null);

  const popupBannerAds = adverts.filter((ad) => ad.location === "PopupBanner");
  const hasPopupAds = popupBannerAds.length > 0;

  useEffect(() => {
    const cleanup = initViewportFix();
    return cleanup;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      if (!isMobile || !isOpen) return;
      if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
        const menuButton = event.target.closest("[data-menu-button]");
        if (!menuButton) {
          setClose();
        }
      }
    };

    if (isMobile && isOpen) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("touchstart", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [isMobile, isOpen, setClose]);

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
      <div ref={sideNavRef}>
        <SideNav />
      </div>
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
