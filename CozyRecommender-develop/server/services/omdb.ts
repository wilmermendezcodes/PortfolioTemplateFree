// Free Movie API service for movie data (no API key required)
interface FreeMovieResponse {
  ok?: boolean;
  description?: Array<{
    '#TITLE'?: string;
    '#YEAR'?: number;
    '#IMDB_ID'?: string;
    '#ACTORS'?: string;
    '#IMG_POSTER'?: string;
    '#IMDB_URL'?: string;
    '#RANK'?: number;
  }>;
  error_code?: number;
}

export interface MovieData {
  title: string;
  description: string;
  imageUrl: string | null;
  metadata: {
    year: number | null;
    director: string | null;
    cast: string[] | null;
    genre: string | null;
    duration: string | null;
    rating: number | null;
    imdbRating: string | null;
    released: string | null;
    writer: string | null;
    imdbId: string | null;
  };
}

const FREE_MOVIE_API_BASE = 'https://imdb.iamidiotareyoutoo.com';

// Expanded movie queries by mood for better variety and rotation
const MOVIE_QUERIES_BY_MOOD: Record<string, string[]> = {
  relaxed: ['The Grand Budapest Hotel', 'Lost in Translation', 'Her', 'Before Sunrise', 'Midnight in Paris', 'Little Miss Sunshine', 'The Royal Tenenbaums', 'Amélie', 'Call Me By Your Name', 'Frances Ha', 'The Way Way Back', 'Chef', 'Julie & Julia', 'About Time', 'The Holiday'],
  energetic: ['Mad Max Fury Road', 'John Wick', 'Mission Impossible', 'Baby Driver', 'The Matrix', 'Speed', 'Fast Five', 'Guardians of the Galaxy', 'Iron Man', 'Thor', 'Top Gun Maverick', 'Edge of Tomorrow', 'Pacific Rim', 'Crank', 'Rush'],
  creative: ['Inception', 'Eternal Sunshine', 'Birdman', 'Black Swan', 'Mulholland Drive', 'Being John Malkovich', 'Synecdoche New York', 'Adaptation', 'Her', 'Ex Machina', 'Blade Runner 2049', 'Arrival', 'Interstellar', 'The Tree of Life', 'Annihilation'],
  nostalgic: ['Casablanca', 'The Godfather', 'Roman Holiday', 'Singin in the Rain', 'Citizen Kane', 'Sunset Boulevard', 'Some Like It Hot', 'Vertigo', 'North by Northwest', 'The Wizard of Oz', 'Gone with the Wind', 'Lawrence of Arabia', 'The Sound of Music', 'My Fair Lady', 'West Side Story'],
  romantic: ['The Princess Bride', 'When Harry Met Sally', 'Titanic', 'The Notebook', 'Sleepless in Seattle', 'You\'ve Got Mail', 'Love Actually', 'Notting Hill', 'Pretty Woman', 'Ghost', 'Dirty Dancing', 'The Time Traveler\'s Wife', 'Eternal Sunshine', 'La La Land', 'The Shape of Water'],
  adventurous: ['Indiana Jones', 'Pirates of the Caribbean', 'Lord of the Rings', 'The Mummy', 'National Treasure', 'Jurassic Park', 'Avatar', 'The Chronicles of Narnia', 'The Hobbit', 'Star Wars', 'Tomb Raider', 'The Jungle Book', 'Life of Pi', 'Cast Away', 'Into the Wild'],
  mysterious: ['Gone Girl', 'The Sixth Sense', 'Shutter Island', 'The Prestige', 'Zodiac', 'Se7en', 'The Silence of the Lambs', 'Memento', 'The Others', 'The Village', 'Mystic River', 'Prisoners', 'Knives Out', 'The Girl with the Dragon Tattoo', 'L.A. Confidential'],
  uplifting: ['The Pursuit of Happyness', 'Forrest Gump', 'Good Will Hunting', 'Dead Poets Society', 'The Shawshank Redemption', 'It\'s a Wonderful Life', 'Rocky', 'Rudy', 'The Blind Side', 'Remember the Titans', 'Coach Carter', 'The Karate Kid', 'Yes Man', 'Eat Pray Love', 'The Secret Life of Walter Mitty'],
  contemplative: ['Her', 'Lost in Translation', 'The Tree of Life', 'Boyhood', 'Manchester by the Sea', 'Moonlight', 'The Master', 'There Will Be Blood', 'No Country for Old Men', 'The Social Network', 'Birdman', 'American Beauty', 'Fight Club', 'The Matrix', 'Blade Runner'],
  festive: ['Home Alone', 'Elf', 'The Holiday', 'Love Actually', 'A Christmas Story', 'It\'s a Wonderful Life', 'White Christmas', 'The Polar Express', 'Miracle on 34th Street', 'Christmas Vacation', 'The Santa Clause', 'Jingle All the Way', 'Four Weddings and a Funeral', 'My Big Fat Greek Wedding', 'The Wedding Singer']
};

// Keep track of previously served movies to ensure rotation
let movieRotationIndex: Record<string, number> = {};

export async function fetchMoviesByMood(mood: string): Promise<MovieData[]> {
  // Always return Lorem ipsum placeholder movies
  return getFallbackMovies(mood);
}

function transformFreeMovieResponse(movieData: any, searchQuery: string): MovieData {
  return {
    title: movieData['#TITLE'] || searchQuery,
    description: `A captivating ${movieData['#YEAR'] ? `${movieData['#YEAR']} ` : ''}film featuring ${movieData['#ACTORS'] || 'talented actors'}.`,
    imageUrl: movieData['#IMG_POSTER'] || null,
    metadata: {
      year: movieData['#YEAR'] || null,
      director: null, // API doesn't provide director info in search results
      cast: movieData['#ACTORS'] ? movieData['#ACTORS'].split(', ') : null,
      genre: null, // API doesn't provide genre info in search results
      duration: null,
      rating: null,
      imdbRating: null,
      released: movieData['#YEAR'] ? movieData['#YEAR'].toString() : null,
      writer: null,
      imdbId: movieData['#IMDB_ID'] || null,
    }
  };
}

function getFallbackMovies(mood: string): MovieData[] {
  const fallbackMovies: Record<string, MovieData[]> = {
    relaxed: [
      {
        title: "Lorem Ipsum Dolor",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageUrl: null,
        metadata: {
          year: 2023,
          director: "Lorem Director",
          cast: ["Lorem Actor", "Ipsum Actress"],
          genre: "Drama",
          duration: "105 min",
          rating: 4.2,
          imdbRating: "4.2",
          released: "2023",
          writer: "Lorem Writer",
          imdbId: null,
        }
      },
      {
        title: "Sit Amet Consectetur",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        imageUrl: null,
        metadata: {
          year: 2022,
          director: "Consectetur Director",
          cast: ["Consectetur Actor", "Adipiscing Actress"],
          genre: "Romance",
          duration: "98 min",
          rating: 4.1,
          imdbRating: "4.1",
          released: "2022",
          writer: "Consectetur Writer",
          imdbId: null,
        }
      },
      {
        title: "Adipiscing Elit Sed",
        description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        imageUrl: null,
        metadata: {
          year: 2021,
          director: "Elit Director",
          cast: ["Elit Actor", "Tempor Actress"],
          genre: "Comedy",
          duration: "112 min",
          rating: 3.9,
          imdbRating: "3.9",
          released: "2021",
          writer: "Elit Writer",
          imdbId: null,
        }
      },
      {
        title: "Do Eiusmod Tempor",
        description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        imageUrl: null,
        metadata: {
          year: 2020,
          director: "Tempor Director",
          cast: ["Eiusmod Actor", "Tempor Lead"],
          genre: "Drama",
          duration: "127 min",
          rating: 4.0,
          imdbRating: "4.0",
          released: "2020",
          writer: "Tempor Writer",
          imdbId: null,
        }
      }
    ],
    energetic: [
      {
        title: "Veniam Quis Nostrud",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageUrl: null,
        metadata: {
          year: 2023,
          director: "Veniam Director",
          cast: ["Veniam Actor", "Quis Actress"],
          genre: "Action",
          duration: "128 min",
          rating: 4.5,
          imdbRating: "4.5",
          released: "2023",
          writer: "Marcus Johnson, Alex Rivera",
          imdbId: null,
        }
      }
    ],
    creative: [
      {
        title: "Canvas Dreams",
        description: "An artistic exploration of creativity, imagination, and the power of visual storytelling.",
        imageUrl: null,
        metadata: {
          year: 2023,
          director: "Ari Aster",
          cast: ["Tilda Swinton", "Oscar Isaac"],
          genre: "Fantasy Drama",
          duration: "112 min",
          rating: 8.5,
          imdbRating: "8.5",
          released: "September 8, 2023",
          writer: "Ari Aster",
          imdbId: null,
        }
      }
    ],
    nostalgic: [
      {
        title: "Yesterday's Echo",
        description: "A touching story that captures the warmth and bittersweet nature of cherished memories.",
        imageUrl: null,
        metadata: {
          year: 2023,
          director: "Nancy Meyers",
          cast: ["Meryl Streep", "Robert Redford"],
          genre: "Drama",
          duration: "118 min",
          rating: 8.0,
          imdbRating: "8.0",
          released: "November 12, 2023",
          writer: "Nancy Meyers",
          imdbId: null,
        }
      }
    ]
  };
  
  return fallbackMovies[mood] || fallbackMovies.relaxed;
}