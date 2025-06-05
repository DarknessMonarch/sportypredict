import Image from "next/image";
import { IoMdShare } from "react-icons/io";
import styles from "@/app/style/articleCard.module.css";
import { IoReaderOutline as ReadIcon } from "react-icons/io5";

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
        <h3>{post.title}</h3>
        <p>{post.summary}</p>
        <div className={styles.articleMeta}>
          <span>
            By {post.authorName || post.author?.username || "Unknown Author"}
          </span>
        </div>
        <div className={styles.articleFooter}>
          <div onClick={() => onReadMore(post)} className={styles.readMoreBtn}>
            <ReadIcon
              className={styles.readMoreIcon}
              alt="Read more icon"
              aria-label="Read more icon"
            />{" "}
            Read More
          </div>
          <div className={styles.dateAndTime}>
            <span>
              {post.formattedDate ||
                new Date(
                  post.publishDate || post.createdAt
                ).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
