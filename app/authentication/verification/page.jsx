"use client";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import logoImage from "@/public/assets/logo.png";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/style/auth.module.css";
import sportsImage from "@/public/assets/sports.png";
import { BsQrCode as VerificationIcon } from "react-icons/bs";

export default function Verify() {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { verifyEmail, email } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyEmail(email, verificationCode);

      if (result.success) {
        toast.success(result.message);
        router.push("/page/football", { scroll: false });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authComponent}>
      <div className={styles.authComponentBgImage}>
        <Image
          className={styles.advertImage}
          src={sportsImage}
          alt="auth image"
          fill
          sizes="100%"
          quality={100}
          style={{
            objectFit: "contain",
          }}
          priority={true}
        />
        <div className={styles.authText}>Each tip is an investment.</div>
      </div>
      <div className={styles.authWrapper}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
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
            <h1>Verify your account</h1>
            <p>Check your email for verification code</p>
          </div>

          <div className={styles.authInput}>
            <VerificationIcon
              className={styles.authIcon}
              alt="Verification code icon"
              width={20}
              height={20}
            />
            <input
              type="text"
              name="verificationCode"
              id="verificationCode"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.trim())}
              maxLength={6}
              required
              pattern=".{6,6}"
              title="Verification code must be exactly 6 characters long"
            />
          </div>
          <div className={styles.authBottomBtn}>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.formAuthButton}
            >
              {isLoading ? <Loader /> : "Verify your account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
