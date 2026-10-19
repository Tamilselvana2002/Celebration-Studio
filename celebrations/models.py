import uuid
import secrets
from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from django.contrib.auth.hashers import make_password, check_password
from django.db.models.signals import post_save
from django.dispatch import receiver


def generate_unique_slug():
    return secrets.token_urlsafe(9)


class RecipientProfile(models.Model):
    RELATIONSHIP_CHOICES = [
        # Sibling Relationships
        ('sister', 'Sister'),
        ('brother', 'Brother'),
        ('younger_sister', 'Younger Sister'),
        ('younger_brother', 'Younger Brother'),
        ('elder_sister', 'Elder Sister'),
        ('elder_brother', 'Elder Brother'),
        ('twin_sister', 'Twin Sister'),
        ('twin_brother', 'Twin Brother'),
        ('sibling', 'Sibling'),

        # Family Relationships
        ('mother', 'Mother'),
        ('father', 'Father'),
        ('daughter', 'Daughter'),
        ('son', 'Son'),
        ('cousin', 'Cousin'),
        ('family_member', 'Family Member'),

        # Romantic & Partnership
        ('partner', 'Partner / Spouse'),
        ('wife', 'Wife'),
        ('husband', 'Husband'),
        ('girlfriend', 'Girlfriend'),
        ('boyfriend', 'Boyfriend'),

        # Friendships & Social
        ('best_friend', 'Best Friend'),
        ('friend', 'Friend'),
        ('colleague', 'Colleague'),
        ('teacher', 'Teacher'),
        ('mentor', 'Mentor'),
        ('group', 'Group / Team'),
        ('self', 'Myself'),
        ('other', 'Other'),
        ('custom', 'Custom Relationship'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipients', null=True, blank=True)
    full_name = models.CharField(max_length=150)
    nickname = models.CharField(max_length=80, blank=True)
    relationship = models.CharField(max_length=50, choices=RELATIONSHIP_CHOICES, default='friend')
    custom_relationship_label = models.CharField(max_length=80, blank=True, help_text="Custom relationship label if relationship is custom")
    birth_date = models.DateField(null=True, blank=True)
    anniversary_date = models.DateField(null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    personal_notes = models.TextField(blank=True, help_text="Favorite memories, songs, colors, inside jokes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['full_name']

    def __str__(self):
        rel_label = self.custom_relationship_label if (self.relationship == 'custom' and self.custom_relationship_label) else self.get_relationship_display()
        return f"{self.full_name} ({rel_label})"

    @property
    def relationship_title(self):
        if self.relationship == 'custom' and self.custom_relationship_label:
            return self.custom_relationship_label
        return self.get_relationship_display()

    @property
    def display_name(self):
        return self.nickname if self.nickname else self.full_name


class Celebration(models.Model):
    EVENT_TYPE_CHOICES = [
        ('birthday', 'Birthday'),
        ('anniversary', 'Anniversary'),
        ('wedding', 'Wedding Celebration'),
        ('valentine', 'Valentine\'s Day'),
        ('friendship', 'Friendship Day'),
        ('graduation', 'Graduation & Milestone'),
        ('farewell', 'Farewell & New Journey'),
        ('festival', 'Festivals & Holidays'),
        ('congratulations', 'Congratulations'),
        ('thank_you', 'Thank You Experience'),
        ('custom', 'Custom Experience'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='celebrations', null=True, blank=True)
    title = models.CharField(max_length=200)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPE_CHOICES, default='birthday')
    slug = models.SlugField(max_length=64, unique=True, default=generate_unique_slug)
    
    # Theme configuration
    theme_id = models.CharField(max_length=64, default='midnight_gold')
    theme_config = models.JSONField(default=dict, blank=True)
    
    # Global Animation settings
    animation_config = models.JSONField(default=dict, blank=True)
    
    # Soundtrack
    soundtrack_preset = models.CharField(max_length=64, default='celestial_drift')
    custom_audio = models.FileField(upload_to='audio/', null=True, blank=True)
    audio_config = models.JSONField(default=dict, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    view_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('public_celebration', kwargs={'slug': self.slug})

    @property
    def recipient_summary(self):
        participants = list(self.participants.select_related('recipient').all())
        if not participants:
            return "No recipients specified"
        names = [p.recipient.display_name for p in participants]
        if len(names) == 1:
            return names[0]
        elif len(names) == 2:
            return f"{names[0]} & {names[1]}"
        return f"{names[0]} and {len(names) - 1} others"

    def get_default_theme_config(self):
        presets = {
            # --- 10 Master Luxury 3D Themes ---
            'celestial_noir': {'primary': '#38E1FF', 'bg': '#07080C', 'accent': '#E6C065', 'surface': '#101726'},
            'sculptural_gold': {'primary': '#FFD700', 'bg': '#0C0A06', 'accent': '#FFF2B2', 'surface': '#1F1A12'},
            'dreamglass': {'primary': '#E0F2FE', 'bg': '#0B1120', 'accent': '#F472B6', 'surface': '#162035'},
            'romantic_aurora': {'primary': '#EC4899', 'bg': '#14091A', 'accent': '#8B5CF6', 'surface': '#251230'},
            'cosmic_nebula': {'primary': '#A855F7', 'bg': '#03020A', 'accent': '#06B6D4', 'surface': '#150A2E'},
            'ivory_atelier': {'primary': '#D97706', 'bg': '#1A1612', 'accent': '#F59E0B', 'surface': '#2B241E'},
            'crystal_garden': {'primary': '#10B981', 'bg': '#04140D', 'accent': '#6EE7B7', 'surface': '#0C261B'},
            'midnight_cinema': {'primary': '#F59E0B', 'bg': '#080808', 'accent': '#38BDF8', 'surface': '#181818'},
            'pearl_velvet': {'primary': '#F1F5F9', 'bg': '#19040A', 'accent': '#BE123C', 'surface': '#2D0A14'},
            'aurora_prism': {'primary': '#6366F1', 'bg': '#090914', 'accent': '#F43F5E', 'surface': '#17172E'},

            # --- Classic Studio Palette Presets ---
            'midnight_luxury': {'primary': '#E6C065', 'bg': '#07080C', 'accent': '#FFD700', 'surface': '#121622'},
            'midnight_gold': {'primary': '#E6C065', 'bg': '#07080C', 'accent': '#FFD700', 'surface': '#121622'},
            'champagne_gold': {'primary': '#E6C887', 'bg': '#0F0E0C', 'accent': '#FFF8E7', 'surface': '#201D17'},
            'champagne_ivory': {'primary': '#E6C887', 'bg': '#0F0E0C', 'accent': '#FFF8E7', 'surface': '#201D17'},
            'romantic_rose': {'primary': '#FF6584', 'bg': '#14080E', 'accent': '#FF8DA1', 'surface': '#201018'},
            'cosmic_dream': {'primary': '#8A4FFF', 'bg': '#04020D', 'accent': '#38E1FF', 'surface': '#120829'},
            'cosmic_violet': {'primary': '#8A4FFF', 'bg': '#04020D', 'accent': '#38E1FF', 'surface': '#120829'},
            'ethereal_pearl': {'primary': '#CBD5E1', 'bg': '#0A0C10', 'accent': '#FFFFFF', 'surface': '#181C24'},
            'velvet_burgundy': {'primary': '#C59B27', 'bg': '#18040A', 'accent': '#F3D17E', 'surface': '#290A13'},
            'aurora_fantasy': {'primary': '#2EC4B6', 'bg': '#021312', 'accent': '#70E000', 'surface': '#062624'},
            'emerald_aurora': {'primary': '#2EC4B6', 'bg': '#021312', 'accent': '#70E000', 'surface': '#062624'},
            'modern_minimal': {'primary': '#E2E8F0', 'bg': '#080808', 'accent': '#94A3B8', 'surface': '#181818'},
            'floral_garden': {'primary': '#F472B6', 'bg': '#0A140D', 'accent': '#A7F3D0', 'surface': '#122619'},
            'celebration_fireworks': {'primary': '#FACC15', 'bg': '#050819', 'accent': '#F97316', 'surface': '#0F1738'},
            'storybook_fantasy': {'primary': '#D97706', 'bg': '#120D09', 'accent': '#FDE68A', 'surface': '#261C13'},
            'nostalgic_film': {'primary': '#E09F67', 'bg': '#17110B', 'accent': '#F8C291', 'surface': '#241B13'},
            'custom_creator': {'primary': '#E6C065', 'bg': '#0B0D13', 'accent': '#38E1FF', 'surface': '#161C2A'},
        }
        base = presets.get(self.theme_id, presets['midnight_luxury'])
        if self.theme_config:
            merged = base.copy()
            merged.update(self.theme_config)
            return merged
        return base

    def get_default_audio_config(self):
        defaults = {
            'enabled': True,
            'source_type': 'custom' if self.custom_audio else 'preset',
            'custom_url': self.custom_audio.url if self.custom_audio else '',
            'volume': 0.75,
            'loop': True,
            'start_time': 0,
            'fade_in_seconds': 1.5,
            'fade_out_seconds': 2.0,
            'ducking_on_reveal': True
        }
        if self.audio_config:
            merged = defaults.copy()
            merged.update(self.audio_config)
            return merged
        return defaults

    def get_default_animation_config(self):
        defaults = {
            'intensity': 'cinematic',  # subtle, balanced, cinematic
            'particles': True,
            '3d_effects': True,
            'sound_enabled': True,
            'speed': 1.0,
            'transition': 'fade_scale',
        }
        if self.animation_config:
            merged = defaults.copy()
            merged.update(self.animation_config)
            return merged
        return defaults


class CelebrationParticipant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    celebration = models.ForeignKey(Celebration, on_delete=models.CASCADE, related_name='participants')
    recipient = models.ForeignKey(RecipientProfile, on_delete=models.CASCADE, related_name='celebration_links')
    role = models.CharField(max_length=60, default='Honoree')
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return f"{self.recipient.display_name} in {self.celebration.title}"


class CelebrationScene(models.Model):
    SCENE_TYPE_CHOICES = [
        ('cinematic', 'Cinematic Experience (Dramatic Opening & Crescendo)'),
        ('romantic_dream', 'Romantic Dream World (Petals, Warm Glow & Romance)'),
        ('memory_lane', 'Memory Lane (Story Timeline, Photos & Letters)'),
        ('secret_surprise', 'Secret Surprise (Interactive Gift Box & Envelope)'),
        ('cosmic_universe', 'Cosmic Universe (Starfield, Constellations & 3D Starlight)'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    celebration = models.ForeignKey(Celebration, on_delete=models.CASCADE, related_name='scenes')
    scene_type = models.CharField(max_length=50, choices=SCENE_TYPE_CHOICES)
    order = models.PositiveIntegerField(default=0)
    title = models.CharField(max_length=150, default='Scene')
    
    # Validated scene configuration JSON payload
    content = models.JSONField(default=dict, blank=True)
    visual_config = models.JSONField(default=dict, blank=True)
    motion_config = models.JSONField(default=dict, blank=True)
    
    is_skippable = models.BooleanField(default=True)
    duration_seconds = models.FloatField(default=0.0, help_text="0 for interactive/manual continue")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.get_scene_type_display()} (#{self.order + 1}) - {self.title}"


class MediaAsset(models.Model):
    ASSET_TYPE_CHOICES = [
        ('image', 'Image Photo'),
        ('audio', 'Audio Track'),
        ('video', 'Video Clip'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    celebration = models.ForeignKey(Celebration, on_delete=models.SET_NULL, null=True, blank=True, related_name='media_assets')
    file = models.FileField(upload_to='uploads/%Y/%m/')
    asset_type = models.CharField(max_length=20, choices=ASSET_TYPE_CHOICES, default='image')
    caption = models.CharField(max_length=255, blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    file_size = models.PositiveIntegerField(default=0)
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.asset_type.title()}: {self.caption or self.file.name}"


class Publication(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    celebration = models.OneToOneField(Celebration, on_delete=models.CASCADE, related_name='publication')
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    is_password_protected = models.BooleanField(default=False)
    password_hash = models.CharField(max_length=256, blank=True)
    share_url_token = models.CharField(max_length=64, unique=True, default=generate_unique_slug)
    expires_at = models.DateTimeField(null=True, blank=True)
    allow_guest_wishes = models.BooleanField(default=False)

    def set_password(self, raw_password):
        if raw_password:
            self.password_hash = make_password(raw_password)
            self.is_password_protected = True
        else:
            self.password_hash = ''
            self.is_password_protected = False

    def verify_password(self, raw_password):
        if not self.is_password_protected:
            return True
        return check_password(raw_password, self.password_hash)

    def __str__(self):
        status = "Published" if self.is_published else "Draft"
        return f"Publication ({status}) for {self.celebration.title}"


class CreatorProfile(models.Model):
    AVATAR_ORB_CHOICES = [
        ('aurora_prism', 'Aurora Prism'),
        ('celestial_gold', 'Celestial Gold'),
        ('cosmic_stardust', 'Cosmic Stardust'),
        ('emerald_dream', 'Emerald Dream'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='creator_profile')
    bio = models.TextField(
        max_length=500, 
        blank=True, 
        default="Passionate celebration architect crafting unforgettable memories."
    )
    preferred_theme = models.CharField(max_length=50, default='romantic_aurora')
    avatar_orb_style = models.CharField(max_length=50, choices=AVATAR_ORB_CHOICES, default='aurora_prism')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"CreatorProfile({self.user.username})"


@receiver(post_save, sender=User)
def create_or_save_creator_profile(sender, instance, created, **kwargs):
    if created:
        CreatorProfile.objects.get_or_create(user=instance)

