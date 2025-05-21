"use client";

import styles from "@/app/style/pageLayout.module.css";
import { useDrawerStore } from "@/app/store/Drawer";
import SideNav from "@/app/components/SideNav";
import Navbar from "@/app/components/Navbar";

export default function PageLayout({ children }) {
  const { isOpen, setClose } = useDrawerStore();

  const CloseSideNav = () => {
    if (window.innerWidth < 768 && isOpen) {
      setClose();
    }
  };

  return (
    <div className={styles.pageLayout} onClick={CloseSideNav}>
      <SideNav />
      <div className={styles.pageContent}>
        <Navbar />
        {children}
      </div>
    </div>
  );
}
