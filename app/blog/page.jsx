"use client";

import Image from "next/image";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import { useRouter } from "next/navigation";
import Nothing from "@/app/components/Nothing";
import { useBlogStore } from "@/app/store/Blog";
import styles from "@/app/style/blog.module.css";
import SideSlide from "@/app/components/SideSlide";
import LoadingLogo from "@/app/components/LoadingLogo";
import ArticleCard from "@/app/components/BlogCard";
import EmptyBlogImage from "@/public/assets/emptyblog.png";
import { useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { FaFacebookF, FaInstagram, FaRegClock } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoSearchOutline as SearchIcon } from "react-icons/io5";

export default function Blog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    blogs,
    featuredBlogs,
    categories: storeCategories,
    singleBlog,
    loading,
    error,
    fetchBlogs,
    fetchFeaturedBlogs,
    fetchCategories,
    fetchSingleBlog,
  } = useBlogStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const searchTimeoutRef = useRef(null);
  const initialLoadRef = useRef(true);

  const createSlug = useCallback((title) => {
    if (!title) return "";
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, []);

  // Helper function to get author name
  const getAuthorName = (post) => {
    return post.author || post.author || "Unknown Author";
  };

  const getFormattedDate = (post) => {
    return (
      post.formattedDate ||
      new Date(post.publishedAt || post.createdAt).toLocaleDateString()
    );
  };

  const getReadTime = (post) => {
    return post.readTime || "5 min read";
  };

  const createShareUrl = (post) => {
    const slug = createSlug(post.title);
    return `${window.location.origin}${pathname}?blog=${slug}`;
  };

  const findBlogBySlug = useCallback(
    (slug) => {
      if (!slug) return null;

      const allBlogs = [...blogs, ...featuredBlogs];
      return allBlogs.find((blog) => createSlug(blog.title) === slug);
    },
    [blogs, featuredBlogs, createSlug]
  );

  const performSearch = useCallback(
    async (category = "", tag = "", query = "") => {
      setIsSearching(true);
      try {
        await fetchBlogs(category, tag, query);
      } catch (err) {
        toast.error("Search failed. Please try again.");
      } finally {
        setIsSearching(false);
      }
    },
    [fetchBlogs]
  );

  const openModal = useCallback(
    async (post, updateUrl = true) => {
      try {
        let postToShow = post;

        if (post._id) {
          try {
            const detailedPost = await fetchSingleBlog(post._id);
            postToShow = detailedPost || post;
          } catch (fetchError) {
            postToShow = post;
          }
        }

        setSelectedPost(postToShow);
        setShowModal(true);
        document.body.style.overflow = "hidden";

        if (updateUrl) {
          const slug = createSlug(post.title);
          router.replace(`${pathname}?blog=${slug}`, undefined, {
            shallow: true,
          });
        }
      } catch (err) {
        toast.error("Failed to load blog post details");
        setSelectedPost(post);
        setShowModal(true);
        document.body.style.overflow = "hidden";
      }
    },
    [fetchSingleBlog, router, pathname, createSlug]
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedPost(null);
    document.body.style.overflow = "auto";

    const currentParams = searchParams.get("blog");
    if (currentParams) {
      router.replace(pathname, undefined, { shallow: true });
    }
  }, [searchParams, router, pathname]);

  const debouncedSearch = useCallback(
    (query) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        performSearch("", "", query);
      }, 300);
    },
    [performSearch]
  );

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchBlogs(),
          fetchFeaturedBlogs(),
          fetchCategories(),
        ]);
        initialLoadRef.current = false;
      } catch (err) {
        toast.error("Failed to load initial blog data");
      }
    };

    if (initialLoadRef.current) {
      loadInitialData();
    }
  }, [fetchBlogs, fetchCategories, fetchFeaturedBlogs]);

  useEffect(() => {
    const sharedBlogSlug = searchParams.get("blog");
    if (
      sharedBlogSlug &&
      (blogs.length > 0 || featuredBlogs.length > 0) &&
      !showModal
    ) {
      const sharedPost = findBlogBySlug(sharedBlogSlug);

      if (sharedPost) {
        openModal(sharedPost, false);
      } else {
        toast.error("Blog post not found");
        router.replace(pathname, undefined, { shallow: true });
      }
    }
  }, [
    searchParams,
    blogs,
    featuredBlogs,
    showModal,
    openModal,
    findBlogBySlug,
    router,
    pathname,
  ]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    } else if (searchQuery === "") {
      performSearch(activeCategory, "", "");
    }
  }, [searchQuery, debouncedSearch, performSearch, activeCategory]);

  useEffect(() => {
    if (activeCategory && !searchQuery) {
      performSearch(activeCategory, "", "");
    }
  }, [activeCategory, performSearch, searchQuery]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) closeModal();
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [closeModal]);

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (category) => {
    try {
      if (activeCategory === category) {
        setActiveCategory("");
        performSearch("", "", searchQuery);
      } else {
        setActiveCategory(category);
        if (searchQuery) {
          setSearchQuery("");
        }
      }
    } catch (err) {
      toast.error("Failed to filter by category");
    }
  };

  const handleShare = async (post) => {
    try {
      const shareUrl = createShareUrl(post);

      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Blog link copied to clipboard");
      }
    } catch (err) {
      toast.error("Failed to share post");
    }
  };

  const handleSocialShare = async (platform, post) => {
    try {
      const shareUrl = createShareUrl(post);
      const url = encodeURIComponent(shareUrl);
      const text = encodeURIComponent(`${post.title} - ${post.excerpt}`);

      const socialUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        instagram: null, // Special case
      };

      if (platform === "instagram") {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Blog link copied! You can now paste it on Instagram");
        return;
      }

      const socialShareUrl = socialUrls[platform];
      if (!socialShareUrl) {
        throw new Error("Unsupported platform");
      }

      window.open(socialShareUrl, "_blank", "width=600,height=400");
    } catch (err) {
      toast.error("Failed to share on social media");
    }
  };

  const openTelegram = () => {
    window.open("https://t.me/sportyPredictTG", "_blank");
  };

  const renderPostMeta = (post) => (
    <div className={styles.articleMeta}>
      <span>By {getAuthorName(post)}</span>
      <div className={styles.dateAndTime}>
        <span>
          <FaRegClock /> {getReadTime(post)}
        </span>
        <span>{getFormattedDate(post)}</span>
      </div>
    </div>
  );

  const renderSocialShareButtons = (post) => (
    <div className={styles.socialShareLinks}>
      {["facebook", "twitter", "instagram"].map((platform) => {
        const icons = {
          facebook: FaFacebookF,
          twitter: FaXTwitter,
          instagram: FaInstagram,
        };
        const Icon = icons[platform];

        return (
          <button
            key={platform}
            onClick={() => handleSocialShare(platform, post)}
            aria-label={`Share on ${platform}`}
            className={styles.socialIconBtn}
          >
            <Icon
              className={styles.socialIcon}
              alt={platform}
              aria-label={platform}
            />
          </button>
        );
      })}
    </div>
  );

  const renderBlogHeader = () => (
    <div className={styles.blogBanner}>
      <div className={styles.blogHeader}>
        <div className={styles.blogContent}>
          <h1>Insights Blog</h1>
          <p>Expert insights, analysis and thoughts to educate and inform.</p>
        </div>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={handleSearchInput}
            aria-label="Search blog posts"
            className={styles.searchInput}
          />
          <SearchIcon
            aria-label="search"
            alt="search"
            className={styles.searchIcon}
          />
        </div>
      </div>
    </div>
  );

  const renderTelegramSection = () => (
    <div className={styles.telegramContent}>
      <div className={styles.telegramCard}>
        <h2>Join Our Telegram Community</h2>
        <p>
          Get exclusive access to expert insights, premium content, and connect
          with fellow readers.
        </p>
        <button className={styles.telegramButton} onClick={openTelegram}>
          Join us
        </button>
      </div>
    </div>
  );

  const renderEmptyState = () => {
    const getEmptyMessage = () => {
      if (searchQuery) return `No blog posts found for "${searchQuery}"`;
      if (activeCategory)
        return `No blog posts found in "${activeCategory}" category`;
      return "No blog posts available";
    };

    return (
      <div className={styles.blogContainer}>
        {renderBlogHeader()}
        <div className={styles.nothingContainer}>
          <Nothing
            Alt="No blog posts"
            NothingImage={EmptyBlogImage}
            Text={getEmptyMessage()}
          />
        </div>
        {renderTelegramSection()}
      </div>
    );
  };

  const renderModalContent = () => {
    if (!selectedPost) return null;

    return (
      <div className={styles.sideSlideContent}>
        <div className={styles.sideSlideContentHeader}>
          {selectedPost.tags && selectedPost.tags.length > 0 && (
            <div className={styles.articleTags}>
              {selectedPost.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          )}
          {renderSocialShareButtons(selectedPost)}
        </div>

        <div className={styles.sideSlideImageContainer}>
          <Image
            className={styles.sideSlideImage}
            src={selectedPost.image}
            alt={selectedPost.title}
            fill
            sizes="100%"
            quality={100}
            style={{ objectFit: "cover" }}
            priority={true}
          />
        </div>

        <div className={styles.sideSlideInnerContentDetails}>
          <div className={styles.authorContainer}>
            <span className={styles.category}>{selectedPost.category}</span>
            <span>By {getAuthorName(selectedPost)}</span>
          </div>
          <h1 className={styles.sideSlideTitle}>{selectedPost.title}</h1>
          <div
            className={styles.sideSlideInnerContent}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(selectedPost.content),
            }}
          />
        </div>

        <div className={styles.SideSlideFooter}>
          <div className={styles.dateAndTime}>
            <span>
              <FaRegClock /> {getReadTime(selectedPost)}
            </span>
          </div>
          <span>{getFormattedDate(selectedPost)}</span>
        </div>
      </div>
    );
  };

  const featuredPost = featuredBlogs.length > 0 ? featuredBlogs[0] : null;
  const categories = storeCategories.map((cat) => cat.name || cat);

  if (loading && blogs.length === 0 && !featuredPost && !isSearching) {
    return <LoadingLogo />;
  }

  if (blogs.length === 0 && !featuredPost && !loading && !isSearching) {
    return renderEmptyState();
  }

  return (
    <div className={styles.blogContainer}>
      {renderBlogHeader()}

      <div className={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => handleCategoryClick(category)}
            className={`${styles.categoryCard} ${
              activeCategory === category ? styles.activeCategory : ""
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.categoriesInnerContainer}>
        {featuredPost && !searchQuery && !activeCategory && (
          <div className={styles.featuredArticle}>
            <div className={styles.featuredImageWrapper}>
              <Image
                className={styles.featuredImage}
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                sizes="100%"
                quality={100}
                style={{ objectFit: "cover" }}
                priority={true}
              />
            </div>
            <div className={styles.featuredContent}>
              <div className={styles.category}>{featuredPost.category}</div>
              <h2>{featuredPost.title}</h2>
              <p>{featuredPost.excerpt}</p>
              {renderPostMeta(featuredPost)}
              <button
                onClick={() => openModal(featuredPost)}
                className={styles.readMoreBtn}
              >
                Read Full Article
              </button>
            </div>
          </div>
        )}

        <div className={styles.blogMainContent}>
          <h2>Latest Blog Posts</h2>

          {isSearching ? (
            <div className={styles.nothingContainer}>
              <LoadingLogo />
            </div>
          ) : (
            <div className={styles.articlesContent}>
              {blogs.map((post) => (
                <ArticleCard
                  key={post._id}
                  post={post}
                  onReadMore={openModal}
                  onShare={handleShare}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {renderTelegramSection()}

      <SideSlide
        isOpen={showModal}
        onClose={closeModal}
        closeOnOverlayClick={true}
        showCloseButton={true}
      >
        {renderModalContent()}
      </SideSlide>
    </div>
  );
}
