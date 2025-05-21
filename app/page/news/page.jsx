"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "@/app/style/news.module.css";


export default function SportsNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "football",
    image: ""
  });
  const [categories, setCategories] = useState([
    "football", "basketball", "tennis", "cricket", "golf", "other"
  ]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingArticle, setEditingArticle] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const mockArticles = [
          {
            id: 1,
            title: "Liverpool secures dramatic win against Manchester City",
            content: "In a thrilling match at Anfield, Liverpool secured a last-minute winner against title rivals Manchester City.",
            category: "football",
            image: "/images/liverpool-mancity.jpg",
            date: "2025-04-17",
            author: "John Smith"
          },
          {
            id: 2,
            title: "Lakers dominate Celtics in season opener",
            content: "LeBron James led the Lakers to a commanding victory over the Boston Celtics in the NBA season opener.",
            category: "basketball",
            image: "/images/lakers-celtics.jpg",
            date: "2025-04-16",
            author: "Mike Johnson"
          },
          {
            id: 3,
            title: "Serena Williams announces comeback tour",
            content: "Tennis legend Serena Williams has announced she will return to professional tennis next season.",
            category: "tennis",
            image: "/images/serena-williams.jpg",
            date: "2025-04-15",
            author: "Sarah Davis"
          }
        ];
        
        setTimeout(() => {
          setArticles(mockArticles);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching news:', error);
        toast.error('Failed to load sports news');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);


  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };



  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const filteredArticles = selectedCategory === "all" 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div className={styles.blogContainer}>
      <header className={styles.header}>
        <h1>Sports Central</h1>
        <p>Your ultimate source for sports news and updates</p>
      </header>

      <div className={styles.actionsBar}>

        <div className={styles.categoryFilter}>
          <label htmlFor="category-filter">Filter by category:</label>
          <select 
            id="category-filter" 
            value={selectedCategory}
            onChange={handleCategoryChange}
            className={styles.select}
            aria-label="Filter articles by category"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.articlesContainer}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading sports news...</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <article key={article.id} className={styles.articleCard}>
              {article.image && (
                <div className={styles.articleImage}>
                  <Image 
                    src={article.image} 
                    alt={article.title || "Article image"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
              <div className={styles.articleMeta}>
                <span className={`${styles.category} ${styles[`category-${article.category}`]}`}>
                  {article.category}
                </span>
                <span className={styles.date}>{article.date}</span>
              </div>
              <h2 className={styles.articleTitle}>{article.title}</h2>
              <p className={styles.articleAuthor}>By {article.author}</p>
              <div className={styles.articleContent}>
                <p>{article.content}</p>
              </div>
            
            </article>
          ))
        ) : (
          <div className={styles.noResults}>
            <p>No articles found for the selected category.</p>
          </div>
        )}
      </div>

    </div>
  );
}