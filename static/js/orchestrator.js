/**
 * CELEBRATION STUDIO — SCENE ORCHESTRATOR
 * Coordinates scene lifecycle, cinematic transitions via AnimationController,
 * audio controller, HUD, and live studio sync.
 */

import { CinematicEngine } from './engines/cinematic.js';
import { RomanticDreamEngine } from './engines/romantic_dream.js';
import { MemoryLaneEngine } from './engines/memory_lane.js';
import { SecretSurpriseEngine } from './engines/secret_surprise.js';
import { CosmicUniverseEngine } from './engines/cosmic_universe.js';
import { AnimationController } from './animation_controller.js';

export class SceneOrchestrator {
  constructor(viewportElement) {
    this.viewport = viewportElement;
    this.scenes = Array.from(this.viewport.querySelectorAll('.scene-container'));
    this.currentIndex = 0;
    this.activeEngine = null;
    this.isTransitioning = false;

    // Layer B Animation Controller
    this.animationController = new AnimationController(this.viewport);

    // HUD Elements
    this.dotsContainer = this.viewport.querySelector('.hud-nav-dots');
    this.prevBtn = this.viewport.querySelector('.hud-prev-btn');
    this.nextBtn = this.viewport.querySelector('.hud-next-btn');
    this.audioToggle = this.viewport.querySelector('.hud-audio-toggle');
    this.skipIntroBtn = this.viewport.querySelector('.hud-skip-intro-btn');
    this.fullscreenBtn = this.viewport.querySelector('.hud-fullscreen-btn');

    this.engineRegistry = {
      cinematic: CinematicEngine,
      romantic_dream: RomanticDreamEngine,
      memory_lane: MemoryLaneEngine,
      secret_surprise: SecretSurpriseEngine,
      cosmic_universe: CosmicUniverseEngine
    };
  }

  init() {
    if (this.scenes.length === 0) return;

    this.bindEvents();
    this.renderHUD();
    this.activateScene(0, false);
    this.autoStartAudio();

    // Sync listener for Experience Studio iframe communication
    window.addEventListener('message', (e) => {
      if (!e.data) return;
      if (e.data.type === 'GO_TO_SCENE') {
        const target = parseInt(e.data.index, 10);
        if (!isNaN(target) && target >= 0 && target < this.scenes.length) {
          this.activateScene(target);
        }
      } else if (e.data.type === 'UPDATE_ANIMATION_CONFIG') {
        if (e.data.config) {
          this.animationController.updateConfig(e.data.config);
        }
      } else if (e.data.type === 'TEST_TRANSITION') {
        if (this.scenes.length > 1) {
          const nextIdx = (this.currentIndex + 1) % this.scenes.length;
          this.activateScene(nextIdx, true);
        }
      } else if (e.data.type === 'PLAY_SCENE') {
        if (this.activeEngine && typeof this.activeEngine.resume === 'function') {
          this.activeEngine.resume();
        }
        if (window.CelebrationAudio && typeof window.CelebrationAudio.play === 'function') {
          window.CelebrationAudio.play();
        }
      } else if (e.data.type === 'PAUSE_SCENE') {
        if (this.activeEngine && typeof this.activeEngine.pause === 'function') {
          this.activeEngine.pause();
        }
        if (window.CelebrationAudio && typeof window.CelebrationAudio.pause === 'function') {
          window.CelebrationAudio.pause();
        }
      } else if (e.data.type === 'RESTART_SCENE') {
        this.activateScene(this.currentIndex, true);
      } else if (e.data.type === 'SEEK_TIME') {
        const ratio = parseFloat(e.data.ratio) || 0;
        if (this.activeEngine && typeof this.activeEngine.seek === 'function') {
          this.activeEngine.seek(ratio);
        }
      } else if (e.data.type === 'AUDIO_MUTE_TOGGLE') {
        if (window.CelebrationAudio) {
          if (e.data.muted) {
            window.CelebrationAudio.mute();
          } else {
            window.CelebrationAudio.unmute();
          }
        }
      } else if (e.data.type === 'AUDIO_VOLUME_CHANGE') {
        if (window.CelebrationAudio && typeof window.CelebrationAudio.setVolume === 'function') {
          window.CelebrationAudio.setVolume(e.data.volume);
        }
      }
    });
  }

  bindEvents() {
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextScene());
    }
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevScene());
    }
    if (this.audioToggle) {
      this.audioToggle.addEventListener('click', () => {
        if (window.CelebrationAudio) {
          const isUnmuted = window.CelebrationAudio.toggleMute();
          this.audioToggle.classList.toggle('audio-muted', !isUnmuted);
        }
      });
    }
    if (this.skipIntroBtn) {
      this.skipIntroBtn.addEventListener('click', () => {
        if (this.scenes.length > 1) {
          this.activateScene(1);
        }
      });
    }
    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    // Keyboard navigation (Enter, Arrow keys, Space, PageDown)
    window.addEventListener('keydown', (e) => {
      // If user is actively typing in an input or textarea, don't trigger navigation
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      const activeScene = this.scenes[this.currentIndex];
      const isMemoryLane = activeScene && activeScene.dataset.sceneType === 'memory_lane';

      if (e.key === 'Enter') {
        // If on Memory Lane, let MemoryLaneEngine cycle through memories first
        // If it's on the last memory or any other scene, advance to next scene
        if (isMemoryLane && this.activeEngine && this.activeEngine.slides) {
          if (this.activeEngine.currentIndex === this.activeEngine.slides.length - 1) {
            this.nextScene();
          } else {
            this.activeEngine.nextSlide();
          }
        } else {
          this.nextScene();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        if (!isMemoryLane) {
          this.nextScene();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (!isMemoryLane) {
          this.prevScene();
        }
      }
    });

    // Touch swipe handling with gesture conflict avoidance
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchIgnored = false;

    this.viewport.addEventListener('touchstart', (e) => {
      // Avoid intercepting touches on 3D WebGL gift box or stage
      if (e.target.closest('#giftThreeContainer, .gift-three-canvas-wrap, .sculpture-stage-viewport')) {
        isTouchIgnored = true;
        return;
      }
      isTouchIgnored = false;
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });

    this.viewport.addEventListener('touchend', (e) => {
      if (isTouchIgnored) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchStartX - touchEndX;
      const deltaY = touchStartY - touchEndY;

      // Only navigate if horizontal swipe is intentional and exceeds vertical motion
      if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX > 0) {
          this.nextScene();
        } else {
          this.prevScene();
        }
      }
    }, { passive: true });
  }

  autoStartAudio() {
    if (!window.CelebrationAudio) return;

    let hasStarted = false;
    const startAudio = () => {
      if (hasStarted) return;
      hasStarted = true;
      if (window.CelebrationAudio) {
        window.CelebrationAudio.unmute();
        if (this.audioToggle) {
          this.audioToggle.classList.remove('audio-muted');
        }
      }
      ['pointerdown', 'touchstart', 'click', 'keydown', 'wheel'].forEach(evt => {
        window.removeEventListener(evt, startAudio, { capture: true });
        document.removeEventListener(evt, startAudio, { capture: true });
      });
    };

    // 1. Attempt immediate autoplay (works on platforms/browsers with permissive autoplay)
    try {
      window.CelebrationAudio.unmute();
      if (this.audioToggle) {
        this.audioToggle.classList.remove('audio-muted');
      }
    } catch (e) {
      // Browser autoplay policy might restrict until user interaction
    }

    // 2. Seamlessly unlock & play on the very first touch/click/key anywhere on the page
    ['pointerdown', 'touchstart', 'click', 'keydown', 'wheel'].forEach(evt => {
      window.addEventListener(evt, startAudio, { capture: true, once: true });
      document.addEventListener(evt, startAudio, { capture: true, once: true });
    });
  }

  renderHUD() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    this.scenes.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = `hud-dot ${i === this.currentIndex ? 'active' : ''}`;
      dot.setAttribute('title', `Scene ${i + 1}`);
      dot.addEventListener('click', () => this.activateScene(i));
      this.dotsContainer.appendChild(dot);
    });
  }

  activateScene(targetIndex, animate = true) {
    if (targetIndex < 0 || targetIndex >= this.scenes.length || this.isTransitioning) return;
    this.isTransitioning = true;

    const oldScene = this.scenes[this.currentIndex];
    const newScene = this.scenes[targetIndex];

    // Cleanup previous engine
    if (this.activeEngine) {
      try {
        this.activeEngine.destroy();
      } catch (err) {
        console.warn('Engine destroy error:', err);
      }
      this.activeEngine = null;
    }

    const onTransitionReady = () => {
      this.currentIndex = targetIndex;

      // Instantiate respective engine with animation config passed
      const sceneType = newScene.dataset.sceneType;
      const EngineClass = this.engineRegistry[sceneType];
      if (EngineClass) {
        this.activeEngine = new EngineClass(newScene, this.animationController.config);
        this.activeEngine.mount();
      }

      // Update HUD dots
      if (this.dotsContainer) {
        const dots = Array.from(this.dotsContainer.querySelectorAll('.hud-dot'));
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === targetIndex);
        });
      }

      // Notify parent window (for Experience Studio live sync)
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'SCENE_CHANGED', index: targetIndex }, '*');
      }

      setTimeout(() => {
        this.isTransitioning = false;
      }, 350);
    };

    if (animate && oldScene && oldScene !== newScene) {
      this.animationController.executeTransition(oldScene, newScene, onTransitionReady);
    } else {
      if (oldScene && oldScene !== newScene) {
        oldScene.classList.remove('scene-active');
      }
      newScene.classList.add('scene-active');
      onTransitionReady();
    }
  }

  nextScene() {
    if (this.currentIndex < this.scenes.length - 1) {
      this.activateScene(this.currentIndex + 1);
    }
  }

  prevScene() {
    if (this.currentIndex > 0) {
      this.activateScene(this.currentIndex - 1);
    }
  }

  replayExperience() {
    // 1. Destroy active engine safely
    if (this.activeEngine) {
      try {
        this.activeEngine.destroy();
      } catch (err) {
        console.warn('Engine destroy error during replay:', err);
      }
      this.activeEngine = null;
    }

    // 2. Explicitly reset all scene containers DOM states
    this.scenes.forEach((scene) => {
      // Reset Engine 1 DOM
      const countdownStage = scene.querySelector('.cinematic-countdown-stage');
      const greetingWrap = scene.querySelector('.cinematic-greeting-wrap');
      const countdownCircle = scene.querySelector('.countdown-circle');
      const countdownNumber = scene.querySelector('.countdown-number');
      if (countdownStage) {
        countdownStage.style.display = '';
        countdownStage.style.opacity = '1';
        countdownStage.style.transform = '';
      }
      if (countdownCircle) {
        countdownCircle.style.strokeDashoffset = '0';
      }
      if (countdownNumber) {
        const initialSeconds = scene.dataset.countdownSeconds || '3';
        countdownNumber.textContent = initialSeconds;
      }
      if (greetingWrap) {
        greetingWrap.style.display = 'none';
        greetingWrap.style.opacity = '0';
        greetingWrap.style.transform = '';
        greetingWrap.style.filter = '';
      }

      // Reset Engine 3 DOM
      const memorySlides = Array.from(scene.querySelectorAll('.memory-slide-card'));
      memorySlides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === 0);
        slide.style.opacity = idx === 0 ? '1' : '0';
        slide.style.transform = '';
        const progressFill = slide.querySelector('.polaroid-progress-fill');
        if (progressFill) progressFill.style.width = '0%';
      });

      // Reset Engine 4 DOM
      const boxStage = scene.querySelector('.sculpture-stage-viewport, .gift-box-stage');
      const threeContainer = scene.querySelector('#giftThreeContainer, .gift-three-canvas-wrap');
      const letterUnfold = scene.querySelector('.surprise-letter-unfold');
      const cssBox = scene.querySelector('.sculpture-artifact-3d, .gift-box-3d');
      const prompt = scene.querySelector('.surprise-prompt');
      if (boxStage) {
        boxStage.style.display = 'block';
      }
      if (threeContainer) {
        threeContainer.style.display = 'block';
        threeContainer.innerHTML = '';
      }
      if (cssBox) {
        cssBox.style.display = '';
        cssBox.style.transform = '';
        cssBox.style.opacity = '1';
      }
      if (letterUnfold) {
        letterUnfold.style.display = 'none';
      }
      if (prompt) {
        prompt.style.opacity = '1';
        prompt.style.transform = '';
      }

      // Reset Engine 5 DOM
      const heart = scene.querySelector('.finale-fx-heart-light');
      if (heart) heart.remove();
    });

    // 3. Clean transition back to scene 0
    this.activateScene(0, true);
  }

  replayClimax() {
    if (this.activeEngine && typeof this.activeEngine.triggerFinaleClimax === 'function') {
      this.activeEngine.triggerFinaleClimax();
    }
  }
}

// Auto-boot on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.querySelector('.celebration-viewport');
  if (viewport) {
    window.orchestrator = new SceneOrchestrator(viewport);
    window.orchestrator.init();
  }
});
