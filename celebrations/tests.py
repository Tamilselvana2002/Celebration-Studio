import json
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from celebrations.models import (
    Celebration, RecipientProfile, CelebrationParticipant,
    CelebrationScene, Publication
)


class CelebrationStudioTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testcreator', password='password123')
        self.client.force_login(self.user)
        
        # Create recipient
        self.recipient = RecipientProfile.objects.create(
            user=self.user,
            full_name='Aria Montgomery',
            nickname='Aria',
            relationship='best_friend'
        )

        # Create celebration
        self.celebration = Celebration.objects.create(
            owner=self.user,
            title='Aria’s Starry Milestone',
            event_type='birthday',
            slug='arias-starry-milestone',
            theme_id='midnight_gold',
            status='published'
        )

        # Link participant
        CelebrationParticipant.objects.create(
            celebration=self.celebration,
            recipient=self.recipient,
            role='Birthday Star'
        )

        # Create scenes for all 5 engines
        self.scene1 = CelebrationScene.objects.create(
            celebration=self.celebration,
            scene_type='cinematic',
            order=0,
            title='Prelude',
            content={'recipient_name': 'Aria', 'title_prefix': 'Celebrating'}
        )
        self.scene2 = CelebrationScene.objects.create(
            celebration=self.celebration,
            scene_type='romantic_dream',
            order=1,
            title='Dream Garden',
            content={'quote': 'Joy in every breath'}
        )
        self.scene3 = CelebrationScene.objects.create(
            celebration=self.celebration,
            scene_type='memory_lane',
            order=2,
            title='Memory Timeline',
            content={'memories': [{'year': '2024', 'title': 'First Journey', 'tag': 'Memory'}]}
        )
        self.scene4 = CelebrationScene.objects.create(
            celebration=self.celebration,
            scene_type='secret_surprise',
            order=3,
            title='Surprise Chest',
            content={'prompt': 'Tap to open', 'surprise_letter': 'Happy Birthday!'}
        )
        self.scene5 = CelebrationScene.objects.create(
            celebration=self.celebration,
            scene_type='cosmic_universe',
            order=4,
            title='Stardust Finale',
            content={'wishes': ['Joy', 'Peace']}
        )

        # Publication record
        self.publication = Publication.objects.create(
            celebration=self.celebration,
            is_published=True
        )

    def test_model_creation_and_relationships(self):
        self.assertEqual(self.celebration.scenes.count(), 5)
        self.assertEqual(self.celebration.recipient_summary, 'Aria')
        self.assertEqual(self.recipient.celebration_links.count(), 1)

    def test_landing_page_renders(self):
        response = self.client.get(reverse('landing'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Celebration Studio')
        self.assertContains(response, 'The Five Experience Engines')

    def test_dashboard_renders_with_real_metrics(self):
        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Total Celebrations')
        self.assertContains(response, 'Aria’s Starry Milestone')

    def test_wizard_creation_workflow(self):
        response = self.client.post(reverse('wizard_create'), {
            'title': 'New Wedding Odyssey',
            'event_type': 'wedding',
            'theme_id': 'romantic_rose',
            'new_recipient_name': 'David & Clara',
            'recipient_relationship': 'partner',
            'starter_pack': 'full_story'
        })
        self.assertEqual(response.status_code, 302)
        new_celebration = Celebration.objects.get(title='New Wedding Odyssey')
        self.assertEqual(new_celebration.event_type, 'wedding')
        self.assertEqual(new_celebration.scenes.count(), 5)

    def test_experience_studio_workbench_renders(self):
        response = self.client.get(reverse('experience_studio', kwargs={'celebration_id': self.celebration.id}))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Story Flow')
        self.assertContains(response, 'previewFrame')
        self.assertContains(response, 'sceneSettingsModal')
        self.assertContains(response, 'studioTimelineDock')
        self.assertContains(response, 'tlTracksStage')

    def test_celebration_preview_endpoint(self):
        response = self.client.get(reverse('celebration_preview', kwargs={'celebration_id': self.celebration.id}))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'celebration-viewport')
        self.assertContains(response, 'engine-cinematic')
        self.assertContains(response, 'engine-dream')

    def test_public_celebration_page_renders_without_chrome(self):
        response = self.client.get(reverse('public_celebration', kwargs={'slug': self.celebration.slug}))
        self.assertEqual(response.status_code, 200)
        # Verify it has no studio-header
        self.assertNotContains(response, 'studio-header')
        self.assertContains(response, 'celebration-viewport')

    def test_password_shield_on_private_celebration(self):
        # Shield with password
        self.publication.set_password('secret123')
        self.publication.save()

        # Initial access requires passcode
        response = self.client.get(reverse('public_celebration', kwargs={'slug': self.celebration.slug}))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Private Celebration')

        # Incorrect password fails
        post_fail = self.client.post(reverse('public_celebration', kwargs={'slug': self.celebration.slug}), {
            'password': 'wrongpassword'
        })
        self.assertContains(post_fail, 'Incorrect passcode')

        # Correct password unlocks
        post_success = self.client.post(reverse('public_celebration', kwargs={'slug': self.celebration.slug}), {
            'password': 'secret123'
        })
        self.assertEqual(post_success.status_code, 302)

        # Subsequent GET is unlocked
        unlocked_get = self.client.get(reverse('public_celebration', kwargs={'slug': self.celebration.slug}))
        self.assertEqual(unlocked_get.status_code, 200)
        self.assertContains(unlocked_get, 'celebration-viewport')

    def test_update_theme_api(self):
        response = self.client.post(
            reverse('api_update_theme', kwargs={'celebration_id': self.celebration.id}),
            data=json.dumps({'theme_id': 'cosmic_violet'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.celebration.refresh_from_db()
        self.assertEqual(self.celebration.theme_id, 'cosmic_violet')

    def test_publish_toggle_api(self):
        response = self.client.post(
            reverse('api_publish_toggle', kwargs={'celebration_id': self.celebration.id}),
            data={'is_published': 'true', 'password': 'newpass'}
        )
        self.assertEqual(response.status_code, 200)
        self.publication.refresh_from_db()
        self.assertTrue(self.publication.is_password_protected)
        self.assertTrue(self.publication.verify_password('newpass'))

    def test_sister_celebration_creation_and_adaptive_content(self):
        # Scenario 1: Sister celebration with adaptive starter content
        response = self.client.post(reverse('wizard_create'), {
            'title': 'To My Sweet Sister Maya',
            'event_type': 'birthday',
            'theme_id': 'romantic_rose',
            'new_recipient_name': 'Maya Lin',
            'recipient_relationship': 'sister',
            'starter_pack': 'full_story'
        })
        self.assertEqual(response.status_code, 302)
        celebration = Celebration.objects.get(title='To My Sweet Sister Maya')
        cinematic_scene = celebration.scenes.get(scene_type='cinematic')
        self.assertIn('Sister', cinematic_scene.content['title_prefix'])
        
        memory_scene = celebration.scenes.get(scene_type='memory_lane')
        self.assertIn('Sister', memory_scene.content['headline'])
        self.assertTrue(len(memory_scene.content['memories']) >= 3)
        # Check that sister quotes are populated
        first_mem = memory_scene.content['memories'][0]
        self.assertTrue(len(first_mem['quote']) > 0)
        second_mem = memory_scene.content['memories'][1]
        self.assertIn('sister', second_mem['quote'].lower())

    def test_brother_celebration_creation_and_adaptive_content(self):
        # Scenario 2: Brother celebration
        response = self.client.post(reverse('wizard_create'), {
            'title': 'Salute to Lucas',
            'event_type': 'graduation',
            'theme_id': 'midnight_gold',
            'new_recipient_name': 'Lucas Vance',
            'recipient_relationship': 'brother',
            'starter_pack': 'full_story'
        })
        self.assertEqual(response.status_code, 302)
        celebration = Celebration.objects.get(title='Salute to Lucas')
        cinematic_scene = celebration.scenes.get(scene_type='cinematic')
        self.assertIn('Brother', cinematic_scene.content['title_prefix'])

    def test_custom_relationship_label_handling(self):
        # Scenario 3: Custom relationship
        response = self.client.post(reverse('wizard_create'), {
            'title': 'Tribute to My Godmother',
            'event_type': 'birthday',
            'theme_id': 'champagne_ivory',
            'new_recipient_name': 'Eleanor',
            'recipient_relationship': 'custom',
            'custom_relationship_label': 'Godmother',
            'starter_pack': 'full_story'
        })
        self.assertEqual(response.status_code, 302)
        celebration = Celebration.objects.get(title='Tribute to My Godmother')
        participant = celebration.participants.first()
        self.assertEqual(participant.recipient.relationship, 'custom')
        self.assertEqual(participant.recipient.relationship_title, 'Godmother')

    def test_update_scene_content_api(self):
        # Scenario 4 & 5: Update custom scene content (custom gift box & final message)
        surprise_scene = self.celebration.scenes.get(scene_type='secret_surprise')
        response = self.client.post(
            reverse('api_update_scene_content', kwargs={'celebration_id': self.celebration.id, 'scene_id': surprise_scene.id}),
            data=json.dumps({
                'title': 'Bespoke Surprise',
                'content': {
                    'surprise_title': 'Deepest Sisterly Love',
                    'surprise_letter': 'A deeply personal note written just for you.',
                    'box_color': '#991b1b',
                    'ribbon_color': '#fbbf24',
                    'signature': 'Your proud brother, Dave'
                }
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        surprise_scene.refresh_from_db()
        self.assertEqual(surprise_scene.title, 'Bespoke Surprise')
        self.assertEqual(surprise_scene.content['box_color'], '#991b1b')
        self.assertEqual(surprise_scene.content['signature'], 'Your proud brother, Dave')

    def test_reorder_scenes_api(self):
        # Scenario 6: Reorder scenes
        scenes = list(self.celebration.scenes.order_by('order'))
        # Reverse order
        reversed_ids = [str(s.id) for s in reversed(scenes)]
        response = self.client.post(
            reverse('api_reorder_scenes', kwargs={'celebration_id': self.celebration.id}),
            data=json.dumps({'scene_ids': reversed_ids}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        new_first_scene = self.celebration.scenes.order_by('order').first()
        self.assertEqual(str(new_first_scene.id), reversed_ids[0])

    def test_add_and_delete_scene_api(self):
        # Scenario 7: Add new scene and delete
        initial_count = self.celebration.scenes.count()
        add_res = self.client.post(
            reverse('api_add_scene', kwargs={'celebration_id': self.celebration.id}),
            data=json.dumps({'scene_type': 'memory_lane', 'title': 'Extra Chapter'}),
            content_type='application/json'
        )
        self.assertEqual(add_res.status_code, 200)
        new_id = json.loads(add_res.content)['scene_id']
        self.assertEqual(self.celebration.scenes.count(), initial_count + 1)

        # Delete the newly added scene
        del_res = self.client.post(
            reverse('api_delete_scene', kwargs={'celebration_id': self.celebration.id, 'scene_id': new_id})
        )
        self.assertEqual(del_res.status_code, 200)
        self.assertEqual(self.celebration.scenes.count(), initial_count)

    def test_animation_registry_integrity_and_preset_resolution(self):
        from celebrations.animation_registry import (
            ANIMATION_REGISTRY, ANIMATION_PRESETS,
            get_default_animation_config, resolve_celebration_animations
        )
        # Verify 8 presets exist
        self.assertEqual(len(ANIMATION_PRESETS), 8)
        self.assertIn('cinematic_luxury', ANIMATION_PRESETS)
        self.assertIn('magical_dream', ANIMATION_PRESETS)
        self.assertIn('romantic_glow', ANIMATION_PRESETS)
        self.assertIn('cosmic_universe', ANIMATION_PRESETS)

        # Verify each preset references valid registry effects
        for pid, p in ANIMATION_PRESETS.items():
            self.assertIn(p['screen_transition'], ANIMATION_REGISTRY)
            self.assertIn(p['image_transition'], ANIMATION_REGISTRY)
            self.assertIn(p['background_effect'], ANIMATION_REGISTRY)
            self.assertIn(p['gift_effect'], ANIMATION_REGISTRY)
            self.assertIn(p['finale_effect'], ANIMATION_REGISTRY)

        # Test resolution with fallback
        resolved = resolve_celebration_animations(self.celebration)
        self.assertEqual(resolved['preset_id'], 'cinematic_luxury')
        self.assertEqual(resolved['screen_transition'], 'screen.light_sweep')

    def test_update_animation_config_api_success(self):
        response = self.client.post(
            reverse('api_update_animations', kwargs={'celebration_id': self.celebration.id}),
            data=json.dumps({
                'preset_id': 'romantic_glow',
                'screen_transition': 'screen.petal_curtain',
                'background_effect': 'background.candlelight',
                'gift_effect': 'gift.blooming',
                'finale_effect': 'finale.heart_of_light',
                'intensity': 'balanced',
                'speed': 1.0
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data['status'], 'ok')
        self.assertEqual(data['animation_config']['preset_id'], 'romantic_glow')
        self.assertEqual(data['animation_config']['screen_transition'], 'screen.petal_curtain')

        self.celebration.refresh_from_db()
        self.assertEqual(self.celebration.animation_config['preset_id'], 'romantic_glow')
        self.assertEqual(self.celebration.animation_config['gift_effect'], 'gift.blooming')

    def test_update_animation_config_api_validation(self):
        response = self.client.post(
            reverse('api_update_animations', kwargs={'celebration_id': self.celebration.id}),
            data=json.dumps({
                'preset_id': 'invalid_preset_foo',
                'screen_transition': 'screen.non_existent',
                'intensity': 'insane'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content)
        self.assertEqual(data['status'], 'error')
        self.assertIn('errors', data)
        self.assertIn('preset_id', data['errors'])
        self.assertIn('screen_transition', data['errors'])
        self.assertIn('intensity', data['errors'])

    def test_wizard_creates_celebration_with_animation_preset(self):
        response = self.client.post(reverse('wizard_create'), data={
            'title': 'Cosmic Milestone for John',
            'event_type': 'graduation',
            'theme_id': 'cosmic_violet',
            'animation_preset': 'cosmic_universe',
            'new_recipient_name': 'John Doe',
            'recipient_relationship': 'brother',
            'starter_pack': 'full_story'
        })
        self.assertEqual(response.status_code, 302)
        new_celebration = Celebration.objects.get(title='Cosmic Milestone for John')
        self.assertEqual(new_celebration.animation_config['preset_id'], 'cosmic_universe')
        self.assertEqual(new_celebration.animation_config['screen_transition'], 'screen.universe_warp')
        self.assertEqual(new_celebration.animation_config['gift_effect'], 'gift.cosmic_portal')

    def test_stage_renders_animation_canvases_and_config(self):
        # Preview view
        prev_res = self.client.get(reverse('celebration_preview', kwargs={'celebration_id': self.celebration.id}))
        self.assertEqual(prev_res.status_code, 200)
        self.assertContains(prev_res, 'id="bgAnimationCanvas"')
        self.assertContains(prev_res, 'id="fxTransitionCanvas"')
        self.assertContains(prev_res, 'id="celebrationAnimationConfig"')
        self.assertContains(prev_res, 'id="celebrationAudioConfig"')

        # Public celebration view
        pub_res = self.client.get(reverse('public_celebration', kwargs={'slug': self.celebration.slug}))
        self.assertEqual(pub_res.status_code, 200)
        self.assertContains(pub_res, 'id="bgAnimationCanvas"')
        self.assertContains(pub_res, 'id="fxTransitionCanvas"')
        self.assertContains(pub_res, 'id="celebrationAnimationConfig"')
        self.assertContains(pub_res, 'id="celebrationAudioConfig"')

    def test_update_audio_config_api(self):
        url = reverse('api_update_audio', kwargs={'celebration_id': self.celebration.id})
        res = self.client.post(
            url,
            data=json.dumps({
                'source_type': 'preset',
                'volume': 0.85,
                'loop': True
            }),
            content_type='application/json'
        )
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.content)
        self.assertEqual(data['status'], 'ok')
        self.celebration.refresh_from_db()
        self.assertEqual(self.celebration.audio_config['volume'], 0.85)
        self.assertEqual(self.celebration.audio_config['source_type'], 'preset')
        self.assertTrue(self.celebration.audio_config['loop'])

    def test_upload_audio_api_validation(self):
        from django.core.files.uploadedfile import SimpleUploadedFile
        url = reverse('api_upload_audio', kwargs={'celebration_id': self.celebration.id})
        
        # Test valid MP3 upload
        audio_file = SimpleUploadedFile("melody.mp3", b"ID3\x03\x00\x00\x00\x00\x00#dummy mp3 audio data", content_type="audio/mpeg")
        res = self.client.post(url, {'audio_file': audio_file})
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.content)
        self.assertEqual(data['status'], 'ok')
        self.celebration.refresh_from_db()
        self.assertEqual(self.celebration.audio_config['source_type'], 'custom')
        self.assertIn('.mp3', self.celebration.audio_config['custom_url'])

        # Test rejected non-audio file
        bad_file = SimpleUploadedFile("script.py", b"print('hello')", content_type="text/x-python")
        res_bad = self.client.post(url, {'audio_file': bad_file})
        self.assertEqual(res_bad.status_code, 400)

    def test_eight_sculptural_gift_styles_in_registry(self):
        from celebrations.animation_registry import ANIMATION_REGISTRY
        gift_keys = [
            'gift.luxury_sculpted', 'gift.liquid_glass', 'gift.velvet_jewelry',
            'gift.cosmic_artifact', 'gift.enchanted_floral', 'gift.paper_sculpture',
            'gift.holographic_future', 'gift.minimal_art'
        ]
        for k in gift_keys:
            self.assertIn(k, ANIMATION_REGISTRY)
            self.assertEqual(ANIMATION_REGISTRY[k]['category'], 'gift')

    def test_twelve_living_finale_styles_in_registry(self):
        from celebrations.animation_registry import ANIMATION_REGISTRY
        finale_keys = [
            'finale.heart_of_light', 'finale.living_portrait', 'finale.universe_made_for_you',
            'finale.grand_celebration', 'finale.letter_writes_itself', 'finale.storybook_finale',
            'finale.ethereal_pearl', 'finale.romantic_dream', 'finale.memory_constellation',
            'finale.editorial_minimal', 'finale.memory_collage', 'finale.quiet_emotional'
        ]
        for k in finale_keys:
            self.assertIn(k, ANIMATION_REGISTRY)
            self.assertEqual(ANIMATION_REGISTRY[k]['category'], 'finale')

    def test_unauthenticated_dashboard_access_redirects_to_landing(self):
        # Scenario: Recipient edits link in address bar to /dashboard/
        unauth_client = Client()
        res = unauth_client.get(reverse('dashboard'))
        self.assertEqual(res.status_code, 302)
        self.assertEqual(res.url, reverse('landing'))

    def test_unauthenticated_studio_access_redirects_to_landing(self):
        # Scenario: Recipient edits link to /celebrations/<id>/edit/
        unauth_client = Client()
        url = reverse('experience_studio', kwargs={'celebration_id': self.celebration.id})
        res = unauth_client.get(url)
        self.assertEqual(res.status_code, 302)
        self.assertEqual(res.url, reverse('landing'))

    def test_unauthenticated_api_mutations_return_403(self):
        # Scenario: Unauthorized script or visitor tries to mutate celebration
        unauth_client = Client()
        url = reverse('api_update_theme', kwargs={'celebration_id': self.celebration.id})
        res = unauth_client.post(url, data=json.dumps({'theme_id': 'ruby_elegance'}), content_type='application/json')
        self.assertEqual(res.status_code, 403)
        data = json.loads(res.content)
        self.assertEqual(data['status'], 'forbidden')

    def test_unauthenticated_public_celebration_access_allowed(self):
        # Scenario: Recipient accesses their shared celebration link /c/<slug>/
        unauth_client = Client()
        res = unauth_client.get(reverse('public_celebration', kwargs={'slug': self.celebration.slug}))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, 'celebration-viewport')
        # Ensure no creator dashboard links are leaked
        self.assertNotContains(res, 'studio-header')
        self.assertNotContains(res, 'Creator Atelier')

    def test_creator_login_portal_animated_renders(self):
        unauth_client = Client()
        res = unauth_client.get(reverse('login'))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, 'authCanvas')
        self.assertContains(res, 'authCard')
        self.assertContains(res, 'Creator Sign In')

    def test_creator_login_workflow(self):
        unauth_client = Client()
        res = unauth_client.post(reverse('login'), {
            'username': 'testcreator',
            'password': 'password123',
            'next': reverse('dashboard')
        })
        self.assertEqual(res.status_code, 302)
        self.assertEqual(res.url, reverse('dashboard'))

    def test_creator_logout_animated_renders(self):
        res = self.client.get(reverse('logout'))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, 'logoutCanvas')
        self.assertContains(res, 'logoutCard')
        self.assertContains(res, 'Session Securely Closed')
        self.assertContains(res, 'logout-countdown-svg')

    def test_creator_register_renders(self):
        unauth_client = Client()
        res = unauth_client.get(reverse('register'))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, 'authCanvas')
        self.assertContains(res, 'Create Account')
        self.assertContains(res, '✦ JOIN CELEBRATION STUDIO ✦')

    def test_creator_register_workflow_success(self):
        unauth_client = Client()
        res = unauth_client.post(reverse('register'), {
            'username': 'newuser123',
            'email': 'newuser@example.com',
            'password': 'password123',
            'confirm_password': 'password123'
        })
        self.assertEqual(res.status_code, 302)
        self.assertEqual(res.url, reverse('dashboard'))
        self.assertTrue(User.objects.filter(username='newuser123').exists())

    def test_creator_register_password_mismatch(self):
        unauth_client = Client()
        res = unauth_client.post(reverse('register'), {
            'username': 'newuser456',
            'password': 'password123',
            'confirm_password': 'different_password'
        })
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, 'Passwords do not match')
        self.assertFalse(User.objects.filter(username='newuser456').exists())

    def test_master_admin_unauthenticated_redirect(self):
        unauth_client = Client()
        res = unauth_client.get(reverse('master_admin_dashboard'))
        self.assertEqual(res.status_code, 302)
        self.assertIn(reverse('login'), res.url)

    def test_master_admin_non_superuser_forbidden(self):
        # Regular authenticated user (non-superuser) must be blocked with 403
        res = self.client.get(reverse('master_admin_dashboard'))
        self.assertEqual(res.status_code, 403)
        self.assertIn(b'Master Administrator clearance required', res.content)

    def test_master_admin_superuser_access(self):
        # Superuser Tamil gets full 200 access
        superuser = User.objects.create_superuser('superadmin', 'admin@example.com', 'adminpass123')
        admin_client = Client()
        admin_client.force_login(superuser)
        res = admin_client.get(reverse('master_admin_dashboard'))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, 'Master Admin Command Center')
        self.assertContains(res, 'Administrator Authority Council')

    def test_master_admin_can_create_new_admin(self):
        superuser = User.objects.create_superuser('chiefadmin', 'chief@example.com', 'adminpass123')
        admin_client = Client()
        admin_client.force_login(superuser)
        res = admin_client.post(reverse('master_admin_create_admin'), {
            'admin_username': 'deputyadmin',
            'admin_email': 'deputy@example.com',
            'admin_password': 'securepass123',
            'admin_confirm_password': 'securepass123'
        })
        self.assertEqual(res.status_code, 302)
        new_admin = User.objects.get(username='deputyadmin')
        self.assertTrue(new_admin.is_superuser)
        self.assertTrue(new_admin.is_staff)

    def test_template_gallery_renders(self):
        self.client.force_login(self.user)
        res = self.client.get(reverse('template_gallery'))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, 'Choose a Template')
        self.assertContains(res, '24 CURATED LUXURY 3D CELEBRATION BLUEPRINTS')
        self.assertContains(res, 'Golden Cinema Premiere')
        self.assertContains(res, 'Aurora of Two Hearts')
        self.assertContains(res, 'Polaroid Memory Atelier')
        self.assertContains(res, 'Sculptural Gift Reveal')
        self.assertContains(res, 'The Living Constellation')

    def test_template_gallery_category_filtering(self):
        self.client.force_login(self.user)
        res = self.client.get(reverse('template_gallery') + '?cat=romantic')
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, 'Aurora of Two Hearts')
        self.assertContains(res, 'Floating Rose Garden')

    def test_wizard_creation_with_template_blueprint(self):
        self.client.force_login(self.user)
        res = self.client.post(reverse('wizard_create'), {
            'title': 'Golden Premiere for Sarah',
            'event_type': 'birthday',
            'template_id': 'golden_cinema',
            'new_recipient_name': 'Sarah',
            'recipient_relationship': 'sister',
        })
        self.assertEqual(res.status_code, 302)
        created = Celebration.objects.filter(owner=self.user, title='Golden Premiere for Sarah').first()
        self.assertIsNotNone(created)
        self.assertEqual(created.theme_id, 'sculptural_gold')
        self.assertEqual(created.soundtrack_preset, 'upbeat_cheer')
        # Check all 5 scenes were created from the blueprint
        self.assertEqual(created.scenes.count(), 5)
        # Check gift box scene has champagne_gold style
        gift_scene = created.scenes.filter(scene_type='secret_surprise').first()
        self.assertIsNotNone(gift_scene)
        self.assertEqual(gift_scene.content.get('style'), 'champagne_gold')

    def test_media_vault_view_and_storage_stats(self):
        self.client.force_login(self.user)
        res = self.client.get(reverse('media_vault'))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, 'Media Vault')
        self.assertContains(res, 'Cloud Storage')
        self.assertContains(res, 'Photo Parallax')

    def test_media_vault_upload_and_delete(self):
        from django.core.files.uploadedfile import SimpleUploadedFile
        self.client.force_login(self.user)
        dummy_file = SimpleUploadedFile("memory_photo.jpg", b"fake-jpeg-binary-data", content_type="image/jpeg")
        res = self.client.post(reverse('media_vault'), {
            'file': dummy_file,
            'caption': 'Our Summer Beach Trip',
            'alt_text': 'Friends at the beach sunset'
        })
        self.assertEqual(res.status_code, 302)
        from celebrations.models import MediaAsset
        asset = MediaAsset.objects.filter(caption='Our Summer Beach Trip').first()
        self.assertIsNotNone(asset)
        self.assertEqual(asset.asset_type, 'image')

        # Test delete
        del_res = self.client.post(reverse('media_vault'), {
            'action': 'delete',
            'asset_id': str(asset.id)
        })
        self.assertEqual(del_res.status_code, 302)
        self.assertFalse(MediaAsset.objects.filter(id=asset.id).exists())


class PasswordResetFlowTestCase(TestCase):
    """
    Independent test suite verifying the secure Gmail SMTP password reset flow:
    - URL routing & template rendering
    - Email dispatch via mail.outbox
    - Account enumeration prevention
    - Token generation and verification
    - Secure password update & hashing
    - Token invalidation after usage
    """
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='resetcreator',
            email='creator@celebrationstudio.test',
            password='OriginalPassword123!'
        )

    def test_login_page_contains_forgot_password_link(self):
        res = self.client.get(reverse('login'))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, reverse('password_reset'))
        self.assertContains(res, 'Forgot password?')

    def test_password_reset_form_renders(self):
        res = self.client.get(reverse('password_reset'))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, 'Reset Password')
        self.assertContains(res, 'name="email"')

    def test_password_reset_email_dispatch_for_valid_user(self):
        from django.core import mail
        mail.outbox = []

        res = self.client.post(reverse('password_reset'), {
            'email': 'creator@celebrationstudio.test'
        })
        self.assertEqual(res.status_code, 302)
        self.assertRedirects(res, reverse('password_reset_done'))

        # Verify email dispatched to mail.outbox
        self.assertEqual(len(mail.outbox), 1)
        dispatched = mail.outbox[0]
        self.assertIn('creator@celebrationstudio.test', dispatched.to)
        self.assertIn('Password Reset Request', dispatched.subject)
        self.assertIn('reset-password/', dispatched.body)

    def test_password_reset_unregistered_email_does_not_leak_enumeration(self):
        from django.core import mail
        mail.outbox = []

        res = self.client.post(reverse('password_reset'), {
            'email': 'unregistered@unknowndomain.test'
        })
        self.assertEqual(res.status_code, 302)
        self.assertRedirects(res, reverse('password_reset_done'))
        # No email sent, but user sees standard success message
        self.assertEqual(len(mail.outbox), 0)

    def test_password_reset_done_page_renders(self):
        res = self.client.get(reverse('password_reset_done'))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, 'Check Your Inbox')

    def test_password_reset_confirm_and_complete_success(self):
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        from django.contrib.auth.tokens import default_token_generator
        from django.contrib.auth import authenticate

        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)

        confirm_url = reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token})

        # GET confirm view with valid token (Django securely redirects to set-password to strip token from referer)
        get_res = self.client.get(confirm_url, follow=True)
        self.assertEqual(get_res.status_code, 200)
        self.assertTrue(get_res.context['validlink'])
        self.assertContains(get_res, 'New Password')

        # POST new password to the active session URL
        set_password_url = get_res.redirect_chain[0][0]
        post_res = self.client.post(set_password_url, {
            'new_password1': 'UpdatedNewPassword999!',
            'new_password2': 'UpdatedNewPassword999!'
        })
        self.assertEqual(post_res.status_code, 302)
        self.assertRedirects(post_res, reverse('password_reset_complete'))

        # Verify password updated and can authenticate
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('UpdatedNewPassword999!'))
        self.assertFalse(self.user.check_password('OriginalPassword123!'))

        auth_user = authenticate(username=self.user.username, password='UpdatedNewPassword999!')
        self.assertIsNotNone(auth_user)

        # Verify old token is now invalidated
        reused_res = self.client.get(confirm_url)
        self.assertEqual(reused_res.status_code, 200)
        self.assertFalse(reused_res.context['validlink'])
        self.assertContains(reused_res, 'Reset Link Invalid')

    def test_password_reset_confirm_invalid_token(self):
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes

        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        invalid_url = reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': 'fake-tampered-token'})

        res = self.client.get(invalid_url)
        self.assertEqual(res.status_code, 200)
        self.assertFalse(res.context['validlink'])
        self.assertContains(res, 'Reset Link Invalid')

    def test_password_reset_complete_page_renders(self):
        res = self.client.get(reverse('password_reset_complete'))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, 'Password Reset Complete')
        self.assertContains(res, reverse('login'))









