import Image from "next/image";
import styles from "@/app/style/loadingLogo.module.css";
import AnimatedLogo from "@/public/assets/logo.gif";

export default function Loading() {
  return (
    <div className={styles.loadingComponent}>
      <Image
        className={styles.loadingImg}
        src={AnimatedLogo}
        alt="Animated Logo "
        height={300}
        optimize="false"
        priority={true}

      />
    </div>
  );
}
