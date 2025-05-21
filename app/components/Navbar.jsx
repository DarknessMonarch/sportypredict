"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import * as React from 'react';
import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/Auth";
import LogoImg from "@/public/assets/fullogo.png";
import styles from "@/app/style/navbar.module.css";
import { useDrawerStore } from "@/app/store/Drawer";
import ProfileImg from "@/public/assets/profile.jpg";
import { usePathname, useRouter } from "next/navigation";
import { RiMenu5Fill as MenuIcon } from "react-icons/ri";
import { FaRegUser as UserIcon } from "react-icons/fa";
import { MdLogout as LogoutIcon } from "react-icons/md";

export default function NavbarComponent() {
  const { toggleOpen, setOpen, setClose } = useDrawerStore();

  const [isMobile, setMobile] = useState(false);
  const [username, setUsername] = useState("penguin");
  const { isAuth, toggleAuth } = useAuthStore();
  const pathname = usePathname();

  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setClose();
        setMobile(true);
      } else {
        setOpen();
        setMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setOpen, setClose]);


  const Login = () => {
    router.push("/authentication/login", { scroll: false });
  };

  const Logout = () => {
    toggleAuth();
    router.push("/authentication/login", { scroll: false });
  };

  const sportypredict = () => {
    router.push("/page/football", { scroll: false });
  };

  return (
    <div className={styles.navContainer}>
      <div className={styles.navContainerInner}>
        {isMobile ? (
          <>
            <MenuIcon
              onClick={toggleOpen}
              className={styles.menuicon}
              alt="menu icon"
            />
            <div className={styles.navLogo} onClick={sportypredict}>
              <Image
                className={styles.logo}
                src={LogoImg}
                alt="logo"
                width={120}
                priority={true}
              />
            </div>
          </>
        ) : (
          <div className={styles.navlinksContainer}>
            <Link
              href="/page/vip"
              className={`${styles.navlinks} ${
                pathname === "/page/vip" ? styles.activeNavLinks : ""
              }`}
            >
              Vip Tips
            </Link>
            <Link
              href="/page/news"
              className={`${styles.navlinks} ${
                pathname === "/page/news" ? styles.activeNavLinks : ""
              }`}
            >
              Sport News
            </Link>
            <Link
              href="/page/blog"
              className={`${styles.navlinks} ${
                pathname === "/page/blog" ? styles.activeNavLinks : ""
              }`}
            >
              Blog
            </Link>
            <Link
              href="/page/payment"
              className={`${styles.navlinks} ${
                pathname === "/page/payment" ? styles.activeNavLinks : ""
              }`}
            >
              How to pay
            </Link>
            <Link
              href="/page/contact"
              className={`${styles.navlinks} ${
                pathname === "/page/contact" ? styles.activeNavLinks : ""
              }`}
            >
              Contact us
            </Link>
            <Link
              href="/page/terms"
              className={`${styles.navlinks} ${
                pathname === "/page/terms" ? styles.activeNavLinks : ""
              }`}
            >
              Terms & Condition
            </Link>
            <Link
              href="/page/privacy"
              className={`${styles.navlinks} ${
                pathname === "/page/privacy" ? styles.activeNavLinks : ""
              }`}
            >
             Privacy Policy
            </Link>
            <Link
              href="/page/refund"
              className={`${styles.navlinks} ${
                pathname === "/page/refund" ? styles.activeNavLinks : ""
              }`}
            >
              Refund Policy
            </Link>
            <Link
              href="/page/disclaimer"
              className={`${styles.navlinks} ${
                pathname === "/page/disclaimer" ? styles.activeNavLinks : ""
              }`}
            >
              Disclaimer
            </Link>
          </div>
        )}

        <div className={styles.navStartContainer}>
          {isMobile && isAuth && (
            <div className={`${styles.navProfile} skeleton`}>
              <Image
                src={ProfileImg}
                height={30}
                width={30}
                alt="profile image"
                priority={true}
                className={styles.profileImg}
              />
            </div>
          )}
          {isAuth ? (
            <div className={styles.navStart}>
              <Image
                src={ProfileImg}
                height={24}
                alt="profile image"
                priority={true}
                className={`${styles.profileImg} skeleton`}
              />
              <div className={styles.userContainerDetails}>
                <div className={styles.userContainer}>
                  <h1>{username}</h1>
                  <h2>Vip</h2>
                </div>

                <button onClick={Logout} className={styles.navButton}>
                  <LogoutIcon className={styles.userIcon} alt="logout icon" />
                </button>
              </div>
            </div>
          ) : (
            <button onClick={Login} className={styles.navButton}>
              <UserIcon className={styles.userIcon} alt="login icon" />
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
