"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/Auth";
import logoImage from "@/public/assets/logo.png";
import styles from "@/app/style/auth.module.css";
import Dropdown from "@/app/components/Dropdown";
import sportsImage from "@/public/assets/sports.png";
import CountriesData from "@/app/utility/Countries";


import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";
import { BiWorld as CountryIcon } from "react-icons/bi";
import { FaRegUser as UserNameIcon } from "react-icons/fa6";
import {
  MdOutlineVpnKey as PasswordIcon,
  MdOutlineEmail as EmailIcon,
} from "react-icons/md";


export default function SignUp() {
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuth, toggleAuth } = useAuthStore();
  const [terms, setTerms] = useState(false);

  const router = useRouter();

  const handleTermsChange = (event) => {
    setTerms(event.target.checked);
  };

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

      toggleAuth();
      toast.success("Welcome back");
      router.push("/page/football", { scroll: false });
    } catch (error) {
      console.error(error);
      toast.error("Login failed");
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
            <h1>Welcome</h1>
            <p>Enter your account details</p>
          </div>

          {/* Name */}
          <div className={styles.authInput}>
            <UserNameIcon className={styles.authIcon} width={24} height={24} />
            <input type="text" name="Name" id="Name" placeholder="Full name" />
          </div>

          {/* Email */}
          <div className={styles.authInput}>
            <EmailIcon className={styles.authIcon} width={24} height={24} />
            <input type="email" name="Email" id="Email" placeholder="Email" />
          </div>

          {/* Country */}
          <div className={styles.authInput}>
            <Dropdown
              options={CountriesData}
              Icon={
                <CountryIcon
                  className={styles.authIcon}
                  width={24}
                  height={24}
                />
              }
              dropPlaceHolder="Choose your country"
              onSelect={setSelectedCountry}
            />
          </div>

          {/* Password */}
          <div className={styles.authInput}>
            <PasswordIcon className={styles.authIcon} width={24} height={24} />
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
              aria-label="Toggle password visibility"
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

          {/* Confirm Password */}
          <div className={styles.authInput}>
            <PasswordIcon className={styles.authIcon} width={24} height={24} />
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
              aria-label="Toggle confirm password visibility"
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

          <div className={styles.termsContainer}>
            <input
              type="checkbox"
              id="terms"
              checked={terms}
              onChange={handleTermsChange}
            />
            <label htmlFor="terms">Accept terms and conditions</label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={styles.formAuthButton}
          >
            {isLoading ? <Loader /> : "Sign up"}
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

      {/* Background Image and Text */}
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
          Each tip is a stepping stone to success.
        </div>
      </div>
    </div>
  );
}
