"use client";

import styles from "@/app/style/sportLayout.module.css";
import Filter from "@/app/components/Filter";
import { usePathname } from "next/navigation";

export default function PageLayout({ children }) {
  const pathname = usePathname();

  const isSinglePage = pathname.includes("/single/");

  return (
    <div className={styles.sportLayout}>
      {children}
      {!isSinglePage && <Filter />}
    </div>
  );
}
