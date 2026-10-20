window.TEMPLATE_CATEGORIES = [
  {
    "id": "all",
    "name": "All Templates",
    "icon": "\u2726"
  },
  {
    "id": "cinematic",
    "name": "Cinematic",
    "icon": "\ud83c\udfac"
  },
  {
    "id": "romantic",
    "name": "Romantic",
    "icon": "\ud83c\udf39"
  },
  {
    "id": "memory",
    "name": "Memory & Family",
    "icon": "\ud83d\udcf7"
  },
  {
    "id": "sculptural",
    "name": "Sculptural & Surprise",
    "icon": "\ud83d\udc8e"
  },
  {
    "id": "cosmic",
    "name": "Cosmic & Celestial",
    "icon": "\ud83c\udf0c"
  }
];

window.MASTER_TEMPLATES = {
  "golden_cinema": {
    "id": "golden_cinema",
    "version": "1.0",
    "category": "cinematic",
    "name": "Golden Cinema Premiere",
    "icon": "\ud83c\udfac",
    "tagline": "Architectural golden stage with film reel countdown and dramatic spotlights",
    "description": "A grand Hollywood-style premiere experience. Features cinematic light sweeps, volumetric amber lighting, velvet curtains, and an orchestral fanfare finale.",
    "theme_id": "sculptural_gold",
    "soundtrack_preset": "upbeat_cheer",
    "animation_preset": "cinematic_luxury",
    "badge": "\u2726 Premiere Showcase",
    "preview_gradient": "linear-gradient(135deg, #1e1302 0%, #d97706 50%, #78350f 100%)",
    "supported_events": [
      "birthday",
      "milestone",
      "graduation",
      "achievement"
    ],
    "supported_relationships": [
      "all"
    ],
    "default_gift_style": "champagne_gold",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "The Red Carpet Premiere",
        "custom_content": {
          "countdown_seconds": 3,
          "countdown_label": "The Premier Showcase Begins In",
          "title": "An Unforgettable Premiere",
          "subtitle": "Tonight, every spotlight shines exclusively on you",
          "ambient_mode": "spotlight_stage"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "Golden Hour Reflections",
        "custom_content": {
          "headline": "Moments of Pure Brilliance",
          "quote": "Like gold forged in fire, your grace and warmth inspire everyone who walks beside you.",
          "particles": "golden_sparkles"
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "The Milestone Reel",
        "custom_content": {
          "headline": "Cherished Chapter Milestones",
          "display_mode": "horizontal_reel",
          "memories": [
            {
              "title": "The Spark",
              "quote": "Where every great legend begins \u2014 with a dream and boundless courage.",
              "image_url": ""
            },
            {
              "title": "Triumphs & Laughter",
              "quote": "Countless shared smiles that lit up every room you entered.",
              "image_url": ""
            },
            {
              "title": "The Journey Today",
              "quote": "Standing tall, beloved by all, and glowing brighter than ever.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Royal Presentation Box",
        "custom_content": {
          "style": "champagne_gold",
          "prompt": "Tap the royal gold satin box to unveil your red-carpet surprise...",
          "title": "From The Heart of Your Admirers",
          "letter": "On this momentous milestone, we celebrate not just what you accomplish, but the wonderful, radiant soul you are. May your coming year be filled with standing ovations, boundless joy, and extraordinary dreams fulfilled.",
          "signature": "With warmest admiration & love"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Grand Celebration Fanfare",
        "custom_content": {
          "headline": "Happy Birthday, Our Superstar!",
          "constellation": "LEO GLORIA",
          "wishes": "Endless Joy, Triumphant Success, Radiant Health",
          "closing": "May this year be your finest blockbuster yet!"
        }
      }
    ]
  },
  "infinite_corridor": {
    "id": "infinite_corridor",
    "version": "1.0",
    "category": "cinematic",
    "name": "Infinite Memory Corridor",
    "icon": "\ud83c\udfdb\ufe0f",
    "tagline": "Endless illuminated colonnade with floating golden frames and spatial depth",
    "description": "A journey down a metaphysical palace corridor. Floating memories line the mirrored pillars as camera motion glides smoothly toward the grand hall.",
    "theme_id": "midnight_cinema",
    "soundtrack_preset": "celestial_drift",
    "animation_preset": "cinematic_luxury",
    "badge": "\ud83d\udc51 Architectural Depth",
    "preview_gradient": "linear-gradient(135deg, #090d16 0%, #1e293b 50%, #38bdf8 100%)",
    "supported_events": [
      "birthday",
      "anniversary",
      "milestone"
    ],
    "supported_relationships": [
      "all"
    ],
    "default_gift_style": "minimal_art",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "Threshold of Time",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "Entering The Grand Corridor",
          "subtitle": "A timeless walk through extraordinary memories"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "Reflections in Marble",
        "custom_content": {
          "headline": "Echoes of Elegance",
          "quote": "Some people pass through life quietly; you turn every corridor into an illuminated gallery of hope."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "The Gallery of Years",
        "custom_content": {
          "headline": "Milestones Along The Colonnade",
          "display_mode": "floating_gallery",
          "memories": [
            {
              "title": "Dawn",
              "quote": "The innocent steps that led to this brilliant horizon.",
              "image_url": ""
            },
            {
              "title": "Zenith",
              "quote": "A heart that continuously gives more than it ever asks in return.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Marble Monolith Secret",
        "custom_content": {
          "style": "minimal_art",
          "prompt": "Touch the Carrara monolith to open the hidden chamber...",
          "title": "A Letter Across The Corridor",
          "letter": "You bring an architectural grace to every life you touch. Here is to a future as infinite as this hall.",
          "signature": "Forever proud of you"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Celestial Rotunda",
        "custom_content": {
          "headline": "Honor, Splendor & Celebration",
          "constellation": "AETERNITAS",
          "wishes": "Infinite Peace, Eternal Beauty, Unstoppable Triumph",
          "closing": "The hall will always welcome you home."
        }
      }
    ]
  },
  "grand_reveal": {
    "id": "grand_reveal",
    "version": "1.0",
    "category": "cinematic",
    "name": "The Grand Reveal",
    "icon": "\ud83c\udfaa",
    "tagline": "Dramatic theatrical curtain rise with golden typography and light beams",
    "description": "A high-impact theatrical unveiling. Velvet curtains part into brilliant golden illumination, unveiling personalized honors and heartfelt tributes.",
    "theme_id": "celestial_noir",
    "soundtrack_preset": "upbeat_cheer",
    "animation_preset": "celebration_burst",
    "badge": "\ud83c\udf89 Maximum Impact",
    "preview_gradient": "linear-gradient(135deg, #180509 0%, #881337 50%, #e11d48 100%)",
    "supported_events": [
      "birthday",
      "graduation",
      "milestone"
    ],
    "supported_relationships": [
      "all"
    ],
    "default_gift_style": "luxury_sculpted",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "The Curtain Rises",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "The Grand Stage is Set",
          "subtitle": "Take your front-row seat for a once-in-a-lifetime reveal"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "Spotlight on You",
        "custom_content": {
          "headline": "A Presence That Commands Wonder",
          "quote": "True star quality is not about seeking applause \u2014 it is about the quiet kindness that brightens everyone around you."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "Highlights & Trophies",
        "custom_content": {
          "headline": "Standing Ovations",
          "display_mode": "horizontal_reel",
          "memories": [
            {
              "title": "The Opening Act",
              "quote": "Where courage first took flight.",
              "image_url": ""
            },
            {
              "title": "Encore Performance",
              "quote": "Every triumph earned through passion and perseverance.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "Backstage Keepsake",
        "custom_content": {
          "style": "luxury_sculpted",
          "prompt": "Unwrap the presentation chest for your personal dedication...",
          "title": "The VIP Envelope",
          "letter": "You deserve every single flower and round of applause today. You make the world a better, brighter show.",
          "signature": "Your #1 Fans"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Grand Finale Fanfare",
        "custom_content": {
          "headline": "A Standing Ovation For You!",
          "constellation": "APOLLO GRAND",
          "wishes": "Rapturous Joy, Unlimited Love, Radiant Future",
          "closing": "Take a bow \u2014 today belongs to you!"
        }
      }
    ]
  },
  "storybook_motion": {
    "id": "storybook_motion",
    "version": "1.0",
    "category": "cinematic",
    "name": "Storybook in Motion",
    "icon": "\ud83d\udcd6",
    "tagline": "Turn-of-the-century leather-bound volume with golden calligraphy and turning parchment",
    "description": "A fairy-tale aesthetic featuring illuminated manuscript chapter headings, realistic 3D page turns, gentle ink reveals, and storybook epilogues.",
    "theme_id": "ivory_atelier",
    "soundtrack_preset": "warm_nostalgia",
    "animation_preset": "memory_lane",
    "badge": "\ud83d\udd4a\ufe0f Fairy Tale Heirloom",
    "preview_gradient": "linear-gradient(135deg, #1c1917 0%, #78350f 50%, #d97706 100%)",
    "supported_events": [
      "birthday",
      "anniversary",
      "family"
    ],
    "supported_relationships": [
      "child",
      "partner",
      "friend",
      "sister",
      "brother"
    ],
    "default_gift_style": "paper_sculpture",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "Chapter I: Once Upon a Time",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "Opening The Golden Folio",
          "subtitle": "The most enchanting tale ever written \u2014 your story"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "Chapter II: The Enchanted Garden",
        "custom_content": {
          "headline": "A Soul of Rare Kindness",
          "quote": "In every fairy tale, there is a heroine who brings laughter to weary travelers and turns simple days into magic."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "Chapter III: Illustrated Memories",
        "custom_content": {
          "headline": "Leaves of Living Memory",
          "display_mode": "storybook_spread",
          "memories": [
            {
              "title": "The Early Chapters",
              "quote": "Golden childhood afternoons that felt like they would last forever.",
              "image_url": ""
            },
            {
              "title": "The Heroic Quests",
              "quote": "Overcoming every hill with laughter and grace.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "Chapter IV: The Secret Parchment",
        "custom_content": {
          "style": "paper_sculpture",
          "prompt": "Unfold the enchanted origami parchment...",
          "title": "A Handwritten Epilogue",
          "letter": "May your chapters always be written in courage and bookmarked with boundless love.",
          "signature": "With infinite affection"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "Chapter V: Happily Ever After",
        "custom_content": {
          "headline": "And The Story Continues...",
          "constellation": "LIBRA VITA",
          "wishes": "Wonder, Serenity, Everlasting Magic",
          "closing": "The finest chapters are still waiting to be lived."
        }
      }
    ]
  },
  "time_capsule": {
    "id": "time_capsule",
    "version": "1.0",
    "category": "cinematic",
    "name": "Time Capsule",
    "icon": "\u23f3",
    "tagline": "Retro-futuristic chronometer chamber with rotating brass rings and temporal counter",
    "description": "Travel through time with brass gears, temporal particle streams, and vintage holographic projections commemorating every year of life.",
    "theme_id": "sculptural_gold",
    "soundtrack_preset": "warm_nostalgia",
    "animation_preset": "cinematic_luxury",
    "badge": "\u231b Temporal Wonder",
    "preview_gradient": "linear-gradient(135deg, #18181b 0%, #451a03 50%, #b45309 100%)",
    "supported_events": [
      "birthday",
      "milestone",
      "anniversary"
    ],
    "supported_relationships": [
      "all"
    ],
    "default_gift_style": "velvet_jewelry",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "Synchronizing The Chronometer",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "Unlocking The Time Vault",
          "subtitle": "Calibrating every precious hour of your magnificent journey"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "The Hourglass of Light",
        "custom_content": {
          "headline": "Moments Frozen In Amber",
          "quote": "Time does not diminish true beauty; like fine vintage wine, every passing year only enriches your depth."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "The Temporal Timeline",
        "custom_content": {
          "headline": "Chronicles Through The Decades",
          "display_mode": "horizontal_reel",
          "memories": [
            {
              "title": "Year Zero",
              "quote": "A world transformed by your arrival.",
              "image_url": ""
            },
            {
              "title": "The Golden Epoch",
              "quote": "Memories etched forever in brass and light.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Heritage Keepsake Box",
        "custom_content": {
          "style": "velvet_jewelry",
          "prompt": "Turn the brass key to unlock your sealed message...",
          "title": "A Message Beyond Time",
          "letter": "If we could gather every second you have spent making others happy, it would fill an eternity. You are timeless.",
          "signature": "Always in your timeline"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Chronos Orbit",
        "custom_content": {
          "headline": "Here is To All Your Future Years!",
          "constellation": "CHRONOS AURA",
          "wishes": "Timeless Health, Ageless Vitality, Perpetual Joy",
          "closing": "Every tick of the clock is another reason to smile."
        }
      }
    ]
  },
  "living_portrait": {
    "id": "living_portrait",
    "version": "1.0",
    "category": "cinematic",
    "name": "Living Portrait Theatre",
    "icon": "\ud83d\uddbc\ufe0f",
    "tagline": "Gilded ornate baroque frames that come alive with kinetic parallax motion",
    "description": "A fine-art museum gallery experience where ornate gilded frames gently breathe with subtle multi-plane parallax depth and chiaroscuro lighting.",
    "theme_id": "midnight_cinema",
    "soundtrack_preset": "celestial_drift",
    "animation_preset": "cinematic_luxury",
    "badge": "\ud83c\udfa8 Masterpiece Gallery",
    "preview_gradient": "linear-gradient(135deg, #09090b 0%, #27272a 50%, #eab308 100%)",
    "supported_events": [
      "birthday",
      "anniversary",
      "milestone"
    ],
    "supported_relationships": [
      "partner",
      "parent",
      "friend"
    ],
    "default_gift_style": "luxury_sculpted",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "The Grand Salon",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "The Masterpiece Unveiling",
          "subtitle": "Step inside the gallery dedicated to a life of distinction"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "The Living Canvas",
        "custom_content": {
          "headline": "A Portrait of True Grace",
          "quote": "You are both the masterpiece and the artist \u2014 painting kindness and joy onto the canvas of our lives."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "The Curated Exhibition",
        "custom_content": {
          "headline": "Permanent Collection",
          "display_mode": "polaroid_wall",
          "memories": [
            {
              "title": "Study in Laughter",
              "quote": "A moment captured where joy was completely unreserved.",
              "image_url": ""
            },
            {
              "title": "The Serenade",
              "quote": "Light catching the gentle curve of your smile.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Curator Secret Drawer",
        "custom_content": {
          "style": "luxury_sculpted",
          "prompt": "Slide open the gilded museum pedestal...",
          "title": "The Artist Dedication",
          "letter": "They say beauty is rare, but a soul as generous as yours is once in a lifetime. Thank you for being our daily inspiration.",
          "signature": "With boundless love"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Eternal Exhibition",
        "custom_content": {
          "headline": "An Unforgettable Masterpiece",
          "constellation": "MUSA CELESTE",
          "wishes": "Creative Fulfillment, Serene Peace, Endless Admiration",
          "closing": "May your life always be framed in love."
        }
      }
    ]
  },
  "aurora_two_hearts": {
    "id": "aurora_two_hearts",
    "version": "1.0",
    "category": "romantic",
    "name": "Aurora of Two Hearts",
    "icon": "\ud83c\udf0c",
    "tagline": "Twin undulating curtains of rose and emerald polar light harmonizing in depth",
    "description": "A breathtaking boreal sky where two waves of polar starlight dance and intertwine, casting soft reflections onto calm glacial waters.",
    "theme_id": "romantic_aurora",
    "soundtrack_preset": "romantic_waltz",
    "animation_preset": "romantic_glow",
    "badge": "\ud83c\udf39 Deep Romance",
    "preview_gradient": "linear-gradient(135deg, #1e0b24 0%, #831843 50%, #f43f5e 100%)",
    "supported_events": [
      "valentine",
      "anniversary",
      "birthday"
    ],
    "supported_relationships": [
      "partner",
      "fiance",
      "spouse"
    ],
    "default_gift_style": "enchanted_floral",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "The Twilight Horizon",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "Beneath The Northern Sky",
          "subtitle": "Where two paths met and changed the universe forever"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "Intertwined Auroras",
        "custom_content": {
          "headline": "My Favorite Place Is With You",
          "quote": "In an infinite cosmos of drifting stars, finding you was the miracle that gave everything color."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "Constellation of Us",
        "custom_content": {
          "headline": "Chapters Written In Starlight",
          "display_mode": "horizontal_reel",
          "memories": [
            {
              "title": "The First Glimpse",
              "quote": "The exact second the world became brighter and softer.",
              "image_url": ""
            },
            {
              "title": "Hand in Hand",
              "quote": "Every quiet evening, every adventure, all better because of you.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Rose Petal Heart",
        "custom_content": {
          "style": "enchanted_floral",
          "prompt": "Touch the blooming rose shell to reveal your love note...",
          "title": "To My Everything",
          "letter": "Loving you is as effortless as breathing and as profound as the oceans. Happy birthday to the one who holds my whole heart.",
          "signature": "Yours, completely and always"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "Heart of Radiant Light",
        "custom_content": {
          "headline": "A Love Written in the Stars",
          "constellation": "AMORIS GEMINI",
          "wishes": "Endless Devotion, Soft Laughter, Lifelong Adventures",
          "closing": "I would choose you in every lifetime."
        }
      }
    ]
  },
  "floating_rose_garden": {
    "id": "floating_rose_garden",
    "version": "1.0",
    "category": "romantic",
    "name": "Floating Rose Garden",
    "icon": "\ud83c\udf39",
    "tagline": "Zero-gravity floating garden of English roses and sakura petals suspended in mist",
    "description": "A dreamy floating botanic garden. Dew-kissed blossoms hover weightlessly as ambient sunlight filters through gentle rose-tinted mist.",
    "theme_id": "romantic_aurora",
    "soundtrack_preset": "romantic_waltz",
    "animation_preset": "romantic_glow",
    "badge": "\ud83c\udf38 Botanical Elegance",
    "preview_gradient": "linear-gradient(135deg, #1c0a1a 0%, #701a75 50%, #f472b6 100%)",
    "supported_events": [
      "birthday",
      "valentine",
      "anniversary"
    ],
    "supported_relationships": [
      "partner",
      "mother",
      "sister",
      "friend"
    ],
    "default_gift_style": "enchanted_floral",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "The Garden Gates",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "Entering The Floating Bower",
          "subtitle": "A sanctuary of beauty dedicated entirely to you"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "Petals in Weightlessness",
        "custom_content": {
          "headline": "Bloom With Wild Abandon",
          "quote": "You possess a beauty that does not demand attention \u2014 it simply radiates like dawn over wild roses."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "The Floral Path",
        "custom_content": {
          "headline": "Bouquet of Memories",
          "display_mode": "floating_gallery",
          "memories": [
            {
              "title": "Spring Awakening",
              "quote": "Your laugh that could thaw any winter chill.",
              "image_url": ""
            },
            {
              "title": "Full Bloom",
              "quote": "Growing more confident, radiant, and inspiring with every day.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Secret Flower Box",
        "custom_content": {
          "style": "enchanted_floral",
          "prompt": "Tap the enchanted flower to unfold your petal letter...",
          "title": "Fragrance of Gratitude",
          "letter": "May your year smell of fresh rain on blossoms, unhurried mornings, and the deepest kind of happiness.",
          "signature": "With all my heart"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Rose Nebula Finale",
        "custom_content": {
          "headline": "May Your Life Always Bloom!",
          "constellation": "ROSA CELESTIA",
          "wishes": "Sweetness, Serenity, Radiant Goodness",
          "closing": "You are the most precious blossom in the garden."
        }
      }
    ]
  },
  "moonlit_love_letter": {
    "id": "moonlit_love_letter",
    "version": "1.0",
    "category": "romantic",
    "name": "Moonlit Love Letter",
    "icon": "\ud83d\udc8c",
    "tagline": "Gentle indigo twilight moonlight reflecting off quiet waters with cursive calligraphy",
    "description": "An intimate, poetic twilight experience. A wax-sealed vellum letter floats on calm moonlit waters, self-inscribing words of lifelong devotion.",
    "theme_id": "celestial_noir",
    "soundtrack_preset": "celestial_drift",
    "animation_preset": "quiet_emotional",
    "badge": "\ud83d\udd4a\ufe0f Quiet Intimacy",
    "preview_gradient": "linear-gradient(135deg, #030712 0%, #1e1b4b 50%, #6366f1 100%)",
    "supported_events": [
      "anniversary",
      "valentine",
      "birthday"
    ],
    "supported_relationships": [
      "partner",
      "spouse"
    ],
    "default_gift_style": "velvet_jewelry",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "By The Water Edge",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "Under The Midnight Moon",
          "subtitle": "A quiet confession whispered across the silver tide"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "Silver Reflections",
        "custom_content": {
          "headline": "My Safe Harbor",
          "quote": "In a world that is constantly rushing, being with you feels like sitting by still waters under an ocean of stars."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "Moonlit Keepsakes",
        "custom_content": {
          "headline": "Unspoken Moments",
          "display_mode": "horizontal_reel",
          "memories": [
            {
              "title": "The First Whisper",
              "quote": "When words were unnecessary because our hearts already knew.",
              "image_url": ""
            },
            {
              "title": "Quiet Evenings",
              "quote": "My favorite place in the universe is simply listening to your breathing beside me.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Wax-Sealed Letter",
        "custom_content": {
          "style": "velvet_jewelry",
          "prompt": "Break the wax seal on the moonlit letter...",
          "title": "What My Heart Always Wanted to Say",
          "letter": "Thank you for choosing me every day. Thank you for your patience, your laugh, and the shelter of your arms. I love you deeper than all the oceans.",
          "signature": "Forever and always yours"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Silver Horizon",
        "custom_content": {
          "headline": "Forever Guided By Your Light",
          "constellation": "LUNA AMOR",
          "wishes": "Peace, Deep Joy, Unwavering Devotion",
          "closing": "As long as the moon pulls the tides, I will adore you."
        }
      }
    ]
  },
  "glass_heart_universe": {
    "id": "glass_heart_universe",
    "version": "1.0",
    "category": "romantic",
    "name": "Glass Heart Universe",
    "icon": "\ud83d\udc8e",
    "tagline": "Hand-blown sculpted refractive glass heart refracting kaleidoscopic iridescent colors",
    "description": "A stunning 3D glass sculpture. Light bounces through prismatic optical facets, casting caustics and diamond reflections across the celebration.",
    "theme_id": "dreamglass",
    "soundtrack_preset": "romantic_waltz",
    "animation_preset": "magical_dream",
    "badge": "\u2728 Refractive Wonder",
    "preview_gradient": "linear-gradient(135deg, #0f172a 0%, #0369a1 50%, #38bdf8 100%)",
    "supported_events": [
      "birthday",
      "anniversary",
      "valentine"
    ],
    "supported_relationships": [
      "partner",
      "daughter",
      "sister",
      "friend"
    ],
    "default_gift_style": "liquid_glass",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "The Crystal Chamber",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "Awakening The Crystal Heart",
          "subtitle": "Pure, luminous, and clear as fine morning light"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "Prismatic Caustics",
        "custom_content": {
          "headline": "Pure And Rare",
          "quote": "You possess a transparency of soul that is almost impossible to find \u2014 honest, radiant, and extraordinarily kind."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "Facet Reflections",
        "custom_content": {
          "headline": "Moments of Diamond Clarity",
          "display_mode": "horizontal_reel",
          "memories": [
            {
              "title": "Crystal Joy",
              "quote": "A laugh so clear it chased away every doubt.",
              "image_url": ""
            },
            {
              "title": "Glimmer of Hope",
              "quote": "The way you lift everyone up with a single look.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Liquid Glass Casket",
        "custom_content": {
          "style": "liquid_glass",
          "prompt": "Tap the hand-blown glass casket to open...",
          "title": "Written on Crystal",
          "letter": "May your year be as bright and resilient as diamond, shining through every challenge and illuminating every dark corner.",
          "signature": "With unconditional love"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "Heart of Infinite Light",
        "custom_content": {
          "headline": "A Soul That Shines Forever",
          "constellation": "COR CRYSTALLUM",
          "wishes": "Clarity, Radiant Joy, Diamond Strength",
          "closing": "Never let anyone dull your magnificent shine."
        }
      }
    ]
  },
  "eternal_orbit": {
    "id": "eternal_orbit",
    "version": "1.0",
    "category": "romantic",
    "name": "Eternal Orbit",
    "icon": "\ud83e\ude90",
    "tagline": "Two celestial golden spheres orbiting each other in harmonic synchrony",
    "description": "A metaphysical romance. Planetary rings of gold dust and gravity waves illustrate the effortless balance of two people destined to orbit together.",
    "theme_id": "pearl_velvet",
    "soundtrack_preset": "celestial_drift",
    "animation_preset": "cosmic_universe",
    "badge": "\ud83e\ude90 Celestial Harmony",
    "preview_gradient": "linear-gradient(135deg, #1c1917 0%, #44403c 50%, #facc15 100%)",
    "supported_events": [
      "anniversary",
      "wedding",
      "valentine"
    ],
    "supported_relationships": [
      "partner",
      "spouse"
    ],
    "default_gift_style": "cosmic_relic",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "Gravitational Pull",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "Synchronizing Two Celestial Worlds",
          "subtitle": "Bound together by an unbreakable gravitational bond"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "Orbital Resonance",
        "custom_content": {
          "headline": "My Center of Gravity",
          "quote": "You anchor me when the winds are wild and give me wings when it is time to soar."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "The Planetary Path",
        "custom_content": {
          "headline": "Orbits Across The Years",
          "display_mode": "horizontal_reel",
          "memories": [
            {
              "title": "First Alignment",
              "quote": "The astronomical coincidence that became our destiny.",
              "image_url": ""
            },
            {
              "title": "Synchronous Rotation",
              "quote": "Moving through life in perfect, effortless rhythm.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Celestial Gyroscope",
        "custom_content": {
          "style": "cosmic_relic",
          "prompt": "Align the gyroscope rings to unlock your message...",
          "title": "An Orbit of Devotion",
          "letter": "No matter where space and time lead us, my heart will always trace its orbit back to you.",
          "signature": "Forever in your gravity"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "Binary Stars in Harmony",
        "custom_content": {
          "headline": "Together in Every Dimension",
          "constellation": "ORBITA AETERNA",
          "wishes": "Harmony, Boundless Compassion, Lifelong Wonder",
          "closing": "Our orbit will never decay."
        }
      }
    ]
  },
  "rose_petal_symphony": {
    "id": "rose_petal_symphony",
    "version": "1.0",
    "category": "romantic",
    "name": "Rose Petal Symphony",
    "icon": "\ud83c\udfbb",
    "tagline": "Swirling 3D vortex of velvet rose petals fluttering in musical cadences",
    "description": "A multisensory floral symphony. Velvet red and blush petals swirl in choreographed waves to an orchestral waltz, culminating in a rose heart burst.",
    "theme_id": "romantic_aurora",
    "soundtrack_preset": "romantic_waltz",
    "animation_preset": "celebration_burst",
    "badge": "\ud83c\udf39 Symphonic Drama",
    "preview_gradient": "linear-gradient(135deg, #2b030b 0%, #991b1b 50%, #f43f5e 100%)",
    "supported_events": [
      "birthday",
      "valentine",
      "anniversary"
    ],
    "supported_relationships": [
      "partner",
      "sister",
      "mother",
      "friend"
    ],
    "default_gift_style": "enchanted_floral",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "The Overture",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "The Symphony Begins",
          "subtitle": "Listen closely \u2014 this melody was written only for you"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "Adagio of Petals",
        "custom_content": {
          "headline": "Poetry in Motion",
          "quote": "You turn ordinary moments into romantic verses, and simple conversations into unforgettable melodies."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "Movement III: The Keepsake Cadenza",
        "custom_content": {
          "headline": "Songs of Shared Days",
          "display_mode": "horizontal_reel",
          "memories": [
            {
              "title": "The Sweet Prelude",
              "quote": "A memory that plays in our hearts on repeat.",
              "image_url": ""
            },
            {
              "title": "Crescendo of Joy",
              "quote": "When we laughed until tears rolled down our cheeks.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Velvet Flower Case",
        "custom_content": {
          "style": "enchanted_floral",
          "prompt": "Tap the blooming petals to open the orchestral note...",
          "title": "The Final Movement",
          "letter": "May your life be accompanied by the sweetest music, gentle breezes, and deep, enduring love.",
          "signature": "With all the love in the world"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Rose Petal Fanfare",
        "custom_content": {
          "headline": "Bravo to Your Beautiful Soul!",
          "constellation": "SYMPHONIA ROSA",
          "wishes": "Enchantment, Melodic Peace, Everlasting Romance",
          "closing": "The music of your laughter will play forever."
        }
      }
    ]
  },
  "polaroid_atelier": {
    "id": "polaroid_atelier",
    "version": "1.0",
    "category": "memory",
    "name": "Polaroid Memory Atelier",
    "icon": "\ud83d\udcf7",
    "tagline": "Sun-drenched artist atelier with clotheslines of gently swaying polaroid prints",
    "description": "A warm, tactile celebration of genuine candid life. Textured polaroids hang on linen lines, bathed in warm afternoon sunlight with handwritten captions.",
    "theme_id": "ivory_atelier",
    "soundtrack_preset": "warm_nostalgia",
    "animation_preset": "memory_lane",
    "badge": "\ud83c\udf9e\ufe0f Most Loved",
    "preview_gradient": "linear-gradient(135deg, #1c1917 0%, #57534e 50%, #fbbf24 100%)",
    "supported_events": [
      "birthday",
      "family",
      "friendship",
      "milestone"
    ],
    "supported_relationships": [
      "sister",
      "brother",
      "friend",
      "parent",
      "all"
    ],
    "default_gift_style": "paper_sculpture",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "Welcome to The Atelier",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "Developing The Keepsakes",
          "subtitle": "Real moments, unposed laughter, and a lifetime of shared stories"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "Golden Sunbeams",
        "custom_content": {
          "headline": "The Beauty of the Everyday",
          "quote": "The greatest treasures are not grand monuments; they are the quiet, silly, candid afternoons spent with you."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "The Clothesline Deck",
        "custom_content": {
          "headline": "Captured In Silver Halide",
          "display_mode": "polaroid_wall",
          "memories": [
            {
              "title": "Remember When?",
              "quote": "That spontaneous road trip where everything went wrong and we laughed until our stomachs hurt.",
              "image_url": ""
            },
            {
              "title": "Unbreakable Bond",
              "quote": "Through thick and thin, always knowing we have each other\u2019s back.",
              "image_url": ""
            },
            {
              "title": "Pure Sunshine",
              "quote": "Your golden spirit that makes everyone feel instantly at home.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Handcrafted Gift Casket",
        "custom_content": {
          "style": "paper_sculpture",
          "prompt": "Open the folded washi keepsake box...",
          "title": "A Letter From The Heart",
          "letter": "No matter how many miles or years separate us, the memories we made are tucked safe in my pocket. Thank you for being my anchor and my best friend.",
          "signature": "Forever in your corner"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Living Keepsake Collage",
        "custom_content": {
          "headline": "To Many More Snapshots Ahead!",
          "constellation": "MEMORIA VERA",
          "wishes": "Endless Laughter, Warm Hugs, Lifelong Sunshine",
          "closing": "Here is to a thousand new memories together!"
        }
      }
    ]
  },
  "childhood_constellation": {
    "id": "childhood_constellation",
    "version": "1.0",
    "category": "memory",
    "name": "Childhood Constellation",
    "icon": "\ud83e\uddf8",
    "tagline": "Vintage star globe tracing key milestones, baby steps, and shared childhood laughter",
    "description": "A heartwarming nostalgic journey tracing innocence, early scrapes, scraped knees, bedroom fort adventures, and growing up side-by-side.",
    "theme_id": "aurora_prism",
    "soundtrack_preset": "warm_nostalgia",
    "animation_preset": "magical_dream",
    "badge": "\ud83c\udfa0 Pure Nostalgia",
    "preview_gradient": "linear-gradient(135deg, #0f172a 0%, #312e81 50%, #a855f7 100%)",
    "supported_events": [
      "birthday",
      "family",
      "sibling"
    ],
    "supported_relationships": [
      "sister",
      "brother",
      "cousin",
      "child"
    ],
    "default_gift_style": "dream_prism",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "The Vintage Star Globe",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "Revolving The Years",
          "subtitle": "Tracing our earliest constellations of innocence and wonder"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "The Treehouse Fort",
        "custom_content": {
          "headline": "Partners In Crime Since Day One",
          "quote": "We built castles out of couch cushions and dreams out of starlight \u2014 and you are still my favorite adventurer."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "The Scrapbook of Wonder",
        "custom_content": {
          "headline": "Baby Steps to Big Dreams",
          "display_mode": "horizontal_reel",
          "memories": [
            {
              "title": "The Sandbox Days",
              "quote": "Sharing crayons, secret codes, and whispered bedtime stories.",
              "image_url": ""
            },
            {
              "title": "Growing Up Fast",
              "quote": "Watching you blossom into the extraordinary, thoughtful person you are today.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Time-Worn Secret Tin",
        "custom_content": {
          "style": "dream_prism",
          "prompt": "Open the luminous memory prism...",
          "title": "A Sibling / Childhood Note",
          "letter": "No matter how grown-up the world demands we be, with you I will always be the kid who believed anything was possible. Happy birthday!",
          "signature": "Your partner in crime forever"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Wonder Constellation",
        "custom_content": {
          "headline": "Keep Your Childhood Spark Alive!",
          "constellation": "PUERITIA AURA",
          "wishes": "Infinite Wonder, Boundless Smiles, Playful Freedom",
          "closing": "Never stop seeing magic in the small things."
        }
      }
    ]
  },
  "family_universe": {
    "id": "family_universe",
    "version": "1.0",
    "category": "memory",
    "name": "Our Family Universe",
    "icon": "\ud83c\udfe1",
    "tagline": "Planetary orbit system where each family member is a luminous world bound by love",
    "description": "A multigenerational tribute honoring family roots, ancestry, traditions, holiday dinner laughter, and the unconditional warmth that connects generations.",
    "theme_id": "ivory_atelier",
    "soundtrack_preset": "warm_nostalgia",
    "animation_preset": "memory_lane",
    "badge": "\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d\udc66 Multi-Generational",
    "preview_gradient": "linear-gradient(135deg, #1c1917 0%, #713f12 50%, #ca8a04 100%)",
    "supported_events": [
      "birthday",
      "family",
      "anniversary",
      "reunion"
    ],
    "supported_relationships": [
      "parent",
      "grandparent",
      "sibling",
      "family"
    ],
    "default_gift_style": "velvet_jewelry",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "The Hearth of Home",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "Gathering Around The Hearth",
          "subtitle": "Celebrating the anchor that keeps our family steady and strong"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "Roots and Wings",
        "custom_content": {
          "headline": "A Foundation Built on Love",
          "quote": "You gave us roots so we would know where we came from, and wings so we would have courage to fly."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "Generations of Smiles",
        "custom_content": {
          "headline": "The Family Album",
          "display_mode": "polaroid_wall",
          "memories": [
            {
              "title": "Holiday Dinners",
              "quote": "The sound of loud laughter echoing around crowded kitchen tables.",
              "image_url": ""
            },
            {
              "title": "Guidance & Wisdom",
              "quote": "Your patient hands and gentle advice when life felt stormy.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Family Heirloom Chest",
        "custom_content": {
          "style": "velvet_jewelry",
          "prompt": "Open the imperial velvet chest...",
          "title": "From The Entire Family",
          "letter": "Everything we are, and all the goodness in our home, stems from your selflessness and devotion. We love and honor you today and every day.",
          "signature": "Your loving family"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Family Tree of Stars",
        "custom_content": {
          "headline": "Happy Birthday to Our Pillar of Strength!",
          "constellation": "DOMUS AETERNA",
          "wishes": "Long Health, Deep Peace, Revered Joy",
          "closing": "Our love for you spans generations."
        }
      }
    ]
  },
  "golden_album": {
    "id": "golden_album",
    "version": "1.0",
    "category": "memory",
    "name": "Golden Memory Album",
    "icon": "\ud83c\udf9e\ufe0f",
    "tagline": "Embossed gold foil heirloom album with corner brackets and photographic turn wipes",
    "description": "A prestigious, heavy velvet-bound commemorative album featuring gold foil embossing, corner brackets, and archival matte photographic prints.",
    "theme_id": "sculptural_gold",
    "soundtrack_preset": "warm_nostalgia",
    "animation_preset": "cinematic_luxury",
    "badge": "\ud83d\udc51 Archival Luxury",
    "preview_gradient": "linear-gradient(135deg, #1c1917 0%, #78350f 50%, #f59e0b 100%)",
    "supported_events": [
      "birthday",
      "anniversary",
      "milestone"
    ],
    "supported_relationships": [
      "all"
    ],
    "default_gift_style": "champagne_gold",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "The Gilded Cover",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "Opening The Archival Album",
          "subtitle": "Gold foil memories bound together for eternity"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "Velvet & Gold",
        "custom_content": {
          "headline": "A Life Richly Lived",
          "quote": "True wealth is not measured in coins, but in the lives you have touched and the smiles you have gifted."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "The Archival Leaves",
        "custom_content": {
          "headline": "Gilded Chapters",
          "display_mode": "horizontal_reel",
          "memories": [
            {
              "title": "The Golden Days",
              "quote": "Photographs that glow with the warmth of genuine happiness.",
              "image_url": ""
            },
            {
              "title": "Milestone Triumphs",
              "quote": "Celebrating every peak conquered along the road.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Royal Satin Presentation",
        "custom_content": {
          "style": "champagne_gold",
          "prompt": "Untie the sheer satin ribbon on the golden box...",
          "title": "The Commemorative Dedication",
          "letter": "This album is a tribute to your extraordinary spirit. May its golden pages continue to expand with every joyful year ahead.",
          "signature": "With deepest respect and love"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Golden Keepsake Finale",
        "custom_content": {
          "headline": "A Golden Milestone Celebrated!",
          "constellation": "AURUM MEMORIA",
          "wishes": "Prosperity, Vitality, Enduring Joy",
          "closing": "Your legacy grows more luminous with every turn of the page."
        }
      }
    ]
  },
  "chapter_book": {
    "id": "chapter_book",
    "version": "1.0",
    "category": "memory",
    "name": "The Chapter Book",
    "icon": "\ud83d\udcda",
    "tagline": "Chronological biography divided into illuminated story chapters with handwritten notes",
    "description": "A literary masterpiece format. Organizes a celebration into numbered chapters: The Prologue, The Growing Years, The Adventures, and The Triumphs.",
    "theme_id": "ivory_atelier",
    "soundtrack_preset": "warm_nostalgia",
    "animation_preset": "memory_lane",
    "badge": "\u270d\ufe0f Literary Memoir",
    "preview_gradient": "linear-gradient(135deg, #18181b 0%, #3f3f46 50%, #d4d4d8 100%)",
    "supported_events": [
      "birthday",
      "milestone",
      "graduation"
    ],
    "supported_relationships": [
      "all"
    ],
    "default_gift_style": "paper_sculpture",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "The Prologue",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "Turning To Page One",
          "subtitle": "The biographical celebration of an extraordinary journey"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "Chapter I: Foundations",
        "custom_content": {
          "headline": "The Character of a Hero",
          "quote": "A life story is not defined by its easiest days, but by the kindness and integrity displayed in every chapter."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "Chapter II: The Great Adventures",
        "custom_content": {
          "headline": "Illuminated Manuscripts",
          "display_mode": "storybook_spread",
          "memories": [
            {
              "title": "Chapter III: Finding Flight",
              "quote": "Courage to dream beyond the standard horizons.",
              "image_url": ""
            },
            {
              "title": "Chapter IV: The Unsung Heroes",
              "quote": "Quiet acts of generosity that changed everything for the better.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "Chapter V: The Author Note",
        "custom_content": {
          "style": "paper_sculpture",
          "prompt": "Open the illuminated chapter seal...",
          "title": "A Word From The Reader",
          "letter": "You are writing an extraordinary story with your life. Every chapter inspires everyone reading along. Keep holding the pen high.",
          "signature": "Your proud reader and companion"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Epilogue & Beyond",
        "custom_content": {
          "headline": "The Best Chapters Lie Ahead!",
          "constellation": "LIBER VIRTUTIS",
          "wishes": "Bold Adventures, Unwritten Joy, Infinite Inspiration",
          "closing": "Turn the page to your brightest year yet."
        }
      }
    ]
  },
  "thousand_moments": {
    "id": "thousand_moments",
    "version": "1.0",
    "category": "memory",
    "name": "A Thousand Little Moments",
    "icon": "\ud83e\udde9",
    "tagline": "Mosaic wall where hundreds of micro-photos assemble into one grand celebratory portrait",
    "description": "A mesmerizing particle-mosaic experience. Thousands of glowing micro-moments drift across the 3D stage before locking into the recipient portrait.",
    "theme_id": "dreamglass",
    "soundtrack_preset": "celestial_drift",
    "animation_preset": "magical_dream",
    "badge": "\u2728 Mosaic Miracle",
    "preview_gradient": "linear-gradient(135deg, #022c22 0%, #0d9488 50%, #5eead4 100%)",
    "supported_events": [
      "birthday",
      "anniversary",
      "milestone"
    ],
    "supported_relationships": [
      "all"
    ],
    "default_gift_style": "liquid_glass",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "The Mosaic Chamber",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "Assembling A Thousand Moments",
          "subtitle": "Every single smile you ever shared, converging into one portrait"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "The Atoms of Joy",
        "custom_content": {
          "headline": "No Moment Was Too Small",
          "quote": "A magnificent life is not one giant miracle; it is thousands of tiny, tender kindnesses woven together."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "The Micro-Moment Stream",
        "custom_content": {
          "headline": "Fragments of Pure Happiness",
          "display_mode": "horizontal_reel",
          "memories": [
            {
              "title": "The Coffee Laughs",
              "quote": "Spontaneous morning conversations that saved the day.",
              "image_url": ""
            },
            {
              "title": "Quiet Triumphs",
              "quote": "Silent victories that meant the world to your heart.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Crystal Mosaic Core",
        "custom_content": {
          "style": "liquid_glass",
          "prompt": "Tap the liquid crystal core to reveal the heartfelt note...",
          "title": "The Full Picture",
          "letter": "When all your days are viewed together, they form a tapestry of profound love and grace. Thank you for being in our world.",
          "signature": "With endless gratitude"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Grand Mosaic Finale",
        "custom_content": {
          "headline": "A Portrait of Infinite Goodness",
          "constellation": "MOSAICA CELESTIS",
          "wishes": "Thousandfold Joy, Everlasting Health, Peace",
          "closing": "Every day with you is a work of art."
        }
      }
    ]
  },
  "sculptural_gift": {
    "id": "sculptural_gift",
    "version": "1.0",
    "category": "sculptural",
    "name": "Sculptural Gift Reveal",
    "icon": "\ud83c\udf81",
    "tagline": "Architectural marble & satin luxury presentation box unboxing with volumetric light",
    "description": "The ultimate luxury unboxing. A 3D WebGL presentation casket with physical materials, bevelled seams, untying satin ribbon, and a volumetric light explosion.",
    "theme_id": "sculptural_gold",
    "soundtrack_preset": "upbeat_cheer",
    "animation_preset": "cinematic_luxury",
    "badge": "\ud83d\udc51 Luxury Unboxing",
    "preview_gradient": "linear-gradient(135deg, #18181b 0%, #b45309 50%, #fef08a 100%)",
    "supported_events": [
      "birthday",
      "milestone",
      "celebration"
    ],
    "supported_relationships": [
      "all"
    ],
    "default_gift_style": "champagne_gold",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "The Presentation Pedestal",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "Approaching The Luxury Vault",
          "subtitle": "A special surprise prepared exclusively for you"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "Anticipation & Glow",
        "custom_content": {
          "headline": "Wrapped in Warmest Thoughts",
          "quote": "The greatest gifts cannot be bought in stores; they are wrapped in affection, gratitude, and true care."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "Memories on The Pedestal",
        "custom_content": {
          "headline": "Precious Keepsakes",
          "display_mode": "horizontal_reel",
          "memories": [
            {
              "title": "The Unforgettable Day",
              "quote": "A memory so bright it still lights up today.",
              "image_url": ""
            },
            {
              "title": "Shared Milestones",
              "quote": "Walking together toward wonderful tomorrows.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Grand 3D Unboxing",
        "custom_content": {
          "style": "champagne_gold",
          "prompt": "Tap the gold satin box to release the ribbon and unwrap your gift...",
          "title": "The Secret Surprise",
          "letter": "May your year be as extraordinary and lavish with happiness as this golden celebration. You deserve every magnificent thing coming your way.",
          "signature": "With warmest love and best wishes"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Climax Celebration Fanfare",
        "custom_content": {
          "headline": "Happy Birthday!",
          "constellation": "DONUM MAGNIFICUM",
          "wishes": "Exuberant Happiness, Good Fortune, Boundless Joy",
          "closing": "Open your arms to a wonderful new chapter!"
        }
      }
    ]
  },
  "crystal_flower": {
    "id": "crystal_flower",
    "version": "1.0",
    "category": "sculptural",
    "name": "Crystal Flower Bloom",
    "icon": "\ud83e\udeb7",
    "tagline": "Facet-by-facet blooming crystal lotus flower glowing from within its golden core",
    "description": "A breathtaking kinetic 3D crystal sculpture. Geometric crystal petals unfold one by one with soothing chime harmonics, revealing a glowing jewel core.",
    "theme_id": "crystal_garden",
    "soundtrack_preset": "celestial_drift",
    "animation_preset": "magical_dream",
    "badge": "\ud83d\udc8e Kinetic Sculpture",
    "preview_gradient": "linear-gradient(135deg, #052e16 0%, #15803d 50%, #86efac 100%)",
    "supported_events": [
      "birthday",
      "anniversary",
      "wellness"
    ],
    "supported_relationships": [
      "all"
    ],
    "default_gift_style": "dream_prism",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "The Emerald Sanctuary",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "The Crystal Lotus Awakens",
          "subtitle": "In a tranquil garden of living crystal, your celebration blooms"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "The Unfolding Petals",
        "custom_content": {
          "headline": "Grace Under Starlight",
          "quote": "Like the lotus that blooms immaculate above still waters, you bring beauty and calm to everywhere you go."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "Petals of Memory",
        "custom_content": {
          "headline": "Glimpses in Crystal",
          "display_mode": "horizontal_reel",
          "memories": [
            {
              "title": "Serenity",
              "quote": "Your quiet wisdom that always brings perspective.",
              "image_url": ""
            },
            {
              "title": "Resilience",
              "quote": "Growing through every season with grace and fortitude.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Blooming Core",
        "custom_content": {
          "style": "dream_prism",
          "prompt": "Touch the glowing crystal core to release the fragrance of wishes...",
          "title": "The Lotus Inscription",
          "letter": "May your life continue to bloom with unshakeable peace, radiant health, and quiet majesty.",
          "signature": "With deepest blessings"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Living Garden Constellation",
        "custom_content": {
          "headline": "May Your Light Never Fade",
          "constellation": "LOTUS VIVIDUS",
          "wishes": "Inner Peace, Radiant Health, Spiritual Joy",
          "closing": "Continue to blossom in your own radiant time."
        }
      }
    ]
  },
  "origami_universe": {
    "id": "origami_universe",
    "version": "1.0",
    "category": "sculptural",
    "name": "Origami Universe",
    "icon": "\ud83e\udda2",
    "tagline": "Geometric folded Japanese washi paper sculpture unfolding into a dreamscape",
    "description": "Poetic paper craft come to life. Sculpted origami cranes and geometric lotus lanterns unfold layer by layer in a minimalist, serene Japanese aesthetic.",
    "theme_id": "ivory_atelier",
    "soundtrack_preset": "celestial_drift",
    "animation_preset": "minimal_elegant",
    "badge": "\ud83d\udcc4 Artisan Elegance",
    "preview_gradient": "linear-gradient(135deg, #18181b 0%, #3f3f46 50%, #e4e4e7 100%)",
    "supported_events": [
      "birthday",
      "graduation",
      "milestone"
    ],
    "supported_relationships": [
      "all"
    ],
    "default_gift_style": "paper_sculpture",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "The Folded Crane",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "Unfolding The First Fold",
          "subtitle": "A thousand folded wishes taking flight for your special day"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "The Washi Lantern",
        "custom_content": {
          "headline": "Artistry of Life",
          "quote": "Each day is a sheet of clean washi paper; with patience and love, you fold it into something breathtaking."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "The Folded Keepsakes",
        "custom_content": {
          "headline": "Geometric Memories",
          "display_mode": "horizontal_reel",
          "memories": [
            {
              "title": "Gentle Folds",
              "quote": "Small moments that shaped an extraordinary character.",
              "image_url": ""
            },
            {
              "title": "Flight of Courage",
              "quote": "Soaring higher than the doubts of the world.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Origami Lantern Box",
        "custom_content": {
          "style": "paper_sculpture",
          "prompt": "Unfold the geometric paper lantern...",
          "title": "The Senbazuru Blessing",
          "letter": "Legend says a thousand paper cranes bring one pure wish to life. May every dream in your heart be granted this year.",
          "signature": "With peaceful admiration"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Thousand Cranes Finale",
        "custom_content": {
          "headline": "A Thousand Wishes For You!",
          "constellation": "GRUS CELESTIS",
          "wishes": "Long Life, Serenity, Beautiful Surprises",
          "closing": "Soar high on the wings of your dreams."
        }
      }
    ]
  },
  "secret_letter_chamber": {
    "id": "secret_letter_chamber",
    "version": "1.0",
    "category": "sculptural",
    "name": "Secret Letter Chamber",
    "icon": "\ud83d\udddd\ufe0f",
    "tagline": "Sanctum sanctorum with a floating wax-sealed cedar keepsake chest and candle glow",
    "description": "A private sanctuary lit by floating candles. A brass-trimmed cedar chest floats weightlessly, awaiting the creator\u2019s cipher to reveal an emotional letter.",
    "theme_id": "celestial_noir",
    "soundtrack_preset": "warm_nostalgia",
    "animation_preset": "quiet_emotional",
    "badge": "\ud83d\udddd\ufe0f Deep Emotion",
    "preview_gradient": "linear-gradient(135deg, #111827 0%, #1f2937 50%, #fbbf24 100%)",
    "supported_events": [
      "birthday",
      "anniversary",
      "family"
    ],
    "supported_relationships": [
      "all"
    ],
    "default_gift_style": "enchanted_chest",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "Entering The Sanctum",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "The Candlelit Chamber",
          "subtitle": "A private space for words that matter most"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "Floating Candlelight",
        "custom_content": {
          "headline": "Words Held In Safe Keeping",
          "quote": "Some feelings are too precious for ordinary conversation; they belong here, where only love speaks."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "The Sealed Archives",
        "custom_content": {
          "headline": "Tributes of Gratitude",
          "display_mode": "horizontal_reel",
          "memories": [
            {
              "title": "The Guiding Light",
              "quote": "When you stood by me when nobody else did.",
              "image_url": ""
            },
            {
              "title": "The Gift of Time",
              "quote": "Every second you gave freely to make someone else comfortable.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Cedar Chest Unlocked",
        "custom_content": {
          "style": "enchanted_chest",
          "prompt": "Turn the brass skeleton key in the lock...",
          "title": "The Vault Letter",
          "letter": "If I never had the words before, let me say them clearly now: you have made my life infinitely richer. Thank you for existing.",
          "signature": "With all my soul"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Luminous Sanctuary Finale",
        "custom_content": {
          "headline": "Treasured Beyond Measure",
          "constellation": "SANCTUM AMOR",
          "wishes": "Quiet Peace, Profound Love, True Contentment",
          "closing": "You are safe, loved, and deeply cherished."
        }
      }
    ]
  },
  "interactive_starmap": {
    "id": "interactive_starmap",
    "version": "1.0",
    "category": "cosmic",
    "name": "Interactive Star Map",
    "icon": "\ud83d\uddfa\ufe0f",
    "tagline": "Real-time celestial starmap with draggable constellations and clickable zodiac milestones",
    "description": "A fully interactive 3D astrolabe. Users can drag the night sky, trace zodiac constellations matching the recipient birthday, and unlock stellar secrets.",
    "theme_id": "cosmic_nebula",
    "soundtrack_preset": "celestial_drift",
    "animation_preset": "cosmic_universe",
    "badge": "\u2728 Interactive 3D",
    "preview_gradient": "linear-gradient(135deg, #020617 0%, #1e1b4b 50%, #38bdf8 100%)",
    "supported_events": [
      "birthday",
      "milestone",
      "graduation"
    ],
    "supported_relationships": [
      "all"
    ],
    "default_gift_style": "cosmic_relic",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "Calibrating The Astrolabe",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "Aligning The Celestial Spheres",
          "subtitle": "Mapping the exact coordinates of the heavens on your birthday"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "The Starlight Projection",
        "custom_content": {
          "headline": "A Cosmic Alignment",
          "quote": "On the night you were born, the universe rearranged its stars to make room for your brilliance."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "The Astrological Timeline",
        "custom_content": {
          "headline": "Celestial Coordinates",
          "display_mode": "horizontal_reel",
          "memories": [
            {
              "title": "First Orbit",
              "quote": "The astronomical wonder of your beginnings.",
              "image_url": ""
            },
            {
              "title": "Solar Flare",
              "quote": "Energy, passion, and enthusiasm that light up everyone.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Faberg\u00e9 Celestial Egg",
        "custom_content": {
          "style": "cosmic_relic",
          "prompt": "Align the gyroscope rings on the Faberg\u00e9 egg to reveal the starmap cipher...",
          "title": "A Star In Your Name",
          "letter": "May your compass always point toward joy and your sails be filled with stardust. You are a true cosmic wonder.",
          "signature": "Your astronomer friend"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Living Starmap Finale",
        "custom_content": {
          "headline": "The Stars Salute You!",
          "constellation": "STELLA NATALIS",
          "wishes": "Infinite Exploration, Starlight Guidance, Cosmic Luck",
          "closing": "Keep navigating toward your highest dreams."
        }
      }
    ]
  },
  "living_constellation": {
    "id": "living_constellation",
    "version": "1.0",
    "category": "cosmic",
    "name": "The Living Constellation",
    "icon": "\u2728",
    "tagline": "Stardust particles dynamically connecting into the recipient name across the cosmos",
    "description": "A jaw-dropping astronomical finale where thousands of individual stars trace gravitational curves, spelling the recipient name in pure radiant starlight.",
    "theme_id": "cosmic_nebula",
    "soundtrack_preset": "celestial_drift",
    "animation_preset": "cosmic_universe",
    "badge": "\ud83c\udf0c Climax Starlight",
    "preview_gradient": "linear-gradient(135deg, #09090b 0%, #311042 50%, #9333ea 100%)",
    "supported_events": [
      "birthday",
      "milestone",
      "anniversary"
    ],
    "supported_relationships": [
      "all"
    ],
    "default_gift_style": "dream_prism",
    "scenes_blueprint": [
      {
        "scene_type": "cinematic",
        "order": 0,
        "title": "Igniting The Starfield",
        "custom_content": {
          "countdown_seconds": 3,
          "title": "Awakening The Deep Cosmos",
          "subtitle": "A billion stars are about to connect for you"
        }
      },
      {
        "scene_type": "romantic_dream",
        "order": 1,
        "title": "The Nebula Veil",
        "custom_content": {
          "headline": "Made of Stardust",
          "quote": "You are literally made of stardust \u2014 and tonight the universe remembers your name."
        }
      },
      {
        "scene_type": "memory_lane",
        "order": 2,
        "title": "The Stellar Corridor",
        "custom_content": {
          "headline": "Stellar Milestones",
          "display_mode": "horizontal_reel",
          "memories": [
            {
              "title": "Nova",
              "quote": "The explosion of brilliance you bring to every task.",
              "image_url": ""
            },
            {
              "title": "Constant North Star",
              "quote": "Always a true, reliable guide for those who love you.",
              "image_url": ""
            }
          ]
        }
      },
      {
        "scene_type": "secret_surprise",
        "order": 3,
        "title": "The Cyber Dream Prism",
        "custom_content": {
          "style": "dream_prism",
          "prompt": "Tap the refractive neon prism to trigger the constellation...",
          "title": "Written Across The Cosmos",
          "letter": "May your year shine with the brilliance of a supernova and the serenity of a quiet moonlit night. You are cosmic magic.",
          "signature": "With boundless love"
        }
      },
      {
        "scene_type": "cosmic_universe",
        "order": 4,
        "title": "The Living Name Constellation",
        "custom_content": {
          "headline": "A Universe Made Just For You!",
          "constellation": "NOMEN CELESTE",
          "wishes": "Infinite Wonder, Universal Love, Eternal Brilliance",
          "closing": "Look up tonight \u2014 the stars are celebrating with you!"
        }
      }
    ]
  }
};
