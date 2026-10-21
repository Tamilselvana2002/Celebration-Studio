/**
 * CELEBRATION STUDIO — MASTER SHARING & KEEPSAKE GIFT CARD CONTROLLER
 * Zero-dependency URL encoding/decoding, instant QR code rendering,
 * and high-resolution downloadable/printable gift card generation.
 */

(function () {
  // 1. URL-Safe Base64 Serialization Engine
  function encodePayload(obj) {
    try {
      const str = JSON.stringify(obj);
      const b64 = btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode('0x' + p1);
      }));
      return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (e) {
      console.error('Failed to encode share payload:', e);
      return '';
    }
  }

  function decodePayload(str) {
    try {
      let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const decoded = decodeURIComponent(Array.prototype.map.call(atob(b64), function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Failed to decode share payload:', e);
      return null;
    }
  }

  // 2. Generate Share URL
  function generateShareUrl(celebration) {
    if (!celebration) return window.location.href;

    // Prune excessive internal caches while keeping all creative data
    const exportData = {
      id: celebration.id,
      title: celebration.title,
      event_type: celebration.event_type || 'birthday',
      theme_id: celebration.theme_id || 'sculptural_gold',
      recipient: celebration.recipient || { name: celebration.recipient_summary || 'Honored Guest' },
      recipient_summary: celebration.recipient_summary || 'Celebration Star',
      audio_config: celebration.audio_config || {},
      animation_config: celebration.animation_config || {},
      scenes: celebration.scenes || []
    };

    const encoded = encodePayload(exportData);
    const origin = window.location.origin;
    let pathname = window.location.pathname;

    // Normalize to preview.html path
    if (pathname.endsWith('/') || pathname === '') {
      pathname = pathname + 'preview.html';
    } else {
      pathname = pathname.substring(0, pathname.lastIndexOf('/') + 1) + 'preview.html';
    }

    // URL Hash is completely client-side, never truncated by web servers
    return `${origin}${pathname}#c=${encoded}`;
  }

  // 3. Decode from current URL (Used by preview_stage_renderer)
  function getSharedCelebrationFromUrl() {
    // Check hash first: #c=...
    const hash = window.location.hash;
    if (hash && hash.includes('c=')) {
      const match = hash.match(/c=([^&]+)/);
      if (match && match[1]) {
        return decodePayload(match[1]);
      }
    }

    // Check query params: ?share=... or ?c=...
    const params = new URLSearchParams(window.location.search);
    const shareParam = params.get('share') || params.get('c');
    if (shareParam) {
      return decodePayload(shareParam);
    }

    return null;
  }

  // 4. Modal Injection & Management
  let modalInitialized = false;

  function ensureModal() {
    if (modalInitialized) return;
    modalInitialized = true;

    const modalHtml = `
      <div id="studioShareModal" class="studio-share-overlay" style="display: none;">
        <div class="studio-share-box">
          <div class="studio-share-header">
            <div>
              <h3 style="margin: 0 0 4px; font-size: 1.35rem; color: #fff; font-family: 'Cinzel', serif;">Gift Keepsake &amp; Share</h3>
              <p style="margin: 0; font-size: 0.85rem; color: rgba(255,255,255,0.65);" id="shareModalSubtitle">Share celebration with recipient anywhere</p>
            </div>
            <button type="button" class="studio-share-close-btn" onclick="CelebrationShare.closeModal()">✕</button>
          </div>

          <div class="studio-share-body">
            <!-- Share URL Bar -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.7); margin-bottom: 6px; font-weight: 700;">
                Instant Recipient URL (Works on any device without login)
              </label>
              <div style="display: flex; gap: 8px;">
                <input type="text" readonly id="studioShareUrlInput" style="flex: 1; height: 42px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.18); border-radius: 999px; color: #38e1ff; font-family: monospace; font-size: 0.8rem; padding: 0 16px; outline: none;">
                <button type="button" id="studioCopyShareBtn" onclick="CelebrationShare.copyUrl()" style="height: 42px; padding: 0 20px; border-radius: 999px; background: linear-gradient(135deg, #a855f7, #ec4899); border: none; color: #fff; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 15px rgba(168,85,247,0.4);">
                  📋 Copy
                </button>
              </div>
              <span id="studioCopyToast" style="font-size: 0.78rem; color: #34d399; font-weight: 600; display: none; margin-top: 6px;">✓ Link copied to clipboard!</span>
            </div>

            <!-- Social Shortcuts -->
            <div style="display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap;">
              <button type="button" onclick="CelebrationShare.shareWhatsApp()" class="share-social-pill" style="background: rgba(37, 211, 102, 0.15); border: 1px solid rgba(37, 211, 102, 0.4); color: #25d366;">
                💬 WhatsApp
              </button>
              <button type="button" onclick="CelebrationShare.shareEmail()" class="share-social-pill" style="background: rgba(56, 225, 255, 0.15); border: 1px solid rgba(56, 225, 255, 0.4); color: #38e1ff;">
                ✉️ Email Link
              </button>
              <button type="button" onclick="CelebrationShare.shareNative()" class="share-social-pill" id="shareNativeBtn" style="background: rgba(244, 114, 182, 0.15); border: 1px solid rgba(244, 114, 182, 0.4); color: #f472b6;">
                📱 Send via Phone...
              </button>
            </div>

            <!-- Luxury Keepsake Card Preview -->
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 20px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #fbbf24;">👑 Printable Keepsake Voucher Card</span>
                <span style="font-size: 0.75rem; color: rgba(255,255,255,0.5);">Scannable Camera QR</span>
              </div>

              <div class="gift-voucher-preview" id="giftVoucherCard">
                <div class="voucher-gold-border">
                  <div class="voucher-content">
                    <div class="voucher-brand">✨ CELEBRATION STUDIO ATELIER ✨</div>
                    <div class="voucher-title" id="voucherRecipient">Aria Montgomery</div>
                    <div class="voucher-subtitle" id="voucherOccasion">A Special 3D Celebration Created Just For You</div>
                    
                    <div class="voucher-qr-wrap">
                      <canvas id="voucherQrCanvas"></canvas>
                    </div>

                    <div class="voucher-instructions">
                      <span>✦ Scan with Phone Camera to Experience ✦</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
              <button type="button" onclick="CelebrationShare.downloadGiftCard()" class="btn btn-secondary btn-sm" style="border-radius: 999px;">
                💾 Download Gift Card (PNG)
              </button>
              <button type="button" onclick="CelebrationShare.printGiftCard()" class="btn btn-primary btn-sm" style="border-radius: 999px; box-shadow: 0 4px 15px rgba(168,85,247,0.4);">
                🖨️ Print Voucher
              </button>
            </div>

          </div>
        </div>
      </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = modalHtml;
    document.body.appendChild(div);

    // Inject Styling
    const style = document.createElement('style');
    style.textContent = `
      .studio-share-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(4, 6, 16, 0.85);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: shareFadeIn 0.3s ease;
      }
      @keyframes shareFadeIn {
        from { opacity: 0; transform: scale(0.97); }
        to { opacity: 1; transform: scale(1); }
      }
      .studio-share-box {
        width: 100%;
        max-width: 580px;
        background: rgba(14, 20, 42, 0.95);
        border: 1px solid rgba(168, 85, 247, 0.4);
        border-radius: 26px;
        box-shadow: 0 25px 70px rgba(0,0,0,0.85), 0 0 50px rgba(168, 85, 247, 0.25);
        padding: 28px 30px;
        box-sizing: border-box;
      }
      .studio-share-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding-bottom: 16px;
        margin-bottom: 20px;
      }
      .studio-share-close-btn {
        background: transparent;
        border: none;
        color: rgba(255,255,255,0.6);
        font-size: 1.2rem;
        cursor: pointer;
        padding: 4px;
        transition: color 0.2s;
      }
      .studio-share-close-btn:hover { color: #fff; }
      .share-social-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 7px 16px;
        border-radius: 999px;
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .share-social-pill:hover {
        transform: translateY(-2px);
      }
      .gift-voucher-preview {
        background: #090c1e;
        border-radius: 16px;
        padding: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6);
      }
      .voucher-gold-border {
        border: 2px solid #fbbf24;
        border-radius: 12px;
        padding: 18px 20px;
        text-align: center;
        background: radial-gradient(circle at 50% 30%, rgba(251, 191, 36, 0.08) 0%, transparent 80%);
      }
      .voucher-brand {
        font-size: 0.68rem;
        letter-spacing: 0.2em;
        color: #fbbf24;
        font-weight: 800;
        margin-bottom: 8px;
      }
      .voucher-title {
        font-family: 'Cinzel', serif;
        font-size: 1.4rem;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 4px;
      }
      .voucher-subtitle {
        font-size: 0.82rem;
        color: rgba(255,255,255,0.7);
        margin-bottom: 16px;
      }
      .voucher-qr-wrap {
        display: inline-block;
        background: #ffffff;
        padding: 10px;
        border-radius: 14px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.4);
        margin-bottom: 12px;
      }
      .voucher-instructions {
        font-size: 0.72rem;
        color: #fbbf24;
        font-weight: 700;
        letter-spacing: 0.05em;
      }
      @media print {
        body * { visibility: hidden !important; }
        #giftVoucherCard, #giftVoucherCard * { visibility: visible !important; }
        #giftVoucherCard {
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) scale(1.2);
          width: 80% !important;
          max-width: 500px !important;
          background: #090c1e !important;
          color: #fff !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `;
    document.head.appendChild(style);
  }

  let activeCelebration = null;
  let activeShareUrl = '';

  function openShareModal(celebrationOrId) {
    ensureModal();

    let celebration = null;
    if (typeof celebrationOrId === 'string') {
      celebration = window.CelebrationDB ? window.CelebrationDB.getCelebration(celebrationOrId) : null;
    } else {
      celebration = celebrationOrId;
    }

    if (!celebration && window.CelebrationDB) {
      const list = window.CelebrationDB.getCelebrations();
      if (list.length > 0) celebration = list[0];
    }

    if (!celebration) {
      alert('Celebration not found');
      return;
    }

    activeCelebration = celebration;
    activeShareUrl = generateShareUrl(celebration);

    // Update Modal DOM
    document.getElementById('shareModalSubtitle').textContent = `For: ${celebration.recipient_summary || 'VIP Star'}`;
    document.getElementById('studioShareUrlInput').value = activeShareUrl;
    document.getElementById('voucherRecipient').textContent = celebration.recipient?.name || celebration.recipient_summary || 'VIP Celebration Star';
    document.getElementById('voucherOccasion').textContent = `A Magical ${celebration.event_type || 'Birthday'} Experience Crafted For You`;

    // Render Canvas QR Code
    const qrCanvas = document.getElementById('voucherQrCanvas');
    if (window.StudioQR && qrCanvas) {
      window.StudioQR.drawCanvas(activeShareUrl, qrCanvas, {
        size: 160,
        margin: 10,
        darkColor: '#090d1f',
        lightColor: '#ffffff',
        roundDots: true,
        emblem: true,
        emblemColor: '#a855f7'
      });
    }

    // Hide toast
    document.getElementById('studioCopyToast').style.display = 'none';

    // Show modal
    document.getElementById('studioShareModal').style.display = 'flex';
  }

  function closeModal() {
    const modal = document.getElementById('studioShareModal');
    if (modal) modal.style.display = 'none';
  }

  function copyUrl() {
    if (!activeShareUrl) return;
    navigator.clipboard.writeText(activeShareUrl).then(() => {
      const toast = document.getElementById('studioCopyToast');
      if (toast) {
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 3000);
      }
    }).catch(() => {
      const input = document.getElementById('studioShareUrlInput');
      input.select();
      document.execCommand('copy');
      const toast = document.getElementById('studioCopyToast');
      if (toast) {
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 3000);
      }
    });
  }

  function shareWhatsApp() {
    if (!activeShareUrl || !activeCelebration) return;
    const recipient = activeCelebration.recipient?.name || activeCelebration.recipient_summary || 'my friend';
    const text = encodeURIComponent(`✨ Special 3D Celebration for ${recipient}! Click to experience your magical moment: ${activeShareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  }

  function shareEmail() {
    if (!activeShareUrl || !activeCelebration) return;
    const recipient = activeCelebration.recipient?.name || activeCelebration.recipient_summary || 'VIP';
    const subject = encodeURIComponent(`A Magical 3D Celebration for ${recipient} ✨`);
    const body = encodeURIComponent(`Hello!\n\nA custom 3D celebration has been created just for you in Celebration Studio.\n\nOpen your magical celebration here:\n${activeShareUrl}\n\nEnjoy the moment!`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  function shareNative() {
    if (!activeShareUrl || !activeCelebration) return;
    if (navigator.share) {
      navigator.share({
        title: activeCelebration.title,
        text: `✨ A custom 3D celebration experience for ${activeCelebration.recipient_summary}!`,
        url: activeShareUrl
      }).catch(() => {});
    } else {
      copyUrl();
    }
  }

  function downloadGiftCard() {
    const qrCanvas = document.getElementById('voucherQrCanvas');
    if (!qrCanvas || !activeCelebration) return;

    // Build High-Res 300 DPI Export Canvas
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 1200;
    exportCanvas.height = 1600;
    const ctx = exportCanvas.getContext('2d');

    // 1. Dark Velvet Cosmic Background
    const bgGrad = ctx.createRadialGradient(600, 500, 50, 600, 800, 900);
    bgGrad.addColorStop(0, '#151c3d');
    bgGrad.addColorStop(0.6, '#0b0f24');
    bgGrad.addColorStop(1, '#050714');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 1600);

    // 2. Gold Filigree Border
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 10;
    ctx.strokeRect(50, 50, 1100, 1500);

    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(65, 65, 1070, 1470);

    // 3. Header Texts
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ CELEBRATION STUDIO ATELIER ✦', 600, 180);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px serif';
    const recipient = activeCelebration.recipient?.name || activeCelebration.recipient_summary || 'VIP Celebration Star';
    ctx.fillText(recipient, 600, 310);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '32px sans-serif';
    const occasion = `A Custom 3D ${activeCelebration.event_type || 'Birthday'} Journey`;
    ctx.fillText(occasion, 600, 380);

    // 4. Draw Center High-Res QR Code
    const tempQr = document.createElement('canvas');
    if (window.StudioQR) {
      window.StudioQR.drawCanvas(activeShareUrl, tempQr, {
        size: 560,
        margin: 24,
        darkColor: '#070919',
        lightColor: '#ffffff',
        roundDots: true,
        emblem: true,
        emblemColor: '#a855f7'
      });
      ctx.drawImage(tempQr, 320, 500, 560, 560);
    }

    // 5. Instruction Footer
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('✦ SCAN WITH YOUR PHONE CAMERA ✦', 600, 1160);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '24px monospace';
    ctx.fillText('No app or installation required • Instant 3D Playback', 600, 1220);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '20px sans-serif';
    ctx.fillText('Crafted with love on Celebration Studio Atelier', 600, 1480);

    // 6. Trigger Download
    const dataUrl = exportCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = `Celebration-Gift-Card-${recipient.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    a.href = dataUrl;
    a.click();
  }

  function printGiftCard() {
    window.print();
  }

  // Public Interface
  window.CelebrationShare = {
    generateShareUrl,
    getSharedCelebrationFromUrl,
    openShareModal,
    closeModal,
    copyUrl,
    shareWhatsApp,
    shareEmail,
    shareNative,
    downloadGiftCard,
    printGiftCard
  };
})();
