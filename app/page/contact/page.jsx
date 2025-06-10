"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/style/contact.module.css";
import Instagram from "@/public/assets/instagram.png";
import Whatsapp from "@/public/assets/whatsapp.png";
import Telegram from "@/public/assets/telegram.png";
import Twitter from "@/public/assets/twitter.png";
import Facebook from "@/public/assets/facebook.png";

import { FaRegUser as UserNameIcon } from "react-icons/fa6";
import { MdOutlineEmail as EmailIcon } from "react-icons/md";

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const { submitContactForm } = useAuthStore();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const socialData = [
    {
      name: "Facebook",
      icons: Facebook,
      link: "https://www.facebook.com/profile.php?id=100093225097104&mibextid=LQQJ4d",
      dataAttribute: "facebook"
    },
    {
      name: "Twitter",
      icons: Twitter,
      link: "https://twitter.com/sportypredict?s=21&t=ordgrMn8HjrBLUy3PdpsBA",
      dataAttribute: "twitter"
    },
    {
      name: "Instagram",
      icons: Instagram,
      link: "https://instagram.com/sportypredict_?igshid=MTIzZWMxMTBkOA==",
      dataAttribute: "instagram"
    },
    {
      name: "Telegram",
      icons: Telegram,
      link: "https://t.me/sportyPredictTG",
      dataAttribute: "telegram"
    },
    {
      name: "Whatsapp",
      icons: Whatsapp,
      link: "https://wa.me/+254703147237?text=Hi SportyPredict, I want to join your WhatsApp group",
      dataAttribute: "whatsapp"
    },
  ];

  const openLink = (link, name) => {
    if (!link || link.trim() === "") {
      toast.error(`${name} link is not available yet. Please try other contact methods.`);
      return;
    }
    window.open(link, "_blank");
    toast.success(`Opening ${name}...`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 2) {
      newErrors.username = "Username must be at least 2 characters";
    } else if (formData.username.trim().length > 50) {
      newErrors.username = "Username must be less than 50 characters";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = "Message must be less than 1000 characters";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  async function onSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { success, message } = await submitContactForm(
        formData.email.trim(),
        formData.username.trim(),
        formData.message.trim()
      );

      if (success) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ username: "", email: "", message: "" });
        setErrors({});
      } else {
        toast.error(message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      
      if (error.name === 'NetworkError' || error.message.includes('fetch')) {
        toast.error("Network error. Please check your connection and try again.");
      } else if (error.status === 429) {
        toast.error("Too many requests. Please wait a moment before trying again.");
      } else if (error.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.formContactContainer}>
      <div className={styles.contactWrap}>
        <div className={styles.contactWrapinfo}>
          {/* Username */}
          <div className={styles.contactInputContainer}>
            <label htmlFor="username" className={styles.contactLabel}>
              Username
            </label>
            <div className={styles.contactInput}>
              <UserNameIcon className={styles.contactIcon} />
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                maxLength={50}
                autoComplete="username"
              />
            </div>
            {errors.username && (
              <p className={styles.errorText}>{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className={styles.contactInputContainer}>
            <label htmlFor="email" className={styles.contactLabel}>
              Email Address
            </label>
            <div className={styles.contactInput}>
              <EmailIcon className={styles.contactIcon} />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className={styles.errorText}>{errors.email}</p>
            )}
          </div>

          {/* Message */}
          <div className={styles.contactInputContainer}>
            <label htmlFor="message" className={styles.contactLabel}>
              Message
            </label>
            <div className={styles.contactInputTextArea}>
              <textarea
                name="message"
                id="message"
                placeholder="Enter your message here..."
                rows="4"
                value={formData.message}
                onChange={handleInputChange}
                maxLength={1000}
              ></textarea>
            </div>
            {errors.message && (
              <p className={styles.errorText}>{errors.message}</p>
            )}
          </div>

          <div className={styles.formcontactBtnWrapper}>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.formcontactButton}
            >
              {isLoading ? <Loader /> : "Send Message"}
            </button>
          </div>
        </div>

        {/* Social Media Section */}
        <div className={styles.socialSection}>
          <div className={styles.socialContainer}>
            <h3 className={styles.socialTitle}>Connect With SportyPredict</h3>
            <p className={styles.socialDescription}>
              Follow us on social media for the latest predictions, tips, and sports insights.
            </p>
            <div className={styles.socialLinks}>
              {socialData.map((data, index) => (
                <div
                  className={styles.socialIconWrap}
                  key={index}
                  data-social={data.dataAttribute}
                  onClick={() => openLink(data.link, data.name)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Follow us on ${data.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openLink(data.link, data.name);
                    }
                  }}
                >
                  <Image
                    className={styles.socialIcon}
                    src={data.icons}
                    alt={`${data.name} icon`}
                    height={28}
                    width={28}
                    priority={true}
                  />
                </div>
              ))}
            </div>
            <div className={styles.contactNote}>
              <p>
                You can also send us a message once you&apos;ve paid for VIP membership to have it processed quickly.
                For urgent matters, contact us directly via WhatsApp or Telegram.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}