"use client";

import { useEffect } from "react";
import Footer from "@/app/components/Footer";
import styles from "@/app/style/info.module.css";

export default function TermsConditions() {
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
      <div className={styles.termsCard}>
        <h1>Terms & Conditions</h1>

        <div className={styles.section}>
          <p>
            By accessing or using predictions and betting tips on the
            Sportypredict.com website or any of our affiliate sites, pages,
            accounts, or signing up on the website, you agree to be bound by and
            comply with:
          </p>
        </div>

        <div className={styles.section}>
          <ul className={styles.bulletList}>
            <li>Our Privacy Policy</li>
            <li>Our Disclaimer Notice</li>
            <li>Our Terms and Conditions</li>
            <li>The rules applicable to our betting or gaming products</li>
          </ul>
        </div>

        <div className={styles.section}>
          <p>
            Please carefully read the Terms and if you do not accept them,
            refrain from using the website.
          </p>
        </div>

        <div className={styles.section}>
          <p>
            The betting tips, predictions, analysis, previews, and statistics
            published on Sportypredict.com are our recommendations and personal
            opinions. They are not definitive or guaranteed predictions with no
            possibility of loss. Every user of Sportypredict.com engages in
            betting at their own risk.
          </p>
        </div>

        <div className={styles.section}>
          <p>
            We strongly advise and encourage responsible betting. Do not wager
            more than you can afford to lose. Sportypredict.com cannot be held
            responsible for the actions of its users and visitors. Any profits
            or losses resulting from gambling are solely the user&apos;s
            responsibility. Refunds for payments made are not granted.
          </p>
        </div>

        <div className={styles.section}>
          <p>
            Betting may be illegal in certain countries or regions, so we urge
            all users to comply with the relevant regulations in their
            jurisdiction. Users are responsible for acting in accordance with
            their local laws. Reproduction and unauthorized use of materials
            such as tips, analysis, and strategies from Sportypredict.com are
            strictly prohibited. If you wish to reproduce any original content
            from the site, please contact us to discuss your request.
          </p>
        </div>

        <div className={styles.section}>
          <p>
            The bet codes associated with events previewed on the site belong
            exclusively to our affiliate bookmakers. Users will be informed
            about the specific sites to which the codes pertain. Any opinions
            expressed regarding strategies, bookmakers, and football
            predictions, among others, are subjective and do not represent a
            broader, inferred population. Sportypredict.com does not publish
            sports fixtures or fixture lists, and currently has no intention to
            do so. We make every effort not to infringe copyright regarding
            fixture publications by bookmakers and do not possess any license to
            publish fixtures. If you believe that any data published on
            Sportypredict.com violates copyright, please contact us immediately.
          </p>
        </div>

        <div className={styles.section}>
          <h2>OUR LIABILITY</h2>
          <p>
            Sportypredict does not accept any liability for damages,
            liabilities, or losses arising from or connected to the services,
            picks, and predictions on the website or its affiliates. While we
            strive to ensure the accuracy of the information on the website, we
            do not guarantee the accuracy or completeness of the information and
            material provided. The website may contain typographical errors,
            inaccuracies, or outdated information. Sportypredict.com is under no
            obligation to update such material. The information and material on
            the website are provided &quot;as is,&quot; without any conditions,
            warranties, or other terms. Therefore, to the maximum extent
            permitted by law, Predict provides the website on the basis of
            excluding all representations, express or implied warranties,
            conditions, and other terms that might have an effect in relation to
            the website, except as expressly stated in these terms and
            conditions.
          </p>
        </div>

        <div className={styles.section}>
          <p>
            Sportypredict ensures the accuracy and currency of all information
            presented on its site. However, Sportypredict.com cannot be held
            responsible for users&apos; individual calculations or
            accumulations, as we provide accumulations in our Accumulator
            category. By accessing or using predictions and betting tips on the
            Sportypredict.com website or any of our affiliate sites, pages,
            accounts, or signing up on the website, you agree to be bound by our
            terms and conditions. By creating a profile and signing up to use
            Sportypredict.com, you confirm your acceptance of the summarized
            terms and conditions. Additionally, by signing up, you have
            entrusted us with your email and subscription details, and we are
            obligated to protect your information.
          </p>
        </div>

        <div className={styles.section}>
          <h2>OTHER PROVISIONS</h2>
          <p>
            These Terms and Conditions, along with the Privacy Policy, Cookies
            Policy, Rules, and any referenced documents, guidelines, or rules
            posted on the website, constitute the entire agreement and
            understanding between the parties, superseding any prior agreements
            related to the subject matter. You acknowledge and agree that by
            entering into and agreeing to these Terms and Conditions, the
            Privacy Policy, Cookies Policy, Rules, and any referenced documents,
            guidelines, or rules, you do not rely on any statement,
            representation, warranty, understanding, promise, or assurance
            (whether negligently or innocently made) of any person other than
            what is expressly set out therein. Nothing in this clause shall
            limit or exclude any liability for fraud or fraudulent
            misrepresentation.
          </p>
        </div>

        <div className={styles.section}>
          <p>
            No delay, failure, or omission (in whole or in part) in enforcing,
            exercising, or pursuing any right, power, privilege, claim, or
            remedy provided by these Terms and Conditions or by law shall be
            considered a waiver of that right, power, privilege, claim, or
            remedy in respect to the circumstances at hand or bar the
            enforcement of that or any other right, power, privilege, claim, or
            remedy in any other instance at any time.
          </p>
        </div>

        <div className={styles.section}>
          <p>
            If any provision of these Terms and Conditions is found invalid or
            unenforceable by any court or administrative body of competent
            jurisdiction, such invalidity or unenforceability shall not affect
            the validity of the remaining provisions, which shall remain in full
            force and effect.
          </p>
        </div>

        <div className={styles.section}>
          <p>
            These Terms and Conditions do not create a partnership, joint
            venture, or principal-agent relationship between the parties, and no
            party has the authority to bind any other party unless expressly
            provided otherwise in these Terms and Conditions.
          </p>
        </div>

        <div className={styles.section}>
          <p>
            Sportypredict shall not be in breach of these Terms and Conditions
            or liable for any delay or failure to perform its obligations if
            such delay or failure results from events, circumstances, or causes
            beyond its reasonable control. These may include, but are not
            limited to, telecommunications network failures, power failures,
            failures in third-party computer hardware or software, fire,
            lightning, explosion, flood, severe weather, industrial disputes or
            lock-outs, terrorist activity, and acts of government or other
            competent authorities. In such circumstances, the time for
            performance shall be extended by a period equivalent to the delay or
            failure.
          </p>
        </div>
        <Footer />
      </div>
    </div>
  );
}
