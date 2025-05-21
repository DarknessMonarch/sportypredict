"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/Auth";
import logoImage from "@/public/assets/logo.png";
import styles from "@/app/style/auth.module.css";
import sportsImage from "@/public/assets/sports.png";


import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";

import { FaRegUser as UserNameIcon } from "react-icons/fa6";
import {
  MdOutlineVpnKey as PasswordIcon,
  
} from "react-icons/md";


export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuth, toggleAuth } = useAuthStore();
  const [terms, setTerms] = useState(false);

  const router = useRouter();

  const handleTermsChange = (event) => {
    setTerms(event.target.checked);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const forgotPassword = () => {
    router.push("forgot", { scroll: false });
  };
  const readTerms = () => {
    router.push("/page/terms", { scroll: false });
  };

  const SignUp = () => {
    router.push("signup", { scroll: false });
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

      toggleAuth();
      toast.success("Welcome");
      router.push("/page/football", { scroll: false });
    } catch (error) {
      console.error(error);
      toast.error("Sign up failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.authComponent}>
      <div className={styles.authComponentBgImage}>
        <Image
          className={styles.advertImage}
          src={sportsImage}
          alt="auth image"
          layout="fill"
          quality={100}
          objectFit="contain"
          priority
        />
        <div className={styles.authText}>
          Invest with our vip for guranteed wins
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
            <h1>Welcome back</h1>
            <p>Enter your account details</p>
          </div>
          {/* Username */}
          <div className={styles.authInput}>
            <UserNameIcon
              className={styles.authIcon}
              alt="Username icon"
              width={20}
              height={20}
            />
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
            />
          </div>
          {/*  password */}

          <div className={styles.authInput}>
            <PasswordIcon
              className={styles.authIcon}
              alt="password icon"
              width={20}
              height={20}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="Password"
              id="Password"
              placeholder="Password"
            />
            <button
              type="button"
              className={styles.showBtn}
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <HidePasswordIcon
                  className={styles.authIcon}
                  width={20}
                  height={20}
                />
              ) : (
                <ShowPasswordIcon
                  className={styles.authIcon}
                  width={20}
                  height={20}
                />
              )}
            </button>
          </div>
          {/* Terms and Forgot Password */}
          <div className={styles.formChange}>
            <div className={styles.termsContainer}>
              <input
                type="checkbox"
                id="terms"
                checked={terms}
                onChange={handleTermsChange}
              />
              <label htmlFor="terms">Accept terms and conditions</label>
            </div>
            <span onClick={forgotPassword}>Forgot Password</span>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.formAuthButton}
          >
            {isLoading ? <Loader /> : "Login"}
          </button>
          <h3>
            Don’t have an account?{" "}
            <div className={styles.btnLoginContainer} onClick={SignUp}>
              Sign up
            </div>
          </h3>
        </form>
      </div>
    </div>
  );
}
