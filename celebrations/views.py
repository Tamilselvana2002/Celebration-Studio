import json
import uuid
import logging
from django.shortcuts import render, redirect, get_object_or_404
from django.views import View
from django.views.generic import TemplateView, ListView, CreateView
from django.contrib.auth import login, logout, authenticate, update_session_auth_hash
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import (
    PasswordResetView, PasswordResetDoneView,
    PasswordResetConfirmView, PasswordResetCompleteView
)
from django.http import JsonResponse, HttpResponseForbidden, Http404
from django.urls import reverse_lazy, reverse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.cache import never_cache
from django.utils.decorators import method_decorator
from django.contrib import messages
from django.db.models import Q
from django.http import HttpResponse

logger = logging.getLogger(__name__)

from .models import (
    Celebration, RecipientProfile, CelebrationParticipant,
    CelebrationScene, MediaAsset, Publication, CreatorProfile
)
from .animation_themes import (
    get_theme_by_id, get_all_animation_themes, INTENSITY_CHOICES
)
from .animation_registry import (
    ANIMATION_REGISTRY, ANIMATION_PRESETS,
    get_default_animation_config, resolve_celebration_animations,
    validate_animation_payload, get_master_themes
)
from .templates_catalog import (
    get_master_templates,
    get_template_by_id,
    get_templates_by_category,
    TEMPLATE_CATEGORIES
)


class CreatorRequiredMixin:
    """
    Enforces authentication for all creator routes.
    If an unauthenticated visitor tries to access creator routes (e.g. by tampering
    with the URL in the browser address bar), they are gracefully redirected to the
    public landing page, completely shielding creator dashboards, directories, and editors.
    """
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('landing')
        return super().dispatch(request, *args, **kwargs)


class CreatorAPIMixin:
    """
    Enforces authentication and ownership on all creator API endpoints.
    Returns HTTP 403 Forbidden with JSON detail if unauthorized.
    """
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'status': 'forbidden', 'message': 'Authentication required'}, status=403)
        
        celebration_id = kwargs.get('celebration_id')
        if celebration_id:
            celebration = get_object_or_404(Celebration, id=celebration_id)
            if celebration.owner and celebration.owner != request.user:
                return JsonResponse({'status': 'forbidden', 'message': 'Permission denied'}, status=403)
            request.celebration = celebration

        return super().dispatch(request, *args, **kwargs)


class CreatorLoginView(View):
    """
    Fully animated creator login portal with living stardust particle canvas,
    frosted glassmorphism card, and interactive validation animations.
    """
    def get(self, request):
        if request.user.is_authenticated:
            return redirect('dashboard')
        next_url = request.GET.get('next', reverse('dashboard'))
        return render(request, 'auth/login.html', {
            'next_url': next_url,
            'next': next_url,
            'error_message': None,
            'error': None
        })

    def post(self, request):
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')
        next_url = request.POST.get('next') or reverse('dashboard')

        auth_username = username
        if '@' in username:
            user_by_email = User.objects.filter(email__iexact=username).first()
            if user_by_email:
                auth_username = user_by_email.username

        user = authenticate(request, username=auth_username, password=password)
        if user is not None:
            login(request, user)
            return redirect(next_url)
        else:
            err_msg = 'Invalid email/username or password. Please try again.'
            return render(request, 'auth/login.html', {
                'next_url': next_url,
                'next': next_url,
                'error_message': err_msg,
                'error': err_msg,
                'username': username
            })


@method_decorator(never_cache, name='dispatch')
class CreatorLogoutView(View):
    """
    Terminates creator session cleanly, flushes session state, prevents caching,
    and returns user to login portal with clear confirmation.
    Supports animated exit screen if requested via ?animated=1.
    """
    def get(self, request):
        return self._perform_logout(request)

    def post(self, request):
        return self._perform_logout(request)

    def _perform_logout(self, request):
        logout(request)
        if request.GET.get('animated') == '1':
            return render(request, 'auth/logout.html', {})
        messages.success(request, "You have been successfully signed out of Celebration Studio.")
        return redirect(f"{reverse('login')}?logged_out=1")


class CreatorRegisterView(View):
    """
    Fully animated creator registration portal with living stardust particle canvas,
    frosted glassmorphism card, account creation, and seamless auto-login.
    """
    def get(self, request):
        if request.user.is_authenticated:
            return redirect('dashboard')
        return render(request, 'auth/register.html', {'error': None})

    def post(self, request):
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '')
        confirm_password = request.POST.get('confirm_password', '')

        if not username:
            return render(request, 'auth/register.html', {
                'error': 'Please choose a username.',
                'username': username,
                'email': email
            })

        if User.objects.filter(username__iexact=username).exists():
            return render(request, 'auth/register.html', {
                'error': f'The username "{username}" is already taken. Please pick another.',
                'username': username,
                'email': email
            })

        if len(password) < 6:
            return render(request, 'auth/register.html', {
                'error': 'Password must be at least 6 characters long.',
                'username': username,
                'email': email
            })

        if password != confirm_password:
            return render(request, 'auth/register.html', {
                'error': 'Passwords do not match. Please verify and try again.',
                'username': username,
                'email': email
            })

        # Create user & authenticate
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        login(request, user)
        return redirect('dashboard')


class CustomPasswordResetView(PasswordResetView):
    """
    Initiates the secure password reset flow.
    Submits user's registered email address, checks active users,
    generates a secure 30-minute HMAC token, and dispatches the reset email via Gmail SMTP.
    Catches SMTP exceptions gracefully to avoid unhandled 500 errors.
    """
    template_name = 'registration/password_reset_form.html'
    email_template_name = 'registration/password_reset_email.html'
    subject_template_name = 'registration/password_reset_subject.txt'
    html_email_template_name = 'registration/password_reset_email.html'
    success_url = reverse_lazy('password_reset_done')

    def form_valid(self, form):
        try:
            return super().form_valid(form)
        except Exception as exc:
            logger.error("Failed to send password reset email via SMTP: %s", exc)
            form.add_error(
                None,
                "Unable to dispatch reset email right now. Please verify SMTP server settings or try again shortly."
            )
            return self.form_invalid(form)


class CustomPasswordResetDoneView(PasswordResetDoneView):
    """
    Confirmation screen displayed after submitting password reset request.
    Prevents user enumeration by showing identical friendly message regardless of whether
    email exists in the database.
    """
    template_name = 'registration/password_reset_done.html'


class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    """
    Token validation and password replacement screen.
    Validates uidb64 and one-time token against PASSWORD_RESET_TIMEOUT (1800s).
    If valid, allows user to set and confirm new password with standard validators.
    """
    template_name = 'registration/password_reset_confirm.html'
    success_url = reverse_lazy('password_reset_complete')


class CustomPasswordResetCompleteView(PasswordResetCompleteView):
    """
    Final success screen confirming password has been reset.
    Provides direct link to sign in with new credentials.
    """
    template_name = 'registration/password_reset_complete.html'



class LandingView(TemplateView):
    template_name = 'landing.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        # Strictly show only official sample demo showcases on the public landing page.
        # Personal user celebrations are private and NEVER displayed on the public homepage.
        ctx['featured_celebrations'] = Celebration.objects.filter(
            slug__in=['marcus-chen-graduation', 'elena-starlight-birthday'],
            status='published'
        )
        return ctx


class DashboardView(CreatorRequiredMixin, View):
    def get(self, request):
        user = request.user
        
        # Real statistics strictly from authenticated creator's records
        celebrations = Celebration.objects.filter(owner=user)
        recipients = RecipientProfile.objects.filter(user=user)

        total_count = celebrations.count()
        published_count = celebrations.filter(status='published').count()
        draft_count = celebrations.filter(status='draft').count()
        total_recipients = recipients.count()

        query = request.GET.get('q', '')
        if query:
            celebrations = celebrations.filter(title__icontains=query)

        event_filter = request.GET.get('event', '')
        if event_filter:
            celebrations = celebrations.filter(event_type=event_filter)

        return render(request, 'dashboard.html', {
            'celebrations': celebrations,
            'total_count': total_count,
            'published_count': published_count,
            'draft_count': draft_count,
            'total_recipients': total_recipients,
            'query': query,
            'event_filter': event_filter
        })


class CreatorProfileView(LoginRequiredMixin, View):
    """
    3D Animated Creator Profile & Atelier Command Center:
    - Interactive 3D Holographic Persona Canvas (Three.js WebGL)
    - 3D perspective glassmorphic ID card with gyroscope/mouse tilt
    - Real-time celebration portfolio statistics & quick-launch links
    - Tabbed identity management, studio default theme preferences, and security controls
    """
    login_url = 'login'

    def get(self, request):
        user = request.user
        profile, _ = CreatorProfile.objects.get_or_create(user=user)

        # Calculate metrics
        user_celebrations = Celebration.objects.filter(owner=user)
        total_celebrations = user_celebrations.count()
        published_count = user_celebrations.filter(status='published').count()
        draft_count = user_celebrations.filter(status='draft').count()
        recipients_count = RecipientProfile.objects.filter(user=user).count()
        media_count = MediaAsset.objects.filter(celebration__owner=user).count()

        recent_celebrations = user_celebrations.order_by('-updated_at')[:4]
        master_themes = get_master_themes()
        all_animation_themes = get_all_animation_themes()
        selected_anim_theme = get_theme_by_id(profile.animation_theme)

        context = {
            'profile': profile,
            'user': user,
            'stats': {
                'total_celebrations': total_celebrations,
                'published_count': published_count,
                'draft_count': draft_count,
                'recipients_count': recipients_count,
                'media_count': media_count,
            },
            'recent_celebrations': recent_celebrations,
            'master_themes': master_themes,
            'animation_themes': all_animation_themes,
            'selected_anim_theme': selected_anim_theme,
            'intensity_choices': INTENSITY_CHOICES,
            'orb_styles': CreatorProfile.AVATAR_ORB_CHOICES,
            'success_message': request.session.pop('profile_success', None),
            'error_message': request.session.pop('profile_error', None),
        }
        return render(request, 'profile.html', context)

    def post(self, request):
        user = request.user
        profile, _ = CreatorProfile.objects.get_or_create(user=user)
        action = request.POST.get('action', 'update_profile')

        if action == 'update_profile':
            first_name = request.POST.get('first_name', '').strip()
            last_name = request.POST.get('last_name', '').strip()
            email = request.POST.get('email', '').strip()
            bio = request.POST.get('bio', '').strip()
            preferred_theme = request.POST.get('preferred_theme', profile.preferred_theme).strip()
            avatar_orb_style = request.POST.get('avatar_orb_style', profile.avatar_orb_style).strip()

            if email:
                if User.objects.filter(email__iexact=email).exclude(pk=user.pk).exists():
                    request.session['profile_error'] = f"The email '{email}' is already registered to another account."
                    return redirect('profile')
                user.email = email

            user.first_name = first_name
            user.last_name = last_name
            user.save()

            profile.bio = bio
            profile.preferred_theme = preferred_theme
            profile.avatar_orb_style = avatar_orb_style
            profile.save()

            request.session['profile_success'] = "Creator Atelier profile updated successfully!"
            return redirect('profile')

        elif action == 'update_animation_preferences':
            theme_id = request.POST.get('animation_theme', '').strip()
            intensity = request.POST.get('animation_intensity', 'balanced').strip()

            all_themes = get_all_animation_themes()
            if theme_id not in all_themes:
                request.session['profile_error'] = f"Invalid animation theme '{theme_id}' selected."
                return redirect('profile')

            if intensity not in ['subtle', 'balanced', 'cinematic']:
                intensity = 'balanced'

            profile.animation_theme = theme_id
            profile.animation_intensity = intensity
            profile.reduced_motion = request.POST.get('reduced_motion') in ['on', 'true', 'True', True]
            profile.particles_enabled = request.POST.get('particles_enabled') in ['on', 'true', 'True', True]
            profile.ambient_glow_enabled = request.POST.get('ambient_glow_enabled') in ['on', 'true', 'True', True]
            profile.parallax_enabled = request.POST.get('parallax_enabled') in ['on', 'true', 'True', True]
            profile.background_motion_enabled = request.POST.get('background_motion_enabled') in ['on', 'true', 'True', True]
            profile.save()

            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({
                    'status': 'success',
                    'message': f"Theme '{all_themes[theme_id]['name']}' applied!",
                    'theme': get_theme_by_id(theme_id),
                    'intensity': intensity,
                })

            request.session['profile_success'] = f"Animation theme '{all_themes[theme_id]['name']}' applied across your studio!"
            return redirect('profile')

        elif action == 'change_password':
            current_password = request.POST.get('current_password', '')
            new_password1 = request.POST.get('new_password1', '')
            new_password2 = request.POST.get('new_password2', '')

            if not user.check_password(current_password):
                request.session['profile_error'] = "Current password does not match. Please verify and try again."
                return redirect('profile')

            if len(new_password1) < 6:
                request.session['profile_error'] = "New password must be at least 6 characters long."
                return redirect('profile')

            if new_password1 != new_password2:
                request.session['profile_error'] = "New passwords do not match. Please verify and try again."
                return redirect('profile')

            user.set_password(new_password1)
            user.save()
            update_session_auth_hash(request, user)
            request.session['profile_success'] = "Password updated securely!"
            return redirect('profile')

        return redirect('profile')


class TemplateGalleryView(CreatorRequiredMixin, View):
    """
    Renders the 24 Master Celebration Templates Catalogue matching 04_template_gallery.jpg.
    Allows filtering by category (Cinematic, Romantic, Memory, Sculptural, Cosmic) and search.
    """
    def get(self, request):
        category = request.GET.get('cat', 'all')
        templates = get_templates_by_category(category)
        return render(request, 'gallery.html', {
            'categories': TEMPLATE_CATEGORIES,
            'selected_category': category,
            'templates': templates,
            'templates_json': json.dumps(get_master_templates()),
            'total_templates_count': len(get_master_templates())
        })


class WizardCreateView(CreatorRequiredMixin, View):
    def get(self, request):
        recipients = RecipientProfile.objects.filter(user=request.user)
        template_id = request.GET.get('template')
        selected_template = get_template_by_id(template_id) if template_id else None
        return render(request, 'wizard.html', {
            'recipients': recipients,
            'animation_presets': ANIMATION_PRESETS,
            'THEME_PRESETS': get_master_themes(),
            'selected_template': selected_template,
            'ALL_TEMPLATES': get_master_templates(),
            'TEMPLATE_CATEGORIES': TEMPLATE_CATEGORIES
        })

    def post(self, request):
        title = request.POST.get('title', 'My Celebration')
        event_type = request.POST.get('event_type', 'birthday')
        theme_id = request.POST.get('theme_id', 'midnight_gold')
        animation_preset = request.POST.get('animation_preset', 'cinematic_luxury')
        template_id = request.POST.get('template_id') or request.GET.get('template')
        chosen_template = get_template_by_id(template_id) if template_id else None

        if chosen_template:
            if not request.POST.get('theme_id') or request.POST.get('theme_id') == 'midnight_gold':
                theme_id = chosen_template.get('theme_id', theme_id)
            if not request.POST.get('animation_preset') or request.POST.get('animation_preset') == 'cinematic_luxury':
                animation_preset = chosen_template.get('animation_preset', animation_preset)

        recipient_id = request.POST.get('recipient_id')
        new_recipient_name = request.POST.get('new_recipient_name', '').strip()
        recipient_relationship = request.POST.get('recipient_relationship', 'friend')
        custom_relationship_label = request.POST.get('custom_relationship_label', '').strip()
        starter_pack = request.POST.get('starter_pack', 'full_story')

        owner = request.user

        # Handle recipient creation or reuse
        recipient = None
        if recipient_id:
            try:
                recipient = RecipientProfile.objects.get(id=recipient_id)
            except RecipientProfile.DoesNotExist:
                recipient = None

        if not recipient and new_recipient_name:
            recipient = RecipientProfile.objects.create(
                user=owner,
                full_name=new_recipient_name,
                nickname=new_recipient_name.split()[0],
                relationship=recipient_relationship,
                custom_relationship_label=custom_relationship_label
            )

        # Create Celebration with chosen animation config
        initial_anim_config = get_default_animation_config(animation_preset)
        celebration = Celebration.objects.create(
            owner=owner,
            title=title,
            event_type=event_type,
            theme_id=theme_id,
            animation_config=initial_anim_config,
            status='draft'
        )

        if chosen_template and 'soundtrack_preset' in chosen_template:
            celebration.soundtrack_preset = chosen_template['soundtrack_preset']
            celebration.save(update_fields=['soundtrack_preset'])

        if recipient:
            CelebrationParticipant.objects.create(
                celebration=celebration,
                recipient=recipient,
                role='Honoree',
                display_order=0
            )

        # Create Publication record
        Publication.objects.create(
            celebration=celebration,
            is_published=False
        )

        rec_name = recipient.display_name if recipient else "Special Someone"
        rel_key = recipient.relationship if recipient else recipient_relationship
        custom_label = recipient.custom_relationship_label if recipient else custom_relationship_label

        # Adaptive Relationship Content Pack (Sister, Brother, Sibling, etc.)
        from .relationship_content import get_relationship_content
        rel_pack = get_relationship_content(rel_key, custom_label=custom_label, recipient_name=rec_name)

        if chosen_template and chosen_template.get('scenes_blueprint'):
            order = 0
            for sc in chosen_template['scenes_blueprint']:
                content = dict(sc.get('custom_content', {}))
                for k, v in list(content.items()):
                    if isinstance(v, str):
                        content[k] = v.replace('{recipient_name}', rec_name)
                    elif isinstance(v, list):
                        for item in v:
                            if isinstance(item, dict):
                                for ik, iv in item.items():
                                    if isinstance(iv, str):
                                        item[ik] = iv.replace('{recipient_name}', rec_name)
                content['recipient_name'] = rec_name
                if sc['scene_type'] == 'cinematic':
                    content['title_prefix'] = rel_pack['title_prefix']
                    content['tagline'] = content.get('subtitle', rel_pack['tagline'])
                    content['countdown_enabled'] = True
                elif sc['scene_type'] == 'secret_surprise':
                    if 'style' in content and 'gift_style' not in content:
                        content['gift_style'] = content['style']
                        content['box_style'] = content['style']

                CelebrationScene.objects.create(
                    celebration=celebration,
                    scene_type=sc['scene_type'],
                    order=order,
                    title=sc['title'],
                    content=content
                )
                order += 1
        else:
            # Seed initial scenes based on selected starter pack & relationship
            order = 0
            CelebrationScene.objects.create(
                celebration=celebration,
                scene_type='cinematic',
                order=order,
                title='The Starlit Prelude',
                content={
                    'title_prefix': rel_pack['title_prefix'],
                    'recipient_name': rec_name,
                    'subtitle': rel_pack['subtitle'],
                    'tagline': rel_pack['tagline'],
                    'countdown_enabled': True,
                    'countdown_seconds': 3,
                    'climax_text': rel_pack['climax_text']
                }
            )
            order += 1

            if starter_pack in ['full_story', 'romantic']:
                CelebrationScene.objects.create(
                    celebration=celebration,
                    scene_type='romantic_dream',
                    order=order,
                    title='Reflections of Grace',
                    content={
                        'headline': rel_pack['quote_headline'],
                        'quote': rel_pack['quote'],
                        'message_body': f"Wishing {rec_name} every ounce of joy and radiance in this new chapter.",
                        'petals_type': 'roses_and_sakura',
                        'heart_sparkle': True
                    }
                )
                order += 1

            CelebrationScene.objects.create(
                celebration=celebration,
                scene_type='memory_lane',
                order=order,
                title='Echoes of Memory',
                content={
                    'headline': rel_pack['memory_headline'],
                    'intro': 'Moments cherished in starlight...',
                    'memories': rel_pack['memories']
                }
            )
            order += 1

            CelebrationScene.objects.create(
                celebration=celebration,
                scene_type='secret_surprise',
                order=order,
                title='The Mystery Box',
                content={
                    'prompt': 'Tap to unlock a surprise prepared just for you...',
                    'gift_style': 'cosmic_relic',
                    'box_style': 'cosmic_relic',
                    'box_color': '#b91c1c',
                    'ribbon_color': '#f59e0b',
                    'surprise_title': rel_pack['surprise_title'],
                    'surprise_letter': rel_pack['surprise_letter'],
                    'signature': rel_pack['signature'],
                    'confetti_colors': ['#FFD700', '#FFFFFF', '#38E1FF', '#E6C065']
                }
            )
            order += 1

            CelebrationScene.objects.create(
                celebration=celebration,
                scene_type='cosmic_universe',
                order=order,
                title='Infinite Constellations',
                content={
                    'headline': rel_pack['final_headline'],
                    'constellation_name': f'Constellation of {rec_name}',
                    'closing_message': rel_pack['final_message'],
                    'signature': rel_pack['signature'],
                    'wishes': rel_pack['final_wishes'],
                    'final_cheer': 'Here is to a brilliant and triumphant future!'
                }
            )

        return redirect('experience_studio', celebration_id=celebration.id)


class ExperienceStudioView(CreatorRequiredMixin, View):
    def get(self, request, celebration_id):
        celebration = get_object_or_404(Celebration.objects.prefetch_related('scenes', 'participants__recipient'), id=celebration_id)
        if celebration.owner and celebration.owner != request.user:
            return redirect('landing')
        publication, _ = Publication.objects.get_or_create(celebration=celebration)
        
        scenes_data = [
            {
                'id': str(s.id),
                'scene_type': s.scene_type,
                'title': s.title,
                'order': s.order,
                'content': s.content,
                'is_skippable': s.is_skippable
            }
            for s in celebration.scenes.all()
        ]

        anim_config = resolve_celebration_animations(celebration)
        audio_config = celebration.get_default_audio_config()

        return render(request, 'editor.html', {
            'celebration': celebration,
            'publication': publication,
            'scenes': celebration.scenes.all(),
            'scenes_json': json.dumps(scenes_data),
            'share_url': request.build_absolute_uri(reverse('public_celebration', kwargs={'slug': celebration.slug})),
            'animation_config': anim_config,
            'animation_config_json': json.dumps(anim_config),
            'animation_presets': ANIMATION_PRESETS,
            'animation_registry': ANIMATION_REGISTRY,
            'audio_config': audio_config,
            'audio_config_json': json.dumps(audio_config),
            'THEME_PRESETS': get_master_themes(),
        })


class CelebrationPreviewView(CreatorRequiredMixin, View):
    def get(self, request, celebration_id):
        celebration = get_object_or_404(Celebration.objects.prefetch_related('scenes'), id=celebration_id)
        if celebration.owner and celebration.owner != request.user:
            return redirect('landing')
        scenes = celebration.scenes.all()
        anim_config = resolve_celebration_animations(celebration)
        audio_config = celebration.get_default_audio_config()
        return render(request, 'preview.html', {
            'celebration': celebration,
            'scenes': scenes,
            'is_preview': True,
            'animation_config': anim_config,
            'animation_config_json': json.dumps(anim_config),
            'audio_config': audio_config,
            'audio_config_json': json.dumps(audio_config),
        })


class PublicCelebrationView(View):
    def get(self, request, slug):
        celebration = get_object_or_404(Celebration.objects.prefetch_related('scenes', 'participants__recipient'), slug=slug)
        publication, _ = Publication.objects.get_or_create(celebration=celebration)

        # Check if password protected and unlocked in session
        if publication.is_password_protected:
            session_key = f'unlocked_celebration_{celebration.id}'
            if not request.session.get(session_key):
                return render(request, 'password_prompt.html', {
                    'celebration': celebration,
                    'error': None
                })

        # Increment view count
        celebration.view_count += 1
        celebration.save(update_fields=['view_count'])

        anim_config = resolve_celebration_animations(celebration)
        audio_config = celebration.get_default_audio_config()

        return render(request, 'public_celebration.html', {
            'celebration': celebration,
            'scenes': celebration.scenes.all(),
            'publication': publication,
            'animation_config': anim_config,
            'animation_config_json': json.dumps(anim_config),
            'audio_config': audio_config,
            'audio_config_json': json.dumps(audio_config),
        })

    def post(self, request, slug):
        # Password verification POST
        celebration = get_object_or_404(Celebration, slug=slug)
        publication = get_object_or_404(Publication, celebration=celebration)

        password = request.POST.get('password', '')
        if publication.verify_password(password):
            request.session[f'unlocked_celebration_{celebration.id}'] = True
            return redirect('public_celebration', slug=slug)
        else:
            return render(request, 'password_prompt.html', {
                'celebration': celebration,
                'error': 'Incorrect passcode. Please try again.'
            })


class RecipientDirectoryView(CreatorRequiredMixin, View):
    def get(self, request):
        recipients = RecipientProfile.objects.filter(user=request.user)
        return render(request, 'recipients.html', {'recipients': recipients})

    def post(self, request):
        user = request.user
        full_name = request.POST.get('full_name')
        nickname = request.POST.get('nickname')
        relationship = request.POST.get('relationship', 'friend')
        birth_date = request.POST.get('birth_date') or None
        personal_notes = request.POST.get('personal_notes', '')

        RecipientProfile.objects.create(
            user=user,
            full_name=full_name,
            nickname=nickname,
            relationship=relationship,
            birth_date=birth_date,
            personal_notes=personal_notes
        )
        return redirect('recipient_directory')


class MediaVaultView(CreatorRequiredMixin, View):
    def get(self, request):
        user_celebrations = Celebration.objects.filter(owner=request.user)
        base_assets = MediaAsset.objects.filter(
            Q(celebration__owner=request.user) | Q(celebration__isnull=True)
        ).select_related('celebration').distinct()

        category = request.GET.get('category', 'all').lower()
        assets = base_assets
        if category == 'photos':
            assets = assets.filter(asset_type='image')
        elif category == 'audio':
            assets = assets.filter(asset_type='audio')
        elif category == 'videos':
            assets = assets.filter(asset_type='video')
        elif category == 'assets':
            # 3D assets or special items
            assets = assets.filter(asset_type__in=['3d', 'sticker', 'vector'])

        search_query = request.GET.get('q', '').strip()
        if search_query:
            assets = assets.filter(
                Q(caption__icontains=search_query) |
                Q(alt_text__icontains=search_query) |
                Q(file__icontains=search_query)
            )

        # Storage statistics
        total_count = base_assets.count()
        photo_count = base_assets.filter(asset_type='image').count()
        audio_count = base_assets.filter(asset_type='audio').count()
        video_count = base_assets.filter(asset_type='video').count()

        total_bytes = sum(a.file_size for a in base_assets if a.file_size)
        total_mb = round(total_bytes / (1024 * 1024), 2)
        storage_quota_mb = 500.0
        storage_percent = min(100.0, round((total_mb / storage_quota_mb) * 100, 1))

        context = {
            'assets': assets,
            'user_celebrations': user_celebrations,
            'active_category': category,
            'search_query': search_query,
            'total_count': total_count,
            'photo_count': photo_count,
            'audio_count': audio_count,
            'video_count': video_count,
            'total_mb': total_mb,
            'storage_quota_mb': storage_quota_mb,
            'storage_percent': storage_percent,
        }
        return render(request, 'media_vault.html', context)

    def post(self, request):
        action = request.POST.get('action')
        if action == 'delete':
            asset_id = request.POST.get('asset_id')
            if asset_id:
                try:
                    asset = MediaAsset.objects.get(id=asset_id)
                    if not asset.celebration or asset.celebration.owner == request.user:
                        try:
                            asset.file.delete(save=False)
                        except Exception:
                            pass
                        asset.delete()
                        if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.content_type == 'application/json':
                            return JsonResponse({'status': 'ok', 'deleted': asset_id})
                except MediaAsset.DoesNotExist:
                    pass
            return redirect('media_vault')

        # Upload files
        uploaded_files = request.FILES.getlist('file') or ([request.FILES.get('file')] if request.FILES.get('file') else [])
        caption = request.POST.get('caption', '').strip()
        alt_text = request.POST.get('alt_text', '').strip()
        celebration_id = request.POST.get('celebration_id')
        celebration = None
        if celebration_id:
            celebration = Celebration.objects.filter(id=celebration_id, owner=request.user).first()

        created_assets = []
        for uploaded_file in uploaded_files:
            lower_name = uploaded_file.name.lower()
            if lower_name.endswith(('.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac')):
                asset_type = 'audio'
            elif lower_name.endswith(('.mp4', '.webm', '.mov', '.ogv')):
                asset_type = 'video'
            else:
                asset_type = 'image'

            asset = MediaAsset.objects.create(
                celebration=celebration,
                file=uploaded_file,
                asset_type=asset_type,
                caption=caption or uploaded_file.name,
                alt_text=alt_text,
                file_size=uploaded_file.size
            )
            created_assets.append(str(asset.id))

        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'status': 'ok', 'created_ids': created_assets})

        return redirect('media_vault')


# ==========================================================================
# AJAX JSON API ENDPOINTS FOR LIVE STUDIO UPDATES (SECURED)
# ==========================================================================

class UpdateThemeAPI(CreatorAPIMixin, View):
    def post(self, request, celebration_id):
        celebration = getattr(request, 'celebration', None) or get_object_or_404(Celebration, id=celebration_id)
        try:
            data = json.loads(request.body)
            new_theme = data.get('theme_id')
            if new_theme:
                celebration.theme_id = new_theme
                celebration.save(update_fields=['theme_id'])
                return JsonResponse({'status': 'ok', 'theme_id': new_theme})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
        return JsonResponse({'status': 'invalid'}, status=400)


class PublishToggleAPI(CreatorAPIMixin, View):
    def post(self, request, celebration_id):
        celebration = getattr(request, 'celebration', None) or get_object_or_404(Celebration, id=celebration_id)
        publication, _ = Publication.objects.get_or_create(celebration=celebration)

        is_published = request.POST.get('is_published') == 'true'
        raw_password = request.POST.get('password', '').strip()

        publication.is_published = is_published
        if is_published and not publication.published_at:
            publication.published_at = timezone.now()
        
        if raw_password:
            publication.set_password(raw_password)
        else:
            publication.set_password('')

        publication.save()

        celebration.status = 'published' if is_published else 'draft'
        celebration.save(update_fields=['status'])

        share_url = request.build_absolute_uri(reverse('public_celebration', kwargs={'slug': celebration.slug}))
        return JsonResponse({
            'status': 'ok',
            'is_published': is_published,
            'is_password_protected': publication.is_password_protected,
            'share_url': share_url
        })


class UpdateSceneContentAPI(CreatorAPIMixin, View):
    def post(self, request, celebration_id, scene_id):
        celebration = getattr(request, 'celebration', None) or get_object_or_404(Celebration, id=celebration_id)
        scene = get_object_or_404(CelebrationScene, id=scene_id, celebration=celebration)

        try:
            data = json.loads(request.body)
            new_title = data.get('title')
            new_content = data.get('content')
            is_skippable = data.get('is_skippable')

            if new_title is not None:
                scene.title = new_title
            if new_content is not None and isinstance(new_content, dict):
                # Deep merge or replace scene content payload
                merged = scene.content.copy()
                merged.update(new_content)
                scene.content = merged
            if is_skippable is not None:
                scene.is_skippable = bool(is_skippable)

            scene.save()
            return JsonResponse({'status': 'ok', 'scene_id': str(scene.id), 'content': scene.content, 'title': scene.title})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)


class ReorderScenesAPI(CreatorAPIMixin, View):
    def post(self, request, celebration_id):
        celebration = getattr(request, 'celebration', None) or get_object_or_404(Celebration, id=celebration_id)
        try:
            data = json.loads(request.body)
            ordered_scene_ids = data.get('scene_ids', [])

            for index, s_id in enumerate(ordered_scene_ids):
                CelebrationScene.objects.filter(celebration=celebration, id=s_id).update(order=index)

            return JsonResponse({'status': 'ok', 'message': 'Scenes reordered successfully'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)


class AddSceneAPI(CreatorAPIMixin, View):
    def post(self, request, celebration_id):
        celebration = getattr(request, 'celebration', None) or get_object_or_404(Celebration, id=celebration_id)
        try:
            data = json.loads(request.body)
            scene_type = data.get('scene_type', 'memory_lane')
            title = data.get('title', 'New Scene')

            current_max_order = celebration.scenes.count()
            
            # Default content based on scene type
            defaults = {
                'cinematic': {'title_prefix': 'Celebrating', 'recipient_name': celebration.recipient_summary, 'subtitle': 'A momentous occasion', 'countdown_enabled': True, 'countdown_seconds': 3},
                'romantic_dream': {'headline': 'A Garden of Warm Wishes', 'quote': '“Some moments shine brighter than the rest.”', 'petals_type': 'roses_and_sakura'},
                'memory_lane': {'headline': 'Cherished Highlights', 'intro': 'Precious moments in time', 'memories': []},
                'secret_surprise': {'prompt': 'Tap to open your special surprise...', 'gift_style': 'cosmic_relic', 'box_style': 'cosmic_relic', 'box_color': '#b91c1c', 'ribbon_color': '#f59e0b', 'surprise_title': 'A Special Wish', 'surprise_letter': 'May your day be filled with endless joy and light!'},
                'cosmic_universe': {'headline': 'Infinite Starlight', 'constellation_name': f'Constellation of {celebration.recipient_summary}', 'wishes': ['Joy', 'Peace', 'Prosperity']}
            }

            new_scene = CelebrationScene.objects.create(
                celebration=celebration,
                scene_type=scene_type,
                order=current_max_order,
                title=title,
                content=defaults.get(scene_type, {})
            )

            return JsonResponse({'status': 'ok', 'scene_id': str(new_scene.id), 'scene_type': new_scene.scene_type, 'title': new_scene.title, 'order': new_scene.order})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)


class DeleteSceneAPI(CreatorAPIMixin, View):
    def post(self, request, celebration_id, scene_id):
        celebration = getattr(request, 'celebration', None) or get_object_or_404(Celebration, id=celebration_id)
        scene = get_object_or_404(CelebrationScene, id=scene_id, celebration=celebration)

        # Ensure celebration keeps at least one scene
        if celebration.scenes.count() <= 1:
            return JsonResponse({'status': 'error', 'message': 'A celebration must contain at least one scene.'}, status=400)

        scene.delete()

        # Re-index remaining scenes
        for idx, s in enumerate(celebration.scenes.order_by('order')):
            s.order = idx
            s.save(update_fields=['order'])

        return JsonResponse({'status': 'ok', 'message': 'Scene removed successfully'})


class UploadPhotoAPI(CreatorAPIMixin, View):
    def post(self, request, celebration_id):
        celebration = getattr(request, 'celebration', None) or get_object_or_404(Celebration, id=celebration_id)
        uploaded_file = request.FILES.get('file')

        if not uploaded_file:
            return JsonResponse({'status': 'error', 'message': 'No file uploaded'}, status=400)

        try:
            asset = MediaAsset.objects.create(
                celebration=celebration,
                file=uploaded_file,
                asset_type='image',
                caption=request.POST.get('caption', uploaded_file.name),
                file_size=uploaded_file.size
            )
            return JsonResponse({
                'status': 'ok',
                'asset_id': str(asset.id),
                'file_url': asset.file.url,
                'caption': asset.caption
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)


class UpdateAnimationConfigAPI(CreatorAPIMixin, View):
    def post(self, request, celebration_id):
        celebration = getattr(request, 'celebration', None) or get_object_or_404(Celebration, id=celebration_id)
        try:
            data = json.loads(request.body)
            errors = validate_animation_payload(data)
            if errors:
                return JsonResponse({'status': 'error', 'errors': errors, 'message': 'Validation failed'}, status=400)

            # Check if preset changed
            preset_id = data.get('preset_id')
            existing_config = celebration.animation_config or {}
            
            if preset_id and preset_id != existing_config.get('preset_id'):
                config = get_default_animation_config(preset_id)
            else:
                config = resolve_celebration_animations(celebration)

            # Update customizable fields
            for key in ['preset_id', 'screen_transition', 'image_transition', 'background_effect', 
                        'gift_effect', 'finale_effect', 'intensity', 'speed', 
                        'respect_reduced_motion', 'sound_effects_enabled']:
                if key in data:
                    config[key] = data[key]

            celebration.animation_config = config
            celebration.save(update_fields=['animation_config'])

            return JsonResponse({
                'status': 'ok',
                'animation_config': config,
                'message': 'Animation configuration saved successfully'
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)


class UploadAudioAPI(CreatorAPIMixin, View):
    def post(self, request, celebration_id):
        celebration = getattr(request, 'celebration', None) or get_object_or_404(Celebration, id=celebration_id)
        uploaded_file = request.FILES.get('audio_file') or request.FILES.get('file')

        if not uploaded_file:
            return JsonResponse({'status': 'error', 'message': 'No audio file uploaded'}, status=400)

        # File format validation: MP3, WAV, OGG, M4A, AAC
        valid_extensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac']
        name_lower = uploaded_file.name.lower()
        if not any(name_lower.endswith(ext) for ext in valid_extensions):
            return JsonResponse({
                'status': 'error',
                'message': 'Unsupported audio format. Please upload MP3, WAV, OGG, M4A, or AAC audio files.'
            }, status=400)

        # File size limit: 20MB
        max_size = 20 * 1024 * 1024
        if uploaded_file.size > max_size:
            return JsonResponse({
                'status': 'error',
                'message': f'Audio file exceeds 20MB limit ({uploaded_file.size / (1024*1024):.1f}MB).'
            }, status=400)

        try:
            # Save to celebration.custom_audio
            celebration.custom_audio = uploaded_file
            celebration.save(update_fields=['custom_audio'])

            cfg = celebration.get_default_audio_config()
            cfg['source_type'] = 'custom'
            cfg['custom_url'] = celebration.custom_audio.url
            celebration.audio_config = cfg
            celebration.save(update_fields=['audio_config'])

            # Also store as a managed MediaAsset
            MediaAsset.objects.create(
                celebration=celebration,
                file=uploaded_file,
                asset_type='audio',
                caption=uploaded_file.name,
                file_size=uploaded_file.size
            )

            return JsonResponse({
                'status': 'ok',
                'file_url': celebration.custom_audio.url,
                'track_name': uploaded_file.name,
                'file_size': uploaded_file.size,
                'audio_config': cfg,
                'message': 'Custom soundtrack uploaded successfully'
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)


class UpdateAudioConfigAPI(CreatorAPIMixin, View):
    def post(self, request, celebration_id):
        celebration = getattr(request, 'celebration', None) or get_object_or_404(Celebration, id=celebration_id)
        try:
            data = json.loads(request.body)
            cfg = celebration.get_default_audio_config()

            if 'enabled' in data:
                cfg['enabled'] = bool(data['enabled'])
            if 'source_type' in data:
                cfg['source_type'] = data['source_type']
            if 'soundtrack_preset' in data:
                celebration.soundtrack_preset = data['soundtrack_preset']
                celebration.save(update_fields=['soundtrack_preset'])
            if 'volume' in data:
                cfg['volume'] = max(0.0, min(1.0, float(data['volume'])))
            if 'loop' in data:
                cfg['loop'] = bool(data['loop'])
            if 'start_time' in data:
                cfg['start_time'] = max(0.0, float(data['start_time']))
            if 'fade_in_seconds' in data:
                cfg['fade_in_seconds'] = max(0.0, float(data['fade_in_seconds']))
            if 'fade_out_seconds' in data:
                cfg['fade_out_seconds'] = max(0.0, float(data['fade_out_seconds']))
            if 'ducking_on_reveal' in data:
                cfg['ducking_on_reveal'] = bool(data['ducking_on_reveal'])
            if 'clear_custom' in data and data['clear_custom']:
                celebration.custom_audio = None
                celebration.save(update_fields=['custom_audio'])
                cfg['custom_url'] = ''
                cfg['source_type'] = 'preset'

            celebration.audio_config = cfg
            celebration.save(update_fields=['audio_config'])

            return JsonResponse({
                'status': 'ok',
                'audio_config': cfg,
                'soundtrack_preset': celebration.soundtrack_preset,
                'message': 'Audio configuration saved successfully'
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)


# ==========================================================================
# MASTER ADMIN COMMAND CENTER (EXCLUSIVE TO SUPERUSERS)
# ==========================================================================

class SuperuserRequiredMixin:
    """
    Enforces strict Superuser / Master Admin authentication.
    Only users with is_superuser=True can access.
    Non-superusers and unauthenticated visitors are completely blocked.
    """
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect(f"{reverse('login')}?next={request.path}")
        if not request.user.is_superuser:
            return HttpResponseForbidden("Access Denied: Master Administrator clearance required.")
        return super().dispatch(request, *args, **kwargs)


class MasterAdminDashboardView(SuperuserRequiredMixin, View):
    """
    Exclusive Master Admin Command Center dashboard.
    Overview of system metrics, creator accounts, admin authorization, and celebration fleet.
    """
    def get(self, request):
        admin_users = User.objects.filter(is_superuser=True).order_by('-date_joined')
        regular_users = User.objects.filter(is_superuser=False).prefetch_related('celebrations').order_by('-date_joined')
        all_celebrations = Celebration.objects.select_related('owner').prefetch_related('scenes').order_by('-created_at')

        total_users_count = User.objects.count()
        total_celebrations_count = all_celebrations.count()
        published_celebrations_count = all_celebrations.filter(status='published').count()
        total_media_count = MediaAsset.objects.count()

        message = request.session.pop('admin_message', None)
        error = request.session.pop('admin_error', None)

        return render(request, 'admin/master_dashboard.html', {
            'admin_users': admin_users,
            'regular_users': regular_users,
            'all_celebrations': all_celebrations,
            'total_users_count': total_users_count,
            'total_celebrations_count': total_celebrations_count,
            'published_celebrations_count': published_celebrations_count,
            'total_media_count': total_media_count,
            'message': message,
            'error': error,
        })


class MasterAdminCreateAdminView(SuperuserRequiredMixin, View):
    """
    Only an existing Master Administrator can create a new administrator.
    Public registration cannot create admin accounts.
    """
    def post(self, request):
        username = request.POST.get('admin_username', '').strip()
        email = request.POST.get('admin_email', '').strip()
        password = request.POST.get('admin_password', '')
        confirm_password = request.POST.get('admin_confirm_password', '')

        if not username:
            request.session['admin_error'] = 'Admin username is required.'
            return redirect('master_admin_dashboard')

        if User.objects.filter(username__iexact=username).exists():
            request.session['admin_error'] = f'The username "{username}" is already in use.'
            return redirect('master_admin_dashboard')

        if len(password) < 6:
            request.session['admin_error'] = 'Password must be at least 6 characters.'
            return redirect('master_admin_dashboard')

        if password != confirm_password:
            request.session['admin_error'] = 'Passwords do not match.'
            return redirect('master_admin_dashboard')

        # Create new superuser & staff administrator
        admin_user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        admin_user.is_superuser = True
        admin_user.is_staff = True
        admin_user.save()

        request.session['admin_message'] = f'Successfully created and authorized new administrator "{username}".'
        return redirect('master_admin_dashboard')


class MasterAdminToggleAdminView(SuperuserRequiredMixin, View):
    """
    Allows Master Admin to promote or demote administrator privileges.
    Prevents self-demotion to avoid locking out the owner.
    """
    def post(self, request, user_id):
        target_user = get_object_or_404(User, id=user_id)
        if target_user.id == request.user.id:
            request.session['admin_error'] = 'Security alert: You cannot modify your own administrator clearance.'
            return redirect('master_admin_dashboard')

        new_status = not target_user.is_superuser
        target_user.is_superuser = new_status
        target_user.is_staff = new_status
        target_user.save()

        action_name = 'promoted to Administrator' if new_status else 'demoted to Regular Creator'
        request.session['admin_message'] = f'User "{target_user.username}" was {action_name}.'
        return redirect('master_admin_dashboard')


class MasterAdminDeleteCelebrationView(SuperuserRequiredMixin, View):
    """
    Allows Master Admin to delete any inappropriate or test celebration across the system.
    Protects built-in system sample showcases.
    """
    def post(self, request, celebration_id):
        celebration = get_object_or_404(Celebration, id=celebration_id)
        if celebration.slug in ['marcus-chen-graduation', 'elena-starlight-birthday']:
            request.session['admin_error'] = 'Built-in sample showcases cannot be deleted.'
            return redirect('master_admin_dashboard')

        title = celebration.title
        celebration.delete()
        request.session['admin_message'] = f'Successfully deleted celebration "{title}".'
        return redirect('master_admin_dashboard')






