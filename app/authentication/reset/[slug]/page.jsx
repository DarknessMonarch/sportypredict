"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import styles from "@/app/style/auth.module.css";
import logoImage from "@/public/assets/logo.png";
import footballImage from "@/public/assets/football.jpg";


import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";

import {
  MdOutlineVpnKey as PasswordIcon,
} from "react-icons/md";

export default function Reset() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const toggleConfirmPassword = () => {
    setConfirmPassword(!showConfirmPassword);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };


  const readTerms = () => {
    router.push("/page/terms", { scroll: false });
  };

  const Login = () => {
    router.push("login", { scroll: false });
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

      toast.success("Reset link successful");

      router.push("/page/login ", { scroll: false });
    } catch (error) {
      console.error(error);
      toast.error("Reset failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.authComponent}>
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
            <h1>Reset Password</h1>
            <p>Enter your new Password</p>
          </div>

          {/*  password */}

          <div className={styles.authInput}>
            <PasswordIcon
              className={styles.authIcon}
              alt="password icon"
              width={24}
              height={24}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="Password"
              id="Password"
              placeholder="New Password"
            />
            <button
              type="button"
              className={styles.showBtn}
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <ShowPasswordIcon
                  className={styles.authIcon}
                  width={24}
                  height={24}
                />
              ) : (
                <HidePasswordIcon
                  className={styles.authIcon}
                  width={24}
                  height={24}
                />
              )}
            </button>
          </div>
          {/* confirm password */}

          <div className={styles.authInput}>
            <PasswordIcon
              className={styles.authIcon}
              alt="confirm password"
              width={24}
              height={24}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm Password"
            />
            <button
              type="button"
              className={styles.showBtn}
              onClick={toggleConfirmPassword}
            >
              {showConfirmPassword ? (
                <ShowPasswordIcon
                  className={styles.authIcon}
                  width={24}
                  height={24}
                />
              ) : (
                <HidePasswordIcon
                  className={styles.authIcon}
                  width={24}
                  height={24}
                />
              )}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.formAuthButton}
          >
            {isLoading ? <Loader /> : "Reset "}
          </button>

          {/* Login */}
          <h3>
            Already have an account?{" "}
            <div className={styles.btnLoginContainer} onClick={Login}>
              Login
            </div>
          </h3>
        </form>
      </div>
      <div className={styles.authComponentBgImage}>
        <Image
          className={styles.advertImage}
          src={footballImage}
          alt="auth image"
          layout="fill"
          quality={100}
          objectFit="cover"
          priority
        />
        <div className={styles.authText}>Thank you for being apart of us</div>
      </div>
    </div>
  );
}
