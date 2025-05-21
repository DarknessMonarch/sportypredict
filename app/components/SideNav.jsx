"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import LogoImg from "@/public/assets/logo.png";
import FullLogo from "@/public/assets/fullogo.png";
import { useAuthStore } from "@/app/store/Auth";
import { useDrawerStore } from "@/app/store/Drawer";
import styles from "@/app/style/sideNav.module.css";
import ProfileImg from "@/public/assets/profile.jpg";
import { usePathname, useRouter } from "next/navigation";

import { RiBasketballLine as BasketballIcon } from "react-icons/ri";
import { TbInfoHexagon as AboutIcon } from "react-icons/tb";
import {
  IoClose as CloseIcon,
  IoFootball as FootballIcon,
} from "react-icons/io5";
import {
  MdLogout as LogoutIcon,
  MdOutlineLocalOffer as OffersIcon,
  MdOutlineSportsTennis as TennisIcon,
} from "react-icons/md";
import { PiCourtBasketball as BetOfTheDayIcon } from "react-icons/pi";
import { TbStars as ExtraIcon } from "react-icons/tb";

export default function SideNavComponent() {
  const [username, setUsername] = useState("penguin");
  const { isOpen, toggleOpen } = useDrawerStore();
  const { isAuth, toggleAuth } = useAuthStore();
  const [isMobile, setMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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
              height={24}
              width={24}
              alt="close icon"
            />
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const SignOut = () => {
    toggleAuth();
  };

  if (isOpen) {
    return (
      <div
        className={`${styles.sideNavContainer} ${
          isOpen ? styles.showSideNav : ""
        }`}
      >
        <CloseIconComponent />
        <div className={styles.sideNavScroller}>
          {isAuth && (
            <div className={styles.sideNav}>
              <Image
                src={ProfileImg}
                height={24}
                alt="profile image"
                priority={true}
                className={styles.profileImg}
              />
              <div className={styles.sideNavDetails}>
                <h1>{username}</h1>
                <h2>Vip</h2>
              </div>
              <button onClick={SignOut} className={styles.sideNavButton}>
                <LogoutIcon
                  className={styles.userIcon}
                  height={24}
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
              href="/page/day"
              className={`${styles.sideNavLinkContainer} ${
                pathname === "/page/day" ? styles.activesideNav : ""
              }`}
            >
              <BetOfTheDayIcon
                className={styles.sideNavIcon}
                alt="day icon"
              />
              <h1>Bet of the day</h1>
            </Link>
            <Link
              href="/page/extra"
              className={`${styles.sideNavLinkContainer} ${
                pathname === "/page/extra" ? styles.activesideNav : ""
              }`}
            >
              <ExtraIcon className={styles.sideNavIcon} alt="extra icon" />
              <h1>Extra prediction</h1>
            </Link>
            <Link
              href="/page/basketball"
              className={`${styles.sideNavLinkContainer} ${
                pathname === "/page/basketball" ? styles.activesideNav : ""
              }`}
            >
              <BasketballIcon className={styles.sideNavIcon} alt="basketball icon" />
              <h1>Basketball</h1>
            </Link>
            <Link
              href="/page//football"
              className={`${styles.sideNavLinkContainer} ${
                pathname === "/page/football" ||
                pathname.startsWith("/page/football/")
                  ? styles.activesideNav
                  : ""
              }`}
            >
              <FootballIcon
                className={styles.sideNavIcon}
                alt="football icon"
              />
              <h1>Football</h1>
            </Link>
            <Link
              href="/page/tennis"
              className={`${styles.sideNavLinkContainer} ${
                pathname === "/page/tennis" ? styles.activesideNav : ""
              }`}
            >
              <TennisIcon className={styles.sideNavIcon} alt="tennis icon" />
              <h1>Tennis</h1>
            </Link>
            <Link
              href="/page/offers"
              className={`${styles.sideNavLinkContainer} ${
                pathname === "/page/offers" ? styles.activesideNav : ""
              }`}
            >
              <OffersIcon className={styles.sideNavIcon} alt="Offer icon" />
              <h1>Offers </h1>
            </Link>
            <Link
              href="/page/about"
              className={`${styles.sideNavLinkContainer} ${
                pathname === "/page/about" ? styles.activesideNav : ""
              }`}
            >
              <AboutIcon className={styles.sideNavIcon} alt="about icon" />
              <h1>About </h1>
            </Link>
          </div>
          <div className={`${styles.sideNavAdverts} skeleton`}>
            <Image
              className={styles.advertImage}
              src="https://res.cloudinary.com/dttvkmjpd/image/upload/v1712787636/n83nja0ktpivsatsmcu6.gif"
              alt="Advertisement"
              fill
              sizes="100%"
              objectFit="cover"
              priority={true}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
