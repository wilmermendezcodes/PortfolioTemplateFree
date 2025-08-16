import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  structuredData?: object;
  searchTerms?: string[];
  contentType?: 'movie' | 'book' | 'music' | 'general';
}

export function SEOHead({
  title = "Cozy - AI-Powered Movie, Book & Music Recommendations",
  description = "Discover personalized entertainment with Cozy's AI-powered recommendations. Get mood-based suggestions for movies, books, and music. Premium recommendations starting at $1/month.",
  keywords = "AI recommendations, movie suggestions, book recommendations, music discovery, mood-based content, entertainment app, personalized recommendations, subscription service",
  canonical,
  ogImage = "https://cozy-recommendations.replit.app/og-image.png",
  noIndex = false,
  structuredData,
  searchTerms = [],
  contentType = 'general'
}: SEOHeadProps) {
  
  // Enhanced keywords based on content type and search terms
  const getEnhancedKeywords = () => {
    let baseKeywords = keywords;
    
    // Add content-specific search terms
    const contentKeywords = {
      movie: "movies, films, cinema, movie recommendations, film suggestions, watch movies, movie search, best movies, popular films, movie finder, film discovery, entertainment",
      book: "books, novels, literature, book recommendations, reading suggestions, book search, best books, popular novels, book finder, book discovery, reading list, authors",
      music: "music, songs, albums, artists, music recommendations, song suggestions, music search, best music, popular songs, music finder, music discovery, playlists, bands",
      general: "entertainment, recommendations, discover, find, search, suggestions"
    };
    
    // Combine with search terms
    const enhancedTerms = [
      baseKeywords,
      contentKeywords[contentType],
      ...searchTerms,
      // Common search patterns
      "find " + contentType,
      "search " + contentType,
      "discover " + contentType,
      "recommend " + contentType,
      "suggest " + contentType,
      "best " + contentType,
      "popular " + contentType,
      contentType + " finder",
      contentType + " discovery",
      contentType + " recommendations"
    ].filter(Boolean).join(", ");
    
    return enhancedTerms;
  };
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta tags with enhanced keywords
    const enhancedKeywords = getEnhancedKeywords();
    updateMetaTag('description', description);
    updateMetaTag('keywords', enhancedKeywords);
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    
    // Add search-specific meta tags
    updateMetaTag('application-name', 'Cozy Recommendations');
    updateMetaTag('author', 'Cozy Entertainment Platform');
    updateMetaTag('generator', 'Cozy AI Recommendation Engine');
    updateMetaTag('subject', `${contentType} recommendations and discovery`);
    updateMetaTag('abstract', description);
    updateMetaTag('topic', `${contentType} search and recommendations`);
    updateMetaTag('summary', description);
    updateMetaTag('classification', 'Entertainment, Recommendations, AI, Search');
    updateMetaTag('category', `${contentType} discovery platform`);
    updateMetaTag('coverage', 'Worldwide');
    updateMetaTag('distribution', 'Global');
    updateMetaTag('rating', 'General');
    updateMetaTag('revisit-after', '1 day');
    
    // Update Open Graph tags
    updateMetaProperty('og:title', title);
    updateMetaProperty('og:description', description);
    updateMetaProperty('og:image', ogImage);
    updateMetaProperty('og:url', canonical || window.location.href);
    
    // Update Twitter tags
    updateMetaProperty('twitter:title', title);
    updateMetaProperty('twitter:description', description);
    updateMetaProperty('twitter:image', ogImage);
    updateMetaProperty('twitter:url', canonical || window.location.href);
    
    // Update canonical URL
    if (canonical) {
      updateCanonicalUrl(canonical);
    }
    
    // Add structured data
    if (structuredData) {
      addStructuredData(structuredData);
    }
    
    // Cleanup function
    return () => {
      // Remove structured data on component unmount
      if (structuredData) {
        removeStructuredData();
      }
    };
  }, [title, description, keywords, canonical, ogImage, noIndex, structuredData]);

  return null; // This component doesn't render anything
}

function updateMetaTag(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateMetaProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateCanonicalUrl(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = url;
}

function addStructuredData(data: object) {
  removeStructuredData(); // Remove existing structured data first
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'structured-data';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function removeStructuredData() {
  const existingScript = document.getElementById('structured-data');
  if (existingScript) {
    existingScript.remove();
  }
}