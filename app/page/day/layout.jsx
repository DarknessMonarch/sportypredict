"use client";

import styles from "@/app/style/sportLayout.module.css";
import Filter from "@/app/components/Filter";
import { usePathname } from "next/navigation";
import { usePredictionStore } from "@/app/store/Prediction";

export default function PageLayout({ children }) {
  const pathname = usePathname();
  const { predictions } = usePredictionStore();


  const isSinglePage = pathname.includes("/single/");

  return (
    <div className={`${styles.sportLayout} ${predictions ? styles.nopredictionLayout : ""}`}>
      {children}
      {!isSinglePage && <Filter />}
    </div>
  );
}
