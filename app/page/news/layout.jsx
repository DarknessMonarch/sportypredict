export async function generateMetadata({ searchParams }) {
  const articleSlug = searchParams?.article;
  
  // Default news page metadata
  if (!articleSlug) {
    return {
      title: 'Sports News | Latest Updates | SportyPredict',
      description: 'Your ultimate source for sports news and updates. Stay informed with the latest sports headlines and breaking news.',
      keywords: 'sports news, latest sports updates, breaking sports news, sports headlines',
      authors: [{ name: 'SportyPredict' }],
      creator: 'SportyPredict',
      publisher: 'SportyPredict',
      openGraph: {
        title: 'Sports News | Latest Updates | SportyPredict',
        description: 'Your ultimate source for sports news and updates. Stay informed with the latest sports headlines.',
        url: 'https://sportypredict.com/page/news',
        siteName: 'SportyPredict',
        images: [
          {
            url: 'https://sportypredict.com/og-news.jpg',
            width: 1200,
            height: 630,
            alt: 'SportyPredict News',
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Sports News | Latest Updates | SportyPredict',
        description: 'Your ultimate source for sports news and updates.',
        images: ['https://sportypredict.com/og-news.jpg'],
        creator: '@sportypredict',
      },
      alternates: {
        canonical: 'https://sportypredict.com/page/news',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  }

  // Dynamic metadata for specific news article
  try {
    const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
    
    // Search for news by title matching the slug
    const response = await fetch(`${SERVER_API}/news/search?q=${encodeURIComponent(articleSlug.replace(/-/g, ' '))}`, {
      next: { revalidate: 1800 } // Revalidate every 30 minutes for news
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.articles.length > 0) {
        const article = data.articles[0];
        
        const title = `${article.title} | SportyPredict News`;
        const description = article.summary || article.content?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Latest sports news and updates.';
        
        return {
          title,
          description,
          keywords: `${article.category}, sports news, ${article.title.split(' ').slice(0, 5).join(', ')}`,
          authors: [{ name: article.authorName || article.author?.username || 'SportyPredict' }],
          creator: article.authorName || article.author?.username || 'SportyPredict',
          publisher: 'SportyPredict',
          openGraph: {
            title,
            description,
            url: `https://sportypredict.com/page/news?article=${articleSlug}`,
            siteName: 'SportyPredict',
            images: article.image ? [
              {
                url: article.image,
                width: 1200,
                height: 630,
                alt: article.title,
              },
            ] : [
              {
                url: 'https://sportypredict.com/og-news.jpg',
                width: 1200,
                height: 630,
                alt: 'SportyPredict News',
              },
            ],
            locale: 'en_US',
            type: 'article',
            publishedTime: article.publishDate || article.createdAt,
            modifiedTime: article.updatedAt,
            section: article.category,
            tags: article.tags || [article.category],
          },
          twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: article.image ? [article.image] : ['https://sportypredict.com/og-news.jpg'],
            creator: '@sportypredict',
          },
          alternates: {
            canonical: `https://sportypredict.com/page/news?article=${articleSlug}`,
          },
          robots: {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              'max-image-preview': 'large',
              'max-snippet': -1,
            },
          },
        };
      }
    }
  } catch (error) {
    console.error('Error generating news metadata:', error);
  }

  // Fallback to default news metadata if article not found
  return {
    title: 'Sports News | Latest Updates | SportyPredict',
    description: 'Your ultimate source for sports news and updates. Stay informed with the latest sports headlines.',
    keywords: 'sports news, latest updates, breaking news',
    alternates: {
      canonical: 'https://sportypredict.com/page/news',
    },
  };
}

export default function NewsLayout({ children }) {
  return children;
}