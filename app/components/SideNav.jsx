"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import LogoImg from "@/public/assets/logo.png";
import { useAuthStore } from "@/app/store/Auth";
import FullLogo from "@/public/assets/fullogo.png";
import { useDrawerStore } from "@/app/store/Drawer";
import { useAdvertStore } from "@/app/store/Advert";
import styles from "@/app/style/sideNav.module.css";
import { useEffect, useState, useCallback, useRef } from "react";

import { RiBasketballLine as BasketballIcon } from "react-icons/ri";
import { GiTakeMyMoney as MoneyIcon } from "react-icons/gi";
import { RiVipLine as VipIcon } from "react-icons/ri";
import {
  IoClose as CloseIcon,
  IoFootball as FootballIcon,
} from "react-icons/io5";

import {
  MdLogout as LogoutIcon,
  MdOutlineSportsTennis as TennisIcon,
} from "react-icons/md";
import { PiCourtBasketball as BetOfTheDayIcon } from "react-icons/pi";
import { TbStars as ExtraIcon } from "react-icons/tb";

import { 
  IoNewspaperOutline as NewsIcon,
  IoInformationCircleOutline as AboutIcon 
} from "react-icons/io5";
import { 
  RiArticleLine as BlogIcon,
  RiGiftLine as OffersIcon 
} from "react-icons/ri";

export default function SideNavComponent() {
  const { isOpen, toggleOpen, setClose } = useDrawerStore();

  const adverts = useAdvertStore((state) => state.adverts);

  const [isMobile, setMobile] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const fileInputRef = useRef(null);
  const pathname = usePathname();

  const sideBannerAds = adverts.filter((ad) => ad.location === "SideBanner");
  const currentAd = sideBannerAds[currentAdIndex];

  const {
    isAuth,
    username,
    profileImage,
    isVip,
    isAdmin,
    logout,
    clearUser,
    updateProfileImage,
  } = useAuthStore((state) => ({
    isAuth: state.isAuth,
    username: state.username,
    profileImage: state.profileImage,
    isVip: state.isVip,
    isAdmin: state.isAdmin,
    logout: state.logout,
    clearUser: state.clearUser,
    updateProfileImage: state.updateProfileImage,
  }));

  useEffect(() => {
    if (sideBannerAds.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex(
          (prevIndex) => (prevIndex + 1) % sideBannerAds.length
        );
      }, 10000); // Change ad every 10 seconds

      return () => clearInterval(interval);
    }
  }, [sideBannerAds.length]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMobile(true);
      } else {
        setMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handler to close nav on mobile when link is clicked
  const handleLinkClick = useCallback(() => {
    if (isMobile) {
      setClose();
    }
  }, [isMobile, setClose]);

  const handleProfileImageClick = useCallback(() => {
    if (fileInputRef.current && !isUploadingImage) {
      fileInputRef.current.click();
    }
  }, [isUploadingImage]);

  const handleFileChange = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Please select a valid image file (JPEG, PNG, WebP or GIF)"
        );
        return;
      }
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        toast.error("Image size must be less than 100MB");
        return;
      }

      setIsUploadingImage(true);
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64String = e.target.result;

          try {
            const result = await updateProfileImage(base64String);
            if (result.success) {
              toast.success("Profile image updated successfully!");
            } else {
              toast.error(result.message || "Failed to update profile image");
            }
          } catch (error) {
            toast.error("Failed to update profile image");
          } finally {
            setIsUploadingImage(false);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }
        };

        reader.onerror = () => {
          toast.error("Failed to read the image file");
          setIsUploadingImage(false);
        };

        reader.readAsDataURL(file);
      } catch (error) {
        toast.error("Failed to process the image");
        setIsUploadingImage(false);
      }
    },
    [updateProfileImage]
  );

  const handleAdClick = useCallback(() => {
    if (currentAd?.link) {
      window.open(currentAd.link, "_blank", "noopener,noreferrer");
    }
  }, [currentAd?.link]);

  const ProfileImageComponent = () => (
    <div className={styles.profileImgWrapper}>
      {profileImage?.startsWith("https://") ? (
        <div className={styles.profileImgContainer}>
          <Image
            className={styles.profileImg}
            src={profileImage}
            alt="profile"
            fill
            sizes="100%"
            quality={100}
            priority={true}
            onClick={handleProfileImageClick}
            style={{
              objectFit: "cover",
              cursor: isUploadingImage ? "not-allowed" : "pointer",
              opacity: isUploadingImage ? 0.7 : 1,
            }}
          />
        </div>
      ) : (
        <div className={`${styles.profileImg} skeleton`} />
      )}
    </div>
  );

  const CloseIconComponent = () => {
    if (isOpen) {
      return (
        <div className={styles.menuContainer} onClick={toggleOpen}>
          <Image
            className={styles.logoImg}
            src={LogoImg}
            alt="logo"
            height={70}
            priority={true}
          />
          <div className={styles.menuInner}>
            <CloseIcon
              className={styles.menuicon}
              height={28}
              width={28}
              alt="close icon"
            />
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const SideNavAdvertComponent = () => {
    if (!currentAd) {
      return null;
    }

    return (
      <div className={`${styles.sideNavAdverts}  skeleton`}>
        <div
          className={styles.advertImageContainer}
          onClick={handleAdClick}
          style={{ cursor: currentAd.link ? "pointer" : "default" }}
        >
          <Image
            className={styles.advertImage}
            src={currentAd.image}
            alt={currentAd.title || "Advertisement"}
            fill
            sizes="100%"
            style={{ objectFit: "cover" }}
            priority={true}
          />
        </div>
      </div>
    );
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        clearUser();
        toast.success("Logged out successfully");
      } else {
        toast.error(result.message || "Logout failed");
      }
    } catch (error) {
      toast.error("An error occurred during logout");
    }
  };

  if (isOpen) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          style={{ display: "none" }}
          disabled={isUploadingImage}
        />

        <div
          className={`${styles.sideNavContainer} ${
            isOpen ? styles.showSideNav : ""
          }`}
        >
          <CloseIconComponent />
          <div className={styles.sideNavScroller}>
            {isAuth && (
              <div className={styles.sideNav}>
                <ProfileImageComponent />
                <div className={styles.sideNavDetails}>
                  <h1>{username || "Guest"}</h1>
                  <h2>{isAdmin ? "Admin" : isVip ? "Vip" : "User"}</h2>
                </div>
                <button onClick={handleLogout} className={styles.sideNavButton}>
                  <LogoutIcon
                    className={styles.userIcon}
                    height={24}
                    width={24}
                    alt="logout icon"
                  />
                  Logout
                </button>
              </div>
            )}

            {!isMobile && (
              <div className={styles.deskSideNav}>
                <Image
                  className={styles.logoImg}
                  src={FullLogo}
                  alt="logo"
                  height={40}
                  priority={true}
                />
              </div>
            )}

            <div className={styles.sideNavContainerTop}>
              <Link
                href="/page/vip"
                className={`${styles.sideNavLinkContainer} ${
                  pathname === "/page/vip" || pathname.startsWith("/page/vip/")
                    ? styles.activesideNav
                    : ""
                }`}
                onClick={handleLinkClick}
              >
                <VipIcon className={styles.sideNavIcon} alt="vip icon" />
                <h1>Vip</h1>
              </Link>
              <Link
                href="/page/payment"
                className={`${styles.sideNavLinkContainer} ${
                  pathname === "/page/payment" ||
                  pathname.startsWith("/page/payment/")
                    ? styles.activesideNav
                    : ""
                }`}
                onClick={handleLinkClick}
              >
                <MoneyIcon className={styles.sideNavIcon} alt="Offer icon" />
                <h1>How to pay </h1>
              </Link>
              <Link
                href="/page/football"
                className={`${styles.sideNavLinkContainer} ${
                  pathname === "/page/football" ||
                  pathname.startsWith("/page/football/")
                    ? styles.activesideNav
                    : ""
                }`}
                onClick={handleLinkClick}
              >
                <FootballIcon
                  className={styles.sideNavIcon}
                  alt="football icon"
                />
                <h1>Football</h1>
              </Link>
              <Link
                href="/page/day"
                className={`${styles.sideNavLinkContainer} ${
                  pathname === "/page/day" || pathname.startsWith("/page/day")
                    ? styles.activesideNav
                    : ""
                }`}
                onClick={handleLinkClick}
              >
                <BetOfTheDayIcon
                  className={styles.sideNavIcon}
                  alt="day icon"
                />
                <h1>Bet of the day</h1>
              </Link>
              <Link
                href="/page/basketball"
                className={`${styles.sideNavLinkContainer} ${
                  pathname === "/page/basketball" ||
                  pathname.startsWith("/page/basketball/")
                    ? styles.activesideNav
                    : ""
                }`}
                onClick={handleLinkClick}
              >
                <BasketballIcon
                  className={styles.sideNavIcon}
                  alt="basketball icon"
                />
                <h1>Basketball</h1>
              </Link>
              <Link
                href="/page/tennis"
                className={`${styles.sideNavLinkContainer} ${
                  pathname === "/page/tennis" ||
                  pathname.startsWith("/page/tennis/")
                    ? styles.activesideNav
                    : ""
                }`}
                onClick={handleLinkClick}
              >
                <TennisIcon className={styles.sideNavIcon} alt="tennis icon" />
                <h1>Tennis</h1>
              </Link>
              <Link
                href="/page/extra"
                className={`${styles.sideNavLinkContainer} ${
                  pathname === "/page/extra" ||
                  pathname.startsWith("/single/extra")
                    ? styles.activesideNav
                    : ""
                }`}
                onClick={handleLinkClick}
              >
                <ExtraIcon className={styles.sideNavIcon} alt="extra icon" />
                <h1>Extra prediction</h1>
              </Link>

              {/* Mobile-only navigation links */}
              {isMobile && (
                <>
                  <Link
                    href="/page/news"
                    className={`${styles.sideNavLinkContainer} ${
                      pathname === "/page/news" ? styles.activesideNav : ""
                    }`}
                    onClick={handleLinkClick}
                  >
                    <NewsIcon className={styles.sideNavIcon} alt="news icon" />
                    <h1>Sport News</h1>
                  </Link>
                  <Link
                    href="/page/blog"
                    className={`${styles.sideNavLinkContainer} ${
                      pathname === "/page/blog" ? styles.activesideNav : ""
                    }`}
                    onClick={handleLinkClick}
                  >
                    <BlogIcon className={styles.sideNavIcon} alt="blog icon" />
                    <h1>Sport Blog</h1>
                  </Link>
                  <Link
                    href="/page/offers"
                    className={`${styles.sideNavLinkContainer} ${
                      pathname === "/page/offers" ? styles.activesideNav : ""
                    }`}
                    onClick={handleLinkClick}
                  >
                    <OffersIcon className={styles.sideNavIcon} alt="offers icon" />
                    <h1>Sport offers</h1>
                  </Link>
                  <Link
                    href="/page/about"
                    className={`${styles.sideNavLinkContainer} ${
                      pathname === "/page/about" ? styles.activesideNav : ""
                    }`}
                    onClick={handleLinkClick}
                  >
                    <AboutIcon className={styles.sideNavIcon} alt="about icon" />
                    <h1>About us</h1>
                  </Link>
                      <Link
                    href="/page/contact"
                    className={`${styles.sideNavLinkContainer} ${
                      pathname === "/page/contact" ? styles.activesideNav : ""
                    }`}
                    onClick={handleLinkClick}
                  >
                    <AboutIcon className={styles.sideNavIcon} alt="about icon" />
                    <h1>Contact us</h1>
                  </Link>
                </>
              )}
            </div>

            <SideNavAdvertComponent />
          </div>
        </div>
      </>
    );
  } else {
    return null;
  }
}