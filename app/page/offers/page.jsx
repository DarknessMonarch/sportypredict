"use client";

import { useEffect } from "react";
import OfferCard from "@/app/components/OfferCard";
import styles from "@/app/style/offers.module.css";

export default function Bonus() {
  return (
    <div className={styles.bonusMain}>
      <div className={styles.bonusHeader}>
      <h1>Best Betting Sign Up Offers</h1>
      <p>New customers only | commercial content 18 + age limit | T&Cs apply</p>
      </div>
      <OfferCard />
      <div className={styles.bonusInfo}>
        <h2>What are welcome bonuses?</h2>
        <p>
          In the context of betting sites, a welcome bonus is a promotional
          offer designed to entice new customers to register and start betting
          on the platform. This bonus typically provides a financial incentive
          to new users when they create an account and make their first deposit.
          The specifics of a welcome bonus can vary from one betting site to
          another, but common types of welcome bonuses in betting sites include:
        </p>
        <p>
          <span>1. Deposit Match Bonus:</span> This is the most common type
          of welcome bonus. The betting site matches a percentage of the initial
          deposit made by the new user. For example, a 100% deposit match bonus
          on a $100 deposit would give the user an additional $100 in bonus
          funds to bet with.
        </p>
        <p>
          <span>2. Free Bet:</span> Some betting sites offer a free bet as a
          welcome bonus. Users receive a free bet token that they can use to
          place a wager without risking their own money. Any winnings from the
          free bet may be subject to certain conditions.
        </p>
        <p>
          <span>3. No Deposit Bonus:</span> In some cases, betting sites
          offer a no deposit bonus, which means that new users receive a small
          amount of bonus funds simply for signing up, without the need to make
          an initial deposit.
        </p>
        <p>
          <span>4. Cashback Bonus:</span> A cashback welcome bonus refunds a
          portion of the user&apos;s losses over a specific period, providing a
          form of insurance against initial losses.
        </p>
        <p>
          <span>5. Enhanced Odds:</span> Some betting sites may offer
          enhanced odds on a specific event or outcome as part of their welcome
          bonus, giving new users the chance to place a bet at more favorable
          odds.
        </p>
        <p>
          It&apos;s essential for users to carefully read and understand the
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
