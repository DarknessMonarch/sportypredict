"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
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
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";
import { FaTiktok, FaYoutube, FaXTwitter } from "react-icons/fa6";
import { PiTelegramLogoDuotone as TelegramIcon } from "react-icons/pi";

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
        <div className={styles.mainSection}>
          <div className={styles.brandSection}>
            <Image
              className={styles.logo}
              src={LogoImg}
              alt="SportyPredict Logo"
              height={60}
              priority={true}
            />
            <p className={styles.brandDesc}>
              Professional sports predictions and expert analysis across
              football, basketball, tennis, and more.
            </p>
          </div>

          <div className={styles.linksSection}>
            <div className={styles.linkColumn}>
              <h4>Services</h4>
              <Link href="/page/vip">VIP Membership</Link>
              <Link href="/page/payment">How to Pay</Link>
              <Link href="/page/offers">Special Offers</Link>
            </div>
            <div className={styles.linkColumn}>
              <h4>Legal</h4>
              <Link href="/page/terms">Terms & Conditions</Link>
              <Link href="/page/privacy">Privacy Policy</Link>
              <Link href="/page/refund">Refund Policy</Link>
            </div>
            <div className={styles.contactSection}>
              <h4>Contact</h4>
              <div className={styles.contactInfo}>
                <span
                  onClick={() =>
                    openSocialMedia(
                      "https://wa.me/+254703147237?text=Hi SportyPredict, I want to buy VIP subscription"
                    )
                  }
                >
                  <FaPhone /> +254703147237
                </span>
                <span>
                  <FaEnvelope /> contact@sportypredict.com
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rightSection}>
          <form onSubmit={handleWhatsAppSubmit} className={styles.whatsappForm}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send us a WhatsApp message..."
              className={styles.whatsappInput}
            />
            <button type="submit" className={styles.whatsappButton}>
              <FaWhatsapp />
            </button>
          </form>

          {/* Social Media */}
          <div className={styles.socialSection}>
            <div className={styles.socialLinks}>
              <button
                className={`${styles.socialButton} ${styles.facebook}`}
                onClick={() =>
                  openSocialMedia(
                    "https://www.facebook.com/profile.php?id=100093225097104&mibextid=LQQJ4d"
                  )
                }
              >
                <FaFacebookF />
              </button>
                <button
                className={`${styles.socialButton} ${styles.whatsapp}`}
                onClick={() =>
                  openSocialMedia(
                    "https://wa.me/+254703147237?text=Hi SportyPredict, I want to join your WhatsApp group"
                  )
                }
              >
                <FaWhatsapp />
              </button>
              <button
                className={`${styles.socialButton} ${styles.twitter}`}
                onClick={() =>
                  openSocialMedia(
                    "https://twitter.com/sportypredict?s=21&t=ordgrMn8HjrBLUy3PdpsBA"
                  )
                }
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
              >
                <FaInstagram />
              </button>
              <button
                className={`${styles.socialButton} ${styles.youtube}`}
                onClick={() =>
                  openSocialMedia("https://www.youtube.com/@Sportypredict")
                }
              >
                <FaYoutube />
              </button>
              <button
                className={`${styles.socialButton} ${styles.telegram}`}
                onClick={() => openSocialMedia("https://t.me/sportyPredictTG")}
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
              >
                <FaTiktok />
              </button>
            
            </div>
            <div className={styles.appButtons}>
              <div className={styles.appButton}>
                <FaApple className={styles.appIcon} />
                <div className={styles.appText}>
                  <span className={styles.appPlatform}>App Store</span>
                  <span className={styles.comingSoon}>Coming Soon</span>
                </div>
              </div>
              <div className={styles.appButton}>
                <FaGooglePlay className={styles.appIcon} />
                <div className={styles.appText}>
                  <span className={styles.appPlatform}>Google Play</span>
                  <span className={styles.comingSoon}>Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <span>© {currentYear} SportyPredict. All rights reserved.</span>
        <div className={styles.bottomLinks}>
          <Link href="/page/terms">Terms</Link>
          <Link href="/page/privacy">Privacy</Link>
          <Link href="/page/disclaimer">Disclaimer</Link>
        </div>
      </div>
    </footer>
  );
}
