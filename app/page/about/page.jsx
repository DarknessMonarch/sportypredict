"use client";

import { useEffect } from "react";
import styles from "@/app/style/info.module.css";

export default function About() {
  useEffect(() => {
    const sections = document.querySelectorAll(`.${styles.section}`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(20px)";
      section.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
  <div className={styles.termsContainer}>
        <div className={styles.termHeader}>
          <h1>About Sportypredict</h1>
        </div>
        <div className={styles.section}>
          <h2>
            SportyPredict is One Of the leading provider of sports betting
            analysis and predictions.
          </h2>
          <p>
            Our primary focus is delivering the best sports betting tips,
            covering a wide range of sports including football, basketball, and
            tennis. Our goal is to ensure that you can engage in daily sports
            betting with confidence and maximize your potential for success. Our
            website features a user-friendly interface that allows easy
            navigation on both desktop and mobile devices, making online sports
            gambling a seamless experience. If you are seeking a reliable
            platform that accurately predicts football matches,
            SportyPredict.com is unquestionably the best sports prediction
            website.
          </p>
        </div>
        <div className={styles.section}>
          <h2>Why Choose SportyPredict?</h2>
          <p>
            At SportyPredict, our sports predictions are meticulously crafted
            based on a comprehensive understanding of matches derived from an
            extensive analysis of statistics. Our dedicated team invests
            significant time and effort into providing you with reliable tips
            that you can confidently rely on. Moreover, our predictions are
            available with major betting sites, including bet365, Unibet,
            Sportpesa, bet9ja, sportybet, williamhill, and many others.
          </p>
        </div>
        <div className={styles.section}>
          <h2>The Significance of Following a Betting Prediction Website.</h2>
          <p>
            Sports, particularly football, basketball, and tennis, have garnered
            a massive fan base. The thrill and excitement of these sports have
            attracted numerous enthusiasts who are eager to engage in sports
            betting and earn money. However, without a sound knowledge of
            betting and the associated risks, losses can quickly accumulate.
            This is where SportyPredict.com proves invaluable as the ultimate
            provider of betting tips. Our predictions are generated through
            meticulous analysis and statistical evaluation conducted by our team
            of experts, taking into account all relevant factors to produce the
            best possible predictions. By relying on a reputable prediction
            website like SportyPredict.com, you can eliminate the need for
            extensive research and effortlessly access top-notch tips. This
            allows you to relax, confidently place your bets on a trustworthy
            betting site, and eagerly await the results without unnecessary
            stress or worry.
          </p>
        </div>
        <div className={styles.section}>
          <h2>
            The Importance of Relying on an Accurate Football Prediction
            Website.
          </h2>
          <p>
            The importance of relying on an accurate football prediction website
            lies within the inherent pursuit of earning money. It is this
            pursuit that drives individuals to seek out reliable sports
            prediction sites such as SportyPredict.com, which has consistently
            proven to be a profitable platform for many. Let us delve into the
            reasons why accurate predictions are crucial:
          </p>
        </div>
        <div className={styles.section}>
          <h2>
            The Importance of Relying on an Accurate Football Prediction
            Website.
          </h2>
          <p>
            The importance of relying on an accurate football prediction website
            lies within the inherent pursuit of earning money. It is this
            pursuit that drives individuals to seek out reliable sports
            prediction sites such as SportyPredict.com, which has consistently
            proven to be a profitable platform for many. Let us delve into the
            reasons why accurate predictions are crucial:
          </p>

          <ul className={styles.bulletList}>
            <li>
              Complete Safety and Security: The foremost priority of the best
              prediction sites is ensuring the complete safety and security of
              players. This entails safeguarding personal information to
              guarantee peace of mind while placing bets.
            </li>
            <li>
              Increased Chances of Winning: Accurate predictions significantly
              enhance the chances of winning. By relying on reliable tips,
              players can place bets on multiple events simultaneously, thereby
              increasing their potential for earning substantial profits.
            </li>
            <li>
              Accessibility for All: Placing bets on football, basketball, or
              tennis matches does not necessitate prior expertise or a deep
              understanding of the sport. Even individuals who have never played
              these sports can easily engage in betting, thanks to the
              simplicity of the process.
            </li>
            <li>
              Numerous Opportunities for Success: The vast array of leagues and
              matches provides ample opportunities to place bets and
              significantly improve the likelihood of winning.
            </li>
            <li>
              Enhanced Betting Experience: Whether you prefer complex
              accumulator bets or simple wagers, reputable betting sites empower
              enthusiasts to maintain control over their betting experience,
              ensuring enjoyment and excitement.
            </li>
          </ul>
          <p>
            As the gaming season commences, capitalizing on the passion for
            sports to improve one&apos;s financial well-being becomes paramount.
            This can only be accomplished through the utilization of the best
            prediction site in the world. Those who aspire to transform their
            dreams into reality are encouraged to explore any of the
            aforementioned betting sites.
          </p>
        </div>
        <div className={styles.section}>
          <h2>How to Stake Tips from Our Website.</h2>
          <p>
            We strongly advise against staking your money on all the games
            listed on our platform in a single betting slip. Instead, we
            recommend playing 1 to 3 games on a single bet slip. By adhering to
            this strategy, you can maximize the likelihood of profitable
            outcomes in the most efficient manner. Additionally, our (VIP PLAN)
            section offers an even more exclusive and highly recommended
            selection of tips, enabling users to generate substantial returns.
            By following our work, you will embark on a journey of consistent
            profitability and will never regret choosing SportyPredict. It is
            important to note that sports predictions are not authorized for
            individuals below 18 years of age or those engaging in illegal
            betting. It is a pursuit for those who are willing to accept
            potential losses and take responsibility for their choices. Although
            no sports prediction can offer 100% guarantee due to various factors
            such as injuries, red cards, and weather conditions that can affect
            outcomes, our analysis at SportyPredict.com guarantees a success
            rate of over 96%.
          </p>
        </div>
        <div className={styles.section}>
          <h2>All Football Betting Tips.</h2>
          <p>
            Explore our comprehensive range of free football predictions for
            major bet markets:
          </p>
          <ul className={styles.bulletList}>
            <li>Bet Of The Day tip</li>
            <li>Basketball tips</li>
            <li>Football tips</li>
            <li>Tennis tips</li>
            <li>Vip tips</li>
          </ul>
        </div>
        <div className={styles.section}>
          <p>
            SportyPredict is the ultimate destination for accurate sports
            betting predictions, specializing in football, basketball, and
            tennis. We provide reliable information and predictions to
            individuals who are passionate about betting and eager to earn
            money. Additionally, our (VIP PLAN) offers an opportunity for
            maximum profitability
          </p>
        </div>
      </div>
  );
}
