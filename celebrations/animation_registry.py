"""
CELEBRATION STUDIO — ANIMATION REGISTRY & EFFECT DEFINITIONS
Centralized catalog for all supported cinematic, transition, background,
image, gift reveal, finale, and text animations with default parameters,
performance tiers, and reduced-motion mappings.
"""

ANIMATION_REGISTRY = {
    # -------------------------------------------------------------
    # 1. SCREEN TRANSITIONS (Full Viewport Inter-Scene Effects)
    # -------------------------------------------------------------
    'screen.light_sweep': {
        'id': 'screen.light_sweep',
        'category': 'screen',
        'name': 'Cinematic Light Sweep',
        'description': 'A narrow, luminous beam of golden/white light travels across the screen, cleanly transitioning layers.',
        'icon': '✨',
        'default_params': {
            'direction': 'left_to_right',
            'duration': 1.1,
            'beam_width': 180,
            'glow_intensity': 0.85
        },
        'performance': 'high',
        'reduced_motion': 'screen.fade'
    },
    'screen.liquid_silk': {
        'id': 'screen.liquid_silk',
        'category': 'screen',
        'name': 'Liquid Silk Reveal',
        'description': 'A flowing, organic curved curtain of translucent silk glides across the viewport.',
        'icon': '🌊',
        'default_params': {
            'direction': 'upwards',
            'duration': 1.25,
            'wave_amplitude': 40,
            'tint': 'rgba(230,192,101,0.3)'
        },
        'performance': 'medium',
        'reduced_motion': 'screen.fade'
    },
    'screen.universe_warp': {
        'id': 'screen.universe_warp',
        'category': 'screen',
        'name': 'Universe Warp',
        'description': 'Depth acceleration through luminous star trails and celestial warp lines into the next scene.',
        'icon': '🌌',
        'default_params': {
            'duration': 1.3,
            'star_density': 60,
            'warp_intensity': 1.0
        },
        'performance': 'high',
        'reduced_motion': 'screen.fade'
    },
    'screen.petal_curtain': {
        'id': 'screen.petal_curtain',
        'category': 'screen',
        'name': 'Petal Curtain',
        'description': 'A romantic cascade of sakura and rose petals drift down to veil and unveil the stage.',
        'icon': '🌸',
        'default_params': {
            'duration': 1.4,
            'petal_count': 35,
            'drift_speed': 1.0
        },
        'performance': 'medium',
        'reduced_motion': 'screen.fade'
    },
    'screen.portal_open': {
        'id': 'screen.portal_open',
        'category': 'screen',
        'name': 'Portal Opening',
        'description': 'A glowing, celestial aperture expands outwards from center stage to reveal the incoming scene.',
        'icon': '🌀',
        'default_params': {
            'duration': 1.15,
            'glow_color': '#ffd700',
            'shape': 'circle'
        },
        'performance': 'high',
        'reduced_motion': 'screen.fade'
    },
    'screen.memory_film': {
        'id': 'screen.memory_film',
        'category': 'screen',
        'name': 'Memory Film Wipe',
        'description': 'Vintage photographic film roll shutter effect with subtle camera flash and slide.',
        'icon': '🎞️',
        'default_params': {
            'duration': 0.95,
            'shutter_speed': 0.35,
            'lens_flare': True
        },
        'performance': 'high',
        'reduced_motion': 'screen.fade'
    },

    # -------------------------------------------------------------
    # 2. IMAGE & PHOTO TRANSITIONS (Card / Gallery Level)
    # -------------------------------------------------------------
    'image.floating_memory': {
        'id': 'image.floating_memory',
        'category': 'image',
        'name': '3D Floating Card Shuffle',
        'description': 'Physical 3D card toss with pitch, roll, depth perspective, and elastic spring landing.',
        'icon': '🃏',
        'default_params': {
            'duration': 0.85,
            'tilt_angle': 25,
            'z_distance': 180
        },
        'performance': 'high',
        'reduced_motion': 'image.fade'
    },
    'image.camera_focus': {
        'id': 'image.camera_focus',
        'category': 'image',
        'name': 'Camera Lens Focus',
        'description': 'Smooth optical focus pull from soft dream blur into razor-sharp brilliance with light sheen.',
        'icon': '🔍',
        'default_params': {
            'duration': 0.9,
            'blur_radius': 16,
            'zoom_scale': 1.08
        },
        'performance': 'medium',
        'reduced_motion': 'image.fade'
    },
    'image.album_page_turn': {
        'id': 'image.album_page_turn',
        'category': 'image',
        'name': 'Album Page Turn',
        'description': 'Realistic 3D physical page peel with layered drop-shadow and natural paper curl.',
        'icon': '📖',
        'default_params': {
            'duration': 1.0,
            'curl_direction': 'left',
            'shadow_depth': 0.6
        },
        'performance': 'high',
        'reduced_motion': 'image.fade'
    },
    'image.particle_formation': {
        'id': 'image.particle_formation',
        'category': 'image',
        'name': 'Particle Stardust Assembly',
        'description': 'Fine glittering particles gather from the cosmos to crystallize into the photograph.',
        'icon': '✨',
        'default_params': {
            'duration': 1.2,
            'particle_count': 50,
            'dissolve_delay': 0.4
        },
        'performance': 'medium',
        'reduced_motion': 'image.fade'
    },
    'image.cinematic_wipe': {
        'id': 'image.cinematic_wipe',
        'category': 'image',
        'name': 'Cinematic Angle Wipe',
        'description': 'Razor-sharp 45° luminous light blade slice revealing the photo underneath.',
        'icon': '📐',
        'default_params': {
            'duration': 0.8,
            'angle': 45,
            'feather': 20
        },
        'performance': 'high',
        'reduced_motion': 'image.fade'
    },
    'image.memory_universe': {
        'id': 'image.memory_universe',
        'category': 'image',
        'name': 'Memory Universe Orbit',
        'description': 'Photos orbit in celestial 3D space with smooth camera pan and Ken Burns focal zoom.',
        'icon': '🪐',
        'default_params': {
            'duration': 1.1,
            'orbit_radius': 220,
            'glow': True
        },
        'performance': 'medium',
        'reduced_motion': 'image.fade'
    },

    # -------------------------------------------------------------
    # 3. BACKGROUND ATMOSPHERES (Environmental Shaders / Canvas)
    # -------------------------------------------------------------
    'background.starfield': {
        'id': 'background.starfield',
        'category': 'background',
        'name': 'Living Cosmic Starfield',
        'description': 'Infinite parallax starfield with variable twinkling, subtle nebula clouds, and shooting stars.',
        'icon': '🌌',
        'default_params': {
            'star_count': 200,
            'drift_speed': 0.3,
            'shooting_stars': True
        },
        'performance': 'high',
        'reduced_motion': 'background.static'
    },
    'background.golden_dust': {
        'id': 'background.golden_dust',
        'category': 'background',
        'name': 'Golden Champagne Dust',
        'description': 'Luminescent golden bokeh orbs and warm micro-particles gently floating upwards.',
        'icon': '✨',
        'default_params': {
            'particle_count': 45,
            'glow_intensity': 0.7,
            'speed': 0.4
        },
        'performance': 'high',
        'reduced_motion': 'background.static'
    },
    'background.dream_clouds': {
        'id': 'background.dream_clouds',
        'category': 'background',
        'name': 'Ethereal Dream Clouds',
        'description': 'Soft pastel gradient nebulae drifting silently with gentle breathing luminescence.',
        'icon': '☁️',
        'default_params': {
            'cloud_speed': 0.25,
            'pulse_duration': 6.0
        },
        'performance': 'high',
        'reduced_motion': 'background.static'
    },
    'background.liquid_glass': {
        'id': 'background.liquid_glass',
        'category': 'background',
        'name': 'Liquid Glass Waves',
        'description': 'Glassmorphic caustic light ribbons shimmering across the background canvas.',
        'icon': '🔮',
        'default_params': {
            'refraction': 0.5,
            'wave_frequency': 0.02
        },
        'performance': 'medium',
        'reduced_motion': 'background.static'
    },
    'background.candlelight': {
        'id': 'background.candlelight',
        'category': 'background',
        'name': 'Warm Candlelight Breathing',
        'description': 'Organic, warm ambient flicker casting gentle shadows and comforting amber glow.',
        'icon': '🕯️',
        'default_params': {
            'warmth': '#f59e0b',
            'flicker_rate': 0.8
        },
        'performance': 'high',
        'reduced_motion': 'background.static'
    },
    'background.aurora': {
        'id': 'background.aurora',
        'category': 'background',
        'name': 'Emerald & Violet Aurora',
        'description': 'Magnificent celestial northern lights dancing across dark velvet horizons.',
        'icon': '🌠',
        'default_params': {
            'color_1': '#2ec4b6',
            'color_2': '#8a4fff',
            'flow_speed': 0.35
        },
        'performance': 'medium',
        'reduced_motion': 'background.static'
    },

    # -------------------------------------------------------------
    # 4. GIFT BOX REVEAL SYSTEM
    # -------------------------------------------------------------
    'gift.magical_light': {
        'id': 'gift.magical_light',
        'category': 'gift',
        'name': 'Magical Light Beam Burst',
        'description': 'Lid levitates as blinding warm rays of golden starlight erupt from within.',
        'icon': '🌟',
        'default_params': {
            'duration': 2.4,
            'beam_count': 12,
            'confetti': True
        },
        'performance': 'high',
        'reduced_motion': 'gift.simple'
    },
    'gift.ribbon_unwrap': {
        'id': 'gift.ribbon_unwrap',
        'category': 'gift',
        'name': 'Silk Ribbon Untie & Float',
        'description': 'The golden bow unties, ribbons unravel smoothly in 3D, and the lid springs open.',
        'icon': '🎀',
        'default_params': {
            'duration': 2.2,
            'unwrap_speed': 1.0
        },
        'performance': 'high',
        'reduced_motion': 'gift.simple'
    },
    'gift.enchanted_chest': {
        'id': 'gift.enchanted_chest',
        'category': 'gift',
        'name': 'Enchanted Treasure Chest',
        'description': 'Antique golden chest with glowing lock symbol that clicks and creaks open triumphantly.',
        'icon': '🗝️',
        'default_params': {
            'duration': 2.5,
            'sparkle_burst': True
        },
        'performance': 'high',
        'reduced_motion': 'gift.simple'
    },
    'gift.holographic': {
        'id': 'gift.holographic',
        'category': 'gift',
        'name': 'Holographic Sci-Fi Box',
        'description': 'High-tech energy lattice box disassembles into floating holographic panels.',
        'icon': '💠',
        'default_params': {
            'duration': 2.0,
            'scan_line': True
        },
        'performance': 'medium',
        'reduced_motion': 'gift.simple'
    },
    'gift.blooming': {
        'id': 'gift.blooming',
        'category': 'gift',
        'name': 'Blooming Rose Petal Gift',
        'description': 'The box unfolds like petals of a royal rose, releasing floating starlight blossoms.',
        'icon': '🌹',
        'default_params': {
            'duration': 2.6,
            'petal_count': 25
        },
        'performance': 'medium',
        'reduced_motion': 'gift.simple'
    },
    'gift.cosmic_portal': {
        'id': 'gift.cosmic_portal',
        'category': 'gift',
        'name': 'Cosmic Stardust Portal',
        'description': 'Swirling miniature nebula appears inside the box, drawing the camera into starlight.',
        'icon': '🌀',
        'default_params': {
            'duration': 2.8,
            'portal_color': '#38e1ff'
        },
        'performance': 'high',
        'reduced_motion': 'gift.simple'
    },
    'gift.luxury_sculpted': {
        'id': 'gift.luxury_sculpted',
        'category': 'gift',
        'name': 'Luxury Sculpted Presentation Box',
        'description': 'Handcrafted beveled presentation box with weighted satin lid and gold foil emboss.',
        'icon': '👑',
        'default_params': {
            'duration': 2.4,
            'bevel_radius': 12,
            'foil_glow': True
        },
        'performance': 'high',
        'reduced_motion': 'gift.simple'
    },
    'gift.liquid_glass': {
        'id': 'gift.liquid_glass',
        'category': 'gift',
        'name': 'Liquid Glass & Crystal Casket',
        'description': 'Translucent refractive crystal glass container with luminous internal caustics.',
        'icon': '💎',
        'default_params': {
            'duration': 2.5,
            'caustic_intensity': 0.85
        },
        'performance': 'medium',
        'reduced_motion': 'gift.simple'
    },
    'gift.velvet_jewelry': {
        'id': 'gift.velvet_jewelry',
        'category': 'gift',
        'name': 'Velvet Heritage Jewelry Box',
        'description': 'Plush arched velvet heirloom box with polished brass latch and cushion lift.',
        'icon': '💍',
        'default_params': {
            'duration': 2.3,
            'latch_snap': True
        },
        'performance': 'high',
        'reduced_motion': 'gift.simple'
    },
    'gift.cosmic_artifact': {
        'id': 'gift.cosmic_artifact',
        'category': 'gift',
        'name': 'Cosmic Starlight Artifact',
        'description': 'Obsidian and celestial starlight orb with orbiting gyro rings that expand outward.',
        'icon': '🪐',
        'default_params': {
            'duration': 2.8,
            'ring_count': 3
        },
        'performance': 'high',
        'reduced_motion': 'gift.simple'
    },
    'gift.enchanted_floral': {
        'id': 'gift.enchanted_floral',
        'category': 'gift',
        'name': 'Enchanted Floral Keepsake',
        'description': 'Botanical filigree case that unfolds like layered garden petals into bloom.',
        'icon': '🌺',
        'default_params': {
            'duration': 2.6,
            'bloom_stages': 3
        },
        'performance': 'medium',
        'reduced_motion': 'gift.simple'
    },
    'gift.paper_sculpture': {
        'id': 'gift.paper_sculpture',
        'category': 'gift',
        'name': 'Origami Paper Sculpture',
        'description': 'Geometric folded paper box that smoothly tessellates and flattens out.',
        'icon': '📄',
        'default_params': {
            'duration': 2.1,
            'folds': 8
        },
        'performance': 'high',
        'reduced_motion': 'gift.simple'
    },
    'gift.holographic_future': {
        'id': 'gift.holographic_future',
        'category': 'gift',
        'name': 'Holographic Future Display',
        'description': 'Floating volumetric laser grid emitter projecting interactive tactile surprise.',
        'icon': '💠',
        'default_params': {
            'duration': 2.2,
            'scanline_speed': 1.2
        },
        'performance': 'high',
        'reduced_motion': 'gift.simple'
    },
    'gift.minimal_art': {
        'id': 'gift.minimal_art',
        'category': 'gift',
        'name': 'Minimalist Architectural Monolith',
        'description': 'Clean matte architectural geometry sliding apart along precise vertical axes.',
        'icon': '🏛️',
        'default_params': {
            'duration': 1.9,
            'split_axis': 'vertical'
        },
        'performance': 'high',
        'reduced_motion': 'gift.simple'
    },

    # -------------------------------------------------------------
    # 5. FINALE CLIMAX SYSTEM (12 Living Masterpiece Styles)
    # -------------------------------------------------------------
    'finale.heart_of_light': {
        'id': 'finale.heart_of_light',
        'category': 'finale',
        'name': 'Heart of Radiant Light',
        'description': 'Luminescent particles gather into an illuminated symbol of devotion that frames the final wish.',
        'icon': '💖',
        'default_params': {
            'duration': 3.5,
            'particle_glow': 1.0,
            'pulsing': True
        },
        'performance': 'high',
        'reduced_motion': 'finale.simple'
    },
    'finale.living_portrait': {
        'id': 'finale.living_portrait',
        'category': 'finale',
        'name': 'Living Memory Portrait',
        'description': 'Gilded luminous portrait frame with soft atmospheric halo and focal Ken Burns breathing.',
        'icon': '🖼️',
        'default_params': {
            'duration': 3.8,
            'frame_glow': '#E6C065',
            'ambient_halo': True
        },
        'performance': 'high',
        'reduced_motion': 'finale.simple'
    },
    'finale.universe_made_for_you': {
        'id': 'finale.universe_made_for_you',
        'category': 'finale',
        'name': 'A Universe Made Just For You',
        'description': 'Thousands of constellations align with recipient name written across the celestial firmament.',
        'icon': '🌌',
        'default_params': {
            'duration': 4.5,
            'warp_effect': True
        },
        'performance': 'high',
        'reduced_motion': 'finale.simple'
    },
    'finale.universe': {
        'id': 'finale.universe',
        'category': 'finale',
        'name': 'A Universe Made Just For You (Legacy)',
        'description': 'Thousands of constellations align with recipient name written across the celestial firmament.',
        'icon': '🌌',
        'default_params': {
            'duration': 4.5,
            'warp_effect': True
        },
        'performance': 'high',
        'reduced_motion': 'finale.simple'
    },
    'finale.grand_celebration': {
        'id': 'finale.grand_celebration',
        'category': 'finale',
        'name': 'Grand Celebration Fanfare',
        'description': 'Spectacular double golden confetti cannons with ambient fireworks and starlight bursts.',
        'icon': '🎉',
        'default_params': {
            'duration': 4.0,
            'confetti_spread': 120,
            'fireworks_count': 4
        },
        'performance': 'high',
        'reduced_motion': 'finale.simple'
    },
    'finale.letter_writes_itself': {
        'id': 'finale.letter_writes_itself',
        'category': 'finale',
        'name': 'The Letter That Writes Itself',
        'description': 'Golden calligraphy flows stroke by stroke onto royal aged parchment in real time.',
        'icon': '✍️',
        'default_params': {
            'duration': 4.2,
            'ink_flow': True,
            'calligraphy_speed': 1.0
        },
        'performance': 'high',
        'reduced_motion': 'finale.simple'
    },
    'finale.animated_letter': {
        'id': 'finale.animated_letter',
        'category': 'finale',
        'name': 'Wax-Sealed Keepsake Letter (Legacy)',
        'description': 'A royal parchment unrolls with glowing handwritten calligraphy and golden wax seal.',
        'icon': '📜',
        'default_params': {
            'duration': 3.2,
            'ink_flow': True
        },
        'performance': 'high',
        'reduced_motion': 'finale.simple'
    },
    'finale.storybook_finale': {
        'id': 'finale.storybook_finale',
        'category': 'finale',
        'name': 'Enchanted Storybook Epilogue',
        'description': 'Classic fairytale double-page opening with illuminated gold leaf borders.',
        'icon': '📖',
        'default_params': {
            'duration': 3.6,
            'book_tilt': 12
        },
        'performance': 'high',
        'reduced_motion': 'finale.simple'
    },
    'finale.ethereal_pearl': {
        'id': 'finale.ethereal_pearl',
        'category': 'finale',
        'name': 'Ethereal Pearl Radiance',
        'description': 'Opalescent iridescent light washes, mother-of-pearl shimmer, and gentle floating motes.',
        'icon': '🦪',
        'default_params': {
            'duration': 3.4,
            'iridescence': 0.8
        },
        'performance': 'high',
        'reduced_motion': 'finale.simple'
    },
    'finale.romantic_dream': {
        'id': 'finale.romantic_dream',
        'category': 'finale',
        'name': 'Romantic Twilight Dream',
        'description': 'Soft velvet rose petals swirling around a glowing affirmation of deep affection.',
        'icon': '🌹',
        'default_params': {
            'duration': 3.5,
            'petal_count': 30
        },
        'performance': 'high',
        'reduced_motion': 'finale.simple'
    },
    'finale.memory_constellation': {
        'id': 'finale.memory_constellation',
        'category': 'finale',
        'name': 'Memory Constellation Map',
        'description': 'All previous moments connect via luminous starlight threads into a radiant constellation.',
        'icon': '✨',
        'default_params': {
            'duration': 4.0,
            'thread_glow': True
        },
        'performance': 'high',
        'reduced_motion': 'finale.simple'
    },
    'finale.editorial_minimal': {
        'id': 'finale.editorial_minimal',
        'category': 'finale',
        'name': 'Editorial Minimalist Monograph',
        'description': 'High-fashion editorial typography with razor-sharp rule lines and deliberate pauses.',
        'icon': '📰',
        'default_params': {
            'duration': 2.8,
            'line_reveal': True
        },
        'performance': 'high',
        'reduced_motion': 'finale.simple'
    },
    'finale.memory_collage': {
        'id': 'finale.memory_collage',
        'category': 'finale',
        'name': 'Living Keepsake Collage',
        'description': 'Floating multi-layered mosaic of treasured moments gently resting together.',
        'icon': '🎞️',
        'default_params': {
            'duration': 3.8,
            'card_drift': True
        },
        'performance': 'high',
        'reduced_motion': 'finale.simple'
    },
    'finale.quiet_emotional': {
        'id': 'finale.quiet_emotional',
        'category': 'finale',
        'name': 'Quiet Emotional Keepsake',
        'description': 'Restrained, poignant ambient fade with warm candlelight glow and intimate signature reveal.',
        'icon': '🕊️',
        'default_params': {
            'duration': 2.8,
            'soft_glow': True
        },
        'performance': 'high',
        'reduced_motion': 'finale.simple'
    }
}


# -------------------------------------------------------------
# CURATED THEME & ATMOSPHERE PRESETS
# -------------------------------------------------------------
ANIMATION_PRESETS = {
    'cinematic_luxury': {
        'id': 'cinematic_luxury',
        'name': 'Cinematic Luxury',
        'description': 'Dramatic golden light sweeps, 3D card shuffle, and champagne dust atmosphere.',
        'icon': '👑',
        'screen_transition': 'screen.light_sweep',
        'image_transition': 'image.floating_memory',
        'background_effect': 'background.golden_dust',
        'gift_effect': 'gift.magical_light',
        'finale_effect': 'finale.grand_celebration',
        'intensity': 'cinematic',
        'speed': 1.0
    },
    'magical_dream': {
        'id': 'magical_dream',
        'name': 'Magical Dream',
        'description': 'Silk wave reveals, stardust particle assembly, and ethereal dream clouds.',
        'icon': '✨',
        'screen_transition': 'screen.liquid_silk',
        'image_transition': 'image.particle_formation',
        'background_effect': 'background.dream_clouds',
        'gift_effect': 'gift.ribbon_unwrap',
        'finale_effect': 'finale.heart_of_light',
        'intensity': 'cinematic',
        'speed': 1.0
    },
    'romantic_glow': {
        'id': 'romantic_glow',
        'name': 'Romantic Glow',
        'description': 'Petal curtain cascades, camera lens focus pull, and warm candlelight flicker.',
        'icon': '🌹',
        'screen_transition': 'screen.petal_curtain',
        'image_transition': 'image.camera_focus',
        'background_effect': 'background.candlelight',
        'gift_effect': 'gift.blooming',
        'finale_effect': 'finale.heart_of_light',
        'intensity': 'balanced',
        'speed': 1.0
    },
    'memory_lane': {
        'id': 'memory_lane',
        'name': 'Nostalgic Memory Lane',
        'description': 'Vintage memory film wipe, physical album page turn, and candlelit stories.',
        'icon': '📷',
        'screen_transition': 'screen.memory_film',
        'image_transition': 'image.album_page_turn',
        'background_effect': 'background.candlelight',
        'gift_effect': 'gift.enchanted_chest',
        'finale_effect': 'finale.animated_letter',
        'intensity': 'balanced',
        'speed': 1.0
    },
    'cosmic_universe': {
        'id': 'cosmic_universe',
        'name': 'Cosmic Starlight',
        'description': 'Deep space universe warp, celestial memory orbits, and infinite starfield.',
        'icon': '🌌',
        'screen_transition': 'screen.universe_warp',
        'image_transition': 'image.memory_universe',
        'background_effect': 'background.starfield',
        'gift_effect': 'gift.cosmic_portal',
        'finale_effect': 'finale.universe',
        'intensity': 'cinematic',
        'speed': 1.0
    },
    'celebration_burst': {
        'id': 'celebration_burst',
        'name': 'Celebration Burst',
        'description': 'Energetic portal reveals, angled cinematic wipes, and exuberant fireworks.',
        'icon': '🎉',
        'screen_transition': 'screen.portal_open',
        'image_transition': 'image.cinematic_wipe',
        'background_effect': 'background.aurora',
        'gift_effect': 'gift.magical_light',
        'finale_effect': 'finale.grand_celebration',
        'intensity': 'cinematic',
        'speed': 1.1
    },
    'quiet_emotional': {
        'id': 'quiet_emotional',
        'name': 'Quiet & Emotional',
        'description': 'Subtle optical focus, gentle candle breathing, and serene keepsake letter.',
        'icon': '🕊️',
        'screen_transition': 'screen.light_sweep',
        'image_transition': 'image.camera_focus',
        'background_effect': 'background.candlelight',
        'gift_effect': 'gift.ribbon_unwrap',
        'finale_effect': 'finale.quiet_emotional',
        'intensity': 'subtle',
        'speed': 0.9
    },
    'minimal_elegant': {
        'id': 'minimal_elegant',
        'name': 'Minimal & Elegant',
        'description': 'High-framerate crisp fades, gentle card drift, and clean liquid glass caustics.',
        'icon': '🏛️',
        'screen_transition': 'screen.light_sweep',
        'image_transition': 'image.floating_memory',
        'background_effect': 'background.liquid_glass',
        'gift_effect': 'gift.ribbon_unwrap',
        'finale_effect': 'finale.quiet_emotional',
        'intensity': 'subtle',
        'speed': 1.0
    }
}


def get_default_animation_config(preset_id='cinematic_luxury'):
    """Returns validated animation config payload based on preset."""
    preset = ANIMATION_PRESETS.get(preset_id, ANIMATION_PRESETS['cinematic_luxury'])
    return {
        'schema_version': 1,
        'preset_id': preset['id'],
        'preset_name': preset['name'],
        'screen_transition': preset['screen_transition'],
        'image_transition': preset['image_transition'],
        'background_effect': preset['background_effect'],
        'gift_effect': preset['gift_effect'],
        'finale_effect': preset['finale_effect'],
        'intensity': preset['intensity'],
        'speed': preset['speed'],
        'respect_reduced_motion': True,
        'sound_effects_enabled': True
    }


def resolve_celebration_animations(celebration):
    """
    Resolves the active animation configuration for a celebration,
    falling back to preset or default values.
    """
    raw = celebration.animation_config or {}
    preset_id = raw.get('preset_id', 'cinematic_luxury')
    base = get_default_animation_config(preset_id)
    base.update(raw)
    return base


def validate_animation_payload(payload):
    """
    Validates animation configuration dictionary against registered effects.
    """
    errors = {}
    preset_id = payload.get('preset_id')
    if preset_id and preset_id not in ANIMATION_PRESETS:
        errors['preset_id'] = f"Invalid preset: {preset_id}"

    for cat_field in ['screen_transition', 'image_transition', 'background_effect', 'gift_effect', 'finale_effect']:
        val = payload.get(cat_field)
        if val and val not in ANIMATION_REGISTRY:
            errors[cat_field] = f"Invalid effect id: {val}"

    intensity = payload.get('intensity')
    if intensity and intensity not in ['subtle', 'balanced', 'cinematic']:
        errors['intensity'] = f"Invalid intensity: {intensity}"

    speed = payload.get('speed')
    if speed is not None:
        try:
            s_val = float(speed)
            if s_val < 0.2 or s_val > 3.0:
                errors['speed'] = "Speed must be between 0.2 and 3.0"
        except (ValueError, TypeError):
            errors['speed'] = "Speed must be a valid float"

    return errors

