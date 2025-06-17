import Image from "next/image";
import { toast } from "sonner";
import { IoMdShare } from "react-icons/io";
import { FaRegClock } from "react-icons/fa";
import styles from "@/app/style/articleCard.module.css";
import { IoReaderOutline as ReadIcon } from "react-icons/io5";

export default function ArticleCard({
  post,
  onReadMore,
  onShare,
  className = "",
}) {
  const handleImageError = () => {
    toast.error(`Failed to load image for: ${post.title}`);
  };

  const handleReadMore = () => {
    if (onReadMore) {
      onReadMore(post);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(post);
    }
  };

  return (
    <div className={`${styles.articleCard} ${className}`}>
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
        {post.tags.length > 0 && (
          <div className={styles.articleTags}>
            {post.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}
        <div className={styles.articleHeader}>
          <span>{post.category}</span>
          <IoMdShare
            onClick={handleShare}
            className={styles.shareIcon}
            alt="Share icon"
            aria-label="Share icon"
          />
        </div>

        <h3>{post.title}</h3>
        <div className={styles.articleInnerContent}>
          <p>{post.excerpt}</p>
        </div>
        <div className={styles.articleMeta}>
          <div onClick={handleReadMore} className={styles.readMoreBtn}>
            <ReadIcon
              className={styles.readMoreIcon}
              alt="Read more icon"
              aria-label="Read more icon"
            />{" "}
            Read More
          </div>
        </div>
        <div className={styles.articleFooter}>
          <span className={styles.readTime}>
            <FaRegClock /> {post.readTime}
          </span>

          <span className={styles.date}>
            {post.formattedDate ||
              new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
