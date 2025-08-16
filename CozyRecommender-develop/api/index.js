// Vercel serverless API function
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, method, body } = req;
  console.log(`${method} ${url}`);

  try {
    // Parse the URL path
    const urlPath = new URL(url, 'https://example.com').pathname;
    
    // Health check endpoint
    if (urlPath === '/api/health') {
      res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        message: 'Cozy API is running on Vercel'
      });
      return;
    }

    // Auth login endpoint
    if (urlPath === '/api/auth/login' && method === 'POST') {
      const { username } = body || {};
      
      if (!username) {
        res.status(400).json({ message: 'Username is required' });
        return;
      }

      // Create user (in real app, this would use Supabase)
      const user = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        username: username,
        preferences: {},
        subscription: 'free'
      };

      res.status(200).json({ user });
      return;
    }

    // Recommendations endpoint
    if (urlPath.startsWith('/api/recommendations/') && method === 'GET') {
      const userId = urlPath.split('/')[3];
      const urlObj = new URL(url, 'https://example.com');
      const mood = urlObj.searchParams.get('mood') || 'relaxed';
      const type = urlObj.searchParams.get('type');

      // Generate demo recommendations based on mood and type
      const demoRecommendations = generateRecommendations(mood, type);
      
      res.status(200).json(demoRecommendations);
      return;
    }

    // User endpoints
    if (urlPath.startsWith('/api/user/') && method === 'GET') {
      const userId = urlPath.split('/')[3];
      res.status(200).json({
        id: userId,
        username: `User${userId}`,
        preferences: {},
        subscription: 'free'
      });
      return;
    }

    // Favorites endpoints
    if (urlPath.startsWith('/api/favorites/') && method === 'POST') {
      const userId = urlPath.split('/')[3];
      const { recommendationId, title, type } = body || {};
      
      res.status(200).json({
        id: `fav-${Date.now()}`,
        userId,
        recommendationId,
        title,
        type,
        createdAt: new Date().toISOString()
      });
      return;
    }

    // Default response
    res.status(404).json({
      message: 'API endpoint not found',
      path: urlPath,
      method: method
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}

// Generate demo recommendations
function generateRecommendations(mood, type) {
  const recommendations = {
    relaxed: {
      movie: [
        { 
          id: 'movie-relaxed-1', 
          title: 'Lorem Ipsum Dolor', 
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 
          imageUrl: null,
          metadata: { year: 2023, cast: ['Lorem Actor', 'Ipsum Actress'], genre: 'Drama', rating: 4.2 }
        },
        { 
          id: 'movie-relaxed-2', 
          title: 'Sit Amet Consectetur', 
          description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
          imageUrl: null,
          metadata: { year: 2022, cast: ['Consectetur Actor', 'Adipiscing Actress'], genre: 'Romance', rating: 4.1 }
        },
        { 
          id: 'movie-relaxed-3', 
          title: 'Adipiscing Elit', 
          description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 
          imageUrl: null,
          metadata: { year: 2021, cast: ['Elit Actor', 'Tempor Actress'], genre: 'Comedy', rating: 3.9 }
        },
        { 
          id: 'movie-relaxed-4', 
          title: 'Tempor Incididunt', 
          description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.', 
          imageUrl: null,
          metadata: { year: 2020, cast: ['Incididunt Actor', 'Labore Actress'], genre: 'Drama', rating: 4.0 }
        },
        { 
          id: 'movie-relaxed-5', 
          title: 'Ut Labore Dolore', 
          description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.', 
          imageUrl: null,
          metadata: { year: 2019, cast: ['Labore Actor', 'Dolore Actress'], genre: 'Thriller', rating: 4.3 }
        },
        { 
          id: 'movie-relaxed-6', 
          title: 'Magna Aliqua', 
          description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.', 
          imageUrl: null,
          metadata: { year: 2018, cast: ['Magna Actor', 'Aliqua Actress'], genre: 'Adventure', rating: 3.8 }
        }
      ],
      book: [
        { 
          id: 'book-relaxed-1', 
          title: 'Lorem Ipsum Chronicles', 
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 
          imageUrl: null,
          metadata: { author: 'Lorem Author', pages: 245, genre: 'Fiction', rating: 4.2 }
        },
        { 
          id: 'book-relaxed-2', 
          title: 'Consectetur Adipiscing Guide', 
          description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
          imageUrl: null,
          metadata: { author: 'Consectetur Writer', pages: 312, genre: 'Self-Help', rating: 4.0 }
        },
        { 
          id: 'book-relaxed-3', 
          title: 'Elit Sed Do Poetry', 
          description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 
          imageUrl: null,
          metadata: { author: 'Elit Poet', pages: 198, genre: 'Poetry', rating: 4.3 }
        },
        { 
          id: 'book-relaxed-4', 
          title: 'Eiusmod Tempor Wisdom', 
          description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
          imageUrl: null,
          metadata: { author: 'Tempor Sage', pages: 267, genre: 'Philosophy', rating: 4.1 }
        },
        { 
          id: 'book-relaxed-5', 
          title: 'Incididunt Ut Labore', 
          description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.', 
          imageUrl: null,
          metadata: { author: 'Labore Novelist', pages: 189, genre: 'Memoir', rating: 3.9 }
        },
        { 
          id: 'book-relaxed-6', 
          title: 'Dolore Magna Collection', 
          description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.', 
          imageUrl: null,
          metadata: { author: 'Magna Wordsmith', pages: 223, genre: 'Essays', rating: 4.0 }
        }
      ],
      music: [
        { 
          id: 'music-relaxed-1', 
          title: 'Lorem Ipsum Beats', 
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.', 
          imageUrl: null,
          metadata: { artist: 'Lorem Musician', duration: '2h 15m', genre: 'Ambient', rating: 4.3 }
        },
        { 
          id: 'music-relaxed-2', 
          title: 'Consectetur Melodies', 
          description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.', 
          imageUrl: null,
          metadata: { artist: 'Consectetur Band', duration: '1h 45m', genre: 'Classical', rating: 4.1 }
        },
        { 
          id: 'music-relaxed-3', 
          title: 'Adipiscing Sounds', 
          description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 
          imageUrl: null,
          metadata: { artist: 'Adipiscing Artist', duration: '3h 0m', genre: 'Nature', rating: 4.2 }
        },
        { 
          id: 'music-relaxed-4', 
          title: 'Elit Harmonies', 
          description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.', 
          imageUrl: null,
          metadata: { artist: 'Elit Composer', duration: '2h 30m', genre: 'Acoustic', rating: 4.0 }
        },
        { 
          id: 'music-relaxed-5', 
          title: 'Tempor Rhythms', 
          description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.', 
          imageUrl: null,
          metadata: { artist: 'Tempor Orchestra', duration: '1h 20m', genre: 'New Age', rating: 3.9 }
        },
        { 
          id: 'music-relaxed-6', 
          title: 'Incididunt Tunes', 
          description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.', 
          imageUrl: null,
          metadata: { artist: 'Incididunt Ensemble', duration: '2h 45m', genre: 'Instrumental', rating: 4.4 }
        }
      ]
    },
    energetic: {
      movie: [
        { 
          id: 'movie-energetic-1', 
          title: 'Veniam Quis Nostrud', 
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 
          imageUrl: null,
          metadata: { year: 2023, cast: ['Veniam Actor', 'Quis Actress'], genre: 'Action', rating: 4.5 }
        },
        { 
          id: 'movie-energetic-2', 
          title: 'Nostrud Exercitation', 
          description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
          imageUrl: null,
          metadata: { year: 2022, cast: ['Nostrud Hero', 'Exercitation Star'], genre: 'Thriller', rating: 4.3 }
        },
        { 
          id: 'movie-energetic-3', 
          title: 'Ullamco Laboris', 
          description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 
          imageUrl: null,
          metadata: { year: 2021, cast: ['Ullamco Actor', 'Laboris Lead'], genre: 'Adventure', rating: 4.2 }
        },
        { 
          id: 'movie-energetic-4', 
          title: 'Nisi Ut Aliquip', 
          description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est.', 
          imageUrl: null,
          metadata: { year: 2020, cast: ['Nisi Performer', 'Aliquip Champion'], genre: 'Action', rating: 4.4 }
        },
        { 
          id: 'movie-energetic-5', 
          title: 'Ex Ea Commodo', 
          description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.', 
          imageUrl: null,
          metadata: { year: 2019, cast: ['Ex Warrior', 'Commodo Fighter'], genre: 'Sci-Fi', rating: 4.1 }
        },
        { 
          id: 'movie-energetic-6', 
          title: 'Consequat Duis', 
          description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta.', 
          imageUrl: null,
          metadata: { year: 2018, cast: ['Consequat Agent', 'Duis Guardian'], genre: 'Action', rating: 4.6 }
        }
      ],
      book: [
        { 
          id: 'book-energetic-1', 
          title: 'Aute Irure Dolor', 
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.', 
          imageUrl: null,
          metadata: { author: 'Irure Author', pages: 374, genre: 'Adventure', rating: 4.1 }
        },
        { 
          id: 'book-energetic-2', 
          title: 'Reprehenderit Voluptate', 
          description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
          imageUrl: null,
          metadata: { author: 'Voluptate Writer', pages: 342, genre: 'Thriller', rating: 4.0 }
        },
        { 
          id: 'book-energetic-3', 
          title: 'Velit Esse Cillum', 
          description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 
          imageUrl: null,
          metadata: { author: 'Cillum Novelist', pages: 369, genre: 'Sci-Fi', rating: 4.4 }
        },
        { 
          id: 'book-energetic-4', 
          title: 'Dolore Eu Fugiat', 
          description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
          imageUrl: null,
          metadata: { author: 'Fugiat Runner', pages: 287, genre: 'Sports', rating: 4.2 }
        },
        { 
          id: 'book-energetic-5', 
          title: 'Nulla Pariatur', 
          description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.', 
          imageUrl: null,
          metadata: { author: 'Pariatur Expert', pages: 320, genre: 'Self-Help', rating: 4.5 }
        },
        { 
          id: 'book-energetic-6', 
          title: 'Excepteur Sint', 
          description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.', 
          imageUrl: null,
          metadata: { author: 'Sint Motivator', pages: 315, genre: 'Psychology', rating: 4.3 }
        }
      ],
      music: [
        { 
          id: 'music-energetic-1', 
          title: 'Occaecat Cupidatat', 
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.', 
          imageUrl: null,
          metadata: { artist: 'Cupidatat Band', duration: '1h 45m', genre: 'Electronic', rating: 4.5 }
        },
        { 
          id: 'music-energetic-2', 
          title: 'Non Proident', 
          description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.', 
          imageUrl: null,
          metadata: { artist: 'Proident DJ', duration: '2h 30m', genre: 'Dance', rating: 4.3 }
        },
        { 
          id: 'music-energetic-3', 
          title: 'Sunt In Culpa', 
          description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 
          imageUrl: null,
          metadata: { artist: 'Culpa Rockers', duration: '1h 20m', genre: 'Rock', rating: 4.4 }
        },
        { 
          id: 'music-energetic-4', 
          title: 'Qui Officia', 
          description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.', 
          imageUrl: null,
          metadata: { artist: 'Officia Crew', duration: '1h 55m', genre: 'Hip Hop', rating: 4.6 }
        },
        { 
          id: 'music-energetic-5', 
          title: 'Deserunt Mollit', 
          description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.', 
          imageUrl: null,
          metadata: { artist: 'Mollit Fitness', duration: '2h 15m', genre: 'Workout', rating: 4.2 }
        },
        { 
          id: 'music-energetic-6', 
          title: 'Anim Id Est', 
          description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.', 
          imageUrl: null,
          metadata: { artist: 'Est Collective', duration: '1h 35m', genre: 'Pop', rating: 4.3 }
        }
      ]
    },
    creative: {
      movie: [
        { 
          id: 'movie-creative-1', 
          title: 'Laborum Sed Ut', 
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 
          imageUrl: null,
          metadata: { year: 2023, cast: ['Laborum Artist', 'Sed Creator'], genre: 'Drama', rating: 4.7 }
        },
        { 
          id: 'movie-creative-2', 
          title: 'Perspiciatis Unde', 
          description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
          imageUrl: null,
          metadata: { year: 2022, cast: ['Perspiciatis Visionary', 'Unde Dreamer'], genre: 'Fantasy', rating: 4.5 }
        },
        { 
          id: 'movie-creative-3', 
          title: 'Omnis Iste Natus', 
          description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 
          imageUrl: null,
          metadata: { year: 2021, cast: ['Omnis Innovator', 'Natus Pioneer'], genre: 'Sci-Fi', rating: 4.6 }
        },
        { 
          id: 'movie-creative-4', 
          title: 'Error Sit Voluptatem', 
          description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.', 
          imageUrl: null,
          metadata: { year: 2020, cast: ['Error Genius', 'Voluptatem Muse'], genre: 'Art Film', rating: 4.3 }
        },
        { 
          id: 'movie-creative-5', 
          title: 'Accusantium Doloremque', 
          description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.', 
          imageUrl: null,
          metadata: { year: 2019, cast: ['Accusantium Director', 'Doloremque Star'], genre: 'Experimental', rating: 4.1 }
        },
        { 
          id: 'movie-creative-6', 
          title: 'Laudantium Totam', 
          description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.', 
          imageUrl: null,
          metadata: { year: 2018, cast: ['Laudantium Mastermind', 'Totam Visionary'], genre: 'Indie', rating: 4.4 }
        }
      ],
      book: [
        { 
          id: 'book-creative-1', 
          title: 'Rem Aperiam Eaque', 
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.', 
          imageUrl: null,
          metadata: { author: 'Aperiam Creator', pages: 276, genre: 'Creativity', rating: 4.2 }
        },
        { 
          id: 'book-creative-2', 
          title: 'Ipsa Quae Ab', 
          description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
          imageUrl: null,
          metadata: { author: 'Quae Artist', pages: 272, genre: 'Art Theory', rating: 4.1 }
        },
        { 
          id: 'book-creative-3', 
          title: 'Illo Inventore', 
          description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 
          imageUrl: null,
          metadata: { author: 'Inventore Guide', pages: 160, genre: 'Design', rating: 4.0 }
        },
        { 
          id: 'book-creative-4', 
          title: 'Veritatis Quasi', 
          description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est.', 
          imageUrl: null,
          metadata: { author: 'Veritatis Sage', pages: 198, genre: 'Philosophy', rating: 4.3 }
        },
        { 
          id: 'book-creative-5', 
          title: 'Architecto Beatae', 
          description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.', 
          imageUrl: null,
          metadata: { author: 'Beatae Builder', pages: 234, genre: 'Innovation', rating: 3.9 }
        },
        { 
          id: 'book-creative-6', 
          title: 'Vitae Dicta Sunt', 
          description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta.', 
          imageUrl: null,
          metadata: { author: 'Dicta Thinker', pages: 187, genre: 'Inspiration', rating: 4.2 }
        }
      ],
      music: [
        { 
          id: 'music-creative-1', 
          title: 'Explicabo Enim', 
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.', 
          imageUrl: null,
          metadata: { artist: 'Explicabo Collective', duration: '2h 10m', genre: 'Experimental', rating: 4.3 }
        },
        { 
          id: 'music-creative-2', 
          title: 'Ipsam Voluptatem', 
          description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.', 
          imageUrl: null,
          metadata: { artist: 'Voluptatem Orchestra', duration: '1h 55m', genre: 'Ambient', rating: 4.2 }
        },
        { 
          id: 'music-creative-3', 
          title: 'Quia Voluptas', 
          description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 
          imageUrl: null,
          metadata: { artist: 'Voluptas Ensemble', duration: '2h 45m', genre: 'World Fusion', rating: 4.4 }
        },
        { 
          id: 'music-creative-4', 
          title: 'Sit Aspernatur', 
          description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.', 
          imageUrl: null,
          metadata: { artist: 'Aspernatur Studio', duration: '1h 30m', genre: 'Minimalist', rating: 4.0 }
        },
        { 
          id: 'music-creative-5', 
          title: 'Aut Odit Fugit', 
          description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.', 
          imageUrl: null,
          metadata: { artist: 'Odit Soundscape', duration: '2h 20m', genre: 'Electronic', rating: 4.1 }
        },
        { 
          id: 'music-creative-6', 
          title: 'Sed Quia Consequuntur', 
          description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.', 
          imageUrl: null,
          metadata: { artist: 'Consequuntur Labs', duration: '1h 45m', genre: 'Neoclassical', rating: 4.3 }
        }
      ]
    },
    nostalgic: {
      movie: [
        { id: 28, title: 'Back to the Future', description: 'Classic time-travel adventure', rating: 4.6 },
        { id: 29, title: 'The Princess Bride', description: 'Timeless fantasy adventure', rating: 4.7 },
        { id: 30, title: 'Forrest Gump', description: 'Journey through decades of memories', rating: 4.5 }
      ],
      book: [
        { id: 31, title: 'The Wonder Years', description: 'Coming-of-age stories', rating: 4.1 },
        { id: 32, title: 'Childhood Classics', description: 'Books that shaped generations', rating: 4.3 },
        { id: 33, title: 'Historical Fiction', description: 'Stories from bygone eras', rating: 4.2 }
      ],
      music: [
        { id: 34, title: '90s Hits Playlist', description: 'Take a trip down memory lane', rating: 4.4 },
        { id: 35, title: 'Classic Rock', description: 'Timeless songs from decades past', rating: 4.5 },
        { id: 36, title: 'Retro Pop', description: 'Feel-good hits from the past', rating: 4.3 }
      ]
    }
  };

  const moodRecs = recommendations[mood] || recommendations.relaxed;
  
  if (type) {
    const typeRecs = moodRecs[type] || [];
    return typeRecs.map(rec => ({ ...rec, type, mood }));
  }
  
  // Return mixed recommendations if no specific type
  return [
    ...moodRecs.movie.slice(0, 2).map(rec => ({ ...rec, type: 'movie', mood })),
    ...moodRecs.book.slice(0, 2).map(rec => ({ ...rec, type: 'book', mood })),
    ...moodRecs.music.slice(0, 2).map(rec => ({ ...rec, type: 'music', mood }))
  ];
}