"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "@/app/style/blog.module.css";
import { MdOutlineEmail as EmailIcon, MdClose } from "react-icons/md";
import { FaFacebookF, FaTwitter, FaInstagram, FaSearch, FaRegClock } from "react-icons/fa";
import { IoMdShare } from "react-icons/io";
import Link from "next/link";
import Head from "next/head";

const blogPosts = [
  {
    id: 1,
    title: "The Evolution of Basketball Strategy in the Modern Era",
    excerpt: "How analytics and positionless basketball have transformed the NBA game in recent years.",
    image: "https://res.cloudinary.com/dttvkmjpd/image/upload/v1725776055/nbzjfqluexu3re6ocvec.png",
    category: "Basketball",
    author: "Michael Johnson",
    date: "April 18, 2025",
    readTime: "8 min read",
    tags: ["NBA", "Basketball", "Strategy", "Analytics"],
    content: `
      <p>In the past decade, basketball strategy has undergone a revolutionary transformation, driven largely by advanced analytics and the concept of positionless basketball.</p>
      
      <p>The traditional five positions that defined basketball for generations – point guard, shooting guard, small forward, power forward, and center – have been gradually replaced by a more fluid approach where players are valued for their specific skills rather than fitting predetermined roles.</p>
      
      <h3>The Rise of the Three-Point Shot</h3>
      
      <p>Perhaps the most visible change has been the dramatic increase in three-point attempts across the league. Teams now routinely take more three-pointers than two-point shots, a strategy that would have been unthinkable just 15 years ago.</p>
      
      <p>This shift was pioneered by analytics-driven teams that recognized the mathematical advantage: a 33% success rate on three-pointers yields the same points per possession as a 50% success rate on two-pointers.</p>
      
      <h3>Spacing and Ball Movement</h3>
      
      <p>Modern offenses prioritize spacing the floor to create driving lanes and open three-point opportunities. The "five-out" offense, where all five players position themselves around the perimeter, has become increasingly common.</p>
      
      <p>Teams like the Golden State Warriors revolutionized offensive basketball with their emphasis on constant ball movement, off-ball screening, and quick decision-making.</p>
      
      <h3>Defensive Adaptations</h3>
      
      <p>As offenses evolved, defenses had to adapt as well. "Switch everything" schemes became more prevalent as teams sought ways to counter the pick-and-roll heavy offenses and perimeter shooting.</p>
      
      <p>The ideal modern defender is now expected to guard multiple positions effectively, reflecting the positionless nature of today's game.</p>
      
      <h3>The Modern Big Man</h3>
      
      <p>Centers who can't shoot three-pointers or defend in space have seen their value diminish dramatically. Today's elite big men like Nikola Jokić and Joel Embiid combine traditional post skills with perimeter shooting and playmaking ability.</p>
      
      <p>The era of the traditional back-to-the-basket center appears to be over, with even seven-footers now expected to have guard-like skills.</p>
      
      <h3>Looking Ahead</h3>
      
      <p>As technology and data analysis continue to advance, we can expect further evolution in basketball strategy. The game will likely become even more position-fluid, with teams constantly searching for mathematical edges and innovative approaches to maximize efficiency.</p>
      
      <p>What remains constant is the beauty of basketball's continuous evolution – a game that has shown remarkable ability to transform itself while maintaining its core appeal.</p>
    `
  },
  {
    id: 2,
    title: "Top 5 Underdog Stories from the Latest Soccer Season",
    excerpt: "Remarkable teams that defied expectations and made history this year.",
    image: "https://res.cloudinary.com/dttvkmjpd/image/upload/v1725776055/nbzjfqluexu3re6ocvec.png",
    category: "Soccer",
    author: "Emma Rodriguez",
    date: "April 16, 2025",
    readTime: "6 min read",
    tags: ["Soccer", "Football", "Underdogs", "Season Review"],
    content: `
      <p>Every soccer season brings its share of surprises, but this year delivered some truly remarkable underdog stories that captivated fans worldwide.</p>
      
      <h3>1. FC Midtjylland's Champions League Run</h3>
      
      <p>The Danish club shocked Europe by advancing from the group stage despite being placed in the "group of death." Their tactical discipline and team cohesion proved that smart management can compete with financial might.</p>
      
      <h3>2. Girona's La Liga Challenge</h3>
      
      <p>The small Catalan club, playing only their third season in Spain's top flight, defied all expectations by challenging the traditional powerhouses and securing a top-four finish and Champions League qualification.</p>
      
      <h3>3. Wrexham's Fairy Tale Continues</h3>
      
      <p>After their well-documented rise through the National League, Wrexham's momentum continued with another promotion, bringing them just one step away from the Championship. The Hollywood-owned club has become a global phenomenon.</p>
      
      <h3>4. Union Berlin's Bundesliga Resilience</h3>
      
      <p>After narrowly avoiding relegation last season, Union Berlin's incredible transformation saw them finish in the top half of the table with one of the lowest wage bills in the league.</p>
      
      <h3>5. Bologna's Serie A Renaissance</h3>
      
      <p>The historic Italian club ended their 20-year wait for European football with a stunning season that saw them defeat both Milan giants and Juventus. Their attractive, possession-based style won them admirers across Europe.</p>
      
      <p>These stories remind us why we love sports – the unpredictability, the triumph of teamwork over individual talent, and the magic that happens when belief overcomes probability.</p>
    `
  },
  {
    id: 3,
    title: "Nutrition Strategies for Endurance Athletes",
    excerpt: "Science-backed approaches to fueling your body for marathon training and competition.",
    image: "https://res.cloudinary.com/dttvkmjpd/image/upload/v1725776055/nbzjfqluexu3re6ocvec.png",
    category: "Fitness",
    author: "Dr. Sarah Lee",
    date: "April 14, 2025",
    readTime: "10 min read",
    tags: ["Nutrition", "Marathon", "Endurance", "Training"],
    content: `
      <p>Proper nutrition is just as important as physical training for endurance athletes. The right fueling strategy can be the difference between hitting the wall and achieving a personal best.</p>
      
      <h3>Carbohydrate Loading</h3>
      
      <p>Contrary to popular diet trends, endurance athletes need carbohydrates. In the 2-3 days before a marathon or long-distance event, gradually increase your carbohydrate intake to 8-12g per kg of body weight while reducing training volume.</p>
      
      <p>Focus on complex carbohydrates like whole grains, sweet potatoes, and oats rather than simple sugars to maintain stable energy levels.</p>
      
      <h3>Protein Timing and Quality</h3>
      
      <p>Research shows that distributing protein intake throughout the day (20-25g per meal) is more effective than consuming larger amounts in fewer meals. This approach maximizes muscle protein synthesis and recovery.</p>
      
      <p>High-quality protein sources like eggs, fish, lean meats, and dairy contain all essential amino acids needed for muscle repair.</p>
      
      <h3>Race Day Nutrition</h3>
      
      <p>For events lasting longer than 90 minutes, aim to consume 30-60g of carbohydrates per hour. Practice your fueling strategy during training to avoid gastrointestinal distress on race day.</p>
      
      <p>Many elite marathoners now use a combination of sports drinks and easily digestible carbohydrate sources like energy gels or chews.</p>
      
      <h3>Hydration Strategies</h3>
      
      <p>Individual sweat rates vary greatly, making personalized hydration plans essential. Weigh yourself before and after training sessions to determine your fluid loss rate.</p>
      
      <p>For most athletes, consuming 400-800ml of fluid per hour is appropriate, with increased amounts needed in hot or humid conditions.</p>
      
      <h3>Recovery Nutrition</h3>
      
      <p>The 30-60 minute window after exercise is crucial for glycogen replenishment. Consume a 3:1 ratio of carbohydrates to protein (e.g., a banana with Greek yogurt) to optimize recovery.</p>
      
      <p>Tart cherry juice, turmeric, and omega-3 fatty acids have shown promise in reducing exercise-induced inflammation and accelerating recovery.</p>
      
      <p>Remember that nutrition plans should be individualized. What works for one athlete may not work for another, so experiment during training – never during competition – to find your optimal fueling strategy.</p>
    `
  },
];

// Featured post data
const featuredPost = {
  id: 4,
  title: "Breakout Stars to Watch in the Upcoming Football Season",
  excerpt: "Young talents poised to make their mark on the gridiron this fall. We analyze their college careers, pre-season performance, and potential impact.",
  image: "https://res.cloudinary.com/dttvkmjpd/image/upload/v1725776055/nbzjfqluexu3re6ocvec.png",
  category: "Football",
  author: "Jason Williams",
  date: "April 17, 2025",
  readTime: "12 min read",
  tags: ["Football", "NFL", "Rising Stars", "Season Preview"],
  content: `
    <p>With the NFL season approaching, all eyes are on the established stars, but history tells us that every season introduces new names to the football conversation. Here are the breakout candidates poised to become household names this fall.</p>
    
    <h3>Quarterbacks Ready to Leap</h3>
    
    <p>After showing flashes in limited action last season, Drake Maye appears ready to take the reins in New England. His combination of arm talent and mobility could finally give the Patriots the franchise quarterback they've been seeking in the post-Brady era.</p>
    
    <p>Meanwhile, Bo Nix enters his second season with much higher expectations after a promising rookie campaign. His completion percentage improved dramatically in the second half of last season, and reports from camp suggest a more confident player with full command of the offense.</p>
    
    <h3>Running Backs to Watch</h3>
    
    <p>Bijan Robinson disappointed fantasy managers last season due to puzzling usage patterns, but the stars are aligning for his true breakout. New offensive coordinator Ken Dorsey has promised a more conventional approach to the running game, which should finally unleash Robinson's rare combination of power, speed, and receiving ability.</p>
    
    <p>Don't sleep on Jaylen Wright, the rookie from Tennessee who has been turning heads in camp. His 4.38 speed has translated immediately to the NFL level, and he's shown surprising power between the tackles.</p>
    
    <h3>Defensive Disruptors</h3>
    
    <p>Will Anderson Jr. showed promise as a rookie with 7 sacks, but those who watch the film know he was much more disruptive than the numbers suggest. With a year of experience and an improved supporting cast, Anderson appears ready to join the elite tier of NFL pass rushers.</p>
    
    <p>In the secondary, Devon Witherspoon's versatility to play both outside corner and in the slot makes him a matchup weapon. His tenacious playing style and improved technique should translate to more turnovers this season.</p>
    
    <h3>Coaches' Impact</h3>
    
    <p>Don't underestimate the impact of coaching changes on player development. New Lions defensive coordinator Aaron Glenn has simplified the scheme to allow young players to play faster and more instinctively, which could accelerate the development of their promising young talent.</p>
    
    <p>As we watch these young stars emerge, remember that breakout seasons rarely happen in isolation. They're typically the result of talent meeting opportunity, supported by scheme fit and surrounding roster quality.</p>
  `
};

// Popular categories
const categories = [
  "Football", "Basketball", "Soccer", "Tennis", 
  "Golf", "Baseball", "Swimming", "Running", 
  "Fitness", "Olympics", "Extreme Sports"
];

export default function Blog() {
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [allPosts, setAllPosts] = useState([...blogPosts]);

  // SEO metadata
  const pageTitle = "Sports Insights Blog - Latest News, Analysis & Tips";
  const pageDescription = "Expert analysis, breaking news, and in-depth coverage of all your favorite sports. From game highlights to training tips, we've got you covered.";
  const canonicalUrl = "https://yourwebsite.com/blog";

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      // Here you would integrate with your email service
      setIsSubscribed(true);
      setEmail("");
      // In a real application, you'd use your toast library
      console.log("Subscribed:", email);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real application, you'd implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const openModal = (post) => {
    setSelectedPost(post);
    setShowModal(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto'; // Ensure scrolling is re-enabled when component unmounts
    };
  }, []);

  return (
    <>
      {/* SEO Head Section */}
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="https://yourwebsite.com/images/blog-og-image.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content="https://yourwebsite.com/images/blog-twitter-image.jpg" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "Sports Insights Blog",
              "description": "${pageDescription}",
              "url": "${canonicalUrl}",
              "publisher": {
                "@type": "Organization",
                "name": "Sports Insights",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://yourwebsite.com/images/logo.png"
                }
              }
            }
          `}
        </script>
      </Head>

      <div className={styles.blogContainer}>
        {/* Blog Header */}
        <header className={styles.blogHeader}>
          <div className={styles.headerContent}>
            <h1>Sports Insights Blog</h1>
            <p>Expert analysis and breaking news from the world of sports</p>
          </div>
          
          <div className={styles.searchBar}>
            <form onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Search articles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search blog posts"
              />
              <button type="submit" aria-label="Search">
                <FaSearch />
              </button>
            </form>
          </div>
        </header>

        {/* Featured Article */}
        <section className={styles.featuredArticle}>
          <div className={styles.featuredContent}>
            <span className={styles.category}>{featuredPost.category}</span>
            <h2>{featuredPost.title}</h2>
            <p>{featuredPost.excerpt}</p>
            <div className={styles.articleMeta}>
              <div className={styles.author}>
                <span>By {featuredPost.author}</span>
              </div>
              <div className={styles.dateAndTime}>
                <span><FaRegClock /> {featuredPost.readTime}</span>
                <span>{featuredPost.date}</span>
              </div>
            </div>
            <button onClick={() => openModal(featuredPost)} className={styles.readMoreBtn}>
              Read Full Article
            </button>
          </div>
          <div className={styles.featuredImage}>
            <Image 
              src={featuredPost.image} 
              alt={featuredPost.title}
              width={600}
              height={400}
              priority
            />
          </div>
        </section>

        {/* Main Blog Content - Two Rows Layout */}
        <div className={styles.blogMainContent}>
          <h2 className={styles.sectionTitle}>Latest Articles</h2>
          
          {/* First Row */}
          <div className={styles.articlesRow}>
            {allPosts.slice(0, 2).map(post => (
              <article key={post.id} className={styles.articleCard}>
                <div className={styles.articleImage}>
                  <Image 
                    src={post.image} 
                    alt={post.title}
                    width={400}
                    height={250}
                  />
                </div>
                <div className={styles.articleContent}>
                  <span className={styles.category}>{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className={styles.articleMeta}>
                    <span className={styles.author}>{post.author}</span>
                    <span className={styles.date}>{post.date}</span>
                  </div>
                  <div className={styles.articleFooter}>
                    <span className={styles.readTime}><FaRegClock /> {post.readTime}</span>
                    <button onClick={() => openModal(post)} className={styles.readMoreBtn}>Read More</button>
                    <button className={styles.shareBtn} aria-label="Share article">
                      <IoMdShare />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {/* Second Row */}
          <div className={styles.articlesRow}>
            {allPosts.slice(2, 4).map(post => (
              <article key={post.id} className={styles.articleCard}>
                <div className={styles.articleImage}>
                  <Image 
                    src={post.image} 
                    alt={post.title}
                    width={400}
                    height={250}
                  />
                </div>
                <div className={styles.articleContent}>
                  <span className={styles.category}>{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className={styles.articleMeta}>
                    <span className={styles.author}>{post.author}</span>
                    <span className={styles.date}>{post.date}</span>
                  </div>
                  <div className={styles.articleFooter}>
                    <span className={styles.readTime}><FaRegClock /> {post.readTime}</span>
                    <button onClick={() => openModal(post)} className={styles.readMoreBtn}>Read More</button>
                    <button className={styles.shareBtn} aria-label="Share article">
                      <IoMdShare />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          <div className={styles.loadMoreContainer}>
            <button className={styles.loadMoreBtn}>Load More Articles</button>
          </div>
        </div>

        {/* Categories Section */}
        <section className={styles.categoriesSection}>
          <h2 className={styles.sectionTitle}>Popular Categories</h2>
          <div className={styles.categoriesContainer}>
            {categories.map((category, index) => (
              <Link href={`/category/${category.toLowerCase()}`} key={index} className={styles.categoryCard}>
                {category}
              </Link>
            ))}
          </div>
        </section>

        {/* Subscribe Section */}
        <section className={styles.subscribeSection}>
          <div className={styles.subscribeContent}>
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for the latest sports news and analysis</p>
            <form onSubmit={handleSubscribe} className={styles.subscribeForm}>
              <div className={styles.inputGroup}>
                <EmailIcon className={styles.emailIcon} />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={styles.subscribeBtn}>Subscribe Now</button>
            </form>
            {isSubscribed && <p className={styles.successMessage}>Thanks for subscribing!</p>}
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2>Join Our Sports Community</h2>
            <p>Get exclusive access to expert analysis, training tips, and connect with fellow sports enthusiasts.</p>
            <button className={styles.ctaButton}>Sign Up Now</button>
          </div>
        </section>

        {/* Blog Footer */}
        <footer className={styles.blogFooter}>
          <div className={styles.footerContent}>
            <div className={styles.footerColumn}>
              <h3>Sports Insights</h3>
              <p>Your go-to source for sports news, analysis, and expert opinions.</p>
              <div className={styles.socialLinks}>
                <a href="#" aria-label="Facebook"><FaFacebookF /></a>
                <a href="#" aria-label="Twitter"><FaTwitter /></a>
                <a href="#" aria-label="Instagram"><FaInstagram /></a>
              </div>
            </div>
            <div className={styles.footerColumn}>
              <h3>Quick Links</h3>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h3>Contact Us</h3>
              <p>Email: info@sportsinsights.com</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; {new Date().getFullYear()} Sports Insights. All rights reserved.</p>
          </div>
        </footer>

        {/* Side Modal for Article Reading */}
        {showModal && selectedPost && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.sideModal} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeModalBtn} onClick={closeModal}>
                <MdClose />
              </button>
              <div className={styles.modalContent}>
                <span className={styles.category}>{selectedPost.category}</span>
                <h2>{selectedPost.title}</h2>
                <div className={styles.modalMeta}>
                  <div className={styles.author}>By {selectedPost.author}</div>
                  <div className={styles.dateAndTime}>
                    <span><FaRegClock /> {selectedPost.readTime}</span>
                    <span>{selectedPost.date}</span>
                  </div>
                </div>
                <div className={styles.modalImage}>
                  <Image 
                    src={selectedPost.image} 
                    alt={selectedPost.title}
                    width={800}
                    height={500}
                  />
                </div>
                <div className={styles.modalBody} dangerouslySetInnerHTML={{ __html: selectedPost.content }}></div>
                <div className={styles.modalTags}>
                  {selectedPost.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                <div className={styles.modalFooter}>
                  <div className={styles.socialShareLinks}>
                    <span>Share:</span>
                    <a href="#" aria-label="Share on Facebook"><FaFacebookF /></a>
                    <a href="#" aria-label="Share on Twitter"><FaTwitter /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}