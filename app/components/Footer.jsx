"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from 'sonner';
import { useState } from "react";
import { useRouter } from "next/navigation";
import LogoImg from "@/public/assets/logoWhite.png";
import styles from "@/app/style/footer.module.css";

import {
  FaWhatsapp,
  FaEnvelope,
  FaFacebookF,
  FaPhone,
  FaInstagram,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaTiktok, FaYoutube, FaXTwitter } from "react-icons/fa6";
import { PiTelegramLogoDuotone as TelegramIcon } from "react-icons/pi";

import { RiBasketballLine as BasketballIcon } from "react-icons/ri";
import { GiTakeMyMoney as MoneyIcon } from "react-icons/gi";
import { RiVipLine as VipIcon } from "react-icons/ri";
import {
  IoFootball as FootballIcon,
  IoNewspaperOutline as NewsIcon,
  IoInformationCircleOutline as AboutIcon,
} from "react-icons/io5";
import { MdOutlineSportsTennis as TennisIcon } from "react-icons/md";
import { PiCourtBasketball as BetOfTheDayIcon } from "react-icons/pi";
import { TbStars as ExtraIcon } from "react-icons/tb";
import {
  RiArticleLine as BlogIcon,
  RiGiftLine as OffersIcon,
} from "react-icons/ri";

export default function Footer() {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const phoneNumber = "+254703147237";
  const currentYear = new Date().getFullYear();

  const openSocialMedia = (url) => {
    window.open(url, "_blank");
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();

    if (message.trim() !== "") {
      window.open(
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
      setMessage("");
      toast.success("Redirecting to WhatsApp...");
    } else {
      toast.error("Please write a message");
    }
  };

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerColumn}>
            <div className={styles.brandSection}>
              <Image
                className={styles.logo}
                src={LogoImg}
                alt="logo"
                height={80}
                priority={true}
              />
              <p>
                Your premier destination for professional sports predictions,
                expert analysis, and winning betting strategies. We deliver
                data-driven insights across football, basketball, tennis, and
                more to help you make informed betting decisions.
              </p>
            </div>

            <div className={styles.contactSection}>
              <h3 className={styles.columnTitle}>Contact Information</h3>
              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <FaPhone className={styles.contactIcon} />
                  <span
                    className={styles.contactText}
                    onClick={() =>
                      openSocialMedia(
                        "https://wa.me/+254703147237?text=Hi SportyPredict, I want to buy VIP subscription"
                      )
                    }
                  >
                    +254703147237
                  </span>
                </div>
                <div className={styles.contactItem}>
                  <FaEnvelope className={styles.contactIcon} />
                  <span className={styles.contactText}>
                    contact@sportypredict.com
                  </span>
                </div>
                <div className={styles.contactItem}>
                  <FaMapMarkerAlt className={styles.contactIcon} />
                  <span className={styles.contactText}>Nairobi, Kenya</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.footerColumn}>
            {/* Sports Predictions Column */}

            <div className={styles.linkSection}>
              <h3 className={styles.columnTitle}>Sports Predictions</h3>
              <nav className={styles.footerNav}>
                <Link href="/page/day" className={styles.footerLink}>
                  <BetOfTheDayIcon className={styles.footerLinkIcon} />
                  Bet of the Day
                </Link>
                <Link href="/page/football" className={styles.footerLink}>
                  <FootballIcon className={styles.footerLinkIcon} />
                  Football Predictions
                </Link>
                <Link href="/page/basketball" className={styles.footerLink}>
                  <BasketballIcon className={styles.footerLinkIcon} />
                  Basketball Tips
                </Link>
                <Link href="/page/tennis" className={styles.footerLink}>
                  <TennisIcon className={styles.footerLinkIcon} />
                  Tennis Predictions
                </Link>
                <Link href="/page/extra" className={styles.footerLink}>
                  <ExtraIcon className={styles.footerLinkIcon} />
                  Extra Predictions
                </Link>
              </nav>
            </div>
            {/* Services Column */}

            <div className={styles.linkSection}>
              <h3 className={styles.columnTitle}>Services</h3>
              <nav className={styles.footerNav}>
                <Link href="/page/vip" className={styles.footerLink}>
                  <VipIcon className={styles.footerLinkIcon} />
                  VIP Membership
                </Link>
                <Link href="/page/payment" className={styles.footerLink}>
                  <MoneyIcon className={styles.footerLinkIcon} />
                  How to Pay
                </Link>
                <Link href="/page/offers" className={styles.footerLink}>
                  <OffersIcon className={styles.footerLinkIcon} />
                  Special Offers
                </Link>
              </nav>
            </div>
          </div>

          {/* Content & Information Column */}
          <div className={styles.footerColumn}>
            <div className={styles.linkSection}>
              <h3 className={styles.columnTitle}>Content & News</h3>
              <nav className={styles.footerNav}>
                <Link href="/page/news" className={styles.footerLink}>
                  <NewsIcon className={styles.footerLinkIcon} />
                  Sports News
                </Link>
                <Link href="/page/blog" className={styles.footerLink}>
                  <BlogIcon className={styles.footerLinkIcon} />
                  Sports Blog
                </Link>
                <Link href="/page/about" className={styles.footerLink}>
                  <AboutIcon className={styles.footerLinkIcon} />
                  About Us
                </Link>
                <Link href="/page/contact" className={styles.footerLink}>
                  <FaEnvelope className={styles.footerLinkIcon} />
                  Contact Us
                </Link>
              </nav>
            </div>

            <div className={styles.linkSection}>
              <h3 className={styles.columnTitle}>Legal Information</h3>
              <nav className={styles.footerNav}>
                <Link href="/page/terms" className={styles.footerLink}>
                  Terms & Conditions
                </Link>
                <Link href="/page/privacy" className={styles.footerLink}>
                  Privacy Policy
                </Link>
                <Link href="/page/refund" className={styles.footerLink}>
                  Refund Policy
                </Link>
                <Link href="/page/disclaimer" className={styles.footerLink}>
                  Disclaimer
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Communication & Apps Section */}
        <div className={styles.communicationGrid}>
          <div className={styles.whatsappSection}>
            <h4 className={styles.subTitle}>Instant Support</h4>
            <p className={styles.whatsappDesc}>
              Need help? Send us a message on WhatsApp for instant support and
              VIP subscriptions.
            </p>
            <form
              onSubmit={handleWhatsAppSubmit}
              className={styles.whatsappForm}
            >
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className={styles.whatsappInput}
                />
                <button type="submit" className={styles.whatsappButton}>
                  <FaWhatsapp className={styles.whatsappIcon} />
                  Send
                </button>
              </div>
            </form>
          </div>

          <div className={styles.appDownloadSection}>
            <h4 className={styles.subTitle}>Download Our App</h4>
            <p className={styles.appDesc}>
              Get predictions on the go! Download our mobile app for iOS and
              Android.
            </p>
            <div className={styles.downloadButtons}>
              <button
                className={styles.downloadBtn}
                onClick={() =>
                  openSocialMedia("https://apps.apple.com/app/sportypredict")
                }
              >
                <div className={styles.downloadContent}>
                  <span className={styles.downloadText}>Download for</span>
                  <span className={styles.downloadPlatform}>iOS</span>
                </div>
              </button>
              <button
                className={styles.downloadBtn}
                onClick={() =>
                  openSocialMedia(
                    "https://play.google.com/store/apps/details?id=com.sportypredict"
                  )
                }
              >
                <div className={styles.downloadContent}>
                  <span className={styles.downloadText}>Download for</span>
                  <span className={styles.downloadPlatform}>Android</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className={styles.socialSection}>
          <div className={styles.socialContainer}>
            <h3 className={styles.socialTitle}>Follow SportyPredict</h3>
            <p className={styles.socialDescription}>
              Stay updated with the latest predictions, tips, and sports news
              across all our social media platforms.
            </p>
            <div className={styles.socialLinks}>
              <button
                className={`${styles.socialButton} ${styles.facebook}`}
                onClick={() =>
                  openSocialMedia(
                    "https://www.facebook.com/profile.php?id=100093225097104&mibextid=LQQJ4d"
                  )
                }
                aria-label="Follow us on Facebook"
              >
                <FaFacebookF />
              </button>
              <button
                className={`${styles.socialButton} ${styles.twitter}`}
                onClick={() =>
                  openSocialMedia(
                    "https://twitter.com/sportypredict?s=21&t=ordgrMn8HjrBLUy3PdpsBA"
                  )
                }
                aria-label="Follow us on Twitter"
              >
                <FaXTwitter />
              </button>
              <button
                className={`${styles.socialButton} ${styles.instagram}`}
                onClick={() =>
                  openSocialMedia(
                    "https://instagram.com/sportypredict_?igshid=MTIzZWMxMTBkOA=="
                  )
                }
                aria-label="Follow us on Instagram"
              >
                <FaInstagram />
              </button>
              <button
                className={`${styles.socialButton} ${styles.youtube}`}
                onClick={() =>
                  openSocialMedia("https://www.youtube.com/@Sportypredict")
                }
                aria-label="Subscribe to our YouTube channel"
              >
                <FaYoutube />
              </button>
              <button
                className={`${styles.socialButton} ${styles.telegram}`}
                onClick={() => openSocialMedia("https://t.me/sportyPredictTG")}
                aria-label="Join our Telegram channel"
              >
                <TelegramIcon />
              </button>
              <button
                className={`${styles.socialButton} ${styles.tiktok}`}
                onClick={() =>
                  openSocialMedia(
                    "https://www.tiktok.com/@sportypredict?_t=8dxjShAnRI5&_r=1"
                  )
                }
                aria-label="Follow us on TikTok"
              >
                <FaTiktok />
              </button>
              <button
                className={`${styles.socialButton} ${styles.whatsapp}`}
                onClick={() =>
                  openSocialMedia(
                    "https://wa.me/+254703147237?text=Hi SportyPredict, I want to join your WhatsApp group"
                  )
                }
                aria-label="Join our WhatsApp group"
              >
                <FaWhatsapp />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.bottomContent}>
            <div className={styles.copyright}>
              <p>© {currentYear} SportyPredict. All rights reserved.</p>
            </div>
            <div className={styles.bottomLinks}>
              <Link href="/sitemap" className={styles.bottomLink}>
                Sitemap
              </Link>
              <Link href="/page/terms" className={styles.bottomLink}>
                Terms
              </Link>
              <Link href="/page/privacy" className={styles.bottomLink}>
                Privacy
              </Link>
              <Link href="/page/disclaimer" className={styles.bottomLink}>
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
