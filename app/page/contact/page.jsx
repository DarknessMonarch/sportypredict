"use client";

import { toast } from "sonner";
import { useState } from "react";
import Footer from "@/app/components/Footer";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/style/contact.module.css";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
    }

    return Object.keys(newErrors).length === 0;
  };

  async function onSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) return;

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
    <div onSubmit={onSubmit} className={styles.formContactContainer}>
      <div className={styles.contactWrap}>
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
        </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.formcontactButton}
          >
            {isLoading ? <Loader /> : "Send Message"}
          </button>
      </div>
      <Footer />
    </div>
  );
}
