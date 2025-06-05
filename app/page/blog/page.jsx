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
import ArticleCard from "@/app/components/ArticleCard";
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

  const findBlogBySlug = (slug) => {
    if (!slug) return null;
    return blogs.find((blog) => createSlug(blog.title) === slug);
  };

  // Move openModal and closeModal before the useEffect that uses them
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

      searchTimeoutRef.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          await fetchBlogs("", "", query);
        } catch (err) {
          toast.error("Search failed. Please try again.");
        } finally {
          setIsSearching(false);
        }
      }, 300);
    },
    [fetchBlogs]
  );

  // ✅ FIXED: Initial data loading - removed blogs and featuredBlogs from dependencies
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

  // ✅ NEW: Handle shared blog after data is loaded
  useEffect(() => {
    const sharedBlogSlug = searchParams.get("blog");
    if (sharedBlogSlug && (blogs.length > 0 || featuredBlogs.length > 0) && !showModal) {
      let sharedPost = null;

      // Check in blogs first
      if (blogs.length > 0) {
        sharedPost = blogs.find(
          (blog) => createSlug(blog.title) === sharedBlogSlug
        );
      }

      // Check in featured blogs if not found
      if (!sharedPost && featuredBlogs.length > 0) {
        sharedPost = featuredBlogs.find(
          (blog) => createSlug(blog.title) === sharedBlogSlug
        );
      }

      if (sharedPost) {
        openModal(sharedPost, false);
      } else {
        toast.error("Blog post not found");
        router.replace(pathname, undefined, { shallow: true });
      }
    }
  }, [searchParams, blogs, featuredBlogs, showModal, openModal, createSlug, router, pathname]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    } else if (searchQuery === "") {
      setIsSearching(true);
      fetchBlogs(activeCategory, "", "").finally(() => setIsSearching(false));
    }
  }, [searchQuery, debouncedSearch, fetchBlogs, activeCategory]);

  useEffect(() => {
    if (activeCategory && !searchQuery) {
      setIsSearching(true);
      fetchBlogs(activeCategory, "", "").finally(() => setIsSearching(false));
    }
  }, [activeCategory, fetchBlogs, searchQuery]);

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (category) => {
    try {
      if (activeCategory === category) {
        setActiveCategory("");
        setIsSearching(true);
        fetchBlogs("", "", searchQuery).finally(() =>
          // category, tag, search
          setIsSearching(false)
        );
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
      const slug = createSlug(post.title);
      const shareUrl = `${window.location.origin}${pathname}?blog=${slug}`;

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
      const slug = createSlug(post.title);
      const shareUrl = `${window.location.origin}${pathname}?blog=${slug}`;
      const url = encodeURIComponent(shareUrl);
      const text = encodeURIComponent(`${post.title} - ${post.excerpt}`);

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
          toast.success("Blog link copied! You can now paste it on Instagram");
          return;
        default:
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

  const featuredPost = featuredBlogs.length > 0 ? featuredBlogs[0] : null;
  const categories = storeCategories.map((cat) => cat.name || cat);

  // ✅ FIXED: Only show full-page loading when NOT searching
  if (loading && blogs.length === 0 && !featuredPost && !isSearching) {
    return <LoadingLogo />;
  }

  if (blogs.length === 0 && !featuredPost && !loading && !isSearching) {
    return (
      <div className={styles.blogContainer}>
        <div className={styles.blogBanner}>
          <div className={styles.blogHeader}>
            <div className={styles.blogContent}>
              <h1>Insights Blog</h1>
              <p>
                Expert insights, analysis and thoughts to educate and inform.
              </p>
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
        <Nothing
          Alt="No blog posts"
          NothingImage={EmptyBlogImage}
          Text={
            searchQuery
              ? `No blog posts found for "${searchQuery}"`
              : activeCategory
              ? `No blog posts found in "${activeCategory}" category`
              : "No blog posts available"
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
            <span className={styles.category}>{selectedPost.category}</span>

            <span>
              By{" "}
              {selectedPost.author ||
                selectedPost.authorName ||
                "Unknown Author"}
            </span>
          </div>
          <h2>{selectedPost.title}</h2>
          <div
            className={styles.sideSlideInnerContent}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(selectedPost.content),
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
                selectedPost.publishedAt || selectedPost.createdAt
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
                style={{
                  objectFit: "cover",
                }}
                priority={true}
              />
            </div>
            <div className={styles.featuredContent}>
              <div className={styles.category}>{featuredPost.category}</div>
              <h2>{featuredPost.title}</h2>
              <p>{featuredPost.excerpt}</p>
              <div className={styles.articleMeta}>
                <span>
                  By{" "}
                  {featuredPost.author ||
                    featuredPost.authorName ||
                    "Unknown Author"}
                </span>
                <div className={styles.dateAndTime}>
                  <span>
                    <FaRegClock /> {featuredPost.readTime || "5 min read"}
                  </span>
                  <span>
                    {featuredPost.formattedDate ||
                      new Date(
                        featuredPost.publishedAt || featuredPost.createdAt
                      ).toLocaleDateString()}
                  </span>
                </div>
              </div>
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
            <LoadingLogo />
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

        <div className={styles.telegramContent}>
          <div className={styles.telegramCard}>
            <h2>Join Our Telegram Community</h2>
            <p>
              Get exclusive access to expert insights, premium content, and
              connect with fellow readers.
            </p>
            <button className={styles.telegramButton} onClick={openTelegram}>
             Join us
            </button>
          </div>
        </div>
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