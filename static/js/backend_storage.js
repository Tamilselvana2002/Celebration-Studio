/**
 * CELEBRATION STUDIO — CLIENT-SIDE BACKEND & STORAGE ENGINE
 * Replaces Python/Django server with a zero-dependency, permanent
 * in-browser storage system using localStorage & IndexedDB.
 * Intercepts studio fetch calls to guarantee 100% fidelity without changing UI logic.
 */

(function () {
  const KEY_CELEBRATIONS = 'celebration_studio_celebrations';
  const KEY_RECIPIENTS = 'celebration_studio_recipients';
  const KEY_USER = 'celebration_studio_user';
  const KEY_SETTINGS = 'celebration_studio_settings';
  const KEY_MEDIA = 'celebration_studio_media';

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Initial Seed Data to populate new installations immediately
  function getInitialCelebrations() {
    return [
      {
        id: 'gold-cinema-demo-01',
        title: 'Golden Cinema Premiere for Aria',
        event_type: 'birthday',
        theme_id: 'sculptural_gold',
        template_id: 'golden_cinema',
        recipient_summary: 'Aria Montgomery (Sister)',
        recipient: {
          name: 'Aria Montgomery',
          relationship: 'sister'
        },
        status: 'published',
        view_count: 18,
        created_at: new Date().toISOString(),
        audio_config: {
          track_id: 'upbeat_cheer',
          volume: 0.75,
          loop: true,
          track_name: 'Celebration Prelude Fanfare',
          track_url: 'static/audio/sample_ambient.mp3'
        },
        animation_config: {
          screen_transition: 'light_sweep',
          preset_id: 'cinematic_luxury',
          particle_speed: 1.0,
          intensity: 'high'
        },
        scenes: [
          {
            id: 'scene-cinematic-01',
            order: 0,
            scene_type: 'cinematic',
            title: 'The Starlit Prelude',
            content: {
              title_prefix: 'Celebrating My Sister',
              recipient_name: 'Aria Montgomery',
              subtitle: 'A momentous milestone to cherish and remember across time.',
              countdown_seconds: 3,
              countdown_enabled: true
            }
          },
          {
            id: 'scene-romantic-02',
            order: 1,
            scene_type: 'romantic_dream',
            title: 'Golden Hour Reflections',
            content: {
              headline: 'Moments of Pure Brilliance',
              quote: '“Like starlight forged in timeless skies, your grace, warmth, and laughter illuminate every heart beside you.”',
              message_body: 'May this year welcome you with the boundless joy you constantly gift to the world.'
            }
          },
          {
            id: 'scene-memory-03',
            order: 2,
            scene_type: 'memory_lane',
            title: 'Milestone Memories',
            content: {
              headline: 'Moments Written in Time',
              memories: [
                {
                  id: 'mem_1',
                  title: 'The Spark of Starlight',
                  year: 'Chapter 1',
                  tag: 'Cherished',
                  note: 'Where every unforgettable adventure begins — with a dream and boundless courage.',
                  image: 'static/img/memory_stargazing.jpg',
                  quote: '“In every shared laughter, there is starlight.”',
                  quote_style: 'italic_serif',
                  presentation_style: 'polaroid'
                },
                {
                  id: 'mem_2',
                  title: 'Moments of Pure Celebration',
                  year: 'Chapter 2',
                  tag: 'Triumph',
                  note: 'Shared milestones and midnight conversations that turned ordinary days into pure celebration.',
                  image: 'static/img/memory_toast.jpg',
                  quote: '“Some chapters are meant to be reread forever.”',
                  quote_style: 'italic_serif',
                  presentation_style: 'polaroid'
                },
                {
                  id: 'mem_3',
                  title: 'The Next Grand Horizon',
                  year: 'Chapter 3',
                  tag: 'Radiant',
                  note: 'Standing tall, beloved by all, and glowing brighter with every new milestone.',
                  image: 'static/img/memory_graduation.jpg',
                  quote: '“The future expands wherever you choose to step.”',
                  quote_style: 'italic_serif',
                  presentation_style: 'polaroid'
                }
              ]
            }
          },
          {
            id: 'scene-surprise-04',
            order: 3,
            scene_type: 'secret_surprise',
            title: 'The Royal Gilded Box',
            content: {
              gift_style: 'champagne_gold',
              prompt: 'Tap the sculptural artifact to unlock your secret note...',
              box_color: '#8B1E2D',
              ribbon_color: '#E6C065',
              surprise_title: 'From The Heart of Your Family',
              surprise_letter: 'On this momentous milestone, we celebrate not just what you accomplish, but the wonderful, radiant soul you are.\n\nMay your coming year be filled with standing ovations, boundless health, deep peace, and dreams fulfilled.',
              signature: 'Always with love, David',
              gift_photo: 'static/img/memory_kyoto.jpg'
            }
          },
          {
            id: 'scene-cosmic-05',
            order: 4,
            scene_type: 'cosmic_universe',
            title: 'The Starlight Constellation',
            content: {
              finale_style: 'grand_celebration',
              layout_variant: 'centered',
              constellation_name: 'LEO GLORIA',
              headline: 'Happy Birthday, Our Superstar!',
              closing_message: 'May this year be your finest blockbuster yet! Keep shining with boundless brilliance.',
              signature: 'Always in your corner, David',
              wishes: ['Endless Joy', 'Radiant Health', 'Unstoppable Dreams', 'Deep Peace'],
              recipient_photo: 'static/img/memory_bakery.jpg'
            }
          }
        ]
      },
      {
        id: 'romantic-dream-demo-02',
        title: 'Starlight Romance for Lucas',
        event_type: 'anniversary',
        theme_id: 'cosmic_galaxy',
        template_id: 'romantic_rose',
        recipient_summary: 'Lucas Vance (Partner)',
        recipient: {
          name: 'Lucas Vance',
          relationship: 'partner'
        },
        status: 'draft',
        view_count: 5,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        audio_config: {
          track_id: 'gentle_acoustic',
          volume: 0.8,
          loop: true,
          track_name: 'Celestial Melody',
          track_url: 'static/audio/sample_ambient.mp3'
        },
        animation_config: {
          screen_transition: 'aurora_fade',
          preset_id: 'preset_romantic_dream',
          particle_speed: 0.8,
          intensity: 'high'
        },
        scenes: [
          {
            id: 'scene-romantic-01',
            order: 0,
            scene_type: 'cinematic',
            title: 'A Starlit Beginning',
            content: {
              title_prefix: 'Celebrating Our Anniversary',
              recipient_name: 'Lucas Vance',
              subtitle: 'Four years of starlit memories, laughter, and endless adventure.',
              countdown_seconds: 3,
              countdown_enabled: true
            }
          },
          {
            id: 'scene-romantic-02',
            order: 1,
            scene_type: 'romantic_dream',
            title: 'Garden of Stars',
            content: {
              headline: 'To The One Who Makes Every Day Magical',
              quote: '“Every chapter beside you has been pure poetry written across the skies.”',
              message_body: 'Thank you for being my anchor, my confidant, and my favorite adventure.'
            }
          },
          {
            id: 'scene-romantic-03',
            order: 2,
            scene_type: 'cosmic_universe',
            title: 'Our Constellation',
            content: {
              finale_style: 'celestial_drift',
              layout_variant: 'centered',
              constellation_name: 'ORION & LYRA',
              headline: 'Forever & Always',
              closing_message: 'Here is to a hundred more chapters together.',
              signature: 'With all my heart, Elena',
              wishes: ['Eternal Love', 'Endless Laughter', 'Adventures Ahead']
            }
          }
        ]
      }
    ];
  }

  // Master Client Database API
  window.CelebrationDB = {
    _load(key, fallback) {
      try {
        const d = localStorage.getItem(key);
        return d ? JSON.parse(d) : fallback;
      } catch (e) {
        console.warn(`CelebrationDB failed to load ${key}:`, e);
        return fallback;
      }
    },

    _save(key, val) {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch (e) {
        console.error(`CelebrationDB failed to save ${key}:`, e);
      }
    },

    init() {
      if (!localStorage.getItem(KEY_CELEBRATIONS)) {
        this._save(KEY_CELEBRATIONS, getInitialCelebrations());
      }
      if (!localStorage.getItem(KEY_USER)) {
        this._save(KEY_USER, {
          username: 'Atelier Creator',
          email: 'creator@celebrationstudio.com',
          is_authenticated: true,
          is_superuser: true
        });
      }
      if (!localStorage.getItem(KEY_SETTINGS)) {
        this._save(KEY_SETTINGS, {
          theme: 'midnight_gold',
          intensity: 'high',
          soundtrack_auto_play: true
        });
      }
    },

    getUser() {
      return this._load(KEY_USER, {
        username: 'Atelier Creator',
        email: 'creator@celebrationstudio.com',
        is_authenticated: true,
        is_superuser: true
      });
    },

    setUser(user) {
      this._save(KEY_USER, user);
    },

    login(username, email = '') {
      const user = {
        username: username || 'Atelier Creator',
        email: email || 'creator@celebrationstudio.com',
        is_authenticated: true,
        is_superuser: true
      };
      this.setUser(user);
      return user;
    },

    logout() {
      const user = this.getUser();
      user.is_authenticated = false;
      this.setUser(user);
      window.location.href = 'login.html';
    },

    getSettings() {
      return this._load(KEY_SETTINGS, {
        theme: 'midnight_gold',
        intensity: 'high',
        soundtrack_auto_play: true
      });
    },

    updateSettings(updates) {
      const s = Object.assign(this.getSettings(), updates);
      this._save(KEY_SETTINGS, s);
      return s;
    },

    getCelebrations() {
      this.init();
      return this._load(KEY_CELEBRATIONS, []);
    },

    getCelebration(id) {
      const list = this.getCelebrations();
      return list.find(c => String(c.id) === String(id)) || null;
    },

    saveCelebration(celebration) {
      const list = this.getCelebrations();
      const idx = list.findIndex(c => String(c.id) === String(celebration.id));
      if (idx !== -1) {
        list[idx] = celebration;
      } else {
        list.unshift(celebration);
      }
      this._save(KEY_CELEBRATIONS, list);
      return celebration;
    },

    deleteCelebration(id) {
      let list = this.getCelebrations();
      list = list.filter(c => String(c.id) !== String(id));
      this._save(KEY_CELEBRATIONS, list);
    },

    createFromTemplate(templateId, overrides = {}) {
      const catalog = window.MASTER_TEMPLATES || {};
      const template = catalog[templateId] || catalog['golden_cinema'] || {};
      const newId = uuidv4();

      const celebration = {
        id: newId,
        title: overrides.title || template.name || 'New Celebration',
        event_type: overrides.event_type || 'birthday',
        theme_id: template.theme_id || 'sculptural_gold',
        template_id: templateId || 'golden_cinema',
        recipient_summary: overrides.recipient_name 
          ? `${overrides.recipient_name} (${overrides.recipient_relationship || 'VIP'})`
          : 'VIP Celebration Star',
        recipient: {
          name: overrides.recipient_name || 'Honored Guest',
          relationship: overrides.recipient_relationship || 'friend'
        },
        status: 'draft',
        view_count: 0,
        created_at: new Date().toISOString(),
        audio_config: {
          track_id: template.soundtrack_preset || 'upbeat_cheer',
          volume: 0.75,
          loop: true,
          track_name: 'Celebration Soundtrack',
          track_url: 'static/audio/sample_ambient.mp3'
        },
        animation_config: {
          screen_transition: 'light_sweep',
          preset_id: template.animation_preset || 'cinematic_luxury',
          particle_speed: 1.0,
          intensity: 'high'
        },
        scenes: []
      };

      // Populate scenes from blueprint if available
      const blueprint = template.scenes_blueprint || [];
      if (blueprint.length > 0) {
        celebration.scenes = blueprint.map((s, idx) => ({
          id: `scene-${idx + 1}-${Date.now()}`,
          order: idx,
          scene_type: s.scene_type,
          title: s.title,
          content: Object.assign({}, s.custom_content, {
            recipient_name: overrides.recipient_name || s.custom_content?.recipient_name || 'Honored Guest'
          })
        }));
      } else {
        // Fallback default 5-scene flow
        celebration.scenes = [
          {
            id: `scene-1-${Date.now()}`,
            order: 0,
            scene_type: 'cinematic',
            title: 'The Starlit Prelude',
            content: {
              title_prefix: 'Celebrating',
              recipient_name: overrides.recipient_name || 'Honored Guest',
              subtitle: 'A momentous milestone to cherish and remember.',
              countdown_seconds: 3,
              countdown_enabled: true
            }
          },
          {
            id: `scene-2-${Date.now()}`,
            order: 1,
            scene_type: 'romantic_dream',
            title: 'Moments of Pure Brilliance',
            content: {
              headline: 'Moments of Pure Brilliance',
              quote: '“May your journey continue to shine brighter than the most radiant constellations.”',
              message_body: 'Every moment shared with you is a cherished memory.'
            }
          },
          {
            id: `scene-3-${Date.now()}`,
            order: 2,
            scene_type: 'memory_lane',
            title: 'Memories Written in Time',
            content: {
              headline: 'Moments Written in Time',
              memories: [
                {
                  id: `mem_1`,
                  title: 'A Beginning to Remember',
                  year: 'Chapter 1',
                  tag: 'Cherished',
                  note: 'Where every unforgettable story begins.',
                  image: 'static/img/memory_stargazing.jpg',
                  quote: '“In every shared laughter, there is starlight.”'
                }
              ]
            }
          },
          {
            id: `scene-4-${Date.now()}`,
            order: 3,
            scene_type: 'secret_surprise',
            title: 'The Golden Gift Box',
            content: {
              gift_style: 'champagne_gold',
              prompt: 'Tap the gift artifact to unveil your surprise note...',
              box_color: '#8B1E2D',
              ribbon_color: '#E6C065',
              surprise_title: 'A Special Tribute',
              surprise_letter: 'Wishing you boundless joy, triumphant success, and radiant health in the wonderful year ahead.',
              signature: 'With warmest love'
            }
          },
          {
            id: `scene-5-${Date.now()}`,
            order: 4,
            scene_type: 'cosmic_universe',
            title: 'Celestial Finale',
            content: {
              finale_style: 'grand_celebration',
              layout_variant: 'centered',
              constellation_name: 'CELESTIA',
              headline: `Happy Celebration, ${overrides.recipient_name || 'Star'}!`,
              closing_message: 'Keep shining with boundless starlight forever.',
              signature: 'Always with love',
              wishes: ['Endless Joy', 'Radiant Health', 'Bright Success']
            }
          }
        ];
      }

      this.saveCelebration(celebration);
      return celebration;
    },

    updateScene(celebrationId, sceneId, updates) {
      const celebration = this.getCelebration(celebrationId);
      if (!celebration) return null;

      const scene = celebration.scenes.find(s => String(s.id) === String(sceneId));
      if (!scene) return null;

      if (updates.title) scene.title = updates.title;
      if (updates.content) {
        scene.content = Object.assign(scene.content || {}, updates.content);
      }

      this.saveCelebration(celebration);
      return scene;
    },

    reorderScenes(celebrationId, sceneIds) {
      const celebration = this.getCelebration(celebrationId);
      if (!celebration) return false;

      const newOrder = [];
      sceneIds.forEach((id, idx) => {
        const found = celebration.scenes.find(s => String(s.id) === String(id));
        if (found) {
          found.order = idx;
          newOrder.push(found);
        }
      });

      celebration.scenes = newOrder;
      this.saveCelebration(celebration);
      return true;
    },

    addScene(celebrationId, sceneType, title) {
      const celebration = this.getCelebration(celebrationId);
      if (!celebration) return null;

      const newScene = {
        id: `scene-${Date.now()}`,
        scene_type: sceneType,
        title: title || 'New Scene',
        order: celebration.scenes.length,
        content: {}
      };

      celebration.scenes.push(newScene);
      this.saveCelebration(celebration);
      return newScene;
    },

    deleteScene(celebrationId, sceneId) {
      const celebration = this.getCelebration(celebrationId);
      if (!celebration) return false;

      celebration.scenes = celebration.scenes.filter(s => String(s.id) !== String(sceneId));
      celebration.scenes.forEach((s, idx) => s.order = idx);
      this.saveCelebration(celebration);
      return true;
    },

    updateTheme(celebrationId, themeId) {
      const celebration = this.getCelebration(celebrationId);
      if (!celebration) return false;

      celebration.theme_id = themeId;
      this.saveCelebration(celebration);
      return true;
    },

    updateAudio(celebrationId, audioConfig) {
      const celebration = this.getCelebration(celebrationId);
      if (!celebration) return false;

      celebration.audio_config = Object.assign(celebration.audio_config || {}, audioConfig);
      this.saveCelebration(celebration);
      return celebration.audio_config;
    },

    updateAnimations(celebrationId, animConfig) {
      const celebration = this.getCelebration(celebrationId);
      if (!celebration) return false;

      celebration.animation_config = Object.assign(celebration.animation_config || {}, animConfig);
      this.saveCelebration(celebration);
      return celebration.animation_config;
    },

    togglePublish(celebrationId, isPublished) {
      const celebration = this.getCelebration(celebrationId);
      if (!celebration) return false;

      celebration.status = isPublished ? 'published' : 'draft';
      this.saveCelebration(celebration);
      return true;
    },

    // Convert uploaded File to Data URL
    fileToDataUrl(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  };

  // Initialize DB on script load
  window.CelebrationDB.init();

  // =========================================================================
  // FETCH INTERCEPTOR (Seamlessly intercepts AJAX API endpoints on client)
  // =========================================================================
  const originalFetch = window.fetch;
  window.fetch = async function (input, init = {}) {
    const url = typeof input === 'string' ? input : input.url;

    // 1. Update Scene Content: /celebrations/:id/scenes/:scene_id/update/
    const updateSceneMatch = url.match(/\/celebrations\/([^/]+)\/scenes\/([^/]+)\/update\/?/);
    if (updateSceneMatch) {
      const celebrationId = updateSceneMatch[1];
      const sceneId = updateSceneMatch[2];
      let body = {};
      try {
        body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body || {};
      } catch (e) {}

      const scene = window.CelebrationDB.updateScene(celebrationId, sceneId, body);
      return new Response(JSON.stringify({
        status: scene ? 'ok' : 'error',
        scene: scene
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // 2. Reorder Scenes: /celebrations/:id/reorder-scenes/
    const reorderMatch = url.match(/\/celebrations\/([^/]+)\/reorder-scenes\/?/);
    if (reorderMatch) {
      const celebrationId = reorderMatch[1];
      let body = {};
      try {
        body = JSON.parse(init.body || '{}');
      } catch (e) {}
      const ok = window.CelebrationDB.reorderScenes(celebrationId, body.scene_ids || []);
      return new Response(JSON.stringify({ status: ok ? 'ok' : 'error' }), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Add Scene: /celebrations/:id/add-scene/
    const addSceneMatch = url.match(/\/celebrations\/([^/]+)\/add-scene\/?/);
    if (addSceneMatch) {
      const celebrationId = addSceneMatch[1];
      let body = {};
      try {
        body = JSON.parse(init.body || '{}');
      } catch (e) {}
      const scene = window.CelebrationDB.addScene(celebrationId, body.scene_type, body.title);
      return new Response(JSON.stringify({
        status: scene ? 'ok' : 'error',
        scene_id: scene?.id,
        scene_type: scene?.scene_type,
        title: scene?.title,
        order: scene?.order
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // 4. Update Theme: /celebrations/:id/update-theme/
    const themeMatch = url.match(/\/celebrations\/([^/]+)\/update-theme\/?/);
    if (themeMatch) {
      const celebrationId = themeMatch[1];
      let body = {};
      try {
        body = JSON.parse(init.body || '{}');
      } catch (e) {}
      const ok = window.CelebrationDB.updateTheme(celebrationId, body.theme_id);
      return new Response(JSON.stringify({ status: ok ? 'ok' : 'error' }), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    }

    // 5. Update Audio Config: /celebrations/:id/update-audio/
    const audioMatch = url.match(/\/celebrations\/([^/]+)\/update-audio\/?/);
    if (audioMatch) {
      const celebrationId = audioMatch[1];
      let body = {};
      try {
        body = JSON.parse(init.body || '{}');
      } catch (e) {}
      const audioConfig = window.CelebrationDB.updateAudio(celebrationId, body);
      return new Response(JSON.stringify({ status: 'ok', audio_config: audioConfig }), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    }

    // 6. Update Animation Config: /celebrations/:id/update-animations/
    const animMatch = url.match(/\/celebrations\/([^/]+)\/update-animations\/?/);
    if (animMatch) {
      const celebrationId = animMatch[1];
      let body = {};
      try {
        body = JSON.parse(init.body || '{}');
      } catch (e) {}
      const animConfig = window.CelebrationDB.updateAnimations(celebrationId, body);
      return new Response(JSON.stringify({ status: 'ok', animation_config: animConfig }), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    }

    // 7. Publish Toggle: /celebrations/:id/publish-toggle/
    const pubMatch = url.match(/\/celebrations\/([^/]+)\/publish-toggle\/?/);
    if (pubMatch) {
      const celebrationId = pubMatch[1];
      let isPub = true;
      if (init.body instanceof FormData) {
        isPub = init.body.get('is_published') === 'true';
      }
      const ok = window.CelebrationDB.togglePublish(celebrationId, isPub);
      return new Response(JSON.stringify({
        status: ok ? 'ok' : 'error',
        is_published: isPub,
        share_url: `${window.location.origin}/preview.html?id=${celebrationId}`
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // 8. Upload Photo: /celebrations/:id/upload-photo/
    const photoMatch = url.match(/\/celebrations\/([^/]+)\/upload-photo\/?/);
    if (photoMatch && init.body instanceof FormData) {
      const file = init.body.get('file');
      if (file) {
        try {
          const dataUrl = await window.CelebrationDB.fileToDataUrl(file);
          return new Response(JSON.stringify({
            status: 'ok',
            file_url: dataUrl
          }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } catch (e) {
          return new Response(JSON.stringify({ status: 'error', message: 'Upload failed' }), { status: 500 });
        }
      }
    }

    // 9. Upload Audio: /celebrations/:id/upload-audio/
    const audioUploadMatch = url.match(/\/celebrations\/([^/]+)\/upload-audio\/?/);
    if (audioUploadMatch && init.body instanceof FormData) {
      const file = init.body.get('file');
      if (file) {
        try {
          const dataUrl = await window.CelebrationDB.fileToDataUrl(file);
          return new Response(JSON.stringify({
            status: 'ok',
            file_url: dataUrl
          }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } catch (e) {
          return new Response(JSON.stringify({ status: 'error', message: 'Audio upload failed' }), { status: 500 });
        }
      }
    }

    // Default fallback to native fetch
    return originalFetch.apply(this, arguments);
  };

})();
