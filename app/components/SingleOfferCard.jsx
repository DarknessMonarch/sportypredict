"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Nothing from "@/app/components/Nothing";
import { useBonusStore } from "@/app/store/Bonus";
import styles from "@/app/style/Singleoffers.module.css"; 
import NoOffersImg from "@/public/assets/noOffers.png";

import { MdContentCopy as CopyIcon } from "react-icons/md";
import { FaExternalLinkAlt as LinkIcon } from "react-icons/fa";

export default function Bonus() {
  const { bonuses, loading, error, fetchBonuses } = useBonusStore();

  useEffect(() => {
    fetchBonuses("");
  }, [fetchBonuses]);

  const copyCode = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch((err) => {
      });
  };

  if (error) {
    toast.error(error);
  }

  if (loading) {
    return <div className={`${styles.bonusContainer} skeleton`}></div>;
  }

  if (bonuses.length === 0) {
    return (
      <div className={styles.bonusContainer}>
        <Nothing
          Alt="No offers available"
          NothingImage={NoOffersImg}
          Text={"No offers available"}
        />
      </div>
    );
  }

  const openLink = (link) => {
    window.open(link, "_blank");
  };

  return (
    <div className={styles.bonusContainer}>
      {bonuses.map((bonus, index) => (
        <div key={index} className={styles.bonus}>
          <div className={styles.bonusImgContainer}>
            {bonus.bonusImg && (
              <Image
                className={styles.bonusImage}
                src={bonus.bonusImg}
                alt={bonus.title}
                fill
                sizes="100%"
                quality={100}
                style={{
                  objectFit: "cover",
                }}
                priority={true}
              />
            )}
          </div>
          
          <div className={styles.bonusTitle}>
            <span>{bonus.title}</span>
          </div>
          
          <div className={styles.bonusFormContainer}>
            {!bonus.bonusCode || bonus.bonusCode === "" ? (
              <div className={styles.bonusForm}>
                <span>No code required</span>
              </div>
            ) : (
              <div className={styles.bonusForm}>
                <div className={styles.promoForm}>
                  <span>Promo code</span>
                  <h2 className={styles.inputCode}>{bonus.bonusCode}</h2>
                </div>
                <button type="button" className={styles.bonusBtn}>
                  <CopyIcon
                    onClick={() => copyCode(bonus.bonusCode)}
                    className={styles.iconBonus}
                    alt="copy icon"
                    aria-label="Copy"
                  />
                  <LinkIcon
                    onClick={() => openLink(bonus.bonusLink)}
                    className={styles.iconBonus}
                    alt="link icon"
                    aria-label="Link"
                  />
                </button>
              </div>
            )}
            <span>
              The bonus code <strong>{bonus.bonusCode}</strong> is used during
              registration but the offer amount doesn&apos;t change
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}