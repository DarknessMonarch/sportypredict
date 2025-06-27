export async function generateMetadata({ searchParams }) {
  const blogSlug = searchParams?.blog;
  
  if (!blogSlug) {
    return {
      title: 'Sports Blog | Expert Insights | SportyPredict',
      description: 'Expert insights, analysis and thoughts on sports betting, predictions, and industry trends. Stay informed with the latest sports analysis.',
      keywords: 'sports blog, betting insights, sports analysis, expert predictions, sports commentary',
      authors: [{ name: 'SportyPredict' }],
      creator: 'SportyPredict',
      publisher: 'SportyPredict',
      openGraph: {
        title: 'Sports Blog | Expert Insights | SportyPredict',
        description: 'Expert insights, analysis and thoughts on sports betting, predictions, and industry trends.',
        url: 'https://sportypredict.com/page/blog',
        siteName: 'SportyPredict',
        images: [
          {
            url: 'https://sportypredict.com/assets/banner.jpg',
            width: 1200,
            height: 630,
            alt: 'SportyPredict Blog',
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Sports Blog | Expert Insights | SportyPredict',
        description: 'Expert insights, analysis and thoughts on sports betting, predictions, and industry trends.',
        images: ['https://sportypredict.com/assets/banner.jpg'],
        creator: '@sportypredict',
      },
      alternates: {
        canonical: 'https://sportypredict.com/page/blog',
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

  // Dynamic metadata for specific blog post
  try {
    const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
    
    // Search for blog by title matching the slug
    const response = await fetch(`${SERVER_API}/blog?search=${encodeURIComponent(blogSlug.replace(/-/g, ' '))}`, {
      next: { revalidate: 3600 }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.blogs.length > 0) {
        const blog = data.blogs[0];
        
        const title = `${blog.title} | SportyPredict Blog`;
        const description = blog.excerpt || blog.content?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Expert sports insights and analysis.';
        
        return {
          title,
          description,
          keywords: blog.tags?.join(', ') || 'sports, betting, predictions, analysis',
          authors: [{ name: blog.author || 'SportyPredict' }],
          creator: blog.author || 'SportyPredict',
          publisher: 'SportyPredict',
          openGraph: {
            title,
            description,
            url: `https://sportypredict.com/page/blog?blog=${blogSlug}`,
            siteName: 'SportyPredict',
            images: blog.image ? [
              {
                url: blog.image,
                width: 1200,
                height: 630,
                alt: blog.title,
              },
            ] : [
              {
                url: 'https://sportypredict.com/og-blog.jpg',
                width: 1200,
                height: 630,
                alt: 'SportyPredict Blog',
              },
            ],
            locale: 'en_US',
            type: 'article',
            publishedTime: blog.publishedAt || blog.createdAt,
            modifiedTime: blog.updatedAt,
            section: blog.category,
            tags: blog.tags,
          },
          twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: blog.image ? [blog.image] : ['https://sportypredict.com/og-blog.jpg'],
            creator: '@sportypredict',
          },
          alternates: {
            canonical: `https://sportypredict.com/page/blog?blog=${blogSlug}`,
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
    console.error('Error generating blog metadata:', error);
  }

  // Fallback to default blog metadata if blog not found
  return {
    title: 'Sports Blog | Expert Insights | SportyPredict',
    description: 'Expert insights, analysis and thoughts on sports betting, predictions, and industry trends.',
    keywords: 'sports blog, betting insights, sports analysis, expert predictions',
    alternates: {
      canonical: 'https://sportypredict.com/page/blog',
    },
  };
}

export default function BlogLayout({ children }) {
  return children;
}