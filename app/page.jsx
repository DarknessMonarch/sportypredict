"use client";

import { useRouter } from "next/navigation";
import Nothing from "@/app/components/Nothing";
import { useBlogStore } from "@/app/store/Blog";
import { useNewsStore } from "@/app/store/News";
import { useAuthStore } from "@/app/store/Auth";
import HomeCard from "@/app/components/HomeCard";
import styles from "@/app/style/home.module.css";
import NewsCard from "@/app/components/NewsCard";
import HomeBanner from "@/app/components/HomeBanner";
import { useState, useEffect, useRef } from "react";
import ArticleCard from "@/app/components/BlogCard";
import { useAdvertStore } from "@/app/store/Advert";
import { useDrawerStore } from "@/app/store/Drawer";
import VipResults from "@/app/components/VipResults";
import LoadingLogo from "@/app/components/LoadingLogo";
import OfferCard from "@/app/components/SingleOfferCard";
import { usePredictionStore } from "@/app/store/Prediction";
import EmptySportImage from "@/public/assets/emptysport.png";
import ExclusiveOffers from "@/app/components/ExclusiveOffer";
import { initViewportFix } from "@/app/utility/viewportFix";

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

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

  const groupedPredictions = predictions.reduce((groups, prediction) => {
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

  const sportOrder = ["bet-of-the-day", "football", "basketball", "tennis"];
  const sortedSports = Object.keys(groupedPredictions).sort((a, b) => {
    const indexA = sportOrder.indexOf(a);
    const indexB = sportOrder.indexOf(b);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    return a.localeCompare(b);
  });

  const featuredBlogs = blogs.slice(0, 2);
  const featuredNews = articles.slice(0, 2);

  const isDynamicContentLoading =
    predictionsLoading || blogsLoading || newsLoading;
  const hasAnyContent =
    predictions.length > 0 || blogs.length > 0 || articles.length > 0;

  useEffect(() => {
    const updateDate = () => {
      const newDate = new Date().toISOString().split("T")[0];
      setCurrentDate(newDate);
    };

    updateDate();

    const interval = setInterval(() => {
      updateDate();
    }, 60000);

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const midnightTimeout = setTimeout(() => {
      updateDate();
    }, msUntilMidnight);

    return () => {
      clearInterval(interval);
      clearTimeout(midnightTimeout);
    };
  }, []);

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

  useEffect(() => {
    if (isAuthInitialized) {
      fetchAllPredictionsForDate(currentDate);
      fetchBlogs();
      fetchArticles();
    }
  }, [
    isAuthInitialized,
    fetchAllPredictionsForDate,
    fetchBlogs,
    fetchArticles,
    currentDate,
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

  const handleBlogReadMore = (post) => {
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    router.push(`/blog?blog=${slug}`);
  };

  const handleNewsReadMore = (post) => {
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    router.push(`/news?article=${slug}`);
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

  const renderPredictionInfo = () => {
    return (
      <div className={styles.predictionInfo}>
        <h1>Best Free Sports Predictions Website</h1>
        <p>
          SportyPredict is the best free online sports prediction website,
          offering expert tips in football, basketball, and tennis. We Predict,
          you Win. And here&apos;s why we truly are the best free sports
          predictions website:
        </p>

        <h2>1. Comprehensive Free Sports Predictions</h2>
        <p>
          We deliver daily free sports predictions and expert betting tips
          across all major disciplines, including:
        </p>
        <ul>
          <li>
            <strong>Football Predictions</strong> – From Champions League
            showdowns to domestic league clashes, our data-driven forecasts
            cover it all.
          </li>
          <li>
            <strong>Basketball Picks</strong> – NBA matchups, EuroLeague
            showdowns, you&apos;ll find free tips with form analysis and player
            availability.
          </li>
          <li>
            <strong>Tennis Insights</strong> – Grand Slams, ATP/WTA tour events:
            our free tennis predictions always respect the correct set formats
            and tournament contexts.
          </li>
        </ul>
        <p>
          This breadth of no-cost sports tips ensures you never have to look
          elsewhere for reliable guidance.
        </p>

        <h2>2. User-Friendly</h2>
        <p>
          We&apos;ve structured SportyPredict.com for lightning-fast access to
          the content you care about:
        </p>
        <ul>
          <li>
            <strong>Intuitive Navigation</strong> – Tabs for Football,
            Basketball, Tennis, Bet of the Day, News, and Blogs let you find
            free tips in one click.
          </li>
          <li>
            <strong>Responsive Design</strong> – Whether you&apos;re on desktop
            or mobile, our site delivers seamless performance so you never miss
            a tip on the go.
          </li>
        </ul>

        <h2>3. Proven Accuracy & Transparency</h2>
        <p>We believe in full visibility of our track record:</p>
        <ul>
          <li>
            <strong>Archived Results</strong> – Review our past free tips,
            complete with hit rates and outcome breakdowns, so you can trust the
            team behind the predictions.
          </li>
          <li>
            <strong>Data-Driven Analysis</strong> – Every free tip is backed by
            statistical modeling: current form, head-to-head history, home/away
            performance, and situational factors like weather.
          </li>
        </ul>

        <h2>4. Effortless VIP Subscription Path</h2>
        <p>
          For punters seeking extra edge, our VIP plan offers 2–5 premium odds
          picks daily, banker selections, combo tickets, and personalized
          support. Yet we never lock away our free sports betting tips—you
          remain free to access all core predictions whether you subscribe or
          not.
        </p>

        <h2>Conclusion</h2>
        <p>
          By combining in-depth analysis, a seamless user experience, and an
          unwavering commitment to free access, we&apos;ve crafted the ultimate
          destination for free sports predictions. Join thousands of satisfied
          users and let SportyPredict power your next winning bet.
        </p>
      </div>
    );
  };

  const renderPredictionsSection = () => {
    return (
      <div className={styles.predictionsGrid}>
        <h1>Free Sports Tips and Predictions</h1>

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
          onClick={() => router.push("/blog")}
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
          onClick={() => router.push("/news")}
        >
          See more news
        </button>
      </div>
    );
  };

  const renderDynamicContent = () => {
    if (!isAuthInitialized) {
      return (
        <div className={styles.noContentContainer}>
          <Nothing
            Alt="Initializing"
            NothingImage={EmptySportImage}
            Text="Loading home content..."
          />
        </div>
      );
    }

    if (isDynamicContentLoading) {
      return (
        <div className={styles.loadingContainer}>
          <LoadingLogo />
        </div>
      );
    }

    if (!hasAnyContent) {
      return (
        <div className={styles.noContentContainer}>
          <Nothing
            Alt="No prediction"
            NothingImage={EmptySportImage}
            Text={
              "No predictions, blogs or news available at the moment. Please check back later."
            }
          />
        </div>
      );
    }

    return (
      <>
        {renderPredictionsSection()}
        {renderBlogSection()}
        {renderNewsSection()}
      </>
    );
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeMain}>
        <HomeBanner />
        <ExclusiveOffers />
        {renderDynamicContent()}
        {!isMobile && renderPredictionInfo()}
      </div>
      <div className={styles.predictionsSection}>
        <VipResults />
        <OfferCard />
        {isMobile && renderPredictionInfo()}
      </div>
    </div>
  );
}
