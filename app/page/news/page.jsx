"use client";

import { toast } from "sonner";
import Image from "next/image";
import DOMPurify from "dompurify";
import { FaXTwitter } from "react-icons/fa6";
import Nothing from "@/app/components/Nothing";
import { useNewsStore } from "@/app/store/News";
import SideSlide from "@/app/components/SideSlide";
import NewsCard from "@/app/components/NewsCard";
import Dropdown from "@/app/components/Dropdown";
import styles from "@/app/style/blog.module.css";
import LoadingLogo from "@/app/components/LoadingLogo";
import EmptyNewsImg from "@/public/assets/emptynews.png";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FaFacebookF, FaInstagram, FaRegClock } from "react-icons/fa";
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
    searchNews,
    clearError,
  } = useNewsStore();

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

  const getAuthorName = (post) => {
    return post.authorName || post.author?.username || "Unknown Author";
  };

  const getFormattedDate = (post) => {
    return post.formattedDate ||
      new Date(post.publishDate || post.createdAt).toLocaleDateString();
  };

  const getReadTime = (post) => {
    return post.readTime || "5 min read";
  };

  const formatCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const createShareUrl = (post) => {
    const slug = createSlug(post.title);
    return `${window.location.origin}${pathname}?article=${slug}`;
  };

  const findArticleBySlug = useCallback((slug) => {
    if (!slug) return null;
    return articles.find((article) => createSlug(article.title) === slug);
  }, [articles, createSlug]);

  const loadData = useCallback(async (category = "", search = "") => {
    setIsSearching(true);
    try {
      if (search && search.trim() !== "") {
        await searchNews(search.trim());
      } else if (category && category !== "") {
        await fetchNewsByCategory(category);
      } else {
        await fetchArticles();
      }
    } catch (err) {
      toast.error("Failed to load articles");
    } finally {
      setIsSearching(false);
    }
  }, [fetchArticles, fetchNewsByCategory, searchNews]);

  const openModal = useCallback(
    async (post, updateUrl = true) => {
      try {
        setSelectedPost(post);
        setShowModal(true);
        document.body.style.overflow = "hidden";

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
    [router, pathname, createSlug]
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedPost(null);
    document.body.style.overflow = "auto";
    
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

      searchTimeoutRef.current = setTimeout(() => {
        loadData("", query);
      }, 300);
    },
    [loadData]
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await loadData(); 
        initialLoadRef.current = false;
      } catch (err) {
        toast.error("Failed to load initial news data");
      }
    };

    if (initialLoadRef.current) {
      loadInitialData();
    }
  }, [loadData]);

  useEffect(() => {
    const sharedArticleSlug = searchParams.get("article");
    if (sharedArticleSlug && articles.length > 0 && !showModal) {
      const sharedPost = findArticleBySlug(sharedArticleSlug);

      if (sharedPost) {
        openModal(sharedPost, false);
      } else {
        toast.error("Article not found");
        router.replace(pathname, undefined, { shallow: true });
      }
    }
  }, [articles, searchParams, showModal, openModal, findArticleBySlug, router, pathname]);

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
      loadData(activeCategory, "");
    }
  }, [searchQuery, debouncedSearch, loadData, activeCategory]);

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

  const handleCategorySelect = (category) => {
    try {
      const newCategory = activeCategory === category.name ? "" : category.name;
      setActiveCategory(newCategory);
      
      if (searchQuery) {
        setSearchQuery("");
      }
      
      loadData(newCategory, "");
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
      const shareUrl = createShareUrl(post);
      const url = encodeURIComponent(shareUrl);
      const text = encodeURIComponent(
        `${post.title} - ${post.summary || "Sports News"}`
      );

      const socialUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        instagram: null, 
      };

      if (platform === "instagram") {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Article link copied! You can now paste it on Instagram");
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

  const renderNewsHeader = () => (
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
  );

  const renderEmptyState = () => {
    const getEmptyMessage = () => {
      if (searchQuery) return `No news found for "${searchQuery}"`;
      if (activeCategory) return `No news found in "${activeCategory}" category`;
      return "No news available";
    };

    return (
      <div className={styles.blogContainer}>
        {renderNewsHeader()}
        <div className={styles.nothingContainer}>
          <Nothing
            Alt="No news available"
            NothingImage={EmptyNewsImg}
            Text={getEmptyMessage()}
          />
        </div>
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
            <span className={styles.category}>
              {formatCategory(selectedPost.category)}
            </span>
            <span>By {getAuthorName(selectedPost)}</span>
          </div>
          <h2>{selectedPost.title}</h2>
          <div
            className={styles.sideSlideInnerContent}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                selectedPost.content || selectedPost.summary
              ),
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

  const categoryOptions = categories.map((category) => ({
    name: category,
    code: category,
  }));

  if ((loading || isSearching) && articles.length === 0) {
    return (
      <div className={styles.nothingContainer}>
        <LoadingLogo />
      </div>
    );
  }

  if (articles.length === 0 && !loading && !isSearching) {
    return renderEmptyState();
  }

  return (
    <div className={styles.blogContainer}>
      {renderNewsHeader()}

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
        {(loading || isSearching) ? (
          <div className={styles.nothingContainer}>
            <LoadingLogo />
          </div>
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