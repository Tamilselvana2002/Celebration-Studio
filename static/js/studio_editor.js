/**
 * CELEBRATION STUDIO — COMPLETE STORY & CONTENT EDITOR
 * Real-time bidirectional synchronization with live preview viewport,
 * Scene reordering (accessible + Drag/Drop),
 * Full scene content forms (Cinematic, Romantic, Memory Lane, Surprise Gift, Cosmic Finale),
 * Unlimited photo & quote manager with async file uploads,
 * Theme & soundtrack customizer, and publishing workflow.
 */

window.StudioEditor = {
  celebrationId: null,
  csrfToken: null,
  scenes: [],
  activeSceneId: null,
  activeSceneIndex: 0,
  targetUploadIndex: null,
  timelinePlaying: false,
  timelineCurrentTime: 0,
  timelineDuration: 8.0,
  timelineLoop: true,
  timelineAnimFrame: null,
  timelineLastTimestamp: null,
  isScrubbing: false,
  debouncedSaveAudioTimer: null,

  init() {
    const root = document.querySelector('.studio-workbench');
    if (!root) return;

    this.celebrationId = root.dataset.celebrationId;
    this.csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;

    const dataEl = document.getElementById('scenesInitialData');
    if (dataEl) {
      try {
        this.scenes = JSON.parse(dataEl.textContent.trim());
      } catch (e) {
        console.warn('Failed to parse scenesInitialData', e);
      }
    }

    this.bindTabs();
    this.bindDevices();
    this.bindTheme();
    this.bindScenesList();
    this.bindPublishModal();
    this.initTimeline();
    this.initSceneSettings();

    if (this.scenes.length > 0) {
      this.selectScene(this.scenes[0].id);
    }
  },

  bindTabs() {
    const tabBtns = document.querySelectorAll('.studio-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        this.switchTab(target);
      });
    });
  },

  switchTab(tabId) {
    document.querySelectorAll('.studio-tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabId);
    });
    document.querySelectorAll('.studio-tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === tabId);
    });

    if (tabId === 'tab-photos') {
      this.renderPhotosDeck();
    }
  },

  bindDevices() {
    const deviceBtns = document.querySelectorAll('.device-btn');
    const iframe = document.getElementById('previewFrame');
    deviceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        deviceBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const device = btn.dataset.device;
        if (iframe) {
          iframe.className = `preview-iframe device-${device}`;
        }
      });
    });
  },

  bindTheme() {
    const themeSelect = document.getElementById('themeSelect');
    const iframe = document.getElementById('previewFrame');
    if (themeSelect) {
      themeSelect.addEventListener('change', async (e) => {
        const newTheme = e.target.value;
        if (iframe && iframe.contentDocument) {
          iframe.contentDocument.documentElement.setAttribute('data-theme', newTheme);
        }
        
        try {
          await fetch(`/celebrations/${this.celebrationId}/update-theme/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': this.csrfToken
            },
            body: JSON.stringify({ theme_id: newTheme })
          });
          this.setSaveStatus(true);
        } catch (err) {
          console.warn('Theme update error:', err);
        }
      });
    }

    window.selectStudioTheme = (themeId) => {
      const ts = document.getElementById('themeSelect');
      if (ts) {
        ts.value = themeId;
        ts.dispatchEvent(new Event('change'));
      }
      document.querySelectorAll('.theme-card').forEach(c => {
        const isActive = c.dataset.themeId === themeId;
        c.classList.toggle('active-theme', isActive);
        c.style.borderColor = isActive ? 'rgba(56, 225, 255, 0.85)' : 'rgba(255, 255, 255, 0.1)';
        c.style.boxShadow = isActive ? '0 0 20px rgba(56, 225, 255, 0.3)' : '0 4px 14px rgba(0,0,0,0.3)';
      });
      const statusEl = document.getElementById('themeSaveStatus');
      if (statusEl) {
        statusEl.textContent = '✓ Saved';
        setTimeout(() => { statusEl.textContent = ''; }, 2000);
      }
    };
  },

  bindScenesList() {
    const sceneItems = document.querySelectorAll('.scene-item-card');
    sceneItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        const sId = item.dataset.sceneId;
        this.selectScene(sId);
      });
    });

    // Listen to scene change messages from preview iframe
    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'SCENE_CHANGED') {
        const idx = e.data.index;
        if (this.scenes[idx]) {
          this.selectScene(this.scenes[idx].id, false);
        }
      }
    });
  },

  selectScene(sceneId, notifyPreview = true) {
    this.activeSceneId = sceneId;
    const sceneIdx = this.scenes.findIndex(s => s.id === sceneId);
    if (sceneIdx === -1) return;
    this.activeSceneIndex = sceneIdx;
    const scene = this.scenes[sceneIdx];

    // Highlight card in list
    document.querySelectorAll('.scene-item-card').forEach(c => {
      c.classList.toggle('active', c.dataset.sceneId === sceneId);
    });

    // Notify preview iframe
    const iframe = document.getElementById('previewFrame');
    if (notifyPreview && iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'GO_TO_SCENE', index: sceneIdx }, '*');
    }

    // Populate Tab 2 Scene Content Form
    this.populateSceneForm(scene);

    // Synchronize Timeline with current scene
    this.updateTimelineScene(sceneIdx);
  },

  populateSceneForm(scene) {
    const label = document.getElementById('selectedSceneLabel');
    if (label) {
      label.textContent = `Scene ${scene.order + 1}: ${scene.title} (${scene.scene_type})`;
    }

    // Show corresponding panel
    document.querySelectorAll('.scene-editor-panel').forEach(panel => {
      panel.classList.toggle('active', panel.dataset.forType === scene.scene_type);
    });

    const c = scene.content || {};

    if (scene.scene_type === 'cinematic') {
      this.setVal('cinematic_scene_title', scene.title);
      this.setVal('cinematic_prefix', c.title_prefix || '');
      this.setVal('cinematic_name', c.recipient_name || '');
      this.setVal('cinematic_subtitle', c.subtitle || '');
      this.setVal('cinematic_countdown', c.countdown_seconds || 3);
    } else if (scene.scene_type === 'romantic_dream') {
      this.setVal('romantic_scene_title', scene.title);
      this.setVal('romantic_headline', c.headline || '');
      this.setVal('romantic_quote', c.quote || '');
    } else if (scene.scene_type === 'memory_lane') {
      this.setVal('memory_scene_title', scene.title);
      this.setVal('memory_headline', c.headline || '');
    } else if (scene.scene_type === 'secret_surprise') {
      this.setVal('surprise_scene_title', scene.title);
      const style = c.gift_style || 'cosmic_relic';
      this.setVal('surprise_gift_style', style);
      if (typeof window.highlightActiveGiftCard === 'function') {
        window.highlightActiveGiftCard(style);
      }
      this.setVal('surprise_prompt', c.prompt || '');
      this.setVal('surprise_box_color', c.box_color || '#b91c1c');
      this.setVal('surprise_ribbon_color', c.ribbon_color || '#f59e0b');
      this.setVal('surprise_photo', c.gift_photo || '');
      this.setVal('surprise_title', c.surprise_title || '');
      this.setVal('surprise_letter', c.surprise_letter || '');
      this.setVal('surprise_signature', c.signature || '');
    } else if (scene.scene_type === 'cosmic_universe') {
      this.setVal('cosmic_finale_style', c.finale_style || 'grand_celebration');
      this.setVal('cosmic_layout_variant', c.layout_variant || 'centered');
      this.setVal('cosmic_recipient_photo', c.recipient_photo || '');
      this.setVal('cosmic_constellation', c.constellation_name || '');
      this.setVal('cosmic_headline', c.headline || '');
      this.setVal('cosmic_closing', c.closing_message || '');
      this.setVal('cosmic_signature', c.signature || '');
      this.setVal('cosmic_wishes', (c.wishes || []).join(', '));
    }
  },

  setVal(name, val) {
    const el = document.querySelector(`[name="${name}"]`);
    if (el) el.value = val;
  },

  getVal(name) {
    const el = document.querySelector(`[name="${name}"]`);
    return el ? el.value.trim() : '';
  },

  async saveActiveSceneContent() {
    const scene = this.scenes.find(s => s.id === this.activeSceneId);
    if (!scene) return;

    this.setSaveStatus(false, 'Saving...');

    let updatedContent = {};
    let newTitle = scene.title;

    if (scene.scene_type === 'cinematic') {
      newTitle = this.getVal('cinematic_scene_title') || newTitle;
      updatedContent = {
        title_prefix: this.getVal('cinematic_prefix'),
        recipient_name: this.getVal('cinematic_name'),
        subtitle: this.getVal('cinematic_subtitle'),
        countdown_seconds: parseInt(this.getVal('cinematic_countdown'), 10) || 3
      };
    } else if (scene.scene_type === 'romantic_dream') {
      newTitle = this.getVal('romantic_scene_title') || newTitle;
      updatedContent = {
        headline: this.getVal('romantic_headline'),
        quote: this.getVal('romantic_quote')
      };
    } else if (scene.scene_type === 'memory_lane') {
      newTitle = this.getVal('memory_scene_title') || newTitle;
      updatedContent = {
        headline: this.getVal('memory_headline')
      };
    } else if (scene.scene_type === 'secret_surprise') {
      newTitle = this.getVal('surprise_scene_title') || newTitle;
      updatedContent = {
        gift_style: this.getVal('surprise_gift_style') || 'cosmic_relic',
        prompt: this.getVal('surprise_prompt'),
        box_color: this.getVal('surprise_box_color'),
        ribbon_color: this.getVal('surprise_ribbon_color'),
        gift_photo: this.getVal('surprise_photo'),
        surprise_title: this.getVal('surprise_title'),
        surprise_letter: this.getVal('surprise_letter'),
        signature: this.getVal('surprise_signature')
      };
    } else if (scene.scene_type === 'cosmic_universe') {
      updatedContent = {
        finale_style: this.getVal('cosmic_finale_style') || 'grand_celebration',
        layout_variant: this.getVal('cosmic_layout_variant') || 'centered',
        recipient_photo: this.getVal('cosmic_recipient_photo'),
        constellation_name: this.getVal('cosmic_constellation'),
        headline: this.getVal('cosmic_headline'),
        closing_message: this.getVal('cosmic_closing'),
        signature: this.getVal('cosmic_signature'),
        wishes: this.getVal('cosmic_wishes').split(',').map(w => w.trim()).filter(Boolean)
      };
    }

    try {
      const res = await fetch(`/celebrations/${this.celebrationId}/scenes/${scene.id}/update/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.csrfToken
        },
        body: JSON.stringify({
          title: newTitle,
          content: updatedContent
        })
      });
      const data = await res.json();
      if (data.status === 'ok') {
        scene.title = newTitle;
        Object.assign(scene.content, updatedContent);

        // Update title in sidebar list
        const cardTitle = document.querySelector(`.scene-item-card[data-scene-id="${scene.id}"] .scene-item-title`);
        if (cardTitle) cardTitle.textContent = newTitle;

        this.setSaveStatus(true, 'Saved ✓');
        this.reloadPreview();
      }
    } catch (e) {
      console.error('Error saving scene content:', e);
      this.setSaveStatus(false, 'Save Failed ✕');
    }
  },

  // -------------------------------------------------------------
  // TAB 3: UNLIMITED PHOTOS & QUOTES DECK MANAGER
  // -------------------------------------------------------------
  getMemoryLaneScene() {
    return this.scenes.find(s => s.scene_type === 'memory_lane');
  },

  renderPhotosDeck() {
    const memoryScene = this.getMemoryLaneScene();
    const container = document.getElementById('photosDeckList');
    const counter = document.getElementById('photoDeckCount');
    if (!container || !memoryScene) return;

    const memories = memoryScene.content.memories || [];
    if (counter) counter.textContent = `(${memories.length} Memories)`;

    if (memories.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: var(--space-8); color: var(--text-muted); background: rgba(0,0,0,0.2); border-radius: var(--radius-md);">
          <p>No photos or memories added yet.</p>
          <button type="button" class="btn btn-primary btn-sm" style="margin-top: var(--space-3);" onclick="window.StudioEditor.addNewMemoryCard()">
            + Add First Photo
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = memories.map((mem, idx) => `
      <div class="photo-manager-item" data-index="${idx}">
        <div style="display: flex; gap: var(--space-3); margin-bottom: var(--space-3);">
          <img src="${mem.image || '/static/img/memory_stargazing.jpg'}" class="photo-thumb-preview" alt="Preview">
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2);">
              <strong style="color: var(--theme-primary); font-size: var(--text-sm);">Memory #${idx + 1}</strong>
              <div style="display: flex; gap: 4px;">
                <button type="button" class="btn-icon-xs" title="Move Up" onclick="window.StudioEditor.moveMemory(${idx}, -1)">▲</button>
                <button type="button" class="btn-icon-xs" title="Move Down" onclick="window.StudioEditor.moveMemory(${idx}, 1)">▼</button>
                <button type="button" class="btn-icon-xs" title="Remove" style="color: #ef4444;" onclick="window.StudioEditor.deleteMemory(${idx})">✕</button>
              </div>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.StudioEditor.triggerUpload(${idx})">
              📷 Replace / Upload Photo
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); margin-bottom: var(--space-2);">
          <div>
            <label class="form-label" style="font-size: 0.7rem;">Title</label>
            <input type="text" class="form-control mem-title" value="${this.escapeHtml(mem.title || '')}" placeholder="Memory Title">
          </div>
          <div>
            <label class="form-label" style="font-size: 0.7rem;">Timeline Tag / Year</label>
            <input type="text" class="form-control mem-year" value="${this.escapeHtml(mem.year || '')}" placeholder="e.g. 2024 • Kyoto">
          </div>
        </div>

        <div style="margin-bottom: var(--space-2);">
          <label class="form-label" style="font-size: 0.7rem;">Personalized Memory Note / Story</label>
          <textarea class="form-control mem-note" rows="2" placeholder="Write the story behind this moment...">${this.escapeHtml(mem.note || '')}</textarea>
        </div>

        <div>
          <label class="form-label" style="font-size: 0.7rem;">Dedicated Quote for This Photo</label>
          <input type="text" class="form-control mem-quote" value="${this.escapeHtml(mem.quote || '')}" placeholder="e.g. “Joy shared is joy doubled.”">
        </div>
      </div>
    `).join('');
  },

  addNewMemoryCard() {
    const memoryScene = this.getMemoryLaneScene();
    if (!memoryScene) return;

    if (!memoryScene.content.memories) {
      memoryScene.content.memories = [];
    }

    const count = memoryScene.content.memories.length + 1;
    memoryScene.content.memories.push({
      id: `mem_${Date.now()}`,
      title: `Memory Highlight ${count}`,
      year: `Chapter ${count}`,
      tag: 'Cherished',
      note: 'Every memory shared with you holds a special place in my heart.',
      image: '/static/img/memory_stargazing.jpg',
      quote: '“In every shared laughter, there is starlight.”',
      quote_style: 'italic_serif',
      presentation_style: 'polaroid'
    });

    this.renderPhotosDeck();
    this.saveMemoriesDeck();
  },

  deleteMemory(idx) {
    const memoryScene = this.getMemoryLaneScene();
    if (!memoryScene || !memoryScene.content.memories) return;

    memoryScene.content.memories.splice(idx, 1);
    this.renderPhotosDeck();
    this.saveMemoriesDeck();
  },

  moveMemory(idx, dir) {
    const memoryScene = this.getMemoryLaneScene();
    if (!memoryScene || !memoryScene.content.memories) return;

    const list = memoryScene.content.memories;
    const target = idx + dir;
    if (target < 0 || target >= list.length) return;

    const temp = list[idx];
    list[idx] = list[target];
    list[target] = temp;

    this.renderPhotosDeck();
    this.saveMemoriesDeck();
  },

  triggerUpload(idx) {
    this.targetUploadIndex = idx;
    const input = document.getElementById('photoFileInput');
    if (input) input.click();
  },

  async handlePhotoUpload(input) {
    const file = input.files[0];
    if (!file || this.targetUploadIndex === null) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', file.name);

    this.setSaveStatus(false, 'Uploading...');

    try {
      const res = await fetch(`/celebrations/${this.celebrationId}/upload-photo/`, {
        method: 'POST',
        headers: {
          'X-CSRFToken': this.csrfToken
        },
        body: formData
      });
      const data = await res.json();
      if (data.status === 'ok') {
        const memoryScene = this.getMemoryLaneScene();
        if (memoryScene && memoryScene.content.memories[this.targetUploadIndex]) {
          memoryScene.content.memories[this.targetUploadIndex].image = data.file_url;
          this.renderPhotosDeck();
          this.saveMemoriesDeck();
        }
      }
    } catch (e) {
      console.error('Photo upload error:', e);
      this.setSaveStatus(false, 'Upload Failed ✕');
    } finally {
      input.value = '';
    }
  },

  async saveMemoriesDeck() {
    const memoryScene = this.getMemoryLaneScene();
    if (!memoryScene) return;

    // Read values from form DOM into memory objects
    const items = document.querySelectorAll('.photo-manager-item');
    items.forEach((item, idx) => {
      if (memoryScene.content.memories[idx]) {
        memoryScene.content.memories[idx].title = item.querySelector('.mem-title')?.value.trim() || '';
        memoryScene.content.memories[idx].year = item.querySelector('.mem-year')?.value.trim() || '';
        memoryScene.content.memories[idx].note = item.querySelector('.mem-note')?.value.trim() || '';
        memoryScene.content.memories[idx].quote = item.querySelector('.mem-quote')?.value.trim() || '';
      }
    });

    this.setSaveStatus(false, 'Saving...');

    try {
      const res = await fetch(`/celebrations/${this.celebrationId}/scenes/${memoryScene.id}/update/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.csrfToken
        },
        body: JSON.stringify({
          content: {
            memories: memoryScene.content.memories
          }
        })
      });
      const data = await res.json();
      if (data.status === 'ok') {
        this.setSaveStatus(true, 'Saved ✓');
        this.reloadPreview();
      }
    } catch (e) {
      console.error('Error saving memories:', e);
      this.setSaveStatus(false, 'Save Failed ✕');
    }
  },

  // -------------------------------------------------------------
  // SCENE REORDERING & CREATION
  // -------------------------------------------------------------
  async moveScene(sceneId, direction) {
    const idx = this.scenes.findIndex(s => s.id === sceneId);
    if (idx === -1) return;
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= this.scenes.length) return;

    // Swap scenes
    const temp = this.scenes[idx];
    this.scenes[idx] = this.scenes[targetIdx];
    this.scenes[targetIdx] = temp;

    // Re-render scene list in DOM
    this.renderScenesList();

    // Persist reorder to server
    try {
      await fetch(`/celebrations/${this.celebrationId}/reorder-scenes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.csrfToken
        },
        body: JSON.stringify({
          scene_ids: this.scenes.map(s => s.id)
        })
      });
      this.setSaveStatus(true, 'Order Saved ✓');
      this.reloadPreview();
    } catch (e) {
      console.error('Scene reorder error:', e);
    }
  },

  renderScenesList() {
    const container = document.getElementById('scenesContainer');
    if (!container) return;

    container.innerHTML = this.scenes.map((scene, idx) => `
      <div class="scene-item-card ${scene.id === this.activeSceneId ? 'active' : ''}" data-scene-id="${scene.id}" data-scene-type="${scene.scene_type}" data-scene-index="${idx}" onclick="window.StudioEditor.selectScene('${scene.id}')">
        <div class="scene-badge-order">${idx + 1}</div>
        <div class="scene-item-meta">
          <div class="scene-item-title">${this.escapeHtml(scene.title)}</div>
          <div class="scene-item-type">${this.getSceneTypeLabel(scene.scene_type)}</div>
        </div>
        <div class="scene-reorder-actions" onclick="event.stopPropagation()">
          <button type="button" class="btn-icon-xs" title="Move Up" onclick="window.StudioEditor.moveScene('${scene.id}', -1)">▲</button>
          <button type="button" class="btn-icon-xs" title="Move Down" onclick="window.StudioEditor.moveScene('${scene.id}', 1)">▼</button>
        </div>
      </div>
    `).join('');
  },

  getSceneTypeLabel(type) {
    const labels = {
      cinematic: '🎬 Cinematic Prelude',
      romantic_dream: '🌸 Romantic Dream World',
      memory_lane: '📷 Memory Lane Timeline',
      secret_surprise: '🎁 Interactive Gift Box',
      cosmic_universe: '🌌 Cosmic Finale & Signature'
    };
    return labels[type] || type;
  },

  async addScene(type, title) {
    try {
      const res = await fetch(`/celebrations/${this.celebrationId}/add-scene/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.csrfToken
        },
        body: JSON.stringify({ scene_type: type, title: title })
      });
      const data = await res.json();
      if (data.status === 'ok') {
        this.scenes.push({
          id: data.scene_id,
          scene_type: data.scene_type,
          title: data.title,
          order: data.order,
          content: {}
        });
        this.renderScenesList();
        this.selectScene(data.scene_id);
        this.reloadPreview();
      }
    } catch (e) {
      console.error('Error adding scene:', e);
    }
  },

  setSaveStatus(isSaved, text = null) {
    const el = document.getElementById('saveStatusIndicator');
    if (!el) return;
    el.className = `save-status-indicator ${isSaved ? 'saved' : 'saving'}`;
    el.innerHTML = `<span class="status-dot">●</span> <span>${text || (isSaved ? 'Saved' : 'Saving...')}</span>`;
  },

  reloadPreview() {
    const iframe = document.getElementById('previewFrame');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.location.reload();
    }
  },

  bindPublishModal() {
    const copyBtn = document.getElementById('copyShareLinkBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const url = copyBtn.dataset.url;
        if (navigator.clipboard && url) {
          navigator.clipboard.writeText(url).then(() => {
            const original = copyBtn.textContent;
            copyBtn.textContent = 'Copied to Clipboard! ✓';
            setTimeout(() => { copyBtn.textContent = original; }, 2000);
          });
        }
      });
    }
  },

  escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  /* ==============================================================
     PHASE 5: REAL-TIME MULTI-TRACK ANIMATION TIMELINE ENGINE
     ============================================================== */
  initTimeline() {
    const stage = document.getElementById('tlTracksStage');
    const ruler = document.getElementById('tlRuler');

    if (ruler && stage) {
      const handleScrub = (e) => {
        const rect = stage.getBoundingClientRect();
        let clientX = e.clientX;
        if (e.touches && e.touches.length > 0) clientX = e.touches[0].clientX;
        const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
        const ratio = offsetX / rect.width;
        this.seekTimeline(ratio * this.timelineDuration, true);
      };

      ruler.addEventListener('mousedown', (e) => {
        this.isScrubbing = true;
        handleScrub(e);
        const onMouseMove = (moveEvt) => {
          if (this.isScrubbing) handleScrub(moveEvt);
        };
        const onMouseUp = () => {
          this.isScrubbing = false;
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });

      ruler.addEventListener('touchstart', (e) => {
        this.isScrubbing = true;
        handleScrub(e);
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (this.isScrubbing) handleScrub(e);
      }, { passive: true });

      window.addEventListener('touchend', () => {
        this.isScrubbing = false;
      });
    }

    // Spacebar to toggle timeline playback
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlayTimeline();
      }
    });

    this.updateTimelineScene(this.activeSceneIndex);
  },

  updateTimelineScene(sceneIdx) {
    const scene = this.scenes[sceneIdx];
    const titleEl = document.getElementById('tlCurrentSceneTitle');
    if (titleEl && scene) {
      titleEl.textContent = `Scene ${sceneIdx + 1}: ${scene.title || scene.scene_type}`;
    }
    this.seekTimeline(0, false);
  },

  togglePlayTimeline() {
    if (this.timelinePlaying) {
      this.pauseTimeline();
    } else {
      this.playTimeline();
    }
  },

  playTimeline() {
    this.timelinePlaying = true;
    const playBtn = document.getElementById('tlBtnPlay');
    if (playBtn) {
      playBtn.textContent = '⏸';
      playBtn.classList.add('playing');
    }
    this.timelineLastTimestamp = performance.now();

    const iframe = document.getElementById('previewFrame');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'PLAY_SCENE', index: this.activeSceneIndex }, '*');
    }

    const step = (timestamp) => {
      if (!this.timelinePlaying) return;
      const dt = (timestamp - this.timelineLastTimestamp) / 1000;
      this.timelineLastTimestamp = timestamp;

      let nextTime = this.timelineCurrentTime + dt;
      if (nextTime >= this.timelineDuration) {
        if (this.timelineLoop) {
          nextTime = 0;
          this.seekTimeline(0, true);
        } else {
          this.pauseTimeline();
          this.nextSceneTimeline();
          return;
        }
      } else {
        this.seekTimeline(nextTime, false);
      }

      this.timelineAnimFrame = requestAnimationFrame(step);
    };

    this.timelineAnimFrame = requestAnimationFrame(step);
  },

  pauseTimeline() {
    this.timelinePlaying = false;
    if (this.timelineAnimFrame) {
      cancelAnimationFrame(this.timelineAnimFrame);
      this.timelineAnimFrame = null;
    }
    const playBtn = document.getElementById('tlBtnPlay');
    if (playBtn) {
      playBtn.textContent = '▶';
      playBtn.classList.remove('playing');
    }
    const iframe = document.getElementById('previewFrame');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'PAUSE_SCENE', index: this.activeSceneIndex }, '*');
    }
  },

  restartTimeline() {
    this.seekTimeline(0, true);
    const iframe = document.getElementById('previewFrame');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'RESTART_SCENE', index: this.activeSceneIndex }, '*');
    }
  },

  seekTimeline(timeSec, notifyIframe = true) {
    this.timelineCurrentTime = Math.max(0, Math.min(this.timelineDuration, timeSec));
    const ratio = this.timelineCurrentTime / this.timelineDuration;
    const playhead = document.getElementById('tlPlayhead');
    if (playhead) {
      playhead.style.left = `${(ratio * 100).toFixed(2)}%`;
    }

    const currentCode = document.getElementById('tlTimecodeCurrent');
    if (currentCode) {
      const minutes = Math.floor(this.timelineCurrentTime / 60);
      const seconds = Math.floor(this.timelineCurrentTime % 60);
      const centis = Math.floor((this.timelineCurrentTime % 1) * 100);
      currentCode.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
    }

    if (notifyIframe) {
      const iframe = document.getElementById('previewFrame');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'SEEK_TIME',
          time: this.timelineCurrentTime,
          ratio: ratio,
          index: this.activeSceneIndex
        }, '*');
      }
    }
  },

  nextSceneTimeline() {
    if (this.activeSceneIndex < this.scenes.length - 1) {
      this.selectScene(this.scenes[this.activeSceneIndex + 1].id);
    } else {
      this.selectScene(this.scenes[0].id);
    }
  },

  toggleLoopTimeline() {
    this.timelineLoop = !this.timelineLoop;
    const loopBtn = document.getElementById('tlBtnLoop');
    if (loopBtn) {
      loopBtn.classList.toggle('active', this.timelineLoop);
    }
  },

  toggleTimelineDock() {
    const dock = document.getElementById('studioTimelineDock');
    const icon = document.getElementById('tlCollapseIcon');
    if (dock) {
      dock.classList.toggle('collapsed');
      if (icon) {
        icon.textContent = dock.classList.contains('collapsed') ? '▴' : '▾';
      }
    }
  },

  /* ==============================================================
     PHASE 5: FLOATING SCENE SETTINGS INSPECTOR
     Matches 10_editor_scene_settings.jpg
     ============================================================== */
  initSceneSettings() {
    const volSlider = document.getElementById('audioVolumeSlider');
    const quickVol = document.getElementById('quickVolumeSlider');
    const quickPercent = document.getElementById('quickVolumePercent');
    if (volSlider && quickVol) {
      const val = Math.round(parseFloat(volSlider.value || 0.75) * 100);
      quickVol.value = val;
      if (quickPercent) quickPercent.textContent = `${val}%`;
    }

    const scrTrans = document.getElementById('animScreenTransition');
    const quickTrans = document.getElementById('quickSceneTransition');
    if (scrTrans && quickTrans) {
      quickTrans.value = scrTrans.value;
    }
  },

  toggleSceneSettings() {
    const modal = document.getElementById('sceneSettingsModal');
    if (!modal) return;
    const isHidden = modal.style.display === 'none' || !modal.style.display;
    modal.style.display = isHidden ? 'block' : 'none';
  },

  quickToggleMusic(enabled) {
    const loopToggle = document.getElementById('audioLoopToggle');
    if (loopToggle) loopToggle.checked = enabled;

    const iframe = document.getElementById('previewFrame');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'AUDIO_MUTE_TOGGLE',
        muted: !enabled
      }, '*');
    }
    this.saveQuickAudio();
  },

  quickUpdateVolume(val) {
    const percentEl = document.getElementById('quickVolumePercent');
    if (percentEl) percentEl.textContent = `${val}%`;
    const floatVal = (parseFloat(val) / 100).toFixed(2);
    const audioVolSlider = document.getElementById('audioVolumeSlider');
    const audioVolVal = document.getElementById('audioVolumeVal');
    if (audioVolSlider) audioVolSlider.value = floatVal;
    if (audioVolVal) audioVolVal.textContent = floatVal;

    const iframe = document.getElementById('previewFrame');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'AUDIO_VOLUME_CHANGE',
        volume: parseFloat(floatVal)
      }, '*');
    }
    this.debouncedSaveAudio();
  },

  quickUpdateTransition(transId) {
    const scrTrans = document.getElementById('animScreenTransition');
    if (scrTrans) {
      scrTrans.value = transId;
    }
    const iframe = document.getElementById('previewFrame');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'UPDATE_ANIMATION_CONFIG',
        config: { screen_transition: transId }
      }, '*');
    }
    this.saveQuickAnimation({ screen_transition: transId });
  },

  quickUpdateStyle(styleId) {
    const presetMap = {
      cinematic: 'preset_cinematic_gold',
      romantic: 'preset_romantic_dream',
      memory: 'preset_memory_atelier',
      surprise: 'preset_secret_treasure',
      cosmic: 'preset_cosmic_starlight'
    };
    const presetId = presetMap[styleId] || 'preset_cinematic_gold';
    const presetSelect = document.getElementById('animPresetSelect');
    if (presetSelect) {
      presetSelect.value = presetId;
      if (typeof window.handleAnimPresetChange === 'function') {
        window.handleAnimPresetChange(presetId);
      }
    }
    this.saveQuickAnimation({ preset_id: presetId });
  },

  async saveQuickAudio() {
    const statusEl = document.getElementById('quickSettingsStatus');
    if (statusEl) statusEl.textContent = 'Saving audio...';
    if (typeof window.saveAudioSettings === 'function') {
      await window.saveAudioSettings();
    }
    if (statusEl) statusEl.textContent = '✓ Real-time synced';
  },

  debouncedSaveAudio() {
    clearTimeout(this.debouncedSaveAudioTimer);
    this.debouncedSaveAudioTimer = setTimeout(() => {
      this.saveQuickAudio();
    }, 600);
  },

  async saveQuickAnimation(overrideConfig = {}) {
    const statusEl = document.getElementById('quickSettingsStatus');
    if (statusEl) statusEl.textContent = 'Saving animation...';
    if (typeof window.saveAnimationSettings === 'function') {
      await window.saveAnimationSettings();
    }
    if (statusEl) statusEl.textContent = '✓ Real-time synced';
  },

  applySceneSettings() {
    this.toggleSceneSettings();
    this.setSaveStatus(true, 'Scene Settings Applied ✓');
  }
};

const ANIM_PRESET_MAPPINGS = {
  cinematic_luxury: {
    desc: 'Dramatic golden light sweeps, 3D card shuffle, and champagne dust atmosphere.',
    screen: 'screen.light_sweep',
    image: 'image.floating_memory',
    bg: 'background.golden_dust',
    gift: 'gift.magical_light',
    finale: 'finale.grand_celebration',
    intensity: 'cinematic',
    speed: '1.0'
  },
  magical_dream: {
    desc: 'Silk wave reveals, stardust particle assembly, and ethereal dream clouds.',
    screen: 'screen.liquid_silk',
    image: 'image.particle_formation',
    bg: 'background.dream_clouds',
    gift: 'gift.ribbon_unwrap',
    finale: 'finale.heart_of_light',
    intensity: 'cinematic',
    speed: '1.0'
  },
  romantic_glow: {
    desc: 'Petal curtain cascades, camera lens focus pull, and warm candlelight flicker.',
    screen: 'screen.petal_curtain',
    image: 'image.camera_focus',
    bg: 'background.candlelight',
    gift: 'gift.blooming',
    finale: 'finale.heart_of_light',
    intensity: 'balanced',
    speed: '1.0'
  },
  memory_lane: {
    desc: 'Vintage memory film wipe, physical album page turn, and candlelit stories.',
    screen: 'screen.memory_film',
    image: 'image.album_page_turn',
    bg: 'background.candlelight',
    gift: 'gift.enchanted_chest',
    finale: 'finale.animated_letter',
    intensity: 'balanced',
    speed: '1.0'
  },
  cosmic_universe: {
    desc: 'Deep space universe warp, celestial memory orbits, and infinite starfield.',
    screen: 'screen.universe_warp',
    image: 'image.memory_universe',
    bg: 'background.starfield',
    gift: 'gift.cosmic_portal',
    finale: 'finale.universe',
    intensity: 'cinematic',
    speed: '1.0'
  },
  celebration_burst: {
    desc: 'Energetic portal reveals, angled cinematic wipes, and exuberant fireworks.',
    screen: 'screen.portal_open',
    image: 'image.cinematic_wipe',
    bg: 'background.aurora',
    gift: 'gift.magical_light',
    finale: 'finale.grand_celebration',
    intensity: 'cinematic',
    speed: '1.2'
  },
  quiet_emotional: {
    desc: 'Subtle optical focus, gentle candle breathing, and serene keepsake letter.',
    screen: 'screen.light_sweep',
    image: 'image.camera_focus',
    bg: 'background.candlelight',
    gift: 'gift.ribbon_unwrap',
    finale: 'finale.quiet_emotional',
    intensity: 'subtle',
    speed: '0.8'
  },
  minimal_elegant: {
    desc: 'High-framerate crisp fades, gentle card drift, and clean liquid glass caustics.',
    screen: 'screen.light_sweep',
    image: 'image.floating_memory',
    bg: 'background.liquid_glass',
    gift: 'gift.ribbon_unwrap',
    finale: 'finale.quiet_emotional',
    intensity: 'subtle',
    speed: '1.0'
  }
};

window.handleAnimPresetChange = (presetId) => {
  const p = ANIM_PRESET_MAPPINGS[presetId];
  if (!p) return;

  const descEl = document.getElementById('animPresetDesc');
  if (descEl) descEl.textContent = p.desc;

  const screenEl = document.getElementById('animScreenTransition');
  if (screenEl) screenEl.value = p.screen;

  const imgEl = document.getElementById('animImageTransition');
  if (imgEl) imgEl.value = p.image;

  const bgEl = document.getElementById('animBackgroundEffect');
  if (bgEl) bgEl.value = p.bg;

  const giftEl = document.getElementById('animGiftEffect');
  if (giftEl) giftEl.value = p.gift;

  const finaleEl = document.getElementById('animFinaleEffect');
  if (finaleEl) finaleEl.value = p.finale;

  const intensityEl = document.getElementById('animIntensity');
  if (intensityEl) intensityEl.value = p.intensity;

  const speedEl = document.getElementById('animSpeed');
  if (speedEl) speedEl.value = p.speed;

  // Live broadcast to preview frame
  const iframe = document.getElementById('previewFrame');
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({
      type: 'UPDATE_ANIMATION_CONFIG',
      config: {
        preset_id: presetId,
        screen_transition: p.screen,
        image_transition: p.image,
        background_effect: p.bg,
        gift_effect: p.gift,
        finale_effect: p.finale,
        intensity: p.intensity,
        speed: parseFloat(p.speed)
      }
    }, '*');
  }
};

window.saveAnimationSettings = async () => {
  window.StudioEditor.setSaveStatus('saving');

  const payload = {
    preset_id: document.getElementById('animPresetSelect')?.value,
    screen_transition: document.getElementById('animScreenTransition')?.value,
    image_transition: document.getElementById('animImageTransition')?.value,
    background_effect: document.getElementById('animBackgroundEffect')?.value,
    gift_effect: document.getElementById('animGiftEffect')?.value,
    finale_effect: document.getElementById('animFinaleEffect')?.value,
    intensity: document.getElementById('animIntensity')?.value,
    speed: parseFloat(document.getElementById('animSpeed')?.value || '1.0'),
    respect_reduced_motion: true
  };

  try {
    const res = await fetch(`/celebrations/${window.StudioEditor.celebrationId}/update-animations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': window.StudioEditor.csrfToken
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.status === 'ok') {
      window.StudioEditor.setSaveStatus('saved');

      // Sync updated config into iframe
      const iframe = document.getElementById('previewFrame');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'UPDATE_ANIMATION_CONFIG',
          config: data.animation_config
        }, '*');
      }
    } else {
      window.StudioEditor.setSaveStatus('error');
      alert('Could not save animation configuration: ' + (data.message || 'Error'));
    }
  } catch (err) {
    console.error('Save animation settings failed:', err);
    window.StudioEditor.setSaveStatus('error');
  }
};

window.testScreenTransition = () => {
  const iframe = document.getElementById('previewFrame');
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({
      type: 'TEST_TRANSITION'
    }, '*');
  }
};

// Global helper bindings for template onclick handlers
window.switchTab = (tab) => window.StudioEditor.switchTab(tab);
window.moveSceneUp = (id) => window.StudioEditor.moveScene(id, -1);
window.moveSceneDown = (id) => window.StudioEditor.moveScene(id, 1);
window.saveActiveSceneContent = () => window.StudioEditor.saveActiveSceneContent();
window.addNewMemoryCard = () => window.StudioEditor.addNewMemoryCard();
window.saveMemoriesDeck = () => window.StudioEditor.saveMemoriesDeck();
window.handlePhotoUpload = (input) => window.StudioEditor.handlePhotoUpload(input);

window.openAddSceneDialog = () => {
  const dialog = document.getElementById('addSceneDialog');
  if (dialog) dialog.showModal();
};

window.confirmAddScene = () => {
  const type = document.getElementById('newSceneTypeSelect')?.value || 'memory_lane';
  const title = document.getElementById('newSceneTitleInput')?.value.trim() || 'New Scene';
  window.StudioEditor.addScene(type, title);
  document.getElementById('addSceneDialog')?.close();
};

window.handlePublishToggle = async (isPublished) => {
  const password = document.getElementById('publishPasswordInput')?.value.trim() || '';
  const formData = new FormData();
  formData.append('is_published', isPublished ? 'true' : 'false');
  formData.append('password', password);

  try {
    const res = await fetch(`/celebrations/${window.StudioEditor.celebrationId}/publish-toggle/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': window.StudioEditor.csrfToken
      },
      body: formData
    });
    const data = await res.json();
    if (data.status === 'ok') {
      const btn = document.getElementById('publishModalBtn');
      if (btn) {
        btn.textContent = 'Published ✓';
        btn.className = 'btn btn-secondary btn-sm';
      }
      document.getElementById('publishDialog')?.close();
    }
  } catch (e) {
    console.error('Publish error:', e);
  }
};

// AUDIO & SOUNDTRACK STUDIO HANDLERS
window.handleAudioUpload = async (input) => {
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  const statusEl = document.getElementById('audioUploadStatus');
  if (statusEl) {
    statusEl.style.display = 'block';
    statusEl.textContent = `Uploading "${file.name}"...`;
  }

  const formData = new FormData();
  formData.append('audio_file', file);

  try {
    const res = await fetch(`/celebrations/${window.StudioEditor.celebrationId}/upload-audio/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': window.StudioEditor.csrfToken
      },
      body: formData
    });
    const data = await res.json();
    if (data.status === 'ok') {
      if (statusEl) {
        statusEl.textContent = `✓ Uploaded: ${file.name}`;
      }
      const previewBlock = document.getElementById('customAudioPreviewBlock');
      const previewPlayer = document.getElementById('customAudioPreviewPlayer');
      if (previewBlock && previewPlayer) {
        previewBlock.style.display = 'block';
        previewPlayer.src = data.audio_url;
      }
      const sourceTypeSel = document.getElementById('audioSourceType');
      if (sourceTypeSel) sourceTypeSel.value = 'custom';
      
      window.StudioEditor.setSaveStatus(true);

      // Notify preview frame if open
      const iframe = document.getElementById('previewFrame');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'AUDIO_CONFIG_UPDATED',
          audioConfig: data.audio_config
        }, '*');
      }
    } else {
      if (statusEl) statusEl.textContent = `Error: ${data.message || 'Upload failed'}`;
    }
  } catch (err) {
    console.error('Audio upload error:', err);
    if (statusEl) statusEl.textContent = 'Upload error. Please try another file.';
  }
};

window.updateAudioSourceType = (type) => {
  const previewBlock = document.getElementById('customAudioPreviewBlock');
  if (previewBlock) {
    previewBlock.style.display = (type === 'custom') ? 'block' : 'none';
  }
};

window.updateAudioVolume = (val) => {
  const lbl = document.getElementById('audioVolumeVal');
  if (lbl) lbl.textContent = parseFloat(val).toFixed(2);
  const iframe = document.getElementById('previewFrame');
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({
      type: 'SET_AUDIO_VOLUME',
      volume: parseFloat(val)
    }, '*');
  }
};

window.updateAudioLoop = (isLooped) => {
  // Real-time notification if desired
};

window.highlightActiveGiftCard = (styleKey) => {
  document.querySelectorAll('.gift-box-card').forEach(card => {
    card.classList.toggle('active', card.dataset.style === styleKey);
  });
};

window.selectGiftBoxStyle = (styleKey) => {
  const input = document.getElementById('surpriseGiftStyleInput') || document.querySelector('[name="surprise_gift_style"]');
  if (input) input.value = styleKey;

  window.highlightActiveGiftCard(styleKey);

  // Sync animation select if present
  const animGiftSelect = document.getElementById('animGiftEffect');
  if (animGiftSelect) {
    animGiftSelect.value = `gift.${styleKey}`;
  }

  // Real-time live preview update into iframe
  const iframe = document.getElementById('previewFrame');
  if (iframe && iframe.contentDocument) {
    const sceneContainer = iframe.contentDocument.querySelector('.engine-surprise');
    if (sceneContainer) {
      const classes = Array.from(sceneContainer.classList).filter(c => !c.startsWith('gift-style-'));
      classes.push(`gift-style-${styleKey}`);
      sceneContainer.className = classes.join(' ');
      sceneContainer.dataset.giftStyle = styleKey;
    }
  }
};

window.saveAudioSettings = async () => {
  window.StudioEditor.setSaveStatus(false, 'Saving audio...');
  const sourceType = document.getElementById('audioSourceType')?.value || 'preset';
  const volume = parseFloat(document.getElementById('audioVolumeSlider')?.value || 0.75);
  const loop = document.getElementById('audioLoopToggle')?.checked ?? true;

  try {
    const res = await fetch(`/celebrations/${window.StudioEditor.celebrationId}/update-audio/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': window.StudioEditor.csrfToken
      },
      body: JSON.stringify({
        source_type: sourceType,
        volume: volume,
        loop: loop
      })
    });
    const data = await res.json();
    if (data.status === 'ok') {
      window.StudioEditor.setSaveStatus(true);
      const iframe = document.getElementById('previewFrame');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'AUDIO_CONFIG_UPDATED',
          audioConfig: data.audio_config
        }, '*');
      }
    } else {
      window.StudioEditor.setSaveStatus('error');
    }
  } catch (err) {
    console.error('Audio update error:', err);
    window.StudioEditor.setSaveStatus('error');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.StudioEditor.init();
});

