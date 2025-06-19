"use client";

import styles from "@/app/style/sportLayout.module.css";
import { usePathname } from "next/navigation";
import { usePredictionStore } from "@/app/store/Prediction";

export default function PageLayout({ children }) {
  const { predictions } = usePredictionStore();

  return (
    <div className={`${styles.sportLayout} ${predictions ? styles.nopredictionLayout : ""}`}>
      {children}
    </div>
  );
}
