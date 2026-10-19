from .animation_themes import get_theme_by_id, get_all_animation_themes

def celebration_context(request):
    user_animation_theme = get_theme_by_id('cosmic_galaxy')
    user_animation_settings = {
        'theme_id': 'cosmic_galaxy',
        'intensity': 'balanced',
        'reduced_motion': False,
        'particles_enabled': True,
        'ambient_glow_enabled': True,
        'parallax_enabled': True,
        'background_motion_enabled': True,
    }

    if request.user.is_authenticated:
        try:
            profile = getattr(request.user, 'creator_profile', None)
            if profile:
                user_animation_theme = get_theme_by_id(profile.animation_theme)
                user_animation_settings = {
                    'theme_id': profile.animation_theme,
                    'intensity': profile.animation_intensity,
                    'reduced_motion': profile.reduced_motion,
                    'particles_enabled': profile.particles_enabled,
                    'ambient_glow_enabled': profile.ambient_glow_enabled,
                    'parallax_enabled': profile.parallax_enabled,
                    'background_motion_enabled': profile.background_motion_enabled,
                }
        except Exception:
            pass

    return {
        'SITE_TITLE': 'Celebration Studio',
        'USER_ANIMATION_THEME': user_animation_theme,
        'USER_ANIMATION_SETTINGS': user_animation_settings,
        'ALL_ANIMATION_THEMES': get_all_animation_themes(),

        'EVENT_TYPES': [
            ('birthday', 'Birthday', '🎂', 'Cinematic, warm, memorable birthday journey'),
            ('anniversary', 'Anniversary', '🥂', 'Romantic memories & heartfelt milestones'),
            ('wedding', 'Wedding Celebration', '💍', 'Grand romance & timeless vows'),
            ('valentine', 'Valentine\'s Day', '🌹', 'Love letters, blooming roses & dreams'),
            ('friendship', 'Friendship Day', '💛', 'Bonds of laughter, memories & fun'),
            ('graduation', 'Graduation & Milestone', '🎓', 'Achievement, celestial stars & futures'),
            ('farewell', 'Farewell & New Journey', '✈️', 'Gratitude, warm wishes & next horizons'),
            ('festival', 'Festivals & Holidays', '✨', 'Joyous celebrations, lights & sparks'),
            ('congratulations', 'Congratulations', '🎉', 'Triumphant fanfare, cheers & gifts'),
            ('thank_you', 'Thank You Experience', '💌', 'Deep appreciation & heartfelt notes'),
            ('custom', 'Custom Experience', '🌟', 'Tailored scenes for your unique story'),
        ],
        'RELATIONSHIP_OPTIONS': [
            ('sister', 'Sister', '👭'),
            ('brother', 'Brother', '👬'),
            ('younger_sister', 'Younger Sister', '👧'),
            ('younger_brother', 'Younger Brother', '👦'),
            ('elder_sister', 'Elder Sister', '👩'),
            ('elder_brother', 'Elder Brother', '👨'),
            ('twin_sister', 'Twin Sister', '✨'),
            ('twin_brother', 'Twin Brother', '⚡'),
            ('sibling', 'Sibling', '🌱'),
            ('best_friend', 'Best Friend', '💛'),
            ('friend', 'Friend', '🤝'),
            ('partner', 'Partner / Spouse', '💍'),
            ('wife', 'Wife', '💖'),
            ('husband', 'Husband', '💙'),
            ('girlfriend', 'Girlfriend', '🌹'),
            ('boyfriend', 'Boyfriend', '🎈'),
            ('mother', 'Mother', '🌸'),
            ('father', 'Father', '🌟'),
            ('daughter', 'Daughter', '🎀'),
            ('son', 'Son', '🚀'),
            ('cousin', 'Cousin', '🌿'),
            ('family_member', 'Family Member', '🏡'),
            ('colleague', 'Colleague', '💼'),
            ('teacher', 'Teacher', '📚'),
            ('mentor', 'Mentor', '🧭'),
            ('other', 'Other', '💫'),
            ('custom', 'Custom Relationship...', '✏️'),
        ],
        'THEME_PRESETS': [
            {'id': 'midnight_luxury', 'name': 'Midnight Luxury', 'primary': '#E6C065', 'bg': '#07080C', 'accent': '#FFD700', 'desc': 'Obsidian noir with rich platinum-gold highlights'},
            {'id': 'champagne_gold', 'name': 'Champagne Gold', 'primary': '#E6C887', 'bg': '#0F0E0C', 'accent': '#FFF8E7', 'desc': 'Luminous ivory and vintage champagne velvet'},
            {'id': 'romantic_rose', 'name': 'Romantic Rose', 'primary': '#FF6584', 'bg': '#14080E', 'accent': '#FF8DA1', 'desc': 'Blush velvet, delicate rose petals & warm glow'},
            {'id': 'cosmic_dream', 'name': 'Cosmic Dream', 'primary': '#8A4FFF', 'bg': '#04020D', 'accent': '#38E1FF', 'desc': 'Deep space void, ultraviolet nebula & stardust'},
            {'id': 'ethereal_pearl', 'name': 'Ethereal Pearl', 'primary': '#CBD5E1', 'bg': '#0A0C10', 'accent': '#FFFFFF', 'desc': 'Lustrous alabaster, calm silver & pearl sheen'},
            {'id': 'velvet_burgundy', 'name': 'Velvet Burgundy', 'primary': '#C59B27', 'bg': '#18040A', 'accent': '#F3D17E', 'desc': 'Rich royal wine, brushed brass & candlelight'},
            {'id': 'aurora_fantasy', 'name': 'Aurora Fantasy', 'primary': '#2EC4B6', 'bg': '#021312', 'accent': '#70E000', 'desc': 'Emerald boreal glow dancing across polar night'},
            {'id': 'modern_minimal', 'name': 'Modern Minimal', 'primary': '#E2E8F0', 'bg': '#080808', 'accent': '#94A3B8', 'desc': 'Monochrome precision, crisp titanium & typography'},
            {'id': 'floral_garden', 'name': 'Floral Garden', 'primary': '#F472B6', 'bg': '#0A140D', 'accent': '#A7F3D0', 'desc': 'Botanical deep moss, sakura blossoms & morning dew'},
            {'id': 'celebration_fireworks', 'name': 'Celebration Fireworks', 'primary': '#FACC15', 'bg': '#050819', 'accent': '#F97316', 'desc': 'Electric amber fireworks illuminating midnight sky'},
            {'id': 'storybook_fantasy', 'name': 'Storybook Fantasy', 'primary': '#D97706', 'bg': '#120D09', 'accent': '#FDE68A', 'desc': 'Antique leather binding, parchment & gold foil'},
            {'id': 'custom_creator', 'name': 'Custom Creator Theme', 'primary': '#E6C065', 'bg': '#0B0D13', 'accent': '#38E1FF', 'desc': 'Your own bespoke palette and artistic nuances'},
        ]
    }
