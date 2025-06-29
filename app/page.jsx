"use client";

import Popup from "@/app/components/Popup";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Banner from "@/app/components/Banner";
import Footer from "@/app/components/Footer";
import SideNav from "@/app/components/SideNav";
import Nothing from "@/app/components/Nothing";
import { useBlogStore } from "@/app/store/Blog";
import { useNewsStore } from "@/app/store/News";
import { useAuthStore } from "@/app/store/Auth";
import HomeCard from "@/app/components/HomeCard";
import styles from "@/app/style/home.module.css";
import NewsCard from "@/app/components/NewsCard";
import { useState, useEffect, useRef } from "react";
import ArticleCard from "@/app/components/BlogCard";
import { useAdvertStore } from "@/app/store/Advert";
import { useDrawerStore } from "@/app/store/Drawer";
import VipResults from "@/app/components/VipResults";
import LoadingLogo from "@/app/components/LoadingLogo";
import Telegram from "@/app/components/TelegramAdvert";
import OfferCard from "@/app/components/SingleOfferCard";
import { usePredictionStore } from "@/app/store/Prediction";
import EmptySportImage from "@/public/assets/emptysport.png";
import ExclusiveOffers from "@/app/components/ExclusiveOffer";
import { initViewportFix } from "@/app/utility/viewportFix";

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  const { adverts } = useAdvertStore();
  const { isOpen, setClose } = useDrawerStore();
  const { initializeAuth, isInitialized } = useAuthStore();
  const {
    fetchAllPredictionsForDate,
    predictions,
    loading: predictionsLoading,
  } = usePredictionStore();
  const { blogs, fetchBlogs, loading: blogsLoading } = useBlogStore();
  const { articles, fetchArticles, loading: newsLoading } = useNewsStore();
  const sideNavRef = useRef(null);
  const router = useRouter();

  const popupBannerAds = adverts.filter((ad) => ad.location === "PopupBanner");
  const hasPopupAds = popupBannerAds.length > 0;

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Group predictions by sport, but use category for bet-of-the-day
  const groupedPredictions = predictions.reduce((groups, prediction) => {
    // For bet-of-the-day, use the category, otherwise use sport
    let groupKey;
    if (prediction.category === "bet-of-the-day") {
      groupKey = "bet-of-the-day";
    } else {
      groupKey = prediction.sport?.toLowerCase() || "unknown";
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(prediction);
    return groups;
  }, {});

  // Sort sports by priority and then alphabetically
  const sportOrder = ["football", "basketball", "tennis", "bet-of-the-day"];
  const sortedSports = Object.keys(groupedPredictions).sort((a, b) => {
    const indexA = sportOrder.indexOf(a);
    const indexB = sportOrder.indexOf(b);

    // If both sports are in the priority list, use that order
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only one sport is in the priority list, prioritize it
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // If neither sport is in the priority list, sort alphabetically
    return a.localeCompare(b);
  });

  // Get first 3 blog posts and news articles
  const featuredBlogs = blogs.slice(0, 3);
  const featuredNews = articles.slice(0, 3);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await initializeAuth();
        setIsAuthInitialized(true);
      } catch (error) {
        setIsAuthInitialized(true);
      }
    };

    if (!isInitialized && !isAuthInitialized) {
      initAuth();
    } else if (isInitialized) {
      setIsAuthInitialized(true);
    }
  }, [initializeAuth, isInitialized, isAuthInitialized]);

  // Fetch all data when auth is initialized
  useEffect(() => {
    if (isAuthInitialized) {
      fetchAllPredictionsForDate(today);
      fetchBlogs();
      fetchArticles();
    }
  }, [
    isAuthInitialized,
    fetchAllPredictionsForDate,
    fetchBlogs,
    fetchArticles,
    today,
  ]);

  // Viewport fix effect
  useEffect(() => {
    const cleanup = initViewportFix();
    return cleanup;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      if (!isMobile || !isOpen) return;
      if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
        const menuButton = event.target.closest("[data-menu-button]");
        if (!menuButton) {
          setClose();
        }
      }
    };

    if (isMobile && isOpen) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("touchstart", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [isMobile, isOpen, setClose]);

  useEffect(() => {
    if (hasPopupAds) {
      setIsPopupOpen(true);
    }
  }, [hasPopupAds]);

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const isLoading =
    predictionsLoading || blogsLoading || newsLoading || !isAuthInitialized;

  if (isLoading) {
    return (
      <div className={styles.pageLayout}>
        <div ref={sideNavRef}>
          <SideNav />
        </div>
        <div className={styles.pageContent}>
          <Navbar />
          <div className={styles.homeMain}>
            <Banner />
            <ExclusiveOffers />
            <div className={styles.loadingContainer}>
              <LoadingLogo />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  if (predictions.length === 0 && blogs.length === 0 && articles.length === 0) {
    return (
      <div className={styles.pageLayout}>
        <div ref={sideNavRef}>
          <SideNav />
        </div>
        <div className={styles.pageContent}>
          <Navbar />
          <div className={styles.homeMain}>
            <Banner />
            <ExclusiveOffers />
            <div className={styles.noContentContainer}>
              <Nothing
                Alt="No prediction"
                NothingImage={EmptySportImage}
                Text={
                  "No predictions, blogs or news available at the moment. Please check back later."
                }
              />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  const handleCardClick = (predictionData) => {
    const { teamA, teamB, sport } = predictionData;
    if (!teamA || !teamB) return;

    // Use the actual sport from prediction data for navigation
    const category = sport?.toLowerCase() || "football";
    const selectedDate = today;

    const cleanTeamA =
      teamA
        ?.toString()
        ?.trim()
        ?.replace(/\s+/g, "-")
        ?.replace(/[^\w\-]/g, "")
        ?.replace(/--+/g, "-")
        ?.replace(/^-|-$/g, "") || "team-a";

    const cleanTeamB =
      teamB
        ?.toString()
        ?.trim()
        ?.replace(/\s+/g, "-")
        ?.replace(/[^\w\-]/g, "")
        ?.replace(/--+/g, "-")
        ?.replace(/^-|-$/g, "") || "team-b";

    const matchSlug = `${cleanTeamA}-vs-${cleanTeamB}`;
    const baseUrl = `/page/${category}/single/${matchSlug}`;
    const fullUrl = `${baseUrl}?date=${selectedDate}`;

    router.push(fullUrl, { scroll: false });
  };

  const handleBlogReadMore = (post) => {
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    router.push(`/page/blog?blog=${slug}`);
  };

  const handleNewsReadMore = (post) => {
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    router.push(`/page/news?article=${slug}`);
  };

  const handleBlogShare = async (post) => {
    try {
      const slug = post.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

      const shareUrl = `${window.location.origin}/blog?blog=${slug}`;

      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        // You might want to show a toast here
      }
    } catch (err) {
      console.error("Failed to share blog post");
    }
  };

  const handleNewsShare = async (post) => {
    try {
      const slug = post.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

      const shareUrl = `${window.location.origin}/news?article=${slug}`;

      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.summary || "Check out this sports news article",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch (err) {
      console.error("Failed to share news article");
    }
  };

  const renderPredictionsSection = () => {
    return (
      <div className={styles.predictionsGrid}>
        {sortedSports.map((sport) => {
          const sportPredictions = groupedPredictions[sport];
          const sortedPredictions = [...sportPredictions].sort((a, b) => {
            const timeA = a.time ? new Date(a.time).getTime() : 0;
            const timeB = b.time ? new Date(b.time).getTime() : 0;
            return timeA - timeB;
          });

          return (
            <HomeCard
              key={sport}
              sport={sport}
              predictions={sortedPredictions}
              onCardClick={handleCardClick}
            />
          );
        })}
      </div>
    );
  };

  const renderBlogSection = () => {
    if (featuredBlogs.length === 0) return null;

    return (
      <div className={styles.contentSection}>
        <h2>Latest Blog Posts</h2>
        <div className={styles.cardsGrid}>
          {featuredBlogs.map((post) => (
            <ArticleCard
              key={post._id}
              post={post}
              onReadMore={handleBlogReadMore}
              onShare={handleBlogShare}
            />
          ))}
        </div>
        <button
          className={styles.viewAllBtn}
          onClick={() => router.push("/page/blog")}
        >
          See more blogs
        </button>
      </div>
    );
  };

  const renderNewsSection = () => {
    if (featuredNews.length === 0) return null;

    return (
      <div className={styles.contentSection}>
        <h2>Latest Sports News</h2>
        <div className={styles.cardsGrid}>
          {featuredNews.map((post) => (
            <NewsCard
              key={post._id}
              post={post}
              onReadMore={handleNewsReadMore}
              onShare={handleNewsShare}
            />
          ))}
        </div>
        <button
          className={styles.viewAllBtn}
          onClick={() => router.push("/page/news")}
        >
          See more news
        </button>
      </div>
    );
  };

  return (
    <div className={styles.pageLayout}>
      <div ref={sideNavRef}>
        <SideNav />
      </div>
      <div className={styles.pageContent}>
        <Navbar />
        <div className={styles.homeContainer}>
          <div className={styles.homeMain}>
            <Banner />
            <ExclusiveOffers />
            {renderPredictionsSection()}
            {renderBlogSection()}
            {renderNewsSection()}
          </div>
          <div className={styles.predictionsSection}>
            <VipResults />
            <OfferCard />
          </div>
        </div>
        <Footer />
      </div>
      {hasPopupAds && (
        <Popup
          Top={0}
          Right={0}
          Left={0}
          Bottom={0}
          OnClose={closePopup}
          Blur={5}
          Zindex={9999}
          IsOpen={isPopupOpen}
          Content={<Telegram />}
          BorderRadiusTopLeft={15}
          BorderRadiusTopRight={15}
          BorderRadiusBottomRight={15}
          BorderRadiusBottomLeft={15}
        />
      )}
    </div>
  );
}
