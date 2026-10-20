/**
 * CELEBRATION STUDIO — CLIENT PREVIEW STAGE RENDERER
 * Dynamically builds the complete 5-engine celebration DOM
 * from CelebrationDB or MASTER_TEMPLATES before Orchestrator initializes.
 */

(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const celebrationId = urlParams.get('id');
  const templateId = urlParams.get('template');

  let celebration = null;
  if (celebrationId && window.CelebrationDB) {
    celebration = window.CelebrationDB.getCelebration(celebrationId);
  }

  // Fallback to template if requested or if no ID found
  if (!celebration && window.MASTER_TEMPLATES) {
    const tId = templateId || 'golden_cinema';
    const tmpl = window.MASTER_TEMPLATES[tId] || window.MASTER_TEMPLATES['golden_cinema'];
    if (tmpl) {
      celebration = {
        id: tId,
        title: tmpl.name,
        theme_id: tmpl.theme_id || 'sculptural_gold',
        recipient_summary: 'Celebration VIP Star',
        audio_config: {
          track_id: tmpl.soundtrack_preset || 'upbeat_cheer',
          volume: 0.75,
          loop: true,
          track_url: 'static/audio/sample_ambient.mp3'
        },
        animation_config: {
          screen_transition: 'light_sweep',
          preset_id: tmpl.animation_preset || 'cinematic_luxury',
          particle_speed: 1.0,
          intensity: 'high'
        },
        scenes: (tmpl.scenes_blueprint || []).map((s, idx) => ({
          id: `preview-scene-${idx}`,
          order: idx,
          scene_type: s.scene_type,
          title: s.title,
          content: Object.assign({}, s.custom_content, {
            recipient_name: 'Celebration Star'
          })
        }))
      };
    }
  }

  // Fallback to first celebration if still null
  if (!celebration && window.CelebrationDB) {
    const list = window.CelebrationDB.getCelebrations();
    if (list.length > 0) celebration = list[0];
  }

  if (!celebration) {
    console.error('No celebration found for preview');
    return;
  }

  // Set page title & document theme
  document.title = `${celebration.title} — Celebration Experience`;
  document.documentElement.setAttribute('data-theme', celebration.theme_id || 'midnight_gold');

  // Build Viewport HTML
  const stageMount = document.getElementById('stageMount');
  if (!stageMount) return;

  const scenes = celebration.scenes || [];

  let scenesHtml = scenes.map((scene, idx) => {
    const isFirst = idx === 0 ? 'scene-active' : '';
    const c = scene.content || {};

    if (scene.scene_type === 'cinematic') {
      const countdown = c.countdown_seconds || 3;
      return `
        <div class="scene-container engine-cinematic ${isFirst}" data-scene-type="cinematic" data-scene-id="${scene.id}" data-countdown-seconds="${countdown}">
          <div class="cinematic-vignette"></div>
          <div class="cinematic-blast-flash"></div>
          <div class="cinematic-blast-shockwave"></div>

          <div class="cinematic-content-wrap">
            <div class="cinematic-countdown-stage">
              <div class="countdown-spotlight-glow"></div>
              <div class="cinematic-countdown-ring">
                <svg class="countdown-svg" width="120" height="120">
                  <circle cx="60" cy="60" r="52" stroke="rgba(255,255,255,0.08)" stroke-width="5" fill="none" />
                  <circle class="countdown-circle" cx="60" cy="60" r="52" stroke="var(--theme-primary)" stroke-width="5" fill="none" />
                </svg>
                <span class="countdown-number">${countdown}</span>
              </div>
            </div>

            <div class="cinematic-greeting-wrap">
              <div class="cinematic-prefix font-mono">${c.title_prefix || 'A Celebration For'}</div>
              <h1 class="cinematic-title font-display">${c.recipient_name || celebration.recipient_summary || 'Our Beloved Star'}</h1>
              <p class="cinematic-subtitle">${c.subtitle || 'A momentous occasion to cherish and remember.'}</p>
              <button class="btn btn-primary btn-lg cinematic-cta-btn" onclick="window.orchestrator.nextScene()" style="margin-top: var(--space-4);">
                <span>Enter Journey →</span>
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (scene.scene_type === 'romantic_dream') {
      return `
        <div class="scene-container engine-dream ${isFirst}" data-scene-type="romantic_dream" data-scene-id="${scene.id}">
          <div class="dream-content-wrap">
            <div class="dream-glass-card">
              <div class="dream-heart-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h2 class="dream-quote font-display">${c.quote || '“Every chapter beside you has been pure poetry.”'}</h2>
              <p class="dream-message">${c.message_body || c.headline || ''}</p>
            </div>
          </div>
        </div>
      `;
    } else if (scene.scene_type === 'memory_lane') {
      const memories = c.memories || [
        {
          title: 'The Spark of Memory',
          year: 'Chapter 1',
          tag: 'Cherished',
          note: 'Where every unforgettable story begins.',
          image: 'static/img/memory_stargazing.jpg',
          quote: '“In every shared laughter, there is starlight.”'
        }
      ];

      const cardsHtml = memories.map((mem, mIdx) => `
        <div class="memory-slide-card ${mIdx === 0 ? 'active' : ''}" data-index="${mIdx}">
          <div class="washi-tape-accent"></div>
          <div class="polaroid-badge">
            <span class="polaroid-badge-current">${mIdx + 1}</span> / ${memories.length}
          </div>
          <div class="polaroid-photo-frame">
            ${mem.image ? `
              <div class="polaroid-blur-backdrop" style="background-image: url('${mem.image}');"></div>
              <img src="${mem.image}" alt="${mem.title || ''}" class="polaroid-img" loading="eager">
              <div class="photo-sheen-overlay"></div>
            ` : `
              <div class="polaroid-placeholder-graphic"><span>✨</span></div>
            `}
            <div class="polaroid-reflection-sweep"></div>
          </div>
          <div class="memory-slide-content">
            <div class="polaroid-caption">${mem.title || 'Special Milestone'}</div>
            <div class="polaroid-year-tag">${mem.year || 'Moments'} • ${mem.tag || 'Cherished'}</div>
            <p class="polaroid-note-text">${mem.note || ''}</p>
            ${mem.quote ? `<div class="polaroid-quote-text font-serif">${mem.quote}</div>` : ''}
          </div>
          <div class="polaroid-progress-line">
            <div class="polaroid-progress-fill"></div>
          </div>
        </div>
      `).join('');

      return `
        <div class="scene-container engine-memory ${isFirst}" data-scene-type="memory_lane" data-scene-id="${scene.id}">
          <div class="memory-content-wrap">
            <div class="memory-header">
              <div style="font-size: var(--text-xs); color: var(--theme-primary); text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: var(--space-2);">
                ${c.headline || 'Moments Written in Time'}
              </div>
              <h2 class="font-display" style="font-size: clamp(1.6rem, 3.5vw, 2.4rem); color: #fff;">${scene.title}</h2>
            </div>
            <div class="memory-storyteller-stage">
              <div class="deck-shadow-layer deck-layer-2"></div>
              ${cardsHtml}
            </div>
          </div>
        </div>
      `;
    } else if (scene.scene_type === 'secret_surprise') {
      const giftStyle = c.gift_style || 'champagne_gold';
      const boxColor = c.box_color || '#8B1E2D';
      const ribbonColor = c.ribbon_color || '#E6C065';

      return `
        <div class="scene-container engine-surprise gift-style-${giftStyle} ${isFirst}" data-scene-type="secret_surprise" data-scene-id="${scene.id}" data-gift-style="${giftStyle}">
          <div class="sculpture-stage-glow"></div>
          <div class="sculpture-spotlight-beam"></div>

          <div class="surprise-content-wrap">
            <div class="surprise-prompt" style="margin-bottom: var(--space-6); text-align: center;">
              <h2 class="font-display sculpture-title" style="font-size: clamp(2rem, 4.5vw, 3rem); margin-bottom: var(--space-2); color: #fff;">
                ${scene.title}
              </h2>
              <p class="sculpture-subtitle" style="color: var(--text-muted); font-size: clamp(0.9rem, 1.8vw, 1.05rem); max-width: 520px; margin: 0 auto;">
                ${c.prompt || 'Tap the sculptural artifact to unlock your secret note...'}
              </p>
            </div>

            <div class="sculpture-stage-viewport">
              <div class="sculpture-pedestal-plinth"></div>
              <div class="gift-three-canvas-wrap" id="giftThreeContainer"></div>

              <div class="sculpture-artifact-3d" style="--gift-box-bg: ${boxColor}; --gift-ribbon-bg: ${ribbonColor};">
                <div class="sculpture-inner-chamber">
                  <div class="chamber-light-source"></div>
                  <div class="chamber-cosmic-aperture">
                    <div class="aperture-core-star">✦</div>
                    <div class="aperture-sunbeams">
                      <span class="beam-spike beam-1"></span>
                      <span class="beam-spike beam-2"></span>
                      <span class="beam-spike beam-3"></span>
                      <span class="beam-spike beam-4"></span>
                    </div>
                  </div>
                  <div class="chamber-floating-relic">✦</div>
                </div>

                <div class="sculpture-primary-shell">
                  <div class="shell-facet shell-facet-front"></div>
                  <div class="shell-facet shell-facet-back"></div>
                  <div class="shell-facet shell-facet-left"></div>
                  <div class="shell-facet shell-facet-right"></div>
                  <div class="shell-facet shell-facet-bottom"></div>
                  <div class="shell-specular-sweep"></div>
                  <div class="shell-filigree-overlay"></div>
                  <div class="shell-neon-bevels"></div>
                </div>

                <div class="sculpture-ribbon-harness">
                  <div class="ribbon-band ribbon-band-v"></div>
                  <div class="ribbon-band ribbon-band-h"></div>
                  <div class="ribbon-bow-knot">
                    <div class="bow-loop bow-loop-left"></div>
                    <div class="bow-loop bow-loop-right"></div>
                    <div class="bow-center-tie"></div>
                    <div class="bow-tail bow-tail-left"></div>
                    <div class="bow-tail bow-tail-right"></div>
                  </div>
                  <div class="ribbon-clasp-ornament"><span class="clasp-gem">✦</span></div>
                </div>

                <div class="sculpture-articulated-crown">
                  <div class="crown-plate"></div>
                  <div class="crown-filigree"></div>
                  <div class="crown-finial">✦</div>
                  <div class="crown-light-halo"></div>
                </div>

                <div class="sculpture-ground-shadow"></div>
              </div>
            </div>

            <div class="surprise-letter-unfold">
              ${c.gift_photo ? `
                <div class="gift-attachment-photo-wrap">
                  <div class="gift-photo-blur-backdrop" style="background-image: url('${c.gift_photo}');"></div>
                  <img src="${c.gift_photo}" alt="Gift Attachment" class="gift-attachment-img">
                  <div class="gift-photo-sheen"></div>
                </div>
              ` : ''}

              <div class="letter-parchment-inner">
                <div class="letter-wax-seal"><span>✦</span></div>
                <h3 class="font-display letter-headline" style="font-size: clamp(1.4rem, 2.5vw, 1.85rem); margin-bottom: var(--space-4); color: #843d12;">
                  ${c.surprise_title || 'A Special Note'}
                </h3>
                <div class="letter-text" style="white-space: pre-wrap; line-height: 1.6;">${c.surprise_letter || 'May your coming year be filled with wonder and joy.'}</div>
                ${c.signature ? `<div class="letter-signature-signoff">— ${c.signature}</div>` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (scene.scene_type === 'cosmic_universe') {
      const wishes = Array.isArray(c.wishes) ? c.wishes : (c.wishes || 'Joy, Health, Success').split(',').map(w => w.trim());
      const wishesHtml = wishes.map((w, wIdx) => `
        <span class="cosmic-wish-phrase font-serif">
          <span class="wish-star">✦</span> ${w}
        </span>
        ${wIdx < wishes.length - 1 ? '<span class="wish-divider">•</span>' : ''}
      `).join('');

      return `
        <div class="scene-container engine-cosmic finale-style-${c.finale_style || 'grand_celebration'} ${isFirst}" data-scene-type="cosmic_universe" data-scene-id="${scene.id}">
          <div class="finale-deep-atmosphere-gradient"></div>
          <div class="finale-volumetric-light-cone"></div>

          <div class="cosmic-content-wrap finale-layout-${c.layout_variant || 'centered'}">
            <div class="finale-hero-sculpture-stage">
              <div class="sculpted-celestial-halo">
                <div class="halo-ring halo-ring-outer"></div>
                <div class="halo-ring halo-ring-middle"></div>
                <div class="halo-ring halo-ring-inner"></div>
                <div class="halo-light-sweeps"></div>
                <div class="halo-constellation-nodes">
                  <span class="node-star" style="top: 8%; left: 50%;">✦</span>
                  <span class="node-star" style="top: 50%; left: 92%;">✦</span>
                  <span class="node-star" style="top: 92%; left: 50%;">✦</span>
                  <span class="node-star" style="top: 50%; left: 8%;">✦</span>
                </div>
              </div>

              ${c.recipient_photo ? `
                <div class="finale-recipient-portrait-frame">
                  <div class="portrait-blur-backdrop" style="background-image: url('${c.recipient_photo}');"></div>
                  <img src="${c.recipient_photo}" alt="Celebrant Portrait" class="finale-recipient-portrait-img">
                  <div class="portrait-filigree-rim"></div>
                  <div class="portrait-ambient-glow"></div>
                </div>
              ` : `
                <div class="finale-abstract-celestial-centerpiece">
                  <div class="centerpiece-core-orb"></div>
                  <div class="centerpiece-nested-arcs"></div>
                  <div class="centerpiece-monogram font-display">✦</div>
                </div>
              `}
            </div>

            <div class="finale-story-text-container">
              <div class="cosmic-constellation-title font-mono">
                ✦ ${c.constellation_name || 'Constellation of Radiant Memory'} ✦
              </div>

              <h1 class="cosmic-stardust-message font-display" style="color: #fff;">
                ${c.headline || 'Your Starlight Shines Forever'}
              </h1>
              
              ${c.closing_message ? `
                <div class="cosmic-closing-message font-serif" style="white-space: pre-wrap; line-height: 1.6;">
                  ${c.closing_message}
                </div>
              ` : ''}

              <div class="cosmic-wishes-stream">
                ${wishesHtml}
              </div>

              ${c.signature ? `
                <div class="cosmic-signature">
                  — ${c.signature}
                </div>
              ` : ''}
            </div>

            <div class="finale-action-bar">
              <button type="button" class="btn btn-primary btn-lg finale-replay-btn" onclick="window.orchestrator.replayExperience()">
                <span>↺ Replay Celebration</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }
    return '';
  }).join('');

  stageMount.innerHTML = `
    <div class="celebration-viewport" data-theme="${celebration.theme_id || 'midnight_gold'}">
      <canvas id="bgAnimationCanvas" class="bg-animation-canvas"></canvas>
      <canvas id="fxTransitionCanvas" class="fx-transition-canvas"></canvas>

      <div class="viewport-hud">
        <div class="hud-top-bar">
          <button class="hud-pill hud-audio-toggle audio-muted" style="border: none; cursor: pointer;" title="Toggle Ambient Soundtrack" aria-label="Toggle Sound">
            <div class="audio-equalizer">
              <div class="audio-bar"></div>
              <div class="audio-bar"></div>
              <div class="audio-bar"></div>
              <div class="audio-bar"></div>
            </div>
          </button>
        </div>

        <div class="hud-bottom-bar">
          <div class="hud-nav-dots"></div>
        </div>
      </div>

      <div class="viewport-scene-stage">
        ${scenesHtml}
      </div>

      <script id="celebrationAnimationConfig" type="application/json">
        ${JSON.stringify(celebration.animation_config || {})}
      <\/script>
      <script id="celebrationAudioConfig" type="application/json">
        ${JSON.stringify(celebration.audio_config || {})}
      <\/script>
    </div>
  `;
})();
