/**
 * Realistic seed data for Fan Hub Plus Fandom Universe
 * Vastly expanded with authentic Movies, TV Shows, Gaming, Anime, Comics & Pop-Culture lore.
 */

export interface FandomCategory {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  accentColor: string;
  genres: string[];
  itemCount: number;
}

export interface FandomContent {
  id: string;
  title: string;
  slug: string;
  category: string;
  fandom: string;
  type: 'article' | 'video' | 'audio' | 'trailer' | 'character' | 'event' | 'merchandise' | 'image';
  description: string;
  fullText?: string;
  image: string;
  mediaUrl?: string;
  rating: number;
  popularity: number;
  views: number;
  releaseYear: number;
  genre: string;
  author?: string;
  tags: string[];
  featured?: boolean;
}

export interface FandomCharacter {
  id: string;
  name: string;
  fandom: string;
  category: string;
  role: string;
  avatar: string;
  coverImage: string;
  shortBio: string;
  fullBio: string;
  abilities: string[];
  voiceActor?: string;
  firstAppearance: string;
  relatedCharacterIds?: string[];
}

export interface FandomArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  fandom: string;
  author: string;
  authorAvatar: string;
  coverImage: string;
  summary: string;
  content: string;
  tags: string[];
  readTime: string;
  publishedAt: string;
  views: number;
  likes: number;
  isApproved: boolean;
  timelineHighlights?: { year: string; event: string }[];
}

export interface MediaServer {
  id: string;
  name: string;
  url: string;
  type: 'html5' | 'embed' | 'audio';
  quality: string;
}

export interface MediaEpisode {
  id: string;
  episodeNumber: number;
  title: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
}

export interface FandomMedia {
  id: string;
  title: string;
  category: string;
  fandom: string;
  type: 'video' | 'trailer' | 'audio' | 'podcast' | 'soundtrack' | 'movie' | 'anime';
  url: string;
  videoSource?: string;
  thumbnail: string;
  duration: string;
  description: string;
  rating: number;
  views: number;
  tags: string[];
  quality?: string;
  year?: number;
  director?: string;
  genre?: string;
  servers?: MediaServer[];
  episodes?: MediaEpisode[];
}

export interface FandomEvent {
  id: string;
  title: string;
  category: string;
  fandom: string;
  type: 'convention' | 'meetup' | 'premiere' | 'concert' | 'screening';
  date: string;
  time: string;
  city: string;
  venue: string;
  coordinates: { lat: number; lng: number };
  description: string;
  image: string;
  ticketUrl: string;
  price: string;
  attendeesCount: number;
}

export interface FandomMerchandise {
  id: string;
  title: string;
  fandom: string;
  category: string;
  description: string;
  image: string;
  tags: ('Limited Edition' | 'Pre-Order' | 'Collectible')[];
  status: 'available' | 'upcoming' | 'preorder';
  popularity: number;
  releaseDate: string;
  estimatedPrice: string;
}

export interface UpcomingRelease {
  id: string;
  title: string;
  fandom: string;
  category: string;
  type: 'Anime' | 'Gaming' | 'Movies' | 'TV Shows' | 'Comics' | 'Manga' | 'Merchandise';
  releaseDate: string; // ISO date string in future
  image: string;
  synopsis: string;
  hypeScore: number;
}

export const SEED_CATEGORIES: FandomCategory[] = [
  {
    id: "cat-movies",
    slug: "movies",
    name: "Movies & Cinema",
    tagline: "Silver screen epics, auteur masterpieces, and cinematic franchises.",
    description: "IMAX trailers, director deep dives, Rotten Tomatoes and FanScore breakdowns, behind-the-scenes cinematography, and box office milestones.",
    coverImage: "/src/assets/images/cinema_dragon_throne_1790361965433.jpg",
    accentColor: "from-amber-500 via-rose-500 to-red-600",
    genres: ["Sci-Fi", "Superhero", "Psychological Thriller", "Space Opera", "IMAX Epic", "Dark Fantasy"],
    itemCount: 84
  },
  {
    id: "cat-tv-shows",
    slug: "tv-shows",
    name: "Prestige TV Shows",
    tagline: "Serialized narratives, Emmy-winning dramas, and binge-worthy phenomena.",
    description: "Episode timelines, easter egg discoveries, finale theories, character relationship webs, and upcoming season release radars.",
    coverImage: "/src/assets/images/dune_desert_sandworm_1790299309457.jpg",
    accentColor: "from-blue-500 via-indigo-600 to-purple-600",
    genres: ["Post-Apocalyptic", "High Fantasy", "Cyberpunk", "Psychological Mystery", "Sci-Fi Thriller"],
    itemCount: 68
  },
  {
    id: "cat-gaming",
    slug: "gaming",
    name: "Gaming & Esports",
    tagline: "Interactive virtual worlds, competitive showdowns, and open-world marvels.",
    description: "Deep dive into AAA blockbusters, Soulslike lore, Vice City updates, speedrun highlights, and global esports arena championships.",
    coverImage: "/src/assets/images/cyberpunk_vice_city_1790361950975.jpg",
    accentColor: "from-emerald-500 via-teal-500 to-cyan-600",
    genres: ["Open World Action", "Soulslike RPG", "Cyberpunk", "Survival Horror", "Tactical FPS"],
    itemCount: 92
  },
  {
    id: "cat-anime",
    slug: "anime",
    name: "Anime & Animation",
    tagline: "Unleash your spirit across iconic shonen sagas and seasonal sensations.",
    description: "From legendary battle tournaments to psychological dark fantasies, discover episode guides, character abilities, soundtracks, and sakuga breakdowns.",
    coverImage: "/src/assets/images/tanjiro_sun_breathing_1790299259954.jpg",
    accentColor: "from-rose-500 via-pink-500 to-orange-500",
    genres: ["Dark Fantasy", "Battle Shonen", "Psychological", "Supernatural", "Cyberpunk Sakuga"],
    itemCount: 88
  },
  {
    id: "cat-comics",
    slug: "comics",
    name: "Comics & Multiverse",
    tagline: "Classic ink panels, multiverse crossovers, and visionary graphic novels.",
    description: "Key character debuts, writer run analyses, crossover chronologies, and multiverse variants from Marvel, DC, and indie imprints.",
    coverImage: "/src/assets/images/multiverse_avengers_clash_1790361980755.jpg",
    accentColor: "from-cyan-500 via-blue-600 to-indigo-600",
    genres: ["Superhero", "Multiverse Odyssey", "Grimdark Noir", "Cosmic War"],
    itemCount: 62
  },
  {
    id: "cat-manga",
    slug: "manga",
    name: "Manga & Light Novels",
    tagline: "Masterful ink panels, weekly serialization journeys, and timeless volumes.",
    description: "Chapter breakdowns, creator interviews, translation release dates, and manga-to-screen adaptation tracking.",
    coverImage: "/src/assets/images/guts_black_swordsman_1790299509112.jpg",
    accentColor: "from-violet-500 via-purple-600 to-fuchsia-600",
    genres: ["Dark Fantasy", "Seinen", "Shonen Jump", "Supernatural Thriller"],
    itemCount: 54
  },
  {
    id: "cat-kpop",
    slug: "k-pop",
    name: "K-Pop & Global Sounds",
    tagline: "Electrifying choreography, chart-topping comebacks, and global fandoms.",
    description: "Stay in sync with group comebacks, world stadium tour schedules, concept photo teasers, and official lightstick synchronicity tech.",
    coverImage: "/src/assets/images/fandom_kpop_concert_1790294562619.jpg",
    accentColor: "from-pink-500 via-rose-500 to-amber-400",
    genres: ["Synthpop", "Hip-Hop", "EDM", "Concept Comeback"],
    itemCount: 46
  },
  {
    id: "cat-cosplay",
    slug: "cosplay",
    name: "Cosplay & Prop Smithing",
    tagline: "Artistry in motion: handcrafted armors, stage craft, and character spirit.",
    description: "High-density EVA foam tutorials, 3D printing guides, wig styling breakthroughs, masquerade showcase galleries, and championship highlights.",
    coverImage: "/src/assets/images/fandom_cosplay_stage_1790294545689.jpg",
    accentColor: "from-fuchsia-500 via-purple-500 to-rose-500",
    genres: ["Armor Fabrication", "SFX Makeup", "3D Printing & LEDs", "Performance Skits"],
    itemCount: 42
  }
];

export const SEED_CHARACTERS: FandomCharacter[] = [
  // MOVIES
  {
    id: "char-4",
    name: "Paul Atreides (Muad'Dib)",
    fandom: "Dune Universe",
    category: "movies",
    role: "Emperor of the Known Universe & The Kwisatz Haderach",
    avatar: "/src/assets/images/hero_movie_heroine_sandstorm_1790296850678.jpg",
    coverImage: "/src/assets/images/dune_desert_sandworm_1790299309457.jpg",
    shortBio: "The prophet of Arrakis who rides colossal sandworms and sees across all timelines.",
    fullBio: "Heir to House Atreides, Paul navigates the lethal politics of the Imperium and the mystical trials of Arrakis. Through spice agony, his mind awakens to full prescience, binding the Fremen fedaykin to his banner in an epochal clash that rewrites galactic history and triggers the great holy war.",
    abilities: ["Prescient Future Sight", "The Voice Command", "Bene Gesserit Prana-Bindu Combat", "Sandworm Riding Mastery"],
    voiceActor: "Timothée Chalamet",
    firstAppearance: "Dune by Frank Herbert (1965) / Dune: Part One (2021)",
    relatedCharacterIds: ["char-9", "char-16"]
  },
  {
    id: "char-9",
    name: "The Batman (Bruce Wayne)",
    fandom: "The Batman / DC Universe",
    category: "movies",
    role: "Gotham's Dark Knight & World's Greatest Detective",
    avatar: "/src/assets/images/batman_dark_knight_1790299278923.jpg",
    coverImage: "/src/assets/images/batman_dark_knight_1790299278923.jpg",
    shortBio: "Gotham's nocturnal vigilante weaponizing fear, intellect, and physical mastery.",
    fullBio: "Forged in personal tragedy, billionaire Bruce Wayne turns fear itself into an instrument of justice. Armed with Wayne Enterprises military-grade arsenal, forensic genius, and an indomitable moral code, Batman investigates criminal syndicates and psychological terrors across the shadows of Gotham City.",
    abilities: ["Genius Detective Forensics", "Master Martial Arts Combatives", "WayneTech Tactical Arsenal", "Stealth & Psychological Intimidation"],
    voiceActor: "Robert Pattinson / Christian Bale",
    firstAppearance: "Detective Comics #27 (1939) / The Batman (2022)",
    relatedCharacterIds: ["char-4", "char-16", "char-3"]
  },
  {
    id: "char-16",
    name: "Deadpool & Wolverine (Wade & Logan)",
    fandom: "Marvel Cinematic Universe",
    category: "movies",
    role: "Multiverse Mercenaries & Unlikely Saviors",
    avatar: "/src/assets/images/multiverse_avengers_clash_1790361980755.jpg",
    coverImage: "/src/assets/images/multiverse_avengers_clash_1790361980755.jpg",
    shortBio: "The regenerated merc with a mouth and the adamantium-clawed mutant anchor.",
    fullBio: "Brought together across fractured timelines by the Time Variance Authority, Wade Wilson and an embittered variant of Logan clash in the Void before uniting to rescue their home reality. Combining four-wall-breaking humor with visceral, R-rated adamantium choreography.",
    abilities: ["Infinite Cellular Regeneration", "Adamantium Claws & Skeleton", "Fourth-Wall Awareness", "Twin Katana & Firearm Virtuosity"],
    voiceActor: "Ryan Reynolds & Hugh Jackman",
    firstAppearance: "Deadpool & Wolverine (2024)",
    relatedCharacterIds: ["char-9", "char-10", "char-3"]
  },
  {
    id: "char-17",
    name: "J. Robert Oppenheimer",
    fandom: "Oppenheimer / Cinema History",
    category: "movies",
    role: "Director of the Manhattan Project & Theoretical Physicist",
    avatar: "/src/assets/images/cosmic_black_hole_1790299552183.jpg",
    coverImage: "/src/assets/images/cosmic_black_hole_1790299552183.jpg",
    shortBio: "The father of the atomic bomb, torn between scientific brilliance and cosmic dread.",
    fullBio: "Christopher Nolan's cinematic titan: a theoretical physicist whose intellect split the atom at Los Alamos, fundamentally shifting human history. Captured in blistering 70mm IMAX, his psychological reckoning with the chain reaction of geopolitical power stands as one of cinema's greatest character studies.",
    abilities: ["Theoretical Quantum Mechanics", "Scientific Leadership", "Rhetorical Brilliance", "Existential Foresight"],
    voiceActor: "Cillian Murphy",
    firstAppearance: "Oppenheimer (2023)",
    relatedCharacterIds: ["char-4"]
  },

  // TV SHOWS
  {
    id: "char-15",
    name: "Jinx (Powder)",
    fandom: "Arcane (League of Legends)",
    category: "tv-shows",
    role: "Zaun's Anarchic Hextech Prodigy",
    avatar: "/src/assets/images/fandom_anime_cyber_1790294513680.jpg",
    coverImage: "/src/assets/images/neon_vigilante_hero_1790299533301.jpg",
    shortBio: "The volatile Zaunite inventor armed with Fishbones and Shimmer-fueled reflexes.",
    fullBio: "Torn from her sister Vi and raised by Silco in the undercity of Zaun, Powder reinvents herself as Jinx. Combining manic mechanical genius with devastating Hextech weaponry, Jinx unleashes chaos against Piltover's aristocracy while battling traumatic hallucinations of her lost family.",
    abilities: ["Fishbones Hextech Rocket Launcher", "Pow-Pow Minigun Rapid Fire", "Super Mega Death Rocket", "Shimmer-Enhanced Agility"],
    voiceActor: "Ella Purnell",
    firstAppearance: "Arcane: League of Legends (2021)",
    relatedCharacterIds: ["char-18", "char-19"]
  },
  {
    id: "char-18",
    name: "Daemon Targaryen (The Rogue Prince)",
    fandom: "House of the Dragon",
    category: "tv-shows",
    role: "Commander of the City Watch & Dragonrider of Caraxes",
    avatar: "/src/assets/images/cinema_dragon_throne_1790361965433.jpg",
    coverImage: "/src/assets/images/cinema_dragon_throne_1790361965433.jpg",
    shortBio: "The unpredictable Targaryen prince who flies the Blood Wyrm Caraxes and wields Dark Sister.",
    fullBio: "Brother to King Viserys and consort to Queen Rhaenyra, Prince Daemon Targaryen is the most perilous warrior in the Seven Kingdoms. Wielding the ancestral Valyrian steel blade Dark Sister, Daemon's ruthless ambition and fierce familial loyalty ignite the Dance of the Dragons across the skies of Westeros.",
    abilities: ["Dragonriding Caraxes (The Blood Wyrm)", "Valyrian Steel Mastery (Dark Sister)", "Tactical Military Warfare", "Cold Psychological Cunning"],
    voiceActor: "Matt Smith",
    firstAppearance: "House of the Dragon (2022)",
    relatedCharacterIds: ["char-15", "char-19"]
  },
  {
    id: "char-19",
    name: "Joel Miller & Ellie Williams",
    fandom: "The Last of Us",
    category: "tv-shows",
    role: "Survivors of the Cordyceps Pandemic",
    avatar: "/src/assets/images/dune_desert_sandworm_1790299309457.jpg",
    coverImage: "/src/assets/images/fandom_gaming_rpg_1790294531423.jpg",
    shortBio: "A hardened smuggler and an immune girl journeying across a post-apocalyptic America.",
    fullBio: "Traversing quarantine zones, overgrown city ruins, and infected hordes, Joel and Ellie form an unbreakable parental bond. Faced with the choice between saving human civilization or protecting each other, their fateful decisions ripple into devastating moral consequences.",
    abilities: ["Survivalist Crafting & Tracking", "Cordyceps Immunity (Ellie)", "Ruthless Close-Quarters Combat", "Stealth Reconnaissance"],
    voiceActor: "Pedro Pascal & Bella Ramsey",
    firstAppearance: "The Last of Us (HBO 2023 / Naughty Dog 2013)",
    relatedCharacterIds: ["char-15", "char-18"]
  },

  // GAMING
  {
    id: "char-14",
    name: "Lucia Caminos & Jason Duval",
    fandom: "Grand Theft Auto VI",
    category: "gaming",
    role: "Vice City's Modern Outlaw Duo",
    avatar: "/src/assets/images/cyberpunk_vice_city_1790361950975.jpg",
    coverImage: "/src/assets/images/cyberpunk_vice_city_1790361950975.jpg",
    shortBio: "The Bonnie-and-Clyde pair navigating Leonida's neon cartels, swamps, and digital culture.",
    fullBio: "Fresh out of Leonida penitentiary, Lucia teams with Jason to build an empire across the humid glamour and high-stakes criminal underworld of Vice City. Blending tactical planning, dynamic relationship mechanics, and cinematic heists, they represent gaming's next generational milestone.",
    abilities: ["Tactical Heist Execution", "High-Speed Pursuit Evasion", "Firearm Precision Mastery", "Underworld Street Intelligence"],
    voiceActor: "Rockstar Ensemble Cast",
    firstAppearance: "Grand Theft Auto VI (2026)",
    relatedCharacterIds: ["char-2", "char-11"]
  },
  {
    id: "char-2",
    name: "Malenia, Blade of Miquella",
    fandom: "Elden Ring Universe",
    category: "gaming",
    role: "Demigod Empyrean & Undefeated Sword Master",
    avatar: "/src/assets/images/hero_valkyrie_scarlet_bloom_1790296871933.jpg",
    coverImage: "/src/assets/images/hero_fantasy_valkyrie_1790295619434.jpg",
    shortBio: "The undefeated swordsman afflicted by Scarlet Rot who defends the Haligtree.",
    fullBio: "Born an Empyrean cursed with the Scarlet Rot from within, Malenia embraced a life of rigorous swordsmanship under the tutelage of a blind swordsman. Resolute in her devotion to her twin brother Miquella, she waged war against General Radahn in the Shattering and remains legendary for her lethal Waterfowl Dance.",
    abilities: ["Waterfowl Dance Flurry", "Scarlet Aeonia Goddess Bloom", "Prosthetic Katana Mastery", "Lifesteal Essence"],
    voiceActor: "Pippa Bennett-Warner",
    firstAppearance: "Elden Ring (2022) / Shadow of the Erdtree (2024)",
    relatedCharacterIds: ["char-11", "char-12", "char-14"]
  },
  {
    id: "char-11",
    name: "Kratos, Ghost of Sparta",
    fandom: "God of War Ragnarök",
    category: "gaming",
    role: "Former Greek God of War & Norse Champion",
    avatar: "/src/assets/images/kratos_blades_chaos_1790299292974.jpg",
    coverImage: "/src/assets/images/kratos_blades_chaos_1790299292974.jpg",
    shortBio: "The Spartan warrior who conquered Olympus and now guides his son Atreus.",
    fullBio: "Having dismantled the corrupt Greek pantheon, Kratos sought peace in the Norse realm of Midgard. Bearing the frozen Leviathan Axe, the fiery Blades of Chaos, and the Draupnir Spear, he battles Norse Aesir gods to protect his son Atreus and forge a new path of honorable redemption.",
    abilities: ["Blades of Chaos Primordial Fire", "Leviathan Axe Frost Recall", "Spartan Rage Surge", "Draupnir Spear Kinetic Barrage"],
    voiceActor: "Christopher Judge",
    firstAppearance: "God of War (2005) / God of War Ragnarök (2022)",
    relatedCharacterIds: ["char-2", "char-12"]
  },

  // ANIME
  {
    id: "char-1",
    name: "Satoru Gojo",
    fandom: "Jujutsu Kaisen",
    category: "anime",
    role: "Special Grade Sorcerer & The Modern Pinnacle",
    avatar: "/src/assets/images/hero_gojo_domain_unleashed_1790296831168.jpg",
    coverImage: "/src/assets/images/gojo_hollow_purple_blast_1790297433629.jpg",
    shortBio: "The strongest modern sorcerer, wielder of the Limitless and Six Eyes.",
    fullBio: "Satoru Gojo stands as the pinnacle of the modern jujutsu world. Renowned for his untouchable Infinity barrier and devastating Hollow Purple technique, Gojo balances overwhelming godly power with a playful, mentor-focused demeanor aimed at raising a generation of allies strong enough to transform jujutsu society.",
    abilities: ["Limitless Cursed Technique", "Six Eyes Sensory Perception", "Domain Expansion: Unlimited Void", "Hollow Purple Singularity"],
    voiceActor: "Yuichi Nakamura",
    firstAppearance: "Jujutsu Kaisen Chapter 1 / Volume 0",
    relatedCharacterIds: ["char-6", "char-7", "char-8"]
  },
  {
    id: "char-6",
    name: "Tanjiro Kamado",
    fandom: "Demon Slayer (Kimetsu no Yaiba)",
    category: "anime",
    role: "Sun Breathing Swordsman & Demon Slayer",
    avatar: "/src/assets/images/tanjiro_sun_breathing_1790299259954.jpg",
    coverImage: "/src/assets/images/tanjiro_sun_breathing_1790299259954.jpg",
    shortBio: "Kind-hearted blade wielder mastering Hinokami Kagura to save his sister Nezuko.",
    fullBio: "After tragedy strikes his family, Tanjiro trains relentlessly under Sakonji Urokodaki to become a demon slayer. Combining initial Water Breathing forms with ancestral Sun Breathing (Hinokami Kagura), Tanjiro enters the final clash against Muzan Kibutsuji in the dimensional Infinity Castle.",
    abilities: ["Sun Breathing (Hinokami Kagura)", "Transparent World Perception", "Selfless State Immunity", "Acute Olfactory Scent"],
    voiceActor: "Natsuki Hanae",
    firstAppearance: "Demon Slayer Chapter 1",
    relatedCharacterIds: ["char-1", "char-7"]
  },
  {
    id: "char-7",
    name: "Sung Jin-woo",
    fandom: "Solo Leveling",
    category: "anime",
    role: "Shadow Monarch & S-Rank Hunter",
    avatar: "/src/assets/images/jinwoo_shadow_monarch_1790299437099.jpg",
    coverImage: "/src/assets/images/jinwoo_shadow_monarch_1790299437099.jpg",
    shortBio: "The Weakest Hunter who re-awakened as the unstoppable Shadow Monarch.",
    fullBio: "Once known as Humanity's Weakest E-Rank hunter, Jin-woo survives the Double Dungeon trial and receives the Courage of the Weak System. Leveling up beyond human limits, he commands millions of undying shadow soldiers with his iconic command: 'ARISE'.",
    abilities: ["Shadow Extraction (Arise)", "Monarch's Domain", "Ruler's Authority Telekinesis", "Bloodlust Stealth"],
    voiceActor: "Taito Ban",
    firstAppearance: "Solo Leveling Chapter 1",
    relatedCharacterIds: ["char-1", "char-6"]
  },

  // COMICS & MANGA
  {
    id: "char-3",
    name: "Miles Morales",
    fandom: "Spider-Man / Marvel",
    category: "comics",
    role: "Brooklyn's Friendly Neighborhood Spider-Man",
    avatar: "/src/assets/images/hero_fandom_universe_1790294495415.jpg",
    coverImage: "/src/assets/images/hero_fandom_universe_1790294495415.jpg",
    shortBio: "A vibrant Brooklyn youth forging his own unique destiny in the Spider-Verse.",
    fullBio: "Bitten by a genetically engineered spider, Miles Morales carries the mantle of Spider-Man with style, heart, and rhythm. Beyond standard wall-crawling and proportional spider-strength, Miles commands bio-electric Venom Blasts and camouflage invisibility, standing as a beacon for the multiverse.",
    abilities: ["Venom Strike Electric Blast", "Active Camouflage Invisibility", "Spider-Sense Reflexes", "Acrobatic Wall-Crawling"],
    voiceActor: "Shameik Moore / Nadji Jeter",
    firstAppearance: "Ultimate Comics: Fallout #4 (2011)",
    relatedCharacterIds: ["char-9", "char-16"]
  },
  {
    id: "char-13",
    name: "Guts, The Black Swordsman",
    fandom: "Berserk",
    category: "manga",
    role: "Branded Wanderer & Dragonslayer Bearer",
    avatar: "/src/assets/images/guts_black_swordsman_1790299509112.jpg",
    coverImage: "/src/assets/images/guts_black_swordsman_1790299509112.jpg",
    shortBio: "The tragic warrior who defies fate with his colossal iron Dragonslayer blade.",
    fullBio: "Born from a corpse and forged on the battlefield, Guts survives the demonic Eclipse. Bearing the Brand of Sacrifice and the cursed Berserker Armor, he wades through legions of Apostles in a singular pursuit of defiance against the God Hand.",
    abilities: ["Dragonslayer Cleave", "Berserker Armor Fury", "Mechanical Arm Repeater Crossbow", "Indomitable Human Will"],
    voiceActor: "Hiroaki Iwanaga",
    firstAppearance: "Berserk Volume 1 (1989)",
    relatedCharacterIds: ["char-1"]
  }
];

export const SEED_ARTICLES: FandomArticle[] = [
  // MOVIES ARTICLES
  {
    id: "art-6",
    title: "Dune: Part Two - The Sound Design & Sandstorm Cinematography of Arrakis",
    slug: "dune-part-two-cinematography-sound-design",
    category: "movies",
    fandom: "Dune Universe",
    author: "Marcus Vance",
    authorAvatar: "/src/assets/images/hero_movie_heroine_sandstorm_1790296850678.jpg",
    coverImage: "/src/assets/images/dune_desert_sandworm_1790299309457.jpg",
    summary: "Greig Fraser's infrared IMAX cameras and Hans Zimmer's primal dune frequencies created an unforgettable sensory cinema spectacle.",
    content: `Denis Villeneuve's Dune: Part Two elevated modern science fiction cinema into modern mythology. Shooting in the real desert sands of Jordan and Abu Dhabi with customized infrared cameras, the film gives Giedi Prime and Arrakis terrifying physical reality.
    
Complementing the visual grit is Hans Zimmer's acoustic score, which bypassed traditional orchestral brass in favor of desert wind recordings, synthesized female wailing, and sub-bass frequencies that rattle theater seats during the grand Shai-Hulud sandworm assault.
    
Villeneuve's pacing ensures that character psychology is never swallowed by spectacle; Paul's descent from reluctant exile to messianic dread is communicated through lingering close-ups and harrowing soundscapes.`,
    tags: ["Dune", "IMAX", "Cinema Masterclass", "Hans Zimmer", "Villeneuve"],
    readTime: "8 min read",
    publishedAt: "2026-03-22",
    views: 48200,
    likes: 5310,
    isApproved: true,
    timelineHighlights: [
      { year: "1965", event: "Frank Herbert publishes literary sci-fi landmark Dune" },
      { year: "2021", event: "Part One premieres, capturing 6 Academy Awards" },
      { year: "2024", event: "Part Two sets universal acclaim for modern cinema epics" },
      { year: "2026", event: "Dune Messiah enters official pre-production with Villeneuve" }
    ]
  },
  {
    id: "art-7",
    title: "Christopher Nolan's 70mm Practical Cinema Revolution: From Oppenheimer to Interstellar",
    slug: "christopher-nolan-70mm-cinema-revolution",
    category: "movies",
    fandom: "Oppenheimer & Interstellar",
    author: "Julian Reynolds",
    authorAvatar: "/src/assets/images/cosmic_black_hole_1790299552183.jpg",
    coverImage: "/src/assets/images/cosmic_black_hole_1790299552183.jpg",
    summary: "Why shooting on photochemical 70mm IMAX film and building practical miniature effects continues to dwarf green-screen CGI in modern cinema.",
    content: `In an era dominated by sterile digital cinematography and oversaturated CGI, Christopher Nolan remains the champion of photochemical physical film. Oppenheimer demonstrated that even a three-hour dialogue-heavy historical drama could command billions when projected on massive 15-perf 70mm celluloid.
    
From real magnesium-blackpowder explosive simulations for the Trinity test to mathematically modeled black holes with Nobel laureate Kip Thorne in Interstellar, Nolan's uncompromising dedication to visceral realism sets the benchmark for enduring cinematic art.
    
Audiences are increasingly drawn to films that feel tangible, where actors interact with physical lighting and real atmospheric dust. This theatrical revival reasserts the cinema auditorium as a sacred temple of communal narrative.`,
    tags: ["Christopher Nolan", "70mm Film", "IMAX", "Oppenheimer", "Interstellar"],
    readTime: "7 min read",
    publishedAt: "2026-03-15",
    views: 41200,
    likes: 4280,
    isApproved: true
  },
  {
    id: "art-8",
    title: "The Batman Part II: Arkham Rogues, Clayface Theories & Matt Reeves' Gothic Noir",
    slug: "the-batman-part-two-arkham-rogues-clayface",
    category: "movies",
    fandom: "The Batman / DC",
    author: "Selina Kyle-Dean",
    authorAvatar: "/src/assets/images/batman_dark_knight_1790299278923.jpg",
    coverImage: "/src/assets/images/batman_dark_knight_1790299278923.jpg",
    summary: "An in-depth investigation into Matt Reeves' script for The Batman Part II: shifting Bruce Wayne from vengeance to hope amidst a flooded Gotham.",
    content: `When The Batman ended with Gotham submerged under seawall floods, Matt Reeves laid the foundation for an unsparing psychological thriller. The sequel explores the vacuum left by Carmine Falcone's demise, where the Court of Owls, the Penguin, and a tragic reimagining of Clayface threaten to tear the metropolis apart.
    
Robert Pattinson's Batman must now evolve from an instrument of brute vengeance into a symbol of genuine rescue. Greig Fraser's gritty anamorphic lens work promises to once again evoke 1970s neo-noir classics like Chinatown and Taxi Driver.`,
    tags: ["The Batman", "Matt Reeves", "DC Studios", "Robert Pattinson"],
    readTime: "6 min read",
    publishedAt: "2026-03-24",
    views: 36700,
    likes: 3890,
    isApproved: true
  },

  // TV SHOWS ARTICLES
  {
    id: "art-9",
    title: "Arcane Season 2 Climax: Hextech Warfare, Singed's Warwick & The Fall of Piltover",
    slug: "arcane-season-2-climax-hextech-warfare-warwick",
    category: "tv-shows",
    fandom: "Arcane (League of Legends)",
    author: "Viktor Vance",
    authorAvatar: "/src/assets/images/neon_vigilante_hero_1790299533301.jpg",
    coverImage: "/src/assets/images/fandom_anime_cyber_1790294513680.jpg",
    summary: "Fortiche and Riot Games delivered an animation tour-de-force: unpacking Jinx's rocket, Vi's enforcer burden, and Singed's monstrous beast.",
    content: `Arcane's triumphant return proved that video game adaptations can stand alongside the greatest prestige television in history. Fortiche Studio's fusion of 3D camera sweeps and expressive hand-painted brush textures breathes tangible soul into every cobblestone of Zaun and every gleaming ivory tower of Piltover.
    
As Hextech becomes weaponized and Singed's chimera beast Warwick stalks the dark drainage pipes, Jinx and Vi's fractured sisterhood anchors the emotional devastation. It is a tragedy in the Shakespearean tradition, wrapped in electrifying orchestral and industrial sound design.`,
    tags: ["Arcane", "Fortiche", "Riot Games", "Prestige TV", "Jinx"],
    readTime: "9 min read",
    publishedAt: "2026-03-20",
    views: 52400,
    likes: 6120,
    isApproved: true
  },
  {
    id: "art-10",
    title: "House of the Dragon: The Battle of the Gullet & Caraxes' Sky Choreography",
    slug: "house-of-the-dragon-battle-gullet-dragon-vfx",
    category: "tv-shows",
    fandom: "House of the Dragon / Game of Thrones",
    author: "Archmaester Gyldayn",
    authorAvatar: "/src/assets/images/cinema_dragon_throne_1790361965433.jpg",
    coverImage: "/src/assets/images/cinema_dragon_throne_1790361965433.jpg",
    summary: "Inside HBO's massive naval-dragon clash: how VFX supervisors made Caraxes, Vhagar, and Vermax fight with authentic predatory biology.",
    content: `The Dance of the Dragons reached its most catastrophic nautical clash in the Battle of the Gullet. HBO's production team treated each dragon not as fantasy beasts, but as distinct apex predators: Caraxes moves with the agile, serpentine fury of an electric viper, while Vhagar possesses the lumbering, terrifying displacement of a prehistoric blue whale.
    
Daemon Targaryen's tactical ferocity against the Triarchy fleet sets a benchmark for television battle choreography that rivals Battle of the Bastards in scale and emotional dread.`,
    tags: ["House of the Dragon", "Daemon Targaryen", "HBO", "VFX Breakdown"],
    readTime: "7 min read",
    publishedAt: "2026-03-19",
    views: 39500,
    likes: 4120,
    isApproved: true
  },

  // GAMING ARTICLES
  {
    id: "art-11",
    title: "GTA VI: Vice City Map Scale, Dynamic AI NPC Routines & Leonida Physics Engine",
    slug: "gta-6-vice-city-map-scale-ai-leonida-physics",
    category: "gaming",
    fandom: "Grand Theft Auto VI",
    author: "Niko Bellic Jr.",
    authorAvatar: "/src/assets/images/cyberpunk_vice_city_1790361950975.jpg",
    coverImage: "/src/assets/images/cyberpunk_vice_city_1790361950975.jpg",
    summary: "Rockstar's proprietary RAGE 9 engine introduces procedural interior lighting, photorealistic ocean currents, and true behavioral AI across Vice City.",
    content: `Grand Theft Auto VI represents the single most significant technological leap in gaming history. By utilizing machine-learning enhanced NPC schedules, the citizens of Vice City do not follow scripted loops; they react dynamically to humidity, social media trends, and criminal encounters.
    
From the neon glitz of Ocean Drive to the murky, alligator-infested bayous of the Keys, Leonida feels alive with unpredictable satirical energy. The duo mechanic between Lucia and Jason introduces tactical robbery prep and emotional friction that redefines open-world storytelling.`,
    tags: ["GTA 6", "Rockstar Games", "Vice City", "Next-Gen Gaming"],
    readTime: "8 min read",
    publishedAt: "2026-03-25",
    views: 68900,
    likes: 7420,
    isApproved: true
  },
  {
    id: "art-2",
    title: "World Building in Soulslike Games: Environmental Storytelling Masterclass",
    slug: "world-building-soulslike-environmental-storytelling",
    category: "gaming",
    fandom: "Elden Ring & Dark Souls",
    author: "Elena Rostova",
    authorAvatar: "/src/assets/images/hero_valkyrie_scarlet_bloom_1790296871933.jpg",
    coverImage: "/src/assets/images/hero_fantasy_valkyrie_1790295619434.jpg",
    summary: "Examining how FromSoftware crafts unforgettable narratives through architecture, item descriptions, and ambient silence rather than forced exposition.",
    content: `The hallmark of great interactive narrative is trusting the player's curiosity. In Elden Ring, the Lands Between do not announce their history through lengthy monologues; instead, crumbling aqueducts, scattered weapon remains, and the silhouette of the Erdtree convey thousands of years of tragic history.
    
By treating the game world as an archaeological ruin, players become active investigators piecing together the Shattering. Item descriptions serve as historical fragments, leaving deliberate voids for the community to theorize and debate.`,
    tags: ["FromSoftware", "Game Design", "Lore Analysis", "Elden Ring"],
    readTime: "8 min read",
    publishedAt: "2026-03-18",
    views: 38200,
    likes: 3950,
    isApproved: true
  },

  // ANIME ARTICLES
  {
    id: "art-1",
    title: "The Renaissance of Dark Fantasy Anime: From Chainsaw Man to Jujutsu Kaisen",
    slug: "renaissance-dark-fantasy-anime",
    category: "anime",
    fandom: "Jujutsu Kaisen & Chainsaw Man",
    author: "Ren Takahashi",
    authorAvatar: "/src/assets/images/hero_gojo_domain_unleashed_1790296831168.jpg",
    coverImage: "/src/assets/images/anime_clash_battle_1790299565818.jpg",
    summary: "How modern animation studios like MAPPA and WIT redefined modern shonen by infusing psychological horror, fluid sakuga, and morally ambiguous heroes.",
    content: `Over the past five years, the traditional shonen formula has undergone an unprecedented metamorphosis. Where the early 2000s celebrated triumphant underdog heroes fueled by the power of friendship, today's landscape is dominated by high-stakes existentialism, brutal consequences, and visceral choreography.
    
Studio MAPPA's work on Jujutsu Kaisen and Chainsaw Man illustrates a pivotal creative leap. The animation blends dynamic 3D camera sweeps with handcrafted 2D sakuga sequences that capture weight, inertia, and psychological breakdown.`,
    tags: ["MAPPA", "Sakuga", "Dark Fantasy", "Anime Analysis"],
    readTime: "6 min read",
    publishedAt: "2026-03-12",
    views: 31200,
    likes: 2980,
    isApproved: true
  },
  {
    id: "art-5",
    title: "Demon Slayer: The Architectural Sakuga of the Infinity Castle Arc",
    slug: "demon-slayer-infinity-castle-sakuga-breakdown",
    category: "anime",
    fandom: "Demon Slayer (Kimetsu no Yaiba)",
    author: "Kenji Sato",
    authorAvatar: "/src/assets/images/tanjiro_sun_breathing_1790299259954.jpg",
    coverImage: "/src/assets/images/tanjiro_sun_breathing_1790299259954.jpg",
    summary: "How studio ufotable combined unreal engine spatial camera physics with traditional handcrafted Japanese ink effects to manifest Muzan's shifting stronghold.",
    content: `The Infinity Castle arc represents the summit of technical anime filmmaking. Ufotable's proprietary hybrid pipeline blends procedural 3D architectural rooms that shift in non-Euclidean space with hand-drawn, high-frame-rate sword clashes.
    
When Tanjiro and Giyu clash against Upper Moon demons, the camera executes unbroken dynamic 360-degree rotations, matching the tempo of traditional Taiko percussion and cinematic orchestral strings.`,
    tags: ["ufotable", "Demon Slayer", "Sakuga", "Animation Tech"],
    readTime: "6 min read",
    publishedAt: "2026-03-24",
    views: 45600,
    likes: 5120,
    isApproved: true
  }
];

export const SEED_MEDIA: FandomMedia[] = [
  // FEATURED BLOCKBUSTER MOVIES & CINEMA SHOWCASE
  {
    id: "med-srk-1",
    title: "Jawan - The Unstoppable Mass Action Extravaganza (Shah Rukh Khan)",
    category: "movies",
    fandom: "Shah Rukh Khan Cinema",
    type: "movie",
    url: "https://www.youtube-nocookie.com/embed/MWOlnZSnXJo",
    thumbnail: "/src/assets/images/srk_jawan_action_1790431080528.jpg",
    duration: "2:49:00",
    description: "Shah Rukh Khan in a dual action role directed by Atlee. A high-octane emotional action thriller that shattered global box office records with chartbuster music by Anirudh.",
    rating: 5.0,
    views: 45000000,
    tags: ["Shah Rukh Khan", "Jawan", "Bollywood Action", "Atlee", "Blockbuster"],
    quality: "4K Dolby Vision",
    year: 2023,
    director: "Atlee",
    genre: "High-Octane Action Drama"
  },
  {
    id: "med-srk-2",
    title: "Pathaan - YRF Spy Universe Global Spectacle (Shah Rukh Khan & Deepika)",
    category: "movies",
    fandom: "Shah Rukh Khan Cinema",
    type: "movie",
    url: "https://www.youtube-nocookie.com/embed/vqu4z34wENw",
    thumbnail: "/src/assets/images/srk_jawan_action_1790431080528.jpg",
    duration: "2:26:00",
    description: "An exiled RAW agent teams up with an elite ISI operative to stop a private terror organization from launching a deadly biological weapon against India.",
    rating: 4.9,
    views: 38000000,
    tags: ["Shah Rukh Khan", "Pathaan", "Spy Universe", "John Abraham", "YRF"],
    quality: "4K UHD HDR",
    year: 2023,
    director: "Siddharth Anand",
    genre: "Spy Espionage Action"
  },
  {
    id: "med-srk-3",
    title: "Dunki - Heartwarming Comedy Drama Journey (Shah Rukh Khan & Rajkumar Hirani)",
    category: "movies",
    fandom: "Shah Rukh Khan Cinema",
    type: "movie",
    url: "https://www.youtube.com/embed/ACKQDAlAfFE",
    thumbnail: "/src/assets/images/srk_jawan_action_1790431080528.jpg",
    duration: "2:41:00",
    description: "A poignant, laughter-filled and emotionally stirring tale of four friends from a village in Punjab dreaming of reaching England through the Donkey flight route.",
    rating: 4.8,
    views: 29000000,
    tags: ["Shah Rukh Khan", "Dunki", "Rajkumar Hirani", "Comedy Drama", "Family"],
    quality: "1080p FHD",
    year: 2023,
    director: "Rajkumar Hirani",
    genre: "Comedy Drama Romance"
  },
  {
    id: "med-ind-4",
    title: "Kalki 2898 AD - Epic Sci-Fi Dystopian Spectacle (Prabhas & Amitabh Bachchan)",
    category: "movies",
    fandom: "Indian Cinema",
    type: "movie",
    url: "https://www.youtube.com/embed/kQDd1AhGIHk",
    thumbnail: "/src/assets/images/dune_desert_sandworm_1790299309457.jpg",
    duration: "3:01:00",
    description: "Nag Ashwin's monumental futuristic mythology blending the Mahabharata with cyberpunk sci-fi in the year 2898 AD across the Complex and Shambala.",
    rating: 4.9,
    views: 32000000,
    tags: ["Prabhas", "Amitabh Bachchan", "Deepika Padukone", "Sci-Fi", "Kalki"],
    quality: "4K IMAX 60FPS",
    year: 2024,
    director: "Nag Ashwin",
    genre: "Mythological Sci-Fi Action"
  },
  {
    id: "med-ind-5",
    title: "RRR - The Revolutionary Brotherhood & Oscar Winning Roar (SS Rajamouli)",
    category: "movies",
    fandom: "Indian Cinema",
    type: "movie",
    url: "https://www.youtube-nocookie.com/embed/NgBoMJy386M",
    thumbnail: "/src/assets/images/srk_jawan_action_1790431080528.jpg",
    duration: "3:07:00",
    description: "Academy Award winner for Best Original Song 'Naatu Naatu'. A fictional story about two legendary revolutionaries fighting against British colonial rule.",
    rating: 5.0,
    views: 58000000,
    tags: ["RRR", "SS Rajamouli", "Ram Charan", "Jr NTR", "Oscar Winner"],
    quality: "4K Dolby Atmos",
    year: 2022,
    director: "S.S. Rajamouli",
    genre: "Epic Period Action"
  },
  {
    id: "med-ind-6",
    title: "K.G.F: Chapter 2 - The Rise of Rocky Bhai (Yash & Sanjay Dutt)",
    category: "movies",
    fandom: "Indian Cinema",
    type: "movie",
    url: "https://www.youtube-nocookie.com/embed/JKa05nyUmuQ",
    thumbnail: "/src/assets/images/batman_dark_knight_1790299278923.jpg",
    duration: "2:48:00",
    description: "The blood-soaked land of Kolar Gold Fields gets a new sovereign in Rocky Bhai whose name strikes fear into the heart of his foes and the government.",
    rating: 4.9,
    views: 41000000,
    tags: ["Yash", "KGF", "Rocky Bhai", "Sanjay Dutt", "Prashanth Neel"],
    quality: "4K UHD",
    year: 2022,
    director: "Prashanth Neel",
    genre: "Period Crime Action"
  },

  // HOLLYWOOD & POP CULTURE MASTERPIECES
  {
    id: "med-spiderman-1",
    title: "Spider-Man: Across the Spider-Verse - Multiverse Chase (4K Cinema)",
    category: "movies",
    fandom: "Spider-Man Universe",
    type: "movie",
    url: "https://www.youtube-nocookie.com/embed/cqGjhVJWtEg",
    thumbnail: "/src/assets/images/multiverse_avengers_clash_1790361980755.jpg",
    duration: "2:20:00",
    description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. Groundbreaking Oscar-nominated visual art.",
    rating: 5.0,
    views: 24000000,
    tags: ["Spider-Man", "Miles Morales", "Marvel", "Spider-Verse", "Animation"],
    quality: "4K IMAX 60FPS",
    year: 2023,
    director: "Joaquim Dos Santos & Kemp Powers",
    genre: "Multiverse Superhero Animation"
  },
  {
    id: "med-st-1",
    title: "Stranger Things: Season 5 - The Battle for Hawkins & The Upside Down",
    category: "tv-shows",
    fandom: "Stranger Things",
    type: "video",
    url: "https://www.youtube-nocookie.com/embed/sBEvEcpnG7k",
    thumbnail: "/src/assets/images/stranger_things_5_1790431095773.jpg",
    duration: "1:15:00",
    description: "The definitive final chapter of the Duffer Brothers' pop-culture phenomenon. Hawkins is torn open by the Upside Down as Eleven and the party fight Vecna for humanity's survival.",
    rating: 5.0,
    views: 19500000,
    tags: ["Stranger Things", "Netflix", "Eleven", "Vecna", "Final Season", "80s"],
    quality: "4K Dolby Vision",
    year: 2025,
    director: "The Duffer Brothers",
    genre: "Sci-Fi Supernatural Thriller"
  },
  {
    id: "med-gojo-1",
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
    tags: ["Gojo Satoru", "Jujutsu Kaisen", "Infinite Void", "MAPPA", "Hollow Purple"],
    quality: "4K 60FPS",
    year: 2024,
    director: "Sunghoo Park & Shota Goshozono",
    genre: "Dark Fantasy Shonen Action"
  },
  {
    id: "med-5",
    title: "Dune: Part Two - The Arrakis Sandstorm Assault (4K IMAX Cinema)",
    category: "movies",
    fandom: "Dune Universe",
    type: "movie",
    url: "https://www.youtube-nocookie.com/embed/Way9Dexny3w",
    thumbnail: "/src/assets/images/dune_desert_sandworm_1790299309457.jpg",
    duration: "2:46:00",
    description: "Denis Villeneuve's critically acclaimed sci-fi masterpiece. Paul Atreides rides the grand sandworms of Arrakis into an apocalyptic confrontation against the Harkonnens.",
    rating: 4.9,
    views: 14200000,
    tags: ["IMAX 70mm", "Sci-Fi Epic", "Academy Award Winner", "Masterpiece"],
    quality: "4K UHD 60FPS",
    year: 2024,
    director: "Denis Villeneuve",
    genre: "Epic Sci-Fi / Drama"
  },
  {
    id: "med-8",
    title: "Deadpool & Wolverine - The Void & Multiverse Battle Reels",
    category: "movies",
    fandom: "Marvel Cinematic Universe",
    type: "trailer",
    url: "https://www.youtube-nocookie.com/embed/73_1biulkYk",
    thumbnail: "/src/assets/images/multiverse_avengers_clash_1790361980755.jpg",
    duration: "2:08:00",
    description: "Wade Wilson and Wolverine slash their way through the wasteland of the Void in Marvel's box-office shattering team-up event.",
    rating: 4.8,
    views: 18900000,
    tags: ["Marvel", "Deadpool", "Wolverine", "Box Office Hit"],
    quality: "4K Dolby Vision",
    year: 2024,
    director: "Shawn Levy",
    genre: "Superhero Action Comedy"
  },
  {
    id: "med-12",
    title: "The Batman Part II - Arkham Asylum & Neo-Noir Production Teaser",
    category: "movies",
    fandom: "The Batman / DC",
    type: "trailer",
    url: "https://www.youtube-nocookie.com/embed/mqqft2x_Aa4",
    thumbnail: "/src/assets/images/batman_dark_knight_1790299278923.jpg",
    duration: "2:15",
    description: "Robert Pattinson returns to the flooded rain-swept alleys of Gotham City in Matt Reeves' atmospheric detective sequel.",
    rating: 4.9,
    views: 12500000,
    tags: ["DC Studios", "The Batman", "Matt Reeves", "Gothic Noir"],
    quality: "4K HDR",
    year: 2026,
    director: "Matt Reeves",
    genre: "Detective Crime Noir"
  },
  {
    id: "med-oppenheimer-1",
    title: "Oppenheimer - Christopher Nolan 70mm IMAX Official Trailer & Trinity Test",
    category: "movies",
    fandom: "Oppenheimer",
    type: "movie",
    url: "https://www.youtube-nocookie.com/embed/uYPbbksJxIg",
    thumbnail: "/src/assets/images/cosmic_black_hole_1790299552183.jpg",
    duration: "3:00:00",
    description: "Christopher Nolan's biographical masterpiece starring Cillian Murphy. The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    rating: 5.0,
    views: 42000000,
    tags: ["Oppenheimer", "Christopher Nolan", "Cillian Murphy", "IMAX 70mm", "Oscar Winner"],
    quality: "4K IMAX 70mm",
    year: 2023,
    director: "Christopher Nolan",
    genre: "Historical Biographical Drama"
  },
  {
    id: "med-6",
    title: "Grand Theft Auto VI - Official Vice City Reveal Trailer 4K",
    category: "gaming",
    fandom: "Rockstar Games",
    type: "trailer",
    url: "https://www.youtube-nocookie.com/embed/QdBZY2fkU-0",
    thumbnail: "/src/assets/images/cyberpunk_vice_city_1790361950975.jpg",
    duration: "1:31",
    description: "Welcome back to Vice City. Tom Petty's Love Is a Long Road soundtracks the neon streets, wildlife bayous, and viral social media clips of Leonida.",
    rating: 5.0,
    views: 220000000,
    tags: ["Rockstar Games", "GTA VI", "Record Breaker", "Vice City"],
    quality: "4K 60FPS",
    year: 2026,
    director: "Rockstar North",
    genre: "Open World Action"
  },
  {
    id: "med-1",
    title: "Demon Slayer: Infinity Castle Arc - Cinematic Teaser Trailer",
    category: "anime",
    fandom: "Demon Slayer",
    type: "trailer",
    url: "https://www.youtube.com/embed/x7uLutVRBfI",
    thumbnail: "/src/assets/images/tanjiro_sun_breathing_1790299259954.jpg",
    duration: "2:45",
    description: "Witness the descent into the shifting dimensional fortress as the Demon Slayer Corps initiates the final war against Muzan Kibutsuji.",
    rating: 4.9,
    views: 14500000,
    tags: ["Trailer", "ufotable", "Infinity Castle", "Demon Slayer"],
    quality: "4K 60FPS",
    year: 2026,
    director: "Haruo Sotozaki",
    genre: "Dark Fantasy Shonen"
  }
];

export const SEED_UPCOMING_RELEASES: UpcomingRelease[] = [
  {
    id: "rel-1",
    title: "Grand Theft Auto VI",
    fandom: "Rockstar Games",
    category: "gaming",
    type: "Gaming",
    releaseDate: "2026-10-15T00:00:00Z",
    image: "/src/assets/images/cyberpunk_vice_city_1790361950975.jpg",
    synopsis: "Return to the neon-drenched streets of Vice City and the sprawling swamps of Leonida in the most anticipated open-world spectacle of the decade.",
    hypeScore: 99
  },
  {
    id: "rel-3",
    title: "Avengers: Doomsday",
    fandom: "Marvel Cinematic Universe",
    category: "movies",
    type: "Movies",
    releaseDate: "2026-12-18T00:00:00Z",
    image: "/src/assets/images/multiverse_avengers_clash_1790361980755.jpg",
    synopsis: "The multiverse collides under the shadow of Victor von Doom (Robert Downey Jr.), uniting heroes across disparate dimensions in a catastrophic war for reality.",
    hypeScore: 98
  },
  {
    id: "rel-2",
    title: "Chainsaw Man: Reze Arc Movie",
    fandom: "Chainsaw Man",
    category: "anime",
    type: "Anime",
    releaseDate: "2026-08-20T00:00:00Z",
    image: "/src/assets/images/anime_clash_battle_1790299565818.jpg",
    synopsis: "Denji encounters the mysterious bomb hybrid Reze during a rainy night, sparking a whirlwind romance and explosive clash animated by MAPPA for the big screen.",
    hypeScore: 97
  },
  {
    id: "rel-4",
    title: "The Batman: Part II",
    fandom: "The Batman / DC",
    category: "movies",
    type: "Movies",
    releaseDate: "2026-10-02T00:00:00Z",
    image: "/src/assets/images/batman_dark_knight_1790299278923.jpg",
    synopsis: "Matt Reeves and Robert Pattinson return to dive into Arkham's deepest depths and Gotham's flooded streets against Clayface and the Court of Owls.",
    hypeScore: 96
  },
  {
    id: "rel-5",
    title: "Dune: Messiah (Auteur Conclusion)",
    fandom: "Dune Universe",
    category: "movies",
    type: "Movies",
    releaseDate: "2027-03-15T00:00:00Z",
    image: "/src/assets/images/dune_desert_sandworm_1790299309457.jpg",
    synopsis: "Denis Villeneuve's concluding chapter of the Arrakis trilogy: Paul Atreides reckons with the apocalyptic consequences of the Fremen jihad.",
    hypeScore: 98
  },
  {
    id: "rel-6",
    title: "Arcane: Final Season & Act Trilogy",
    fandom: "Arcane",
    category: "tv-shows",
    type: "TV Shows",
    releaseDate: "2026-11-20T00:00:00Z",
    image: "/src/assets/images/fandom_anime_cyber_1790294513680.jpg",
    synopsis: "The definitive war between Zaun and Piltover reaches its heartbreaking conclusion as Jinx, Vi, and Jayce face their ultimate choices.",
    hypeScore: 95
  }
];

export const SEED_MERCHANDISE: FandomMerchandise[] = [
  {
    id: "merch-1",
    title: "Hot Toys 1/6 Scale The Dark Knight (Armory Special Edition)",
    fandom: "The Batman / DC",
    category: "movies",
    description: "Museum-grade collector piece featuring hand-tailored tactical suit, moveable eyes system, functioning magnetic utility belt, and fully illuminated bat-armory cabinet.",
    image: "/src/assets/images/batman_dark_knight_1790299278923.jpg",
    tags: ["Limited Edition", "Collectible"],
    status: "available",
    popularity: 99,
    releaseDate: "2026-02-15",
    estimatedPrice: "$485 USD (Collector Valuation)"
  },
  {
    id: "merch-2",
    title: "Malenia Haligtree Helm Replica - 1:1 Scale Wearable Brass",
    fandom: "Elden Ring",
    category: "gaming",
    description: "Forged in aged bronze alloy with hand-burnished wing crests, microfiber padded interior, and custom magnetic display pedestal signed by the design team.",
    image: "/src/assets/images/hero_valkyrie_scarlet_bloom_1790296871933.jpg",
    tags: ["Limited Edition", "Collectible"],
    status: "preorder",
    popularity: 96,
    releaseDate: "2026-09-30",
    estimatedPrice: "$450 USD (Collector Valuation)"
  },
  {
    id: "merch-5",
    title: "Dune Atreides Ornithopter Mechanical Diecast Model (Functional Flapping Wings)",
    fandom: "Dune",
    category: "movies",
    description: "Engineered with 8 independent articulated carbon-fiber wings, pressurized cabin interior, and desert display base modeled after the dunes of Jordan.",
    image: "/src/assets/images/hero_movie_heroine_sandstorm_1790296850678.jpg",
    tags: ["Collectible"],
    status: "available",
    popularity: 93,
    releaseDate: "2026-01-10",
    estimatedPrice: "$280 USD (Collector Valuation)"
  },
  {
    id: "merch-6",
    title: "Arcane Jinx Fishbones Rocket Launcher 1:1 Scale Sound Prop",
    fandom: "Arcane",
    category: "tv-shows",
    description: "Full-scale mechanical shark launcher featuring motorized jaws, glowing LED chamber lights, and authentic voice line soundboards voiced by Ella Purnell.",
    image: "/src/assets/images/neon_vigilante_hero_1790299533301.jpg",
    tags: ["Limited Edition", "Pre-Order"],
    status: "preorder",
    popularity: 95,
    releaseDate: "2026-11-15",
    estimatedPrice: "$390 USD (Collector Valuation)"
  },
  {
    id: "merch-7",
    title: "Satoru Gojo: Hollow Purple 1/6 Scale Deluxe Resin Statue",
    fandom: "Jujutsu Kaisen",
    category: "anime",
    description: "Hand-painted collector resin statue with internal pulsating LED lighting effect depicting the catastrophic awakening of Hollow Purple against Toji Fushiguro.",
    image: "/src/assets/images/gojo_hollow_purple_blast_1790297433629.jpg",
    tags: ["Limited Edition", "Collectible"],
    status: "available",
    popularity: 98,
    releaseDate: "2026-02-15",
    estimatedPrice: "$380 USD (Collector Valuation)"
  }
];

export const SEED_EVENTS: FandomEvent[] = [
  {
    id: "ev-1",
    title: "Venice Pop-Culture & Sci-Fi Film Festival 2026",
    category: "movies",
    fandom: "Cinema & Sci-Fi",
    type: "screening",
    date: "2026-09-02",
    time: "10:00 AM - 11:30 PM",
    city: "Venice",
    venue: "Palazzo del Cinema, Lido di Venezia",
    coordinates: { lat: 45.4053, lng: 12.3678 },
    description: "World premieres of upcoming auteur science-fiction, 70mm Nolan retrospectives, masterclass panels with world-renowned cinematographers and directors.",
    image: "/src/assets/images/cinema_dragon_throne_1790361965433.jpg",
    ticketUrl: "https://www.labiennale.org/en/cinema",
    price: "€85 - €220",
    attendeesCount: 45000
  },
  {
    id: "ev-2",
    title: "San Diego Comic-Con International 2026",
    category: "comics",
    fandom: "Comics, Movies & Pop Culture",
    type: "convention",
    date: "2026-07-23",
    time: "09:30 AM - 08:00 PM",
    city: "San Diego",
    venue: "San Diego Convention Center",
    coordinates: { lat: 32.7067, lng: -117.161 },
    description: "The global epicenter of pop culture fandom: Hall H blockbuster movie reveals, Marvel & DC universe announcements, and Eisner Awards ceremony.",
    image: "/src/assets/images/multiverse_avengers_clash_1790361980755.jpg",
    ticketUrl: "https://www.comic-con.org",
    price: "$210 (Full Event)",
    attendeesCount: 135000
  },
  {
    id: "ev-3",
    title: "Anime Expo Global 2026",
    category: "anime",
    fandom: "Anime & Manga",
    type: "convention",
    date: "2026-07-02",
    time: "09:00 AM - 07:00 PM",
    city: "Los Angeles",
    venue: "Los Angeles Convention Center",
    coordinates: { lat: 34.0407, lng: -118.269 },
    description: "North America's premier celebration of Japanese animation: world premiere screenings from MAPPA & ufotable, guest voice actors from Tokyo, and cosplay masquerades.",
    image: "/src/assets/images/tanjiro_sun_breathing_1790299259954.jpg",
    ticketUrl: "https://www.anime-expo.org",
    price: "$145 (4-Day Pass)",
    attendeesCount: 110000
  },
  {
    id: "ev-4",
    title: "Worlds 2026 Gaming Championship Grand Finals",
    category: "gaming",
    fandom: "Esports & Competitive Gaming",
    type: "premiere",
    date: "2026-11-14",
    time: "04:00 PM - 10:30 PM",
    city: "Seoul",
    venue: "Gocheok Sky Dome",
    coordinates: { lat: 37.4982, lng: 126.867 },
    description: "The ultimate clash of international esports champions competing for the Summoner's Cup with holographic opening ceremony performances and stadium light shows.",
    image: "/src/assets/images/kratos_blades_chaos_1790299292974.jpg",
    ticketUrl: "https://lolesports.com",
    price: "$95 - $260",
    attendeesCount: 30000
  }
];

export const SEED_FAQS = [
  {
    id: "faq-1",
    question: "What is Fan Hub Plus?",
    answer: "Fan Hub Plus is the premier digital fandom universe and discovery portal celebrating Movies, TV Shows, Gaming, Anime, Comics, Manga, K-Pop, and Cosplay with rich 4K multimedia, character lore compendiums, release countdowns, and community fan submissions.",
    category: "general"
  },
  {
    id: "faq-2",
    question: "Can I stream movies and trailers directly on Fan Hub Plus?",
    answer: "Yes! Our Multimedia Theater supports high-definition trailers, soundtrack orchestrations, behind-the-scenes filmmaking featurettes, and video podcasts with live player controls.",
    category: "media"
  },
  {
    id: "faq-3",
    question: "How do I submit fan articles, theories or cosplay?",
    answer: "Registered users can navigate to the 'Submissions' portal or the User Dashboard to draft fan articles, cosplay galleries, or lore theories. All fan submissions pass an administrator review workflow before public launch.",
    category: "community"
  },
  {
    id: "faq-4",
    question: "How does the Bookmarking and Notes system work?",
    answer: "Click the Bookmark icon on any movie, character, article, video, event, or merchandise item. Saved items appear in your personal Fan Dashboard where you can write private notes to track your watchlists and theories.",
    category: "features"
  }
];
