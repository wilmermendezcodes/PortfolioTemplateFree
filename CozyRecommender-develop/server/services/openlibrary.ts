// Open Library API service for book data
interface OpenLibrarySearchResponse {
  docs: OpenLibraryBook[];
  numFound: number;
}

interface OpenLibraryBook {
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  publisher?: string[];
  subject?: string[];
  isbn?: string[];
  cover_i?: number;
  ratings_average?: number;
  ratings_count?: number;
  key?: string;
}

export interface BookData {
  title: string;
  description: string;
  imageUrl: string | null;
  metadata: {
    author: string | null;
    year: number | null;
    publisher: string | null;
    pages: number | null;
    genre: string | null;
    rating: number | null;
    isbn: string | null;
    subjects: string[] | null;
  };
}

const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';

// Expanded book queries by mood for better variety and rotation
const BOOK_QUERIES_BY_MOOD: Record<string, string[]> = {
  relaxed: ['The Alchemist', 'Eat Pray Love', 'The Little Prince', 'Zen and the Art', 'Mindfulness', 'The Power of Now', 'Wild', 'A Walk in the Woods', 'The Secret Garden', 'Anne of Green Gables', 'The Book Thief', 'Life of Pi', 'The Kite Runner', 'The Help', 'Where the Crawdads Sing'],
  energetic: ['The Hunger Games', 'Ready Player One', 'Dune', 'The Martian', 'Gone Girl', 'The Girl with the Dragon Tattoo', 'The Da Vinci Code', 'Jurassic Park', 'The Maze Runner', 'Divergent', 'The Bourne Identity', 'The Hunt for Red October', 'World War Z', 'The Road', 'Station Eleven'],
  creative: ['Big Magic', 'The Artist Way', 'Steal Like an Artist', 'On Writing', 'Bird by Bird', 'The Creative Habit', 'Art & Fear', 'The War of Art', 'Drawing on the Right Side of the Brain', 'The Elements of Style', 'Save the Cat', 'The Hero with a Thousand Faces', 'Story', 'The Writer\'s Journey', 'A Writer\'s Diary'],
  nostalgic: ['To Kill a Mockingbird', 'The Great Gatsby', 'Pride and Prejudice', 'Jane Eyre', 'Wuthering Heights', 'Little Women', 'The Catcher in the Rye', 'Of Mice and Men', 'The Grapes of Wrath', '1984', 'Brave New World', 'Lord of the Flies', 'The Color Purple', 'Beloved', 'The Sun Also Rises'],
  romantic: ['Pride and Prejudice', 'Jane Eyre', 'Outlander', 'Me Before You', 'The Time Traveler\'s Wife', 'The Princess Bride', 'Gone with the Wind', 'Doctor Zhivago', 'Wuthering Heights', 'Romeo and Juliet', 'The Great Gatsby', 'Anna Karenina', 'Casablanca', 'The English Patient', 'One Day'],
  adventurous: ['Into the Wild', 'Wild', 'The Beach', 'On the Road', 'Treasure Island', 'Robinson Crusoe', 'The Count of Monte Cristo', 'Around the World in 80 Days', 'The Adventures of Tom Sawyer', 'Moby Dick', 'The Call of the Wild', 'Lord of the Flies', 'Life of Pi', 'The Revenant', 'Endurance'],
  mysterious: ['Gone Girl', 'The Girl with the Dragon Tattoo', 'In the Woods', 'The Silent Patient', 'Big Little Lies', 'Sharp Objects', 'The Woman in the Window', 'Rebecca', 'And Then There Were None', 'The Murder of Roger Ackroyd', 'The Maltese Falcon', 'The Big Sleep', 'Mystic River', 'Shutter Island', 'The Talented Mr. Ripley'],
  uplifting: ['The Alchemist', 'The Power of One', 'A Man Called Ove', 'Wonder', 'The Book Thief', 'The Help', 'Life of Pi', 'The Kite Runner', 'The Pursuit of Happyness', 'Tuesdays with Morrie', 'The Last Lecture', 'When Breath Becomes Air', 'Educated', 'Becoming', 'The Seven Habits'],
  contemplative: ['Siddhartha', 'The Stranger', 'Zen and the Art of Motorcycle Maintenance', 'The Tao of Physics', 'Man\'s Search for Meaning', 'Meditations', 'The Power of Now', 'A New Earth', 'The Four Agreements', 'The Prophet', 'Letters to a Young Poet', 'Walden', 'On the Shortness of Life', 'The Art of Living', 'Being and Time'],
  festive: ['A Christmas Carol', 'The Polar Express', 'The Gift of the Magi', 'Little Women', 'The Lion the Witch and the Wardrobe', 'Harry Potter', 'The Night Before Christmas', 'Miracle on 34th Street', 'Holiday Inn', 'The Christmas Box', 'Skipping Christmas', 'The Best Christmas Pageant Ever', 'A Christmas Story', 'The Christmas Carol', 'Christmas Jars']
};

// Keep track of previously served books to ensure rotation
let bookRotationIndex: Record<string, number> = {};

export async function fetchBooksByMood(mood: string): Promise<BookData[]> {
  // Always return Lorem ipsum placeholder books
  return getFallbackBooks(mood);
}

async function transformOpenLibraryResponse(book: OpenLibraryBook): Promise<BookData> {
  let description = "No description available";
  
  // Try to fetch book description from the works API
  if (book.key) {
    try {
      const workResponse = await fetch(`${OPEN_LIBRARY_BASE_URL}${book.key}.json`);
      const workData = await workResponse.json();
      if (workData.description) {
        description = typeof workData.description === 'string' 
          ? workData.description 
          : workData.description.value || description;
      }
    } catch (error) {
      // Use fallback description
    }
  }

  return {
    title: book.title || 'Unknown Title',
    description: description,
    imageUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : null,
    metadata: {
      author: book.author_name ? book.author_name[0] : null,
      year: book.first_publish_year || null,
      publisher: book.publisher ? book.publisher[0] : null,
      pages: null, // Open Library doesn't consistently provide page counts in search
      genre: book.subject ? book.subject.slice(0, 3).join(', ') : null,
      rating: book.ratings_average || null,
      isbn: book.isbn ? book.isbn[0] : null,
      subjects: book.subject ? book.subject.slice(0, 5) : null,
    }
  };
}

function getFallbackBooks(mood: string): BookData[] {
  const fallbackBooks: Record<string, BookData[]> = {
    relaxed: [
      {
        title: "Lorem Ipsum Chronicles",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageUrl: null,
        metadata: {
          author: "Lorem Author",
          year: 2023,
          publisher: "Lorem Press",
          pages: 245,
          genre: "Fiction",
          rating: 4.2,
          isbn: "978-1234567890",
          subjects: ["Lorem", "Ipsum", "Dolor", "Sit", "Amet"],
        }
      },
      {
        title: "Consectetur Adipiscing Guide",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        imageUrl: null,
        metadata: {
          author: "Consectetur Writer",
          year: 2022,
          publisher: "Elit Press",
          pages: 312,
          genre: "Self-Help",
          rating: 4.0,
          isbn: "978-1234567891",
          subjects: ["Consectetur", "Adipiscing", "Elit", "Sed", "Do"],
        }
      },
      {
        title: "Elit Sed Do Poetry",
        description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        imageUrl: null,
        metadata: {
          author: "Elit Poet",
          year: 2021,
          publisher: "Tempor Books",
          pages: 198,
          genre: "Poetry",
          rating: 4.3,
          isbn: "978-1234567892",
          subjects: ["Poetry", "Elit", "Tempor", "Incididunt", "Ut"],
        }
      },
      {
        title: "Eiusmod Tempor Wisdom",
        description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        imageUrl: null,
        metadata: {
          author: "Tempor Sage",
          year: 2020,
          publisher: "Labore Publishing",
          pages: 267,
          genre: "Philosophy",
          rating: 4.1,
          isbn: "978-1234567893",
          subjects: ["Philosophy", "Tempor", "Labore", "Dolore", "Magna"],
        }
      }
    ],
    energetic: [
      {
        title: "Velocity Rising",
        description: "A thrilling adventure that takes readers on a non-stop journey through unexpected challenges and discoveries.",
        imageUrl: null,
        metadata: {
          author: "Jake Rodriguez",
          year: 2023,
          publisher: "Adventure Books",
          pages: 320,
          genre: "Adventure, Thriller",
          rating: 4.1,
          isbn: "978-1234567891",
          subjects: ["Adventure", "Thriller", "Action", "Suspense", "Fiction"],
        }
      }
    ],
    creative: [
      {
        title: "The Artist's Journey",
        description: "An inspiring guide to unlocking creativity and embracing the artistic process in everyday life.",
        imageUrl: null,
        metadata: {
          author: "Maya Chen",
          year: 2023,
          publisher: "Creative Minds Publishing",
          pages: 280,
          genre: "Art, Creativity",
          rating: 4.6,
          isbn: "978-1234567892",
          subjects: ["Art", "Creativity", "Self-Help", "Inspiration", "Design"],
        }
      }
    ],
    nostalgic: [
      {
        title: "Echoes of Home",
        description: "A heartwarming story that captures the essence of family, memory, and the places that shape who we become.",
        imageUrl: null,
        metadata: {
          author: "Eleanor Thompson",
          year: 2023,
          publisher: "Heritage Publishing",
          pages: 350,
          genre: "Fiction, Family Drama",
          rating: 4.4,
          isbn: "978-1234567893",
          subjects: ["Fiction", "Family", "Drama", "Memory", "Coming of Age"],
        }
      }
    ]
  };
  
  return fallbackBooks[mood] || fallbackBooks.relaxed;
}