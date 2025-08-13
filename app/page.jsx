"use client";

import { useRouter } from "next/navigation";
import Nothing from "@/app/components/Nothing";
import { useBlogStore } from "@/app/store/Blog";
import { useNewsStore } from "@/app/store/News";
import { useAuthStore } from "@/app/store/Auth";
import HomeCard from "@/app/components/HomeCard";
import styles from "@/app/style/home.module.css";
import NewsCard from "@/app/components/NewsCard";
import HomeBanner from "@/app/components/homeBanner";
import ArticleCard from "@/app/components/BlogCard";
import { useAdvertStore } from "@/app/store/Advert";
import { useDrawerStore } from "@/app/store/Drawer";
import VipResults from "@/app/components/VipResults";
import OfferCard from "@/app/components/SingleOfferCard";
import { initViewportFix } from "@/app/utility/viewportFix";
import { usePredictionStore } from "@/app/store/Prediction";
import EmptySportImage from "@/public/assets/emptysport.png";
import ExclusiveOffers from "@/app/components/ExclusiveOffer";
import { useState, useEffect, useRef, useCallback } from "react";
import HomeCardSkeleton from "@/app/components/HomeCardSkeleton";

export default function Home() {
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

  // Enhanced content dimensions for better CLS optimization
  const contentDimensions = {
    predictions: {
      minHeight: predictionsLoading ? '600px' : 'auto',
      reservedHeight: '500px'
    },
    blogs: {
      minHeight: blogsLoading ? '450px' : 'auto',
      reservedHeight: '400px'
    },
    news: {
      minHeight: newsLoading ? '450px' : 'auto',
      reservedHeight: '400px'
    }
  };

  const popupBannerAds = adverts.filter((ad) => ad.location === "PopupBanner");
  const hasPopupAds = popupBannerAds.length > 0;

  const processedPredictions = useCallback(() => {
    const groups = predictions.reduce((acc, prediction) => {
      const groupKey = prediction.category === "bet-of-the-day" 
        ? "bet-of-the-day" 
        : prediction.sport?.toLowerCase() || "unknown";
      
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(prediction);
      return acc;
    }, {});

    const sportOrder = ["bet-of-the-day", "football", "basketball", "tennis"];
    const sorted = Object.keys(groups).sort((a, b) => {
      const indexA = sportOrder.indexOf(a);
      const indexB = sportOrder.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });

    return { groupedPredictions: groups, sortedSports: sorted };
  }, [predictions]);

  const { groupedPredictions, sortedSports } = processedPredictions();
  const featuredBlogs = blogs.slice(0, 2);
  const featuredNews = articles.slice(0, 2);

  const handleBlogReadMore = useCallback((post) => {
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    router.push(`/blog?blog=${slug}`);
  }, [router]);

  const handleNewsReadMore = useCallback((post) => {
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    router.push(`/news?article=${slug}`);
  }, [router]);

  const handleShare = useCallback(async (post, type) => {
    try {
      const slug = post.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

      const shareUrl = `${window.location.origin}/${type}?${type}=${slug}`;
      
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: type === 'news' ? post.summary : post.excerpt,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch (err) {
      console.error(`Failed to share ${type}`);
    }
  }, []);

  // Effects
  useEffect(() => {
    const cleanup = initViewportFix();
    return cleanup;
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
  }, [isAuthInitialized, fetchAllPredictionsForDate, fetchBlogs, fetchArticles, currentDate]);

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
  
  // Render predictions section with reserved space
  const renderPredictionsSection = () => {
    return (
      <section 
        className={styles.predictionsGrid}
        style={{ 
          minHeight: contentDimensions.predictions.minHeight
        }}
      >
        <h1 tabIndex={0}>Free Sports Tips and Predictions</h1>
        
        {predictionsLoading ? (
          <>
            {['bet-of-the-day', 'football', 'basketball', 'tennis'].map((sport) => (
              <HomeCardSkeleton 
                key={`skeleton-${sport}`} 
                count={4}
                aria-label={`Loading ${sport} predictions`}
              />
            ))}
          </>
        ) : sortedSports.length > 0 ? (
          sortedSports.map((sport) => (
            <HomeCard
              key={sport}
              sport={sport}
              predictions={groupedPredictions[sport]}
              aria-label={`${sport} predictions`}
            />
          ))
        ) : (
          <div 
            className={styles.noContentContainer}
            style={{ minHeight: '300px' }}
            role="status"
            aria-live="polite"
          >
            <Nothing
              Alt="No predictions available"
              NothingImage={EmptySportImage}
              Text="No predictions available for today"
            />
          </div>
        )}
      </section>
    );
  };

  const renderBlogsSection = () => {
    if (blogsLoading) {
      return (
        <section 
          className={styles.contentSection}
          style={{ minHeight: contentDimensions.blogs.minHeight }}
        >
          <h2 tabIndex={0}>Latest Blog Posts</h2>
          <div className={styles.cardsGrid}>
            {[1, 2].map((i) => (
              <div key={`blog-skeleton-${i}`} className={styles.cardSkeleton} />
            ))}
          </div>
        </section>
      );
    }

    if (featuredBlogs.length === 0) return null;

    return (
      <section 
        className={styles.contentSection}
        style={{ minHeight: contentDimensions.blogs.reservedHeight }}
      >
        <h2 tabIndex={0}>Latest Blog Posts</h2>
        <div className={styles.cardsGrid}>
          {featuredBlogs.map((post) => (
            <ArticleCard
              key={post._id}
              post={post}
              onReadMore={handleBlogReadMore}
              onShare={(post) => handleShare(post, 'blog')}
              aria-label={`Blog post: ${post.title}`}
            />
          ))}
        </div>
        <button
          className={styles.viewAllBtn}
          onClick={() => router.push("/blog")}
          aria-label="View all blog posts"
        >
          See more blogs
        </button>
      </section>
    );
  };

  const renderNewsSection = () => {
    if (newsLoading) {
      return (
        <section 
          className={styles.contentSection}
          style={{ minHeight: contentDimensions.news.minHeight }}
        >
          <h2 tabIndex={0}>Latest Sports News</h2>
          <div className={styles.cardsGrid}>
            {[1, 2].map((i) => (
              <div key={`news-skeleton-${i}`} className={styles.cardSkeleton} />
            ))}
          </div>
        </section>
      );
    }

    if (featuredNews.length === 0) return null;

    return (
      <section 
        className={styles.contentSection}
        style={{ minHeight: contentDimensions.news.reservedHeight }}
      >
        <h2 tabIndex={0}>Latest Sports News</h2>
        <div className={styles.cardsGrid}>
          {featuredNews.map((post) => (
            <NewsCard
              key={post._id}
              post={post}
              onReadMore={handleNewsReadMore}
              onShare={(post) => handleShare(post, 'news')}
              aria-label={`News article: ${post.title}`}
            />
          ))}
        </div>
        <button
          className={styles.viewAllBtn}
          onClick={() => router.push("/news")}
          aria-label="View all news articles"
        >
          See more news
        </button>
      </section>
    );
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeMain}>
        <HomeBanner />
        <ExclusiveOffers />
        
        <main>
          {renderPredictionsSection()}
          {renderBlogsSection()}
          {renderNewsSection()}
        </main>

        {!isMobile && (
          <aside aria-label="Additional Information">
            {renderPredictionInfo()}
          </aside>
        )}
      </div>

      <div 
        className={styles.predictionsSection}
        role="complementary"
      >
        <VipResults />
        <OfferCard />
        {isMobile && (
          <aside aria-label="Additional Information">
            {renderPredictionInfo()}
          </aside>
        )}
      </div>
    </div>
  );
}