"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/Auth";
import logoImage from "@/public/assets/logo.png";
import styles from "@/app/style/auth.module.css";
import sportsImage from "@/public/assets/sports.png";
import { MdOutlineEmail as EmailIcon } from "react-icons/md";

export default function ResetCodeX() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const requestPasswordReset = useAuthStore(
    (state) => state.requestPasswordReset
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    setIsLoading(true);

    try {
      const result = await requestPasswordReset(email);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while requesting password reset");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push("/login"); // Adjust the path as needed
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
        <div className={styles.authText}>
          Don&apos;t gamble, invest with us instead
        </div>
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
            <h1>Forgot Password</h1>
            <p>Enter your email to recieve the reset link</p>
          </div>

          <div className={styles.authInput}>
            <EmailIcon
              className={styles.authIcon}
              alt="Email icon"
              width={20}
              height={20}
            />
            <input
              type="email"
              name="Email"
              id="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
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
            <div className={styles.btnLoginContainer} onClick={handleLogin}>
              Login
            </div>
          </h3>
        </form>
      </div>
    </div>
  );
}