"use client";

import Image from "next/image";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import SideNav from "@/app/components/SideNav";
import styles from "@/app/style/notfound.module.css";
import NotFoundImage from "@/public/assets/notfound.png";

export default function NotFound() {
  return (
    <div className={styles.pageLayout}>
      <SideNav />
      <div className={styles.pageContent}>
        <Navbar />
        <div className={styles.notFound}>
          <Image
            className={styles.notFoundImg}
            src={NotFoundImage}
            height={200}
            alt="Not found image"
            priority={true}
          />
          <p>The page you are looking for does not exist or has been moved.</p>
        </div>
        <Footer />
      </div>
    </div>
  );
}
