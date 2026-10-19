"""
CELEBRATION STUDIO — RELATIONSHIP & EMOTIONAL CONTENT ENGINE
Provides adaptive starter packs, bespoke quotes, headlines, gift letters,
and memory timeline suggestions tailored to any relationship:
Sister, Brother, Elder/Younger/Twin Sibling, Parent, Partner, Mentor, Custom.
"""

RELATIONSHIP_PRESETS = {
    # -------------------------------------------------------------
    # SIBLINGS
    # -------------------------------------------------------------
    'sister': {
        'title_prefix': 'Celebrating My Wonderful Sister',
        'subtitle': 'For the laughter we share, the secrets we keep, and the bond that never fades.',
        'tagline': 'A timeless tribute to an irreplaceable sister ✨',
        'climax_text': 'Cheers to the world’s most amazing sister!',
        'quote_headline': 'A Bond Woven in Starlight',
        'quote': '“A sister is both your mirror and your opposite — someone who knows your story because she helped write it.”',
        'memory_headline': 'Through the Years with My Sister',
        'memories': [
            {
                'year': 'Childhood',
                'title': 'Partners in Mischief',
                'note': 'From stealing snacks to building pillow forts and endless secret whispered laughter.',
                'tag': 'Roots',
                'image': '/static/img/memory_stargazing.jpg',
                'quote': '“No one understands our family jokes quite like you do.”'
            },
            {
                'year': 'Growing Up',
                'title': 'Late Night Heart-to-Hearts',
                'note': 'Always the first person I turn to when life gets complicated. You’ve always had my back.',
                'tag': 'Anchor',
                'image': '/static/img/memory_bakery.jpg',
                'quote': '“Side by side or miles apart, we are sisters connected by heart.”'
            },
            {
                'year': 'Today & Always',
                'title': 'Watching You Shine',
                'note': 'Seeing everything you have accomplished fills my heart with endless pride. Keep soaring!',
                'tag': 'Radiance',
                'image': '/static/img/memory_toast.jpg',
                'quote': '“To my sister: my greatest cheerleader, confidante, and lifelong best friend.”'
            }
        ],
        'surprise_title': 'A Letter From Your Sibling',
        'surprise_letter': 'Dearest Sister,\n\nThrough every season of life, you have been my rock, my sounding board, and my favorite source of joy. Thank you for your warmth, your hilarious honesty, and the way you make every room brighter.\n\nI hope this year brings you all the dreams you’ve been chasing — nobody deserves happiness more than you!\n\nWith all my love, always.',
        'signature': 'Your proudest sibling ❤️',
        'final_headline': 'To My Beautiful Sister',
        'final_message': 'May your year ahead be filled with boundless laughter, deep peace, and extraordinary adventures.',
        'final_wishes': ['Unshakable Joy', 'Boundless Dreams', 'Peace & Warmth', 'Endless Laughter']
    },

    'brother': {
        'title_prefix': 'Celebrating My Incredible Brother',
        'subtitle': 'To my lifelong ally, my partner in crime, and the brother who stands tall through everything.',
        'tagline': 'Honoring an unforgettable brother and friend 🌟',
        'climax_text': 'Here’s to the coolest brother ever!',
        'quote_headline': 'Brothers Bound by Strength',
        'quote': '“There is no buddy like a brother. Through every triumph and misadventure, you’ve been my steadfast champion.”',
        'memory_headline': 'Legendary Chapters with My Brother',
        'memories': [
            {
                'year': 'The Early Days',
                'title': 'Epic Adventures & Backyard Chaos',
                'note': 'From epic video game battles to scraped knees and unbreakable camaraderie.',
                'tag': 'Allies',
                'image': '/static/img/memory_robotics.jpg',
                'quote': '“We fought hard, laughed harder, and always had each other’s back.”'
            },
            {
                'year': 'Milestones',
                'title': 'Crushing Big Goals',
                'note': 'Watching your work ethic, resilience, and genuine loyalty inspire everyone around you.',
                'tag': 'Triumph',
                'image': '/static/img/memory_graduation.jpg',
                'quote': '“Proud to call you my brother every single day.”'
            },
            {
                'year': 'Present',
                'title': 'Here’s to What’s Next',
                'note': 'The adventures are just getting started. Standing proud beside you on this milestone.',
                'tag': 'Golden',
                'image': '/static/img/memory_toast.jpg',
                'quote': '“A brother is a friend given by nature, proven by time.”'
            }
        ],
        'surprise_title': 'A Special Salute to My Brother',
        'surprise_letter': 'Dear Brother,\n\nGrowing up with you has been one of life’s greatest blessings. You’ve shown me what loyalty, courage, and real friendship look like.\n\nNo matter how far our paths take us, you will always be my brother first. Take time today to celebrate yourself — you’ve earned every bit of success and happiness coming your way.\n\nCheers to you, man!',
        'signature': 'Your brother & ally for life 👊',
        'final_headline': 'Strength, Honor & Brotherhood',
        'final_message': 'May this year open new horizons of victory, fulfillment, and great adventures.',
        'final_wishes': ['Unstoppable Drive', 'Great Health', 'Unmatched Success', 'True Peace']
    },

    'elder_sister': {
        'title_prefix': 'In Honor of My Elder Sister',
        'subtitle': 'My guiding light, my role model, and the gentlest harbor in every storm.',
        'tagline': 'With deepest love and gratitude for my big sister 🌸',
        'climax_text': 'Celebrating an extraordinary elder sister!',
        'quote_headline': 'Wisdom, Grace & Sisterhood',
        'quote': '“An elder sister is a protector, a teacher, and a second mother disguised as your best friend.”',
        'memory_headline': 'Moments Guided by Your Grace',
        'memories': [
            {
                'year': 'Guidance',
                'title': 'The Safe Harbor',
                'note': 'You taught me how to navigate the world, standing up for me whenever I needed courage.',
                'tag': 'Beacon',
                'image': '/static/img/memory_kyoto.jpg',
                'quote': '“Thank you for showing me how to walk with kindness and poise.”'
            },
            {
                'year': 'Friendship',
                'title': 'Growing Into Best Friends',
                'note': 'Our bond shifted from big-sister guidance into the deepest, truest friendship I cherish.',
                'tag': 'Bond',
                'image': '/static/img/memory_bakery.jpg',
                'quote': '“Having an older sister means never having to walk through life alone.”'
            }
        ],
        'surprise_title': 'From My Heart to Yours',
        'surprise_letter': 'Dearest Big Sister,\n\nThank you for always paving the way with such grace, intelligence, and endless kindness. You’ve inspired me more than you could ever know.\n\nToday, I wish you all the joy and pampering you so generously give to everyone else. Happy celebration day!',
        'signature': 'With boundless love & respect',
        'final_headline': 'Radiance & Everlasting Joy',
        'final_message': 'May your life be as radiant and nurturing as the love you shower on us.',
        'final_wishes': ['Endless Peace', 'Serenity', 'Fulfillment', 'Deep Happiness']
    },

    'younger_sister': {
        'title_prefix': 'To My Sweet Younger Sister',
        'subtitle': 'Watching you blossom into the incredible woman you are today is my life’s purest joy.',
        'tagline': 'Proud sibling celebrating a sparkling soul ✨',
        'climax_text': 'Cheers to our favorite little sister!',
        'quote_headline': 'A Spark of Pure Sunshine',
        'quote': '“Little sisters bring a magic that turns ordinary days into treasured childhood memories.”',
        'memory_headline': 'Your Journey of Wonder',
        'memories': [
            {
                'year': 'First Steps',
                'title': 'The Little Star',
                'note': 'Remember when you were so tiny, following me everywhere with curious bright eyes?',
                'tag': 'Sweet',
                'image': '/static/img/memory_stargazing.jpg',
                'quote': '“You may be younger, but your spirit is larger than life.”'
            },
            {
                'year': 'Today',
                'title': 'Blossoming Into Greatness',
                'note': 'Look at how fearless, compassionate, and brilliant you have become!',
                'tag': 'Pride',
                'image': '/static/img/memory_toast.jpg',
                'quote': '“Always remember how loved, capable, and uniquely wonderful you are.”'
            }
        ],
        'surprise_title': 'A Sibling’s Promise',
        'surprise_letter': 'My Little Sister,\n\nNo matter how old you get, you will always be the little bundle of sunshine that lit up our home. I will always be here to support you, cheer for you, and celebrate your wins.\n\nKeep dreaming big and shining bright!',
        'signature': 'Always your protector & biggest fan',
        'final_headline': 'Shine On, Little Sister',
        'final_message': 'May the universe reward your sweet heart with endless wonders.',
        'final_wishes': ['Limitless Courage', 'Bright Adventures', 'Laughter', 'Sweet Success']
    },

    'elder_brother': {
        'title_prefix': 'To My Respected Elder Brother',
        'subtitle': 'My real-life hero, mentor, and the strongest pillar I could ever look up to.',
        'tagline': 'Honoring an exceptional big brother 🛡️',
        'climax_text': 'Saluting the best big brother in the world!',
        'quote_headline': 'Strength and Steadfast Loyalty',
        'quote': '“An older brother is a shield against the world and a compass guiding you home.”',
        'memory_headline': 'Stepping Stones & Big Brother Lessons',
        'memories': [
            {
                'year': 'Early Days',
                'title': 'Looking Up to You',
                'note': 'I always wanted to walk where you walked, wear what you wore, and play what you played.',
                'tag': 'Respect',
                'image': '/static/img/memory_robotics.jpg',
                'quote': '“Having you ahead of me made every obstacle feel conquerable.”'
            },
            {
                'year': 'Present',
                'title': 'Brothers & Equals',
                'note': 'Grateful for your wise counsel, your generous heart, and our shared triumphs.',
                'tag': 'Camaraderie',
                'image': '/static/img/memory_graduation.jpg',
                'quote': '“A brother’s hand never truly lets go of yours.”'
            }
        ],
        'surprise_title': 'Deepest Respect & Love',
        'surprise_letter': 'Dear Big Brother,\n\nThank you for standing tall, taking the brunt of life’s lessons first, and making sure the path was smooth for me. You set a standard of integrity I continually strive to meet.\n\nTake this moment to celebrate everything you have built. You deserve the best.',
        'signature': 'With ultimate respect & affection',
        'final_headline': 'To Heights Unreached',
        'final_message': 'May success and peace walk hand in hand with you on your continued journey.',
        'final_wishes': ['Commanding Success', 'Good Health', 'Deep Peace', 'Abundant Joy']
    },

    'younger_brother': {
        'title_prefix': 'To My Dynamic Younger Brother',
        'subtitle': 'From annoying little rascal to one of the most remarkable people I know.',
        'tagline': 'Celebrating the one and only little bro 🚀',
        'climax_text': 'Let’s hear it for the little bro!',
        'quote_headline': 'Energy, Ambition & Brotherhood',
        'quote': '“A younger brother keeps your youth alive and your heart full of laughter.”',
        'memory_headline': 'From Backyard Battles to Greatness',
        'memories': [
            {
                'year': 'Childhood',
                'title': 'The Persistent Little Shadow',
                'note': 'Always begging to join the game, always bringing double the energy and laughs.',
                'tag': 'Playful',
                'image': '/static/img/memory_stargazing.jpg',
                'quote': '“We may have wrestled over the remote, but I’d fight for you anywhere.”'
            },
            {
                'year': 'Now',
                'title': 'Carving Your Own Path',
                'note': 'Incredibly proud of the ambition, drive, and character you display every single day.',
                'tag': 'Pride',
                'image': '/static/img/memory_graduation.jpg',
                'quote': '“So proud to watch you forge your own destiny.”'
            }
        ],
        'surprise_title': 'From Your Big Sibling',
        'surprise_letter': 'Hey Little Bro,\n\nYou might be taller than me now, but you’ll always be my little brother! I am so ridiculously proud of the man you are becoming.\n\nNever lose your spark, your humor, or your relentless drive. Today is your day — make it legendary!',
        'signature': 'Forever in your corner',
        'final_headline': 'The World is Yours, Brother',
        'final_message': 'Go after every dream with courage — we are cheering for you all the way.',
        'final_wishes': ['Limitless Ambition', 'Wild Adventures', 'Great Health', 'Victory']
    },

    'twin_sister': {
        'title_prefix': 'To My Twin Sister & Other Half',
        'subtitle': 'Two hearts beating to the same cosmic melody since day one.',
        'tagline': 'Celebrating our twin soul bond ✨',
        'climax_text': 'Cheers to my lifelong twin sister!',
        'quote_headline': 'Mirror Souls',
        'quote': '“A twin sister is the friend you were born with — a soul woven beside your own before memory began.”',
        'memory_headline': 'Our Parallel Odyssey',
        'memories': [
            {
                'year': 'Origin',
                'title': 'Shared From the Start',
                'note': 'Shared birthdays, shared secrets, and a connection that transcends spoken words.',
                'tag': 'TwinBond',
                'image': '/static/img/memory_stargazing.jpg',
                'quote': '“Half of my heart, all of my confidante.”'
            }
        ],
        'surprise_title': 'Twin Connection',
        'surprise_letter': 'To My Twin,\n\nWe came into this world together, and walking through it with you by my side has been my life’s greatest superpower. Nobody gets me quite like you do.\n\nHappy celebration, my mirror soul!',
        'signature': 'Your other half',
        'final_headline': 'Infinite Twin Connection',
        'final_message': 'May the stars keep shining on our intertwined journeys.',
        'final_wishes': ['Harmony', 'Unbreakable Bond', 'Boundless Joy', 'Starlight Moments']
    },

    'twin_brother': {
        'title_prefix': 'To My Twin Brother & Lifelong Partner',
        'subtitle': 'Born together, growing together, conquering the world together.',
        'tagline': 'Celebrating an extraordinary twin brother ⚡',
        'climax_text': 'Here’s to my twin brother!',
        'quote_headline': 'Brothers from the First Breath',
        'quote': '“Twin brothers share not just a birthday, but a destiny written in parallel lines of loyalty.”',
        'memory_headline': 'The Twin Chronicles',
        'memories': [
            {
                'year': 'Chapter One',
                'title': 'Double Trouble',
                'note': 'From confusing our teachers to teaming up for every adventure imaginable.',
                'tag': 'TwinPower',
                'image': '/static/img/memory_robotics.jpg',
                'quote': '“Two minds, one unstoppable bond.”'
            }
        ],
        'surprise_title': 'To My Twin Brother',
        'surprise_letter': 'Hey Twin,\n\nThere is no one else in this world who shares my perspective quite like you. Thank you for being my constant teammate in this wild game of life.\n\nLet’s make this upcoming year our biggest chapter yet!',
        'signature': 'Your twin brother for life',
        'final_headline': 'Unstoppable Twins',
        'final_message': 'Keep pushing boundaries — we rise together!',
        'final_wishes': ['Shared Triumphs', 'Iron Health', 'Endless Prosperity', 'Great Adventures']
    },

    # -------------------------------------------------------------
    # DEFAULT / UNIVERSAL FALLBACK
    # -------------------------------------------------------------
    'default': {
        'title_prefix': 'A Grand Celebration For',
        'subtitle': 'Honoring your journey, warmth, and brilliance.',
        'tagline': 'A timeless tribute composed with love ✨',
        'climax_text': 'Cheers to an extraordinary person!',
        'quote_headline': 'Moments Written in Starlight',
        'quote': '“Some people make the world brighter just by being in it.”',
        'memory_headline': 'Cherished Highlights',
        'memories': [
            {
                'year': 'Chapter I',
                'title': 'The Beginning',
                'note': 'Where our shared journey and memories took flight.',
                'tag': 'Spark',
                'image': '/static/img/memory_stargazing.jpg',
                'quote': '“A single moment that sparked a lifetime of connection.”'
            },
            {
                'year': 'Chapter II',
                'title': 'Laughter & Triumph',
                'note': 'Through every milestone and challenge overcome together.',
                'tag': 'Joy',
                'image': '/static/img/memory_bakery.jpg',
                'quote': '“Joy shared is joy doubled.”'
            },
            {
                'year': 'Chapter III',
                'title': 'Today & Beyond',
                'note': 'Celebrating everything you have achieved and all that lies ahead.',
                'tag': 'Golden',
                'image': '/static/img/memory_toast.jpg',
                'quote': '“The best is yet to come.”'
            }
        ],
        'surprise_title': 'A Special Wish Prepared Just for You',
        'surprise_letter': 'Dearest Friend,\n\nEvery day you bring happiness, inspiration, and kindness to the world around you. This celebration is our small token of gratitude.\n\nEnjoy every single second of your day — you deserve the universe!',
        'signature': 'With warmest love and cheers',
        'final_headline': 'Your Starlight Glows On',
        'final_message': 'May your year ahead be filled with flourishing health, boundless adventures, and lifelong joy.',
        'final_wishes': ['Flourishing Health', 'Boundless Adventures', 'Unshakable Peace', 'Lifelong Joy']
    }
}


def get_relationship_content(relationship_key, custom_label=None, recipient_name=''):
    """
    Returns curated content pack adapted to the given relationship and recipient name.
    """
    key = relationship_key.lower().strip() if relationship_key else 'default'
    preset = RELATIONSHIP_PRESETS.get(key, RELATIONSHIP_PRESETS['default']).copy()

    # If custom relationship provided, adapt prefix
    if key == 'custom' and custom_label:
        preset['title_prefix'] = f'Celebrating My {custom_label}'
        preset['tagline'] = f'A bespoke tribute to my cherished {custom_label} ✨'

    name = recipient_name or 'You'
    
    # Interpolate recipient name safely into strings
    return {
        'title_prefix': preset['title_prefix'],
        'recipient_name': name,
        'subtitle': preset['subtitle'],
        'tagline': preset['tagline'],
        'climax_text': preset['climax_text'],
        'quote_headline': preset['quote_headline'],
        'quote': preset['quote'],
        'memory_headline': preset['memory_headline'],
        'memories': [
            {
                'id': f"mem_{i+1}",
                'year': m['year'],
                'title': m['title'],
                'note': m['note'],
                'tag': m['tag'],
                'image': m.get('image', '/static/img/memory_stargazing.jpg'),
                'quote': m.get('quote', ''),
                'quote_style': 'italic_serif',
                'presentation_style': 'polaroid'
            }
            for i, m in enumerate(preset['memories'])
        ],
        'surprise_title': preset['surprise_title'],
        'surprise_letter': preset['surprise_letter'].replace('Friend', name).replace('Sister', name).replace('Brother', name),
        'signature': preset['signature'],
        'final_headline': preset['final_headline'],
        'final_message': preset['final_message'],
        'final_wishes': preset['final_wishes']
    }
