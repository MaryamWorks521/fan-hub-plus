import { Character, Article, MediaItem } from '../types/index.ts';

// Map of canonical movies for characters
export function getMediaForCharacter(char: Character): MediaItem {
  const name = char.name.toLowerCase();
  const fandom = char.fandom.toLowerCase();

  // Paul Atreides / Dune
  if (name.includes('paul') || name.includes('atreides') || fandom.includes('dune')) {
    return {
      id: `med-char-${char.id}`,
      title: "Dune: Part Two - The Arrakis Sandstorm Assault (4K IMAX Cinema)",
      category: "movies",
      fandom: "Dune Universe",
      type: "movie",
      url: "https://www.youtube-nocookie.com/embed/Way9Dexny3w",
      thumbnail: "/src/assets/images/dune_desert_sandworm_1790299309457.jpg",
      duration: "2:46:00",
      description: "Denis Villeneuve's critically acclaimed sci-fi masterpiece. Paul Atreides rides the grand sandworms of Arrakis into an apocalyptic confrontation against the Harkonnens.",
      rating: 5.0,
      views: 14200000,
      tags: ["IMAX 70mm", "Paul Atreides", "Sci-Fi Epic", "Academy Award Winner"],
      quality: "4K IMAX 70mm",
      year: 2024,
      director: "Denis Villeneuve",
      genre: "Epic Sci-Fi / Drama"
    };
  }

  // The Batman (Bruce Wayne)
  if (name.includes('batman') || name.includes('wayne') || fandom.includes('batman')) {
    return {
      id: `med-char-${char.id}`,
      title: "The Batman Part II - Arkham Asylum & Neo-Noir Production Teaser",
      category: "movies",
      fandom: "The Batman / DC Universe",
      type: "movie",
      url: "https://www.youtube-nocookie.com/embed/mqqft2x_Aa4",
      thumbnail: "/src/assets/images/batman_dark_knight_1790299278923.jpg",
      duration: "2:15:00",
      description: "Robert Pattinson returns to the flooded rain-swept alleys of Gotham City in Matt Reeves' atmospheric detective sequel.",
      rating: 4.9,
      views: 12500000,
      tags: ["DC Studios", "The Batman", "Matt Reeves", "Gothic Noir"],
      quality: "4K HDR",
      year: 2026,
      director: "Matt Reeves",
      genre: "Detective Crime Noir"
    };
  }

  // Deadpool & Wolverine
  if (name.includes('deadpool') || name.includes('wolverine') || name.includes('logan')) {
    return {
      id: `med-char-${char.id}`,
      title: "Deadpool & Wolverine - The Void & Multiverse Battle Reels",
      category: "movies",
      fandom: "Marvel Cinematic Universe",
      type: "movie",
      url: "https://www.youtube-nocookie.com/embed/73_1biulkYk",
      thumbnail: "/src/assets/images/multiverse_avengers_clash_1790361980755.jpg",
      duration: "2:08:00",
      description: "Wade Wilson and Wolverine slash their way through the wasteland of the Void in Marvel's box-office shattering team-up event.",
      rating: 4.9,
      views: 18900000,
      tags: ["Marvel", "Deadpool", "Wolverine", "Box Office Hit"],
      quality: "4K Dolby Vision",
      year: 2024,
      director: "Shawn Levy",
      genre: "Superhero Action Comedy"
    };
  }

  // J. Robert Oppenheimer
  if (name.includes('oppenheimer') || fandom.includes('oppenheimer')) {
    return {
      id: `med-char-${char.id}`,
      title: "Oppenheimer - Christopher Nolan 70mm IMAX Official Cinema Presentation",
      category: "movies",
      fandom: "Oppenheimer / Cinema History",
      type: "movie",
      url: "https://www.youtube-nocookie.com/embed/uYPbbksJxIg",
      thumbnail: "/src/assets/images/cosmic_black_hole_1790299552183.jpg",
      duration: "3:00:00",
      description: "Christopher Nolan's biographical masterpiece starring Cillian Murphy. The story of American scientist J. Robert Oppenheimer and the Trinity test that changed the world.",
      rating: 5.0,
      views: 42000000,
      tags: ["Oppenheimer", "Christopher Nolan", "Cillian Murphy", "IMAX 70mm"],
      quality: "4K IMAX 70mm",
      year: 2023,
      director: "Christopher Nolan",
      genre: "Historical Biographical Drama"
    };
  }

  // Gojo Satoru
  if (name.includes('gojo') || fandom.includes('jujutsu')) {
    return {
      id: `med-char-${char.id}`,
      title: "Jujutsu Kaisen: Gojo Satoru - Domain Expansion 'Infinite Void' 4K",
      category: "anime",
      fandom: "Jujutsu Kaisen",
      type: "trailer",
      url: "https://www.youtube-nocookie.com/embed/O6qVieflwqs",
      thumbnail: "/src/assets/images/hero_gojo_domain_unleashed_1790296831168.jpg",
      duration: "24:00",
      description: "Witness the pinnacle of Jujutsu sorcery as Gojo Satoru unleashes Hollow Purple and Unlimited Void in MAPPA's legendary animation showcase.",
      rating: 5.0,
      views: 31000000,
      tags: ["Gojo", "Jujutsu Kaisen", "Infinite Void", "MAPPA"],
      quality: "4K 60FPS"
    };
  }

  // Spider-Man
  if (name.includes('spider-man') || name.includes('miles')) {
    return {
      id: `med-char-${char.id}`,
      title: "Spider-Man: Across the Spider-Verse - Multiverse Chase",
      category: "movies",
      fandom: "Spider-Man Universe",
      type: "movie",
      url: "https://www.youtube-nocookie.com/embed/cqGjhVJWtEg",
      thumbnail: "/src/assets/images/multiverse_avengers_clash_1790361980755.jpg",
      duration: "2:20:00",
      description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
      rating: 5.0,
      views: 24000000,
      tags: ["Spider-Man", "Miles Morales", "Marvel", "Spider-Verse"],
      quality: "4K IMAX 60FPS"
    };
  }

  // Jinx / Arcane
  if (name.includes('jinx') || fandom.includes('arcane')) {
    return {
      id: `med-char-${char.id}`,
      title: "Arcane Season 2 - Official Teaser & 'Paint the Town Blue' Trailer",
      category: "tv-shows",
      fandom: "Arcane",
      type: "video",
      url: "https://www.youtube.com/embed/ysqiEC6bLUI",
      thumbnail: "/src/assets/images/fandom_anime_cyber_1790294513680.jpg",
      duration: "2:40",
      description: "The clash between Piltover and Zaun ignites into all-out war. Watch the Emmy-winning masterpiece return.",
      rating: 4.9,
      views: 21500000,
      tags: ["Emmy Winner", "Riot Games", "Fortiche", "Prestige Animation"],
      quality: "4K HDR"
    };
  }

  // Fallback for any other character
  return {
    id: `med-char-${char.id}`,
    title: `${char.name} - Cinematic Showcase & Combat Dossier`,
    category: char.category,
    fandom: char.fandom,
    type: "video",
    url: "https://www.youtube-nocookie.com/embed/Way9Dexny3w",
    thumbnail: char.avatar || char.coverImage,
    duration: "2:15:00",
    description: char.fullBio || char.shortBio,
    rating: 4.9,
    views: 1500000,
    tags: [char.fandom, char.name, "Official Showcase"],
    quality: "4K UHD"
  };
}

// Map of canonical movies for articles
export function getMediaForArticle(art: Article): MediaItem {
  const title = art.title.toLowerCase();
  const fandom = art.fandom.toLowerCase();

  // Dune 2 Article
  if (title.includes('dune') || fandom.includes('dune')) {
    return {
      id: `med-art-${art.id}`,
      title: "Dune: Part Two - The Arrakis Sandstorm Assault (4K IMAX Cinema)",
      category: "movies",
      fandom: "Dune Universe",
      type: "movie",
      url: "https://www.youtube-nocookie.com/embed/Way9Dexny3w",
      thumbnail: "/src/assets/images/dune_desert_sandworm_1790299309457.jpg",
      duration: "2:46:00",
      description: "Denis Villeneuve's critically acclaimed sci-fi masterpiece. Paul Atreides rides the grand sandworms of Arrakis into an apocalyptic confrontation against the Harkonnens.",
      rating: 5.0,
      views: 14200000,
      tags: ["IMAX 70mm", "Sci-Fi Epic", "Academy Award Winner", "Hans Zimmer"],
      quality: "4K IMAX 70mm",
      year: 2024,
      director: "Denis Villeneuve",
      genre: "Epic Sci-Fi / Drama"
    };
  }

  // Nolan 70mm / Oppenheimer Article
  if (title.includes('nolan') || title.includes('oppenheimer') || title.includes('70mm')) {
    return {
      id: `med-art-${art.id}`,
      title: "Christopher Nolan's 70mm Practical Cinema Revolution: Oppenheimer & Interstellar",
      category: "movies",
      fandom: "Oppenheimer & Interstellar",
      type: "movie",
      url: "https://www.youtube-nocookie.com/embed/uYPbbksJxIg",
      thumbnail: "/src/assets/images/cosmic_black_hole_1790299552183.jpg",
      duration: "3:00:00",
      description: "Christopher Nolan's historical masterpiece captured in photochemical 70mm film. Experience the visceral realism of Los Alamos and quantum physics.",
      rating: 5.0,
      views: 42000000,
      tags: ["Christopher Nolan", "70mm Film", "IMAX", "Oppenheimer", "Interstellar"],
      quality: "4K IMAX 70mm",
      year: 2023,
      director: "Christopher Nolan",
      genre: "Cinematic 70mm Symphony"
    };
  }

  // The Batman Part II Article
  if (title.includes('batman') || fandom.includes('batman')) {
    return {
      id: `med-art-${art.id}`,
      title: "The Batman Part II: Arkham Rogues, Clayface & Matt Reeves' Gothic Noir",
      category: "movies",
      fandom: "The Batman / DC",
      type: "movie",
      url: "https://www.youtube-nocookie.com/embed/mqqft2x_Aa4",
      thumbnail: "/src/assets/images/batman_dark_knight_1790299278923.jpg",
      duration: "2:15:00",
      description: "Robert Pattinson returns to the flooded rain-swept alleys of Gotham City in Matt Reeves' atmospheric detective sequel.",
      rating: 4.9,
      views: 12500000,
      tags: ["The Batman", "Matt Reeves", "DC Studios", "Robert Pattinson"],
      quality: "4K HDR",
      year: 2026,
      director: "Matt Reeves",
      genre: "Detective Crime Noir"
    };
  }

  // Arcane Article
  if (title.includes('arcane') || fandom.includes('arcane')) {
    return {
      id: `med-art-${art.id}`,
      title: "Arcane Season 2 Climax: Hextech Warfare & Fall of Piltover",
      category: "tv-shows",
      fandom: "Arcane",
      type: "video",
      url: "https://www.youtube-nocookie.com/embed/hs3p6tZ7c_8",
      thumbnail: "/src/assets/images/fandom_anime_cyber_1790294513680.jpg",
      duration: "2:40",
      description: "The clash between Piltover and Zaun ignites into all-out war with mind-bending hand-painted animation.",
      rating: 4.9,
      views: 21500000,
      tags: ["Arcane", "Fortiche", "Riot Games", "Prestige TV"],
      quality: "4K HDR"
    };
  }

  // Fallback
  return {
    id: `med-art-${art.id}`,
    title: art.title,
    category: art.category,
    fandom: art.fandom,
    type: "video",
    url: "https://www.youtube-nocookie.com/embed/Way9Dexny3w",
    thumbnail: art.coverImage,
    duration: "2:30:00",
    description: art.summary,
    rating: 4.9,
    views: art.views || 25000,
    tags: art.tags || [art.fandom],
    quality: "4K UHD"
  };
}
