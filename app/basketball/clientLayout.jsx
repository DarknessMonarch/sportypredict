"use client";

import Filter from "@/app/components/Filter";
import { usePathname } from "next/navigation";
import styles from "@/app/style/sportLayout.module.css";
import { usePredictionStore } from "@/app/store/Prediction";

export default function PageLayout({ children }) {
  const pathname = usePathname();
  const { predictions } = usePredictionStore();


  const isPredictionPage = pathname.includes("/prediction/");

  return (
    <div className={`${styles.sportLayout} ${predictions ? styles.nopredictionLayout : ""}`}>
      {children}
      {!isPredictionPage && <Filter />}
    </div>
  );
}
