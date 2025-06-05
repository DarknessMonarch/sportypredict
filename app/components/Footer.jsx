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
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa6";

export default function Footer() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
      setSuccess("Redirecting to WhatsApp...");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError("Please write a message");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim() !== "") {
      // Here you would typically handle newsletter subscription
      setSuccess("Thank you for subscribing to our newsletter!");
      setEmail("");
      setError("");
      setTimeout(() => setSuccess(""), 5000);
    } else {
      setError("Please enter a valid email address");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.footerContainer}>
        {/* Main Footer Content */}
        <div className={styles.footerGrid}>
          {/* Company Info Section */}
          <div className={styles.footerColumn}>
            <div className={styles.brandSection}>
              <h2 className={styles.brandTitle}>SportyPredict</h2>
              <p className={styles.brandDescription}>
                Your trusted partner for professional sports predictions and betting insights. 
                We provide expert analysis and data-driven predictions to help you make informed decisions.
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
                  <span className={styles.contactText}>
                    Nairobi, Kenya
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
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
                  Tennis Predictions
                </Link>
                <Link href="/basketball" className={styles.footerLink}>
                  Basketball Tips
                </Link>
                <Link href="/page/news" className={styles.footerLink}>
                  Sport News
                </Link>
                <Link href="/page/blog" className={styles.footerLink}>
                  Sport Blog
                </Link>
                <Link href="/page/offers" className={styles.footerLink}>
                  Sport Offers
                </Link>
                <Link href="/page/about" className={styles.footerLink}>
                  About Us
                </Link>
              </nav>
            </div>
          </div>

          {/* Legal & Support */}
          <div className={styles.footerColumn}>
            <div className={styles.linkSection}>
              <h3 className={styles.columnTitle}>Legal & Support</h3>
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
                <Link href="/page/contact" className={styles.footerLink}>
                  Contact Us
                </Link>
                <Link href="/support" className={styles.footerLink}>
                  Customer Support
                </Link>
                <Link href="/faq" className={styles.footerLink}>
                  FAQ
                </Link>
              </nav>
            </div>
          </div>

          {/* Communication & Apps */}
          <div className={styles.footerColumn}>
            {/* Newsletter Subscription */}
            <div className={styles.newsletterSection}>
              <h3 className={styles.columnTitle}>Stay Updated</h3>
              <p className={styles.newsletterDesc}>
                Subscribe to our newsletter for the latest predictions and exclusive offers.
              </p>
              <form onSubmit={handleNewsletterSubmit} className={styles.newsletterForm}>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={styles.newsletterInput}
                  />
                  <button type="submit" className={styles.newsletterButton}>
                    Subscribe
                  </button>
                </div>
              </form>
            </div>

            {/* WhatsApp Contact */}
            <div className={styles.whatsappSection}>
              <h4 className={styles.subTitle}>Quick Contact</h4>
              <form onSubmit={handleWhatsAppSubmit} className={styles.whatsappForm}>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Send us a WhatsApp message"
                    className={styles.whatsappInput}
                  />
                  <button type="submit" className={styles.whatsappButton}>
                    <FaWhatsapp className={styles.whatsappIcon} />
                  </button>
                </div>
              </form>
              {error && <span className={styles.errorMessage}>{error}</span>}
              {success && <span className={styles.successMessage}>{success}</span>}
            </div>

            {/* Mobile App Download */}
            <div className={styles.appDownloadSection}>
              <h4 className={styles.subTitle}>Download Our App</h4>
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
                    width={120}
                    height={36}
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
                    width={120}
                    height={36}
                    className={styles.downloadImage}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className={styles.socialSection}>
          <div className={styles.socialContainer}>
            <h3 className={styles.socialTitle}>Follow Us</h3>
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
                className={`${styles.socialButton} ${styles.youtube}`}
                onClick={() =>
                  openSocialMedia("https://www.youtube.com/@Sportypredict")
                }
                aria-label="YouTube"
              >
                <FaYoutube />
              </button>
              <button
                className={`${styles.socialButton} ${styles.telegram}`}
                onClick={() => openSocialMedia("https://t.me/sportyPredictTG")}
                aria-label="Telegram"
              >
                <FaTelegram />
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
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.bottomContent}>
            <div className={styles.copyright}>
              <p>© {currentYear} SportyPredict. All rights reserved</p>
            </div>
            <div className={styles.bottomLinks}>
              <Link href="/page/terms" className={styles.bottomLink}>
                Terms
              </Link>
              <Link href="/page/privacy" className={styles.bottomLink}>
                Privacy
              </Link>
              <Link href="/page/disclaimer" className={styles.bottomLink}>
                Disclaimer
              </Link>
              <Link href="/sitemap" className={styles.bottomLink}>
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}