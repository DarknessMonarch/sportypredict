"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "@/app/style/footer.module.css";

import {
  FaWhatsapp,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaTelegram,
} from "react-icons/fa";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa6";

export default function Footer() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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
      setError("");
    } else {
      setError("Please write a message");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Contact Information</h3>
            <p className={styles.contactDesc}>
              For queries or help, please feel free to contact us on:
            </p>
            <div className={styles.contactItem}>
              <FaWhatsapp className={styles.contactIcon} />
              <span
                className={styles.contactText}
                onClick={() =>
                  openSocialMedia(
                    "https://wa.me/+254703147237?text=Hi sporty predict, I want to buy VIP subcription"
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

            <div className={styles.appDownloadSection}>
              <h4 className={styles.downloadTitle}>Download Our App</h4>
              <div className={styles.downloadButtons}>
                <button
                  className={styles.downloadBtn}
                  onClick={() =>
                    openSocialMedia(
                      "https://itunes.apple.com/app/idYOUR_APP_ID"
                    )
                  }
                >
                  <Image
                    src="/images/ios-download.png"
                    alt="Download on iOS"
                    width={140}
                    height={42}
                    className={styles.downloadImage}
                  />
                </button>
                <button
                  className={styles.downloadBtn}
                  onClick={() =>
                    openSocialMedia(
                      "https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME"
                    )
                  }
                >
                  <Image
                    src="/images/android-download.png"
                    alt="Download on Android"
                    width={140}
                    height={42}
                    className={styles.downloadImage}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links & Information */}
          <div className={styles.footerColumn}>
            <div className={styles.linkSection}>
              <h3 className={styles.columnTitle}>Quick Links</h3>
              <nav className={styles.footerNav}>
                <Link href="/" className={styles.footerLink}>
                  Home
                </Link>
                <Link href="/banker" className={styles.footerLink}>
                  Bet of the day
                </Link>
                <Link href="/tennis" className={styles.footerLink}>
                  Tennis
                </Link>
                <Link href="/basketball" className={styles.footerLink}>
                  Basketball
                </Link>
              </nav>
            </div>

            <div className={styles.linkSection}>
              <h3 className={styles.columnTitle}>Information</h3>
              <nav className={styles.footerNav}>
                <Link href="/policy" className={styles.footerLink}>
                  Policy
                </Link>
                <Link href="/disclaimer" className={styles.footerLink}>
                  Disclaimer
                </Link>
                <Link href="/refund" className={styles.footerLink}>
                  Refund policy
                </Link>
                <Link href="/terms" className={styles.footerLink}>
                  Terms & Conditions
                </Link>
              </nav>
            </div>
          </div>

          {/* WhatsApp & Social Media */}
          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Talk with us</h3>
            <p className={styles.socialDesc}>
              Know more about our service or consultancy in advance
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
                  placeholder="WhatsApp us"
                  className={styles.whatsappInput}
                />
                <button type="submit" className={styles.whatsappButton}>
                  <FaWhatsapp className={styles.whatsappIcon} />
                </button>
              </div>
              {error && <span className={styles.errorMessage}>{error}</span>}
            </form>

            <div className={styles.socialLinks}>
              <button
                className={`${styles.socialButton} ${styles.facebook}`}
                onClick={() =>
                  openSocialMedia(
                    "https://www.facebook.com/profile.php?id=100093225097104&mibextid=LQQJ4d"
                  )
                }
                aria-label="Facebook"
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
                aria-label="Twitter"
              >
                <FaTwitter />
              </button>
              <button
                className={`${styles.socialButton} ${styles.telegram}`}
                onClick={() => openSocialMedia("https://t.me/sportyPredictTG")}
                aria-label="Telegram"
              >
                <FaTelegram />
              </button>
              <button
                className={`${styles.socialButton} ${styles.instagram}`}
                onClick={() =>
                  openSocialMedia(
                    "https://instagram.com/sportypredict_?igshid=MTIzZWMxMTBkOA=="
                  )
                }
                aria-label="Instagram"
              >
                <FaInstagram />
              </button>
              <button
                className={`${styles.socialButton} ${styles.tiktok}`}
                onClick={() =>
                  openSocialMedia(
                    "https://www.tiktok.com/@sportypredict?_t=8dxjShAnRI5&_r=1"
                  )
                }
                aria-label="TikTok"
              >
                <FaTiktok />
              </button>
              <button
                className={`${styles.socialButton} ${styles.youtube}`}
                onClick={() =>
                  openSocialMedia("https://www.youtube.com/@Sportypredict")
                }
                aria-label="YouTube"
              >
                <FaYoutube />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>© {currentYear} SportyPredict. All rights reserved</p>
      </div>
    </footer>
  );
}
