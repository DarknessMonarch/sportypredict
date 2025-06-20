import Image from "next/image";
import { IoMdShare } from "react-icons/io";
import styles from "@/app/style/newsCard.module.css";

export default function NewsCard({ post, onReadMore, onShare }) {
  return (
    <div className={styles.articleCard}>
      <div className={styles.articleImageWrapper}>
        <Image
          className={styles.articleImage}
          src={post.image}
          alt={post.title}
          fill
          sizes="100%"
          quality={100}
          style={{
            objectFit: "cover",
          }}
          priority={true}
        />
        <div className={styles.dateAndTime}>
          <span>
            {post.formattedDate ||
              new Date(post.publishDate || post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className={styles.articleContent}>
        <div className={styles.articleHeader}>
          <span>{post.category}</span>
          <IoMdShare
            onClick={() => onShare(post)}
            className={styles.shareIcon}
            alt="Share icon"
            aria-label="Share icon"
          />
        </div>
        <h3>{post.title} <div onClick={() => onReadMore(post)} className={styles.readMoreBtn}>
            Read More
          </div></h3>
      </div>
    </div>
  );
}
