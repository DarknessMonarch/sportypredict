"use client";

import Image from "next/image";
import styles from "@/app/style/exclusiveOffers.module.css";
import { IoIosArrowDroprightCircle  as RightIcon  } from "react-icons/io";

export default function ExclusiveOffers() {
  const offer = () => {
    window.open("https://rb.gy/jnptig", "_blank");
  }
    
  return (
    <div className={styles.exclusiveContainer}>

    <div className={styles.offerContainer} onClick={offer}>
      <div className={styles.offerWrap}>
        <h1>Exclusive offer</h1>
        <div className={styles.offerInner}>
          <Image
            src="https://res.cloudinary.com/dttvkmjpd/image/upload/v1725776054/cgejwicwont8intkmqvf.png"
            height={30}
            width={30}
            alt="offer logo"
            priority={true}
            className={styles.offerlogo}
          />
          <h2>Bonus upto 200.USD</h2>
            <RightIcon className={styles.arrowIcon} alt="right icon" />
        </div>
      </div>
      <span>
        New customers only / Commercial content / 18+ age limit / T&C apply
      </span>
    </div>
    </div>

  );
}
