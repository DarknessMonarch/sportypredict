"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/style/auth.module.css";
import logoImage from "@/public/assets/logo.png";
import basketballImage from "@/public/assets/basketball.jpg";


import {
 
  MdOutlineEmail as EmailIcon,
} from "react-icons/md";


export default function Forgot() {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuth, toggleAuth } = useAuthStore();
  const [terms, setTerms] = useState(false);

  const router = useRouter();

  const Login = () => {
    router.push("login", { scroll: false });
  };

  const policy = () => {
    router.push("/page/policy", { scroll: false });
  };

  const readTerms = () => {
    router.push("/page/terms", { scroll: false });
  };

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      // const response = await fetch("/api/submit", {
      //   method: "POST",
      //   body: formData,
      // });

      toast.success("check your email for reset link");
      router.push("reset", { scroll: false });
    } catch (error) {
      console.error(error);
      toast.error("reset failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.authComponent}>
      <div className={styles.authComponentBgImage}>
        <Image
          className={styles.advertImage}
          src={basketballImage}
          alt="auth image"
          layout="fill"
          quality={100}
          objectFit="cover"
          priority
        />
        <div className={styles.authText}>
          Don&apos;t gamble, invest with us instead
        </div>
      </div>
      <div className={styles.authWrapper}>
        <form onSubmit={onSubmit} className={styles.formContainer}>
          <div className={styles.formHeader}>
            <div className={styles.authLogo}>
              <Image
                className={styles.authLogoImage}
                src={logoImage}
                alt="logo"
                width={60}
                height={60}
              />
            </div>
            <h1>Forgot Password</h1>
            <p>Enter your email to recieve the reset link</p>
          </div>
          {/* Email */}

          <div className={styles.authInput}>
            <EmailIcon
              className={styles.authIcon}
              alt="Email icon"
              width={20}
              height={20}
            />
            <input type="text" name="Email" id="Email" placeholder="Email" />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.formAuthButton}
          >
            {isLoading ? <Loader /> : "Request reset"}
          </button>
          <h3>
            Remember your password?{" "}
            <div className={styles.btnLoginContainer} onClick={Login}>
              Login
            </div>
          </h3>
        </form>
      </div>
    </div>
  );
}
