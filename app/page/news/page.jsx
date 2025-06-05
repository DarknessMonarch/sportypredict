"use client";

import { toast } from "sonner";
import Image from "next/image";
import DOMPurify from "dompurify";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Nothing from "@/app/components/Nothing";
import { useNewsStore } from "@/app/store/News";
import SideSlide from "@/app/components/SideSlide";
import LoadingLogo from "@/app/components/LoadingLogo";
import NewsCard from "@/app/components/NewsCard";
import Dropdown from "@/app/components/Dropdown";
import styles from "@/app/style/blog.module.css";
import EmptyNewsImg from "@/public/assets/emptynews.png";

import { FaFacebookF, FaInstagram, FaRegClock } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoSearchOutline as SearchIcon } from "react-icons/io5";

export default function SportsNews() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    articles,
    loading,
    error,
    categories,
    fetchArticles,
    fetchNewsByCategory,
    clearError,
  } = useNewsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const searchTimeoutRef = useRef(null);
  const initialLoadRef = useRef(true);

  const createSlug = (title) => {
    if (!title) return "";
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const findArticleBySlug = (slug) => {
    if (!slug) return null;
    return articles.find((article) => createSlug(article.title) === slug);
  };

  const openModal = useCallback(
    async (post, updateUrl = true) => {
      try {
        setSelectedPost(post);
        setShowModal(true);

        if (updateUrl) {
          const slug = createSlug(post.title);
          router.replace(`${pathname}?article=${slug}`, undefined, {
            shallow: true,
          });
        }
      } catch (err) {
        toast.error("Failed to load article details");
        setSelectedPost(post);
        setShowModal(true);
        document.body.style.overflow = "hidden";
      }
    },
    [router, pathname]
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedPost(null);
    const currentParams = searchParams.get("article");
    if (currentParams) {
      router.replace(pathname, undefined, { shallow: true });
    }
  }, [searchParams, router, pathname]);

  const debouncedSearch = useCallback(
    (query) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          await fetchArticles(1, 1000, query, false, "", "-publishDate");
        } catch (err) {
          toast.error("Search failed. Please try again.");
        } finally {
          setIsSearching(false);
        }
      }, 300);
    },
    [fetchArticles]
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchArticles(1, 1000, "", false, "", "-publishDate");
        initialLoadRef.current = false;
      } catch (err) {
        toast.error("Failed to load initial news data");
      }
    };

    if (initialLoadRef.current) {
      loadInitialData();
    }
  }, [fetchArticles]);

  useEffect(() => {
    const sharedArticleSlug = searchParams.get("article");
    if (sharedArticleSlug && articles.length > 0 && !showModal) {
      const sharedPost = articles.find(
        (article) => createSlug(article.title) === sharedArticleSlug
      );

      if (sharedPost) {
        openModal(sharedPost, false);
      } else {
        toast.error("Article not found");
        router.replace(pathname, undefined, { shallow: true });
      }
    }
  }, [articles, searchParams, showModal, openModal, router, pathname]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    } else if (searchQuery === "") {
      setIsSearching(true);
      fetchArticles(1, 1000, "", false, activeCategory, "-publishDate").finally(
        () => setIsSearching(false)
      );
    }
  }, [searchQuery, debouncedSearch, fetchArticles, activeCategory]);

  useEffect(() => {
    if (activeCategory && !searchQuery) {
      setIsSearching(true);
      fetchNewsByCategory(activeCategory, 1, 1000).finally(() =>
        setIsSearching(false)
      );
    }
  }, [activeCategory, fetchNewsByCategory, searchQuery]);

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (category) => {
    try {
      if (activeCategory === category.name) {
        setActiveCategory("");
        setIsSearching(true);
        fetchArticles(1, 1000, searchQuery, false, "", "-publishDate").finally(
          () => setIsSearching(false)
        );
      } else {
        setActiveCategory(category.name);
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
      const slug = createSlug(post.title);
      const shareUrl = `${window.location.origin}${pathname}?article=${slug}`;

      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.summary || "Check out this sports news article",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Article link copied to clipboard");
      }
    } catch (err) {
      toast.error("Failed to share post");
    }
  };

  const handleSocialShare = async (platform, post) => {
    try {
      const slug = createSlug(post.title);
      const shareUrl = `${window.location.origin}${pathname}?article=${slug}`;
      const url = encodeURIComponent(shareUrl);
      const text = encodeURIComponent(
        `${post.title} - ${post.summary || "Sports News"}`
      );

      let socialShareUrl = "";
      switch (platform) {
        case "facebook":
          socialShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          break;
        case "twitter":
          socialShareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
          break;
        case "instagram":
          await navigator.clipboard.writeText(shareUrl);
          toast.success(
            "Article link copied! You can now paste it on Instagram"
          );
          return;
        default:
          throw new Error("Unsupported platform");
      }

      window.open(socialShareUrl, "_blank", "width=600,height=400");
    } catch (err) {
      toast.error("Failed to share on social media");
    }
  };

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

  const categoryOptions = categories.map((category) => ({
    name: category,
    code: category,
  }));

  const formatCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (loading && articles.length === 0 && !isSearching) {
    return <LoadingLogo />;
  }

  if (articles.length === 0 && !loading && !isSearching) {
    return (
      <div className={styles.blogContainer}>
        <div className={styles.blogBanner}>
          <div className={styles.blogHeader}>
            <div className={styles.blogContent}>
              <h1>Sports News</h1>
              <p>Your ultimate source for sports news and updates</p>
            </div>

            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={handleSearchInput}
                aria-label="Search news"
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
        <Nothing
          Alt="No news available"
          NothingImage={EmptyNewsImg}
          Text={
            searchQuery
              ? `No news found for "${searchQuery}"`
              : activeCategory
              ? `No news found in "${activeCategory}" category`
              : "No news available"
          }
        />
      </div>
    );
  }

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
          <div className={styles.socialShareLinks}>
            <button
              onClick={() => handleSocialShare("facebook", selectedPost)}
              aria-label="Share on Facebook"
              className={styles.socialIconBtn}
            >
              <FaFacebookF
                className={styles.socialIcon}
                alt="facebook"
                aria-label="facebook"
              />
            </button>
            <button
              onClick={() => handleSocialShare("twitter", selectedPost)}
              aria-label="Share on Twitter"
              className={styles.socialIconBtn}
            >
              <FaXTwitter
                className={styles.socialIcon}
                alt="twitter"
                aria-label="twitter"
              />
            </button>
            <button
              onClick={() => handleSocialShare("instagram", selectedPost)}
              aria-label="Share on Instagram"
              className={styles.socialIconBtn}
            >
              <FaInstagram
                className={styles.socialIcon}
                alt="instagram"
                aria-label="instagram"
              />
            </button>
          </div>
        </div>
        <div className={styles.sideSlideImageContainer}>
          <Image
            className={styles.sideSlideImage}
            src={selectedPost.image}
            alt={selectedPost.title}
            fill
            sizes="100%"
            quality={100}
            style={{
              objectFit: "cover",
            }}
            priority={true}
          />
        </div>
        <div className={styles.sideSlideInnerContentDetails}>
          <div className={styles.authorContainer}>
            <span className={styles.category}>
              {formatCategory(selectedPost.category)}
            </span>

            <span>
              By{" "}
              {selectedPost.authorName ||
                selectedPost.author?.username ||
                "Unknown Author"}
            </span>
          </div>
          <h2>{selectedPost.title}</h2>
          <div
            className={styles.sideSlideInnerContent}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                selectedPost.content || selectedPost.summary
              ),
            }}
          ></div>
        </div>

        <div className={styles.SideSlideFooter}>
          <div className={styles.dateAndTime}>
            <span>
              <FaRegClock /> {selectedPost.readTime || "5 min read"}
            </span>
          </div>
          <span>
            {selectedPost.formattedDate ||
              new Date(
                selectedPost.publishDate || selectedPost.createdAt
              ).toLocaleDateString()}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.blogContainer}>
      <div className={styles.blogBanner}>
        <div className={styles.blogHeader}>
          <div className={styles.blogContent}>
            <h1>Sports News</h1>
            <p>Your ultimate source for sports news and updates</p>
          </div>

          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={handleSearchInput}
              aria-label="Search news"
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

      <div className={styles.dropdownContainerWp}>
        <h2>Latest Sports News</h2>
        <div className={styles.dropdownContainerInner}>
          <Dropdown
            options={categoryOptions}
            onSelect={handleCategorySelect}
            dropPlaceHolder={activeCategory || "All Categories"}
          />
        </div>
      </div>
      <div className={styles.blogMainContent}>

        {isSearching ? (
          <LoadingLogo />
        ) : (
          <div className={styles.articlesContent}>
            {articles.map((post) => (
              <NewsCard
                key={post._id}
                post={post}
                onReadMore={openModal}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </div>

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