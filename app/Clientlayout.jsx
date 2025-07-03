"use client";

import { useAdvertStore } from "@/app/store/Advert";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/style/pageLayout.module.css";
import Telegram from "@/app/components/TelegramAdvert";
import SideNav from "@/app/components/SideNav";
import Navbar from "@/app/components/Navbar";
import { useState, useEffect, useRef } from "react";
import { useDrawerStore } from "@/app/store/Drawer";
import Popup from "@/app/components/Popup";
import { initViewportFix } from "@/app/utility/viewportFix";
import Footer from "@/app/components/Footer";
import { usePathname } from "next/navigation";

export default function PageLayout({ children }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  const { adverts } = useAdvertStore();
  const { isOpen, setClose } = useDrawerStore();
  const { initializeAuth, isInitialized } = useAuthStore();
  const sideNavRef = useRef(null);
  const pathname = usePathname();

 const isAuthRoute = pathname && (
  [
    "/authentication/login",
    "/authentication/resetcode", 
    "/authentication/signup",
    "/authentication/verification"
  ].includes(pathname) || 
  pathname.startsWith("/authentication/reset/")
);

  const popupBannerAds = adverts.filter((ad) => ad.location === "PopupBanner");
  const hasPopupAds = popupBannerAds.length > 0;

  useEffect(() => {
    const initAuth = async () => {
      try {
        await initializeAuth();
        setIsAuthInitialized(true);
      } catch (error) {
        setIsAuthInitialized(true);
      }
    };

    if (!isInitialized && !isAuthInitialized) {
      initAuth();
    } else if (isInitialized) {
      setIsAuthInitialized(true);
    }
  }, [initializeAuth, isInitialized, isAuthInitialized]);

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
      if (!isMobile || !isOpen || isAuthRoute) return;
      if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
        const menuButton = event.target.closest("[data-menu-button]");
        if (!menuButton) {
          setClose();
        }
      }
    };

    if (isMobile && isOpen && !isAuthRoute) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("touchstart", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [isMobile, isOpen, setClose, isAuthRoute]);

  useEffect(() => {
    if (hasPopupAds && !isAuthRoute) {
      setIsPopupOpen(true);
    }
  }, [hasPopupAds, isAuthRoute]);

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  if (isAuthRoute) {
    return children;
  }

  return (
    <div className={styles.pageLayout}>
      <div ref={sideNavRef}>
        <SideNav />
      </div>
      <div className={styles.pageContent}>
        <Navbar />
        <div className={styles.pageChildren}>{children}</div>
        <Footer />
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
