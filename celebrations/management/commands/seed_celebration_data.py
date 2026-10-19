from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from celebrations.models import (
    RecipientProfile, Celebration, CelebrationParticipant,
    CelebrationScene, Publication
)
import datetime


class Command(BaseCommand):
    help = 'Seeds database with realistic recipient profiles and rich multi-engine celebration experiences'

    def handle(self, *args, **options):
        self.stdout.write("Seeding Celebration Studio database...")

        # 1. Ensure primary creator user exists
        creator, created = User.objects.get_or_create(username='creator')
        if created:
            creator.set_password('password123')
            creator.email = 'creator@celebrationstudio.io'
            creator.first_name = 'Julian'
            creator.last_name = 'Vance'
            creator.save()
            self.stdout.write(self.style.SUCCESS("Created demo user: creator / password123"))

        # 2. Seed Recipient Profiles
        recipients_data = [
            {
                'full_name': 'Elena Vance',
                'nickname': 'Elena',
                'relationship': 'partner',
                'birth_date': datetime.date(1996, 4, 18),
                'personal_notes': 'Loves starlit strolls, acoustic indie music, lavender aromas, and deep conversations.',
            },
            {
                'full_name': 'Aria Lin Vance',
                'nickname': 'Aria',
                'relationship': 'sister',
                'birth_date': datetime.date(1998, 9, 12),
                'personal_notes': 'Irreplaceable sister, hilarious confidante, baker of lemon tarts, partner in childhood mischief.',
            },
            {
                'full_name': 'Lucas Vance',
                'nickname': 'Lucas',
                'relationship': 'brother',
                'birth_date': datetime.date(2001, 3, 25),
                'personal_notes': 'Steadfast younger brother, tech tinkerer, champion gamer, loyal ally for life.',
            },
            {
                'full_name': 'Marcus Aurelius Chen',
                'nickname': 'Marcus',
                'relationship': 'best_friend',
                'birth_date': datetime.date(1995, 8, 22),
                'personal_notes': 'Lifelong coding partner, retro arcade enthusiast, coffee aficionado, milestone achiever.',
            },
            {
                'full_name': 'Grandma Rose Vance',
                'nickname': 'Grandma Rose',
                'relationship': 'parent',
                'birth_date': datetime.date(1948, 11, 14),
                'personal_notes': 'Family matriarch, master baker of warm apple crumbles, keeper of precious stories.',
            },
            {
                'full_name': 'Team Odyssey & Friends',
                'nickname': 'The Odyssey Crew',
                'relationship': 'group',
                'personal_notes': 'Unstoppable crew of creators, dreamers, and celebrate-worthy innovators.',
            }
        ]

        recipient_objs = {}
        for r_data in recipients_data:
            obj, _ = RecipientProfile.objects.update_or_create(
                user=creator,
                full_name=r_data['full_name'],
                defaults=r_data
            )
            recipient_objs[obj.nickname] = obj
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(recipient_objs)} recipient profiles."))

        # 3. Seed Celebration 1: Elena's 30th Cosmic Starlight Birthday
        c1, _ = Celebration.objects.update_or_create(
            owner=creator,
            title='Elena Vance — A Celestial Starlit Birthday',
            defaults={
                'event_type': 'birthday',
                'slug': 'elena-starlight-birthday',
                'theme_id': 'midnight_gold',
                'theme_config': {
                    'primary': '#F3C969',
                    'bg': '#0B0D13',
                    'accent': '#FFD700',
                    'surface': '#151922',
                    'font_display': 'Cinzel, Georgia, serif',
                    'font_body': 'Inter, system-ui, sans-serif'
                },
                'animation_config': {
                    'intensity': 'cinematic',
                    'particles': True,
                    '3d_effects': True,
                    'sound_enabled': True,
                    'speed': 1.0
                },
                'soundtrack_preset': 'celestial_drift',
                'status': 'published'
            }
        )

        CelebrationParticipant.objects.get_or_create(
            celebration=c1,
            recipient=recipient_objs['Elena'],
            defaults={'role': 'Birthday Star', 'display_order': 0}
        )

        # Clear existing scenes to recreate cleanly
        c1.scenes.all().delete()

        # Scene 1: Cinematic
        CelebrationScene.objects.create(
            celebration=c1,
            scene_type='cinematic',
            order=0,
            title='The Starlit Prelude',
            content={
                'title_prefix': 'A Celestial Celebration For',
                'recipient_name': 'Elena Vance',
                'subtitle': 'Tonight, thirty brilliant constellations align to honor your light, grace, and laughter.',
                'tagline': 'Tap anywhere to unveil your journey',
                'countdown_enabled': True,
                'countdown_seconds': 3,
                'climax_text': 'Happy 30th Birthday, Elena!'
            },
            visual_config={
                'vignette_intensity': 0.85,
                'gold_flare': True,
                'particles_count': 60
            },
            motion_config={
                'entrance': 'cinematic_drift',
                'text_stagger': 0.08
            }
        )

        # Scene 2: Romantic Dream World
        CelebrationScene.objects.create(
            celebration=c1,
            scene_type='romantic_dream',
            order=1,
            title='The Whispering Garden',
            content={
                'headline': 'A Garden of Pure Light',
                'quote': '“You do not merely exist in this world; you illuminate every room you step into.”',
                'message_body': 'From our quiet midnight teas to the wildest adventures across the coastline, every chapter beside you has been pure poetry. May this upcoming decade bring you as much serenity, wonder, and joy as you bring to everyone who loves you.',
                'petals_type': 'roses_and_sakura',
                'heart_sparkle': True
            },
            visual_config={
                'ambient_glow': '#FF8DA1',
                'soft_focus': True
            },
            motion_config={
                'petal_speed': 1.2,
                'bokeh_depth': True
            }
        )

        # Scene 3: Memory Lane
        CelebrationScene.objects.create(
            celebration=c1,
            scene_type='memory_lane',
            order=2,
            title='Echoes Along Memory Lane',
            content={
                'headline': 'Chapters We Have Written Together',
                'intro': 'Scroll or tap through the moments that shaped our favorite stories...',
                'memories': [
                    {
                        'year': '2019',
                        'title': 'The First Stargazing Trip',
                        'note': 'Freezing winds, hot thermos of spiced cider, and counting fourteen shooting stars over Mount Tamalpais.',
                        'tag': 'Wanderlust',
                        'image': '/static/img/memory_stargazing.jpg'
                    },
                    {
                        'year': '2021',
                        'title': 'The Little Bakery Disaster',
                        'note': 'When the sourdough starter exploded across the ceiling and we laughed until our ribs ached.',
                        'tag': 'Laughter',
                        'image': '/static/img/memory_bakery.jpg'
                    },
                    {
                        'year': '2023',
                        'title': 'The Sunrise at Kyoto',
                        'note': 'Walking through the quiet torii gates in the misty dawn. You looked up and said: “This is a core memory.”',
                        'tag': 'Magic',
                        'image': '/static/img/memory_kyoto.jpg'
                    },
                    {
                        'year': '2026',
                        'title': 'The Chapter of Thirty',
                        'note': 'Standing at the threshold of a radiant decade. The best adventures are still waiting.',
                        'tag': 'Forever',
                        'image': '/static/img/memory_toast.jpg'
                    }
                ]
            },
            visual_config={
                'polaroid_tilt': True,
                'sepia_accents': False
            },
            motion_config={
                'timeline_reveal': 'scroll_or_step'
            }
        )

        # Scene 4: Secret Surprise
        CelebrationScene.objects.create(
            celebration=c1,
            scene_type='secret_surprise',
            order=3,
            title='The Golden Keepsake Box',
            content={
                'prompt': 'A handcrafted secret awaits you within...',
                'box_color': 'royal_midnight',
                'ribbon_color': 'burnished_gold',
                'surprise_title': 'Unwrapping Your Wish',
                'surprise_letter': 'Elena,\n\nYou have given so much warmth and patience to the world. Inside your real-life suitcase tomorrow morning is a ticket to the Amalfi Coast retreat you dreamed of all autumn!\n\nPack your favorite linen journal and walking shoes. Happy Birthday my love!',
                'signature': 'Always, Julian & Friends',
                'confetti_colors': ['#E6C065', '#FF6584', '#FFFFFF', '#FFD700', '#B588FF']
            },
            visual_config={
                'interactive_type': 'gift_box_and_letter',
                'blast_intensity': 'high'
            },
            motion_config={
                'box_spring': True,
                'ribbon_peel': True
            }
        )

        # Scene 5: Cosmic Universe
        CelebrationScene.objects.create(
            celebration=c1,
            scene_type='cosmic_universe',
            order=4,
            title='The Infinite Cosmic Finale',
            content={
                'headline': 'Your Starlight Shines Forever',
                'constellation_name': 'Constellation of Elena',
                'wishes': [
                    'Endless Courage & Discovery',
                    'Peace in Quiet Mornings',
                    'Joy in Every Shared Meal',
                    'A Decade of Flourishing Dreams'
                ],
                'final_cheer': 'Raise a glass to 30 magnificent years!'
            },
            visual_config={
                'stars_density': 800,
                'nebula_color': '#8A4FFF',
                'planet_3d': True
            },
            motion_config={
                'camera_warp': True,
                'stardust_reveal': True
            }
        )

        pub1, _ = Publication.objects.get_or_create(
            celebration=c1,
            defaults={
                'is_published': True,
                'published_at': datetime.datetime.now(),
                'share_url_token': 'elena-starlight-30'
            }
        )

        # 4. Seed Celebration 2: Marcus Chen's Graduation Milestone
        c2, _ = Celebration.objects.update_or_create(
            owner=creator,
            title='Marcus Chen — Master of AI & Innovation',
            defaults={
                'event_type': 'graduation',
                'slug': 'marcus-chen-graduation',
                'theme_id': 'emerald_aurora',
                'theme_config': {
                    'primary': '#2EC4B6',
                    'bg': '#041512',
                    'accent': '#CBF3F0',
                    'surface': '#0A241F',
                    'font_display': 'Cinzel, sans-serif'
                },
                'animation_config': {
                    'intensity': 'cinematic',
                    'particles': True,
                    '3d_effects': True,
                    'sound_enabled': True,
                    'speed': 1.0
                },
                'soundtrack_preset': 'cinematic_triumph',
                'status': 'published'
            }
        )

        CelebrationParticipant.objects.get_or_create(
            celebration=c2,
            recipient=recipient_objs['Marcus'],
            defaults={'role': 'Graduate Honoree', 'display_order': 0}
        )

        c2.scenes.all().delete()

        CelebrationScene.objects.create(
            celebration=c2,
            scene_type='cinematic',
            order=0,
            title='A Triumphant Horizon',
            content={
                'title_prefix': 'Congratulations to our Master Graduate',
                'recipient_name': 'Marcus Aurelius Chen',
                'subtitle': 'Master of Science in Computer Science & Autonomous Robotics — With Highest Honors',
                'tagline': 'Honoring years of relentless curiosity and breakthrough grit',
                'countdown_enabled': False,
                'climax_text': 'Here’s to Marcus!'
            },
            visual_config={'gold_flare': True, 'particles_count': 50},
            motion_config={'entrance': 'cinematic_drift'}
        )

        CelebrationScene.objects.create(
            celebration=c2,
            scene_type='memory_lane',
            order=1,
            title='The Architecture of Triumph',
            content={
                'headline': 'Milestones on the Road to Mastery',
                'intro': 'From the sleepless late-night hackathons to defended dissertations...',
                'memories': [
                    {'year': '2022', 'title': 'First Neural Architecture', 'note': 'Debugging tensor dimensions at 4 AM fueled entirely by green tea.', 'tag': 'Grind', 'image': '/static/img/memory_stargazing.jpg'},
                    {'year': '2024', 'title': 'The Robotics Breakthrough', 'note': 'When the simulated arm completed its first autonomous pick-and-place loop.', 'tag': 'Victory', 'image': '/static/img/memory_robotics.jpg'},
                    {'year': '2026', 'title': 'Thesis Defense Success', 'note': 'Unanimous distinction from the department board. You conquered it!', 'tag': 'Honors', 'image': '/static/img/memory_graduation.jpg'}
                ]
            },
            visual_config={'polaroid_tilt': True},
            motion_config={'timeline_reveal': 'scroll_or_step'}
        )

        CelebrationScene.objects.create(
            celebration=c2,
            scene_type='secret_surprise',
            order=2,
            title='The Golden Honor Vault',
            content={
                'prompt': 'Tap to open the graduation honors seal...',
                'box_color': 'emerald_green',
                'ribbon_color': 'champagne_gold',
                'surprise_title': 'From The Entire Crew',
                'surprise_letter': 'Marcus,\n\nYou dreamed bigger than anyone in our cohort, worked harder, and never forgot to lift others up with you. We are immensely proud of you!\n\nTonight dinner is on us at the Harbor Pavilion!',
                'signature': 'Julian, Elena, Dev & Sarah',
                'confetti_colors': ['#2EC4B6', '#CBF3F0', '#FFD700', '#FFFFFF']
            },
            visual_config={'interactive_type': 'gift_box_and_letter', 'blast_intensity': 'high'},
            motion_config={'box_spring': True}
        )

        CelebrationScene.objects.create(
            celebration=c2,
            scene_type='cosmic_universe',
            order=3,
            title='New Universes Await',
            content={
                'headline': 'Your Orbit Has Just Begun',
                'constellation_name': 'The Architect Constellation',
                'wishes': ['Break Ground in Robotics', 'Inspire Future Engineers', 'Keep the Childlike Wonder'],
                'final_cheer': 'The future is in capable hands!'
            },
            visual_config={'stars_density': 600, 'nebula_color': '#2EC4B6'},
            motion_config={'camera_warp': True}
        )

        Publication.objects.get_or_create(
            celebration=c2,
            defaults={'is_published': True, 'published_at': datetime.datetime.now(), 'share_url_token': 'marcus-chen-ms'}
        )

        self.stdout.write(self.style.SUCCESS("Seeded celebrations with full 5-engine multi-scene sequences!"))
