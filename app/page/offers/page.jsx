"use client";

import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import BonusImg from "@/public/assets/banner.png";
import Nothing from "@/app/components/Nothing";
import EmptySportImg from "@/public/assets/nothing.png";
import styles from "@/app/style/offers.module.css";

import { MdContentCopy as CopyIcon } from "react-icons/md";

export default function Bonus() {
  const bonusData = [
    {
      imgSrc: BonusImg,
      alt: "Bet-offer",
      info: "Bonus upto 130 USD",
      description: "Offers and welcome bonuses available",
      code: "SPBW",
      link: "https://bwredir.com/1bkh?p=%2Fregistration%2F",
    },
    {
      imgSrc: BonusImg,
      alt: "Bet-offer",
      info: "Bonus upto 130 USD",
      description: "Offers and welcome bonuses available",
      code: "BSTIPS",
      link: "https://refpakrtsb.top/L?tag=d_2503393m_45415c_&site=2503393&ad=45415",
    },
    {
      imgSrc: BonusImg,
      alt: "Bet-offer",
      info: "Bonus upto 1000 USD",
      description: "Offers and welcome bonuses available",
      code: "SPTIPS",
      link: "https://stake.com/?c=e2abbfbd54",
    },
  ];

  const copyCode = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className={styles.bonusContainer}>
      {bonusData.length === 0 ? (
        <Nothing
          Alt="No offers available"
          NothingImage={EmptySportImg}
          Text={"No offers available"}
        />
      ) : (
        bonusData.map((bonus, index) => (
          <div key={index} className={styles.bonus}>
            <div className={styles.boImg}>
              <Image
                src={bonus.imgSrc}
                alt={bonus.alt}
                width={30}
                height={30}
              />
            </div>
            <div className={styles.boOff}>
              <span>{bonus.info}</span>
            </div>
            <div className={styles.bonusFormC}>
              {bonus.code === "" ? (
                <div className={styles.bonusNoc}>
                  <span>No code required</span>
                </div>
              ) : (
                <div className={styles.bonusForm}>
                  <div className={styles.promoH}>
                    <span>Promo code</span>
                    <h2 className={styles.inputCode}>{bonus.code}</h2>
                  </div>
                  <button
                    type="submit"
                    className={styles.bonusBtn}
                    onClick={() => copyCode(bonus.code)}
                  >
                    <CopyIcon className={styles.iconBonus} />
                  </button>
                </div>
              )}
              <span>
                The bonus code <b>{bonus.code}</b> is used during registration
                but the offer amount doesn&apos;t change
              </span>
            </div>
            <a href={bonus.link} className={styles.btnOfferSpy}>
              See the offer
            </a>
          </div>
        ))
      )}
      <div className={styles.bonusInfo}>
        <h1>What are welcome bonuses?</h1>
        <p>
          In the context of betting sites, a welcome bonus is a promotional
          offer designed to entice new customers to register and start betting
          on the platform. This bonus typically provides a financial incentive
          to new users when they create an account and make their first deposit.
          The specifics of a welcome bonus can vary from one betting site to
          another, but common types of welcome bonuses in betting sites include:
        </p>
        <ol>
          <li>
            Deposit Match Bonus: This is the most common type of welcome bonus.
            The betting site matches a percentage of the initial deposit made by
            the new user. For example, a 100% deposit match bonus on a $100
            deposit would give the user an additional $100 in bonus funds to bet
            with.
          </li>
          <li>
            Free Bet: Some betting sites offer a free bet as a welcome bonus.
            Users receive a free bet token that they can use to place a wager
            without risking their own money. Any winnings from the free bet may
            be subject to certain conditions.
          </li>
          <li>
            No Deposit Bonus: In some cases, betting sites offer a no deposit
            bonus, which means that new users receive a small amount of bonus
            funds simply for signing up, without the need to make an initial
            deposit.
          </li>
          <li>
            Cashback Bonus: A cashback welcome bonus refunds a portion of the
            user&apos;`s losses over a specific period, providing a form of
            insurance against initial losses.
          </li>
          <li>
            Enhanced Odds: Some betting sites may offer enhanced odds on a
            specific event or outcome as part of their welcome bonus, giving new
            users the chance to place a bet at more favorable odds.
          </li>
        </ol>
        <p>
          It&apos;`s essential for users to carefully read and understand the
          terms and conditions associated with a welcome bonus. These terms
          often include wagering requirements, minimum deposit amounts, and
          restrictions on how the bonus funds can be used and withdrawn. By
          following these terms and conditions, users can make the most of the
          welcome bonus and enjoy their betting experience on the site.
        </p>
      </div>
    </div>
  );
}
