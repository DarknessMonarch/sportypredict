"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "@/app/style/notfound.module.css";
import NotFoundGif from "@/public/assets/notfound.gif";

export default function NotFound() {
  const router = useRouter();

  const goHome = () => {
    router.push("/page/football");
  };

  return (
    <div className={styles.notFound}>
      <Image
        className={styles.notFoundImg}
        src={NotFoundGif}
        height={300}
        alt="Not found"
        loading="lazy"
        optimize="false"
      />
     <button className={styles.notFoundBtn} onClick={goHome}>
        Go Home
     </button>
    </div>
  );
}
