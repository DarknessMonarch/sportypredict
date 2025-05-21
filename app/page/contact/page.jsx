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
      name: "Twitter",
      icons: Twitter,
      link: "",
    },

    {
      name: "Telegram",
      icons: Telegram,
      link: "https://t.me/+p9eRLjKRtv45Y2Fk",
    },
    {
      name: "Whatsapp",
      icons: Whatsapp,
      link: "",
    },
    {
      name: "Instagram",
      icons: Instagram,
      link: "",
    },
    {
      name: "Facebook",
      icons: Facebook,
      link: "https://www.facebook.com/profile.php?id=100085636307503",
    },
  ];

  const openLink = (link) => {
    window.open(link, "_blank");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function onSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { success, message } = await submitContactForm(
        formData.email,
        formData.username,
        formData.message
      );

      if (success) {
        toast.success("Message sent successfully!");
        setFormData({ username: "", email: "", message: "" });
      } else {
        toast.error(message || "Failed to send message");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.formContactContainer}>
      <div className={styles.contactWrapinfo}>
        {/* Username */}
        <div className={styles.contactInputContainer}>
          <label htmlFor="username" className={styles.contactLabel}>
            Username
          </label>
          <div className={styles.contactInput}>
            <UserNameIcon
              className={styles.contactIcon}
              alt="Username icon"
              width={20}
              height={20}
            />
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Penguin"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          {errors.username && (
            <p className={styles.errorText}>{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div className={styles.contactInputContainer}>
          <label htmlFor="email" className={styles.contactLabel}>
            Email
          </label>
          <div className={styles.contactInput}>
            <EmailIcon
              className={styles.contactIcon}
              alt="email icon"
              width={20}
              height={20}
            />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Penguin@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}
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
              placeholder="Enter your message"
              rows="4"
              value={formData.message}
              onChange={handleInputChange}
              required
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
            {isLoading ? <Loader /> : "Contact Us"}
          </button>
        

          <div className={styles.socialContainer}>
            {socialData.map((data, index) => (
              <div
                className={styles.socialIconWrap}
                key={index}
                onClick={() => openLink(data.link)}
              >
                <Image
                  className={styles.socialIcon}
                  src={data.icons}
                  alt={data.name}
                  height={24}
                  priority={true}
                />
              </div>
            ))}
          </div>
          <span>
            You can also send us message once you paid for vip to be processed
          </span>
        </div>
      </div>
    </form>
  );
}
