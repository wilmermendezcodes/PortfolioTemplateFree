// MusicBrainz API service for music data
interface MusicBrainzSearchResponse {
  releases: MusicBrainzRelease[];
  count: number;
}

interface MusicBrainzRelease {
  id?: string;
  title?: string;
  date?: string;
  'artist-credit'?: Array<{
    name?: string;
    artist?: {
      name?: string;
      id?: string;
    };
  }>;
  'release-group'?: {
    'primary-type'?: string;
    'secondary-types'?: string[];
  };
  media?: Array<{
    'track-count'?: number;
  }>;
  'cover-art-archive'?: {
    front?: boolean;
    artwork?: boolean;
  };
}

export interface MusicData {
  title: string;
  description: string;
  imageUrl: string | null;
  metadata: {
    artist: string | null;
    year: number | null;
    genre: string | null;
    duration: string | null;
    tracks: number | null;
    label: string | null;
    albumType: string | null;
    mbid: string | null;
  };
}

const MUSICBRAINZ_BASE_URL = 'https://musicbrainz.org/ws/2';

// Expanded music queries by mood for better variety and rotation
const MUSIC_QUERIES_BY_MOOD: Record<string, string[]> = {
  relaxed: ['Norah Jones', 'Iron and Wine', 'Bon Iver', 'The Paper Kites', 'Daughter', 'Kings of Convenience', 'Zero 7', 'Feist', 'Agnes Obel', 'Ólafur Arnalds', 'Max Richter', 'Ludovico Einaudi', 'Kiasmos', 'Emancipator', 'Bonobo'],
  energetic: ['Daft Punk', 'The Strokes', 'Arctic Monkeys', 'Tame Impala', 'MGMT', 'Justice', 'LCD Soundsystem', 'Franz Ferdinand', 'The White Stripes', 'Queens of the Stone Age', 'Vampire Weekend', 'Phoenix', 'Foster the People', 'Two Door Cinema Club', 'Passion Pit'],
  creative: ['Radiohead', 'Bjork', 'Sigur Ros', 'Thom Yorke', 'Aphex Twin', 'Flying Lotus', 'Boards of Canada', 'Four Tet', 'Autechre', 'Squarepusher', 'Burial', 'Nicolas Jaar', 'Jon Hopkins', 'Kiara', 'Tim Hecker'],
  nostalgic: ['The Beatles', 'Fleetwood Mac', 'The Beach Boys', 'Simon and Garfunkel', 'Bob Dylan', 'The Kinks', 'The Velvet Underground', 'Joni Mitchell', 'Neil Young', 'David Bowie', 'Pink Floyd', 'Led Zeppelin', 'The Rolling Stones', 'The Doors', 'Creedence Clearwater Revival'],
  romantic: ['Adele', 'John Legend', 'Alicia Keys', 'Amy Winehouse', 'Sade', 'Billie Holiday', 'Ella Fitzgerald', 'Frank Sinatra', 'Nat King Cole', 'Diana Ross', 'Marvin Gaye', 'Al Green', 'Barry White', 'The Temptations', 'Stevie Wonder'],
  adventurous: ['Led Zeppelin', 'AC/DC', 'Queen', 'The Who', 'Deep Purple', 'Black Sabbath', 'Iron Maiden', 'Metallica', 'Guns N Roses', 'Pearl Jam', 'Nirvana', 'Red Hot Chili Peppers', 'Foo Fighters', 'Green Day', 'The Killers'],
  mysterious: ['Portishead', 'Massive Attack', 'Tricky', 'Thom Yorke', 'Nine Inch Nails', 'Depeche Mode', 'The Cure', 'Joy Division', 'New Order', 'Bauhaus', 'Sisters of Mercy', 'Dead Can Dance', 'This Mortal Coil', 'Cocteau Twins', 'Slowdive'],
  uplifting: ['Pharrell Williams', 'Bruno Mars', 'Justin Timberlake', 'Stevie Wonder', 'Earth Wind and Fire', 'Kool and the Gang', 'The Jackson 5', 'Motown', 'Diana Ross', 'The Supremes', 'The Temptations', 'Marvin Gaye', 'Aretha Franklin', 'James Brown', 'Ray Charles'],
  contemplative: ['Max Richter', 'Ólafur Arnalds', 'Nils Frahm', 'Kiasmos', 'A Winged Victory for the Sullen', 'Stars of the Lid', 'Tim Hecker', 'William Basinski', 'The Caretaker', 'Grouper', 'Loscil', 'Rafael Anton Irisarri', 'Taylor Deupree', 'Christopher Willits', 'Akira Rabelais'],
  festive: ['Mariah Carey', 'Bing Crosby', 'Frank Sinatra', 'Nat King Cole', 'Ella Fitzgerald', 'Dean Martin', 'Tony Bennett', 'Michael Bublé', 'Christmas', 'Holiday Music', 'Wham!', 'Band Aid', 'Paul McCartney', 'John Lennon', 'Trans-Siberian Orchestra']
};

// Keep track of previously served music to ensure rotation
let musicRotationIndex: Record<string, number> = {};

export async function fetchMusicByMood(mood: string): Promise<MusicData[]> {
  // Always return Lorem ipsum placeholder music
  return getFallbackMusic(mood);
}

function transformMusicBrainzResponse(release: MusicBrainzRelease, searchQuery: string): MusicData {
  const artist = release['artist-credit']?.[0]?.name || 
                 release['artist-credit']?.[0]?.artist?.name || 
                 searchQuery;
  
  const year = release.date ? parseInt(release.date.split('-')[0]) : null;
  const tracks = release.media?.[0]?.['track-count'] || null;
  const albumType = release['release-group']?.['primary-type'] || null;

  return {
    title: release.title || 'Unknown Album',
    description: `A ${albumType?.toLowerCase() || 'release'} by ${artist}${year ? ` from ${year}` : ''}${tracks ? ` featuring ${tracks} tracks` : ''}.`,
    imageUrl: null, // MusicBrainz doesn't directly provide cover art URLs
    metadata: {
      artist: artist,
      year: year,
      genre: null, // MusicBrainz doesn't provide genre in release search
      duration: null, // Would need additional API call to get total duration
      tracks: tracks,
      label: null, // Would need additional API call to get label info
      albumType: albumType,
      mbid: release.id || null,
    }
  };
}

function getFallbackMusic(mood: string): MusicData[] {
  const fallbackMusic: Record<string, MusicData[]> = {
    relaxed: [
      {
        title: "Lorem Ipsum Beats",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
        imageUrl: null,
        metadata: {
          artist: "Lorem Musician",
          year: 2023,
          genre: "Ambient",
          duration: "2h 15m",
          tracks: 12,
          label: "Lorem Records",
          albumType: "Album",
          mbid: null,
        }
      },
      {
        title: "Consectetur Melodies",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
        imageUrl: null,
        metadata: {
          artist: "Consectetur Band",
          year: 2022,
          genre: "Classical",
          duration: "1h 45m",
          tracks: 10,
          label: "Elit Records",
          albumType: "Album",
          mbid: null,
        }
      },
      {
        title: "Adipiscing Sounds",
        description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        imageUrl: null,
        metadata: {
          artist: "Adipiscing Artist",
          year: 2021,
          genre: "Nature",
          duration: "3h 0m",
          tracks: 15,
          label: "Sed Records",
          albumType: "Compilation",
          mbid: null,
        }
      },
      {
        title: "Tempor Rhythms",
        description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
        imageUrl: null,
        metadata: {
          artist: "Tempor Orchestra",
          year: 2020,
          genre: "New Age",
          duration: "1h 20m",
          tracks: 8,
          label: "Incididunt Music",
          albumType: "Album",
          mbid: null,
        }
      }
    ],
    energetic: [
      {
        title: "Electric Pulse",
        description: "High-energy electronic beats that energize and motivate, perfect for workouts and adventure.",
        imageUrl: null,
        metadata: {
          artist: "Voltage",
          year: 2023,
          genre: "Electronic, Dance",
          duration: "45 minutes",
          tracks: 12,
          label: "Energy Music",
          albumType: "Album",
          mbid: null,
        }
      }
    ],
    creative: [
      {
        title: "Canvas Sounds",
        description: "Experimental compositions that inspire creativity and artistic expression through innovative soundscapes.",
        imageUrl: null,
        metadata: {
          artist: "The Experimentalists",
          year: 2023,
          genre: "Experimental, Art Rock",
          duration: "58 minutes",
          tracks: 8,
          label: "Avant-Garde Records",
          albumType: "Album",
          mbid: null,
        }
      }
    ],
    nostalgic: [
      {
        title: "Yesterday's Melody",
        description: "Timeless songs that capture the warmth and beauty of cherished memories and simpler times.",
        imageUrl: null,
        metadata: {
          artist: "The Nostalgics",
          year: 2023,
          genre: "Folk, Indie",
          duration: "48 minutes",
          tracks: 11,
          label: "Memory Lane Music",
          albumType: "Album",
          mbid: null,
        }
      }
    ]
  };
  
  return fallbackMusic[mood] || fallbackMusic.relaxed;
}