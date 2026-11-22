(() => {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  // ---------- Settings ----------
  const KEY = 'bell.settings.v3';
  const DEFAULTS = { back: 'blue', autoJam: false, autoJamAfter: 3 };
  let settings = { ...DEFAULTS };
  try { settings = { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch (_) {}
  const saveSettings = () => { try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch (_) {} };

  // ---------- Bell artwork (bird's-eye view, 300x300, centre 150,150) ----------
  function baseSVG() {
    let screws = '';
    for (const a of [30, 150, 270]) {
      screws += `<g transform="rotate(${a} 150 150)"><circle cx="150" cy="96" r="3.4" fill="url(#b-chrome)"/>
        <path d="M147.6,96 H152.4" stroke="#333" stroke-width="1"/></g>`;
    }
    return `<svg viewBox="0 0 300 300" aria-hidden="true">
      <defs>
        <filter id="b-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
        <filter id="b-tight" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.2"/></filter>
        <filter id="b-blur3" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
        <radialGradient id="b-top" cx=".38" cy=".32" r=".8">
          <stop offset="0" stop-color="#3a3a3c"/>
          <stop offset=".5" stop-color="#141415"/>
          <stop offset="1" stop-color="#040404"/>
        </radialGradient>
        <linearGradient id="b-rim" x1=".15" y1=".1" x2=".85" y2=".9">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset=".22" stop-color="#9a9a9e"/>
          <stop offset=".5" stop-color="#3b3b3e"/>
          <stop offset=".78" stop-color="#c9c9cc"/>
          <stop offset="1" stop-color="#55555a"/>
        </linearGradient>
        <radialGradient id="b-inner" cx=".5" cy=".5" r=".5">
          <stop offset="0" stop-color="#2a2622"/>
          <stop offset=".85" stop-color="#121010"/>
          <stop offset="1" stop-color="#050505"/>
        </radialGradient>
        <radialGradient id="b-chrome" cx=".35" cy=".3" r=".8">
          <stop offset="0" stop-color="#fff"/>
          <stop offset=".45" stop-color="#bdbdbd"/>
          <stop offset="1" stop-color="#3c3c3c"/>
        </radialGradient>
      </defs>
      <!-- shadows on the marble: wide soft one and a tight contact one -->
      <circle cx="158" cy="166" r="141" fill="#000" fill-opacity=".38" filter="url(#b-soft)"/>
      <circle cx="152" cy="154" r="140" fill="#000" fill-opacity=".55" filter="url(#b-tight)"/>
      <!-- glossy black lacquer top -->
      <circle cx="150" cy="150" r="140" fill="url(#b-top)"/>
      <path d="M58,92 A110,110 0 0 1 182,38" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="10" stroke-linecap="round" filter="url(#b-blur3)"/>
      <path d="M248,196 A110,110 0 0 1 206,244" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="7" stroke-linecap="round" filter="url(#b-blur3)"/>
      <!-- chrome trim rings -->
      <circle cx="150" cy="150" r="138.6" fill="none" stroke="url(#b-rim)" stroke-width="3"/>
      <circle cx="150" cy="150" r="140" fill="none" stroke="#000" stroke-opacity=".6" stroke-width=".8"/>
      <circle cx="150" cy="150" r="115.5" fill="none" stroke="url(#b-rim)" stroke-width="2.2"/>
      <circle cx="150" cy="150" r="114" fill="url(#b-inner)"/>
      ${screws}
      <!-- striker mechanism -->
      <circle cx="150" cy="150" r="24" fill="#1c1c1c" stroke="#3a3a3a"/>
      <path d="M150,150 L197,126" stroke="#8a8a8a" stroke-width="5" stroke-linecap="round"/>
      <path d="M150,149 L197,125" stroke="#d8d8d8" stroke-opacity=".6" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M160,154 q6,-8 12,0 t12,0 t12,0" fill="none" stroke="#a5a5a5" stroke-width="1.6"/>
      <circle cx="199" cy="125" r="9" fill="url(#b-chrome)"/>
      <circle cx="150" cy="150" r="8" fill="url(#b-chrome)"/>
    </svg>`;
  }

  function domeSVG() {
    let flutes = '', ticks = '';
    for (let i = 0; i < 16; i++) {
      flutes += `<g transform="rotate(${i * 22.5} 150 150)">
        <path d="M150,116 L150,52" stroke="#3a2506" stroke-opacity=".28" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M152.4,116 L152.4,54" stroke="#fff6d8" stroke-opacity=".32" stroke-width="1" stroke-linecap="round"/></g>`;
    }
    for (let i = 0; i < 90; i++) {
      ticks += `<path transform="rotate(${i * 4} 150 150)" d="M150,39.5 V45" stroke="#2a1a05" stroke-opacity=".45" stroke-width="1.3"/>`;
    }
    return `<svg viewBox="0 0 300 300" aria-hidden="true">
      <defs>
        <filter id="d-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
        <filter id="d-blur2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4"/></filter>
        <radialGradient id="d-body" cx=".42" cy=".4" r=".62">
          <stop offset="0" stop-color="#fbe3a0"/>
          <stop offset=".2" stop-color="#eec565"/>
          <stop offset=".5" stop-color="#d09a38"/>
          <stop offset=".78" stop-color="#9a641a"/>
          <stop offset=".93" stop-color="#5e3b0b"/>
          <stop offset="1" stop-color="#2e1c04"/>
        </radialGradient>
        <linearGradient id="d-edge" x1=".2" y1=".2" x2=".85" y2=".9">
          <stop offset="0" stop-color="#fff2c8" stop-opacity="0"/>
          <stop offset=".55" stop-color="#fff2c8" stop-opacity="0"/>
          <stop offset="1" stop-color="#fff4d6" stop-opacity=".75"/>
        </linearGradient>
        <radialGradient id="d-shade" cx=".4" cy=".36" r=".8">
          <stop offset=".55" stop-color="#000" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity=".45"/>
        </radialGradient>
        <radialGradient id="d-spec" cx=".5" cy=".5" r=".5">
          <stop offset="0" stop-color="#fff" stop-opacity="1"/>
          <stop offset=".6" stop-color="#fff" stop-opacity=".35"/>
          <stop offset="1" stop-color="#fff" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="d-cap" cx=".36" cy=".32" r=".8">
          <stop offset="0" stop-color="#fff"/>
          <stop offset=".4" stop-color="#d4d4d4"/>
          <stop offset=".85" stop-color="#5a5a5a"/>
          <stop offset="1" stop-color="#2a2a2a"/>
        </radialGradient>
      </defs>
      <!-- the dome's own shadow on the base (travels with the dome) -->
      <circle cx="157" cy="160" r="112" fill="#000" fill-opacity=".55" filter="url(#d-blur)"/>
      <circle cx="150" cy="150" r="112" fill="url(#d-body)"/>
      <!-- engraved detail that turns with the dome -->
      <g class="spin">
        ${flutes}${ticks}
        <circle cx="150" cy="150" r="101" fill="none" stroke="#3a2506" stroke-opacity=".3" stroke-width="1.5"/>
        <circle cx="150" cy="150" r="99.5" fill="none" stroke="#fff0c0" stroke-opacity=".25"/>
        <circle cx="150" cy="150" r="33" fill="none" stroke="#3a2506" stroke-opacity=".3" stroke-width="1.5"/>
        <g transform="rotate(11.25 150 150)">
          <circle cx="150" cy="47" r="4.6" fill="url(#d-cap)"/>
          <path d="M147,47 H153" stroke="#333" stroke-width="1.2"/>
        </g>
      </g>
      <!-- fixed lighting (does not turn): window reflection, room bounce, specular -->
      <circle cx="150" cy="150" r="112" fill="url(#d-shade)"/>
      <path d="M72,128 C76,96 96,74 126,66 C118,84 106,104 98,134 C90,140 78,140 72,128 Z" fill="#fff" fill-opacity=".42" filter="url(#d-blur2)"/>
      <path d="M134,62 C150,58 166,60 176,64 C168,70 154,72 140,74 Z" fill="#fff" fill-opacity=".3" filter="url(#d-blur2)"/>
      <ellipse cx="108" cy="104" rx="16" ry="7" transform="rotate(-42 108 104)" fill="url(#d-spec)"/>
      <circle cx="150" cy="150" r="108.5" fill="none" stroke="url(#d-edge)" stroke-width="5" filter="url(#d-blur2)"/>
      <circle cx="150" cy="150" r="111.2" fill="none" stroke="#241503" stroke-width="2"/>
      <circle cx="150" cy="150" r="109.6" fill="none" stroke="#ffe9b0" stroke-opacity=".3" stroke-width=".8"/>
      <g class="cap">
        <circle cx="155" cy="157" r="22" fill="#000" fill-opacity=".45" filter="url(#d-blur2)"/>
        <circle cx="150" cy="150" r="20" fill="url(#d-cap)"/>
        <circle cx="150" cy="150" r="20" fill="none" stroke="#1d1d1d" stroke-opacity=".6"/>
        <circle cx="150" cy="150" r="17.5" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>
        <ellipse cx="143" cy="143" rx="7" ry="4" transform="rotate(-35 143 143)" fill="#fff" fill-opacity=".85"/>
      </g>
    </svg>`;
  }

  // ---------- Folded card, back out (identity never shown) ----------
  // Original ornate back: white border, framed field of fine scrollwork, centre rosette.
  // Folded in quarters, we see one corner quarter: the rounded original corner is
  // top-right, the folded edges (stacked paper) run down the left and along the bottom.
  const BACKS = { blue: ['#1a2a6c', '#f3f0e6', '#0c1540'], red: ['#8c1328', '#f6efe6', '#4f0915'] };
  let uid = 0;
  function foldedCardSVG(back) {
    const [ground, line, crease] = BACKS[back] || BACKS.blue;
    const id = 'fc' + (++uid);
    const q = 'M12,0 H125 V173 Q125,175 123,175 H0 V12 Q0,0 12,0 Z';
    let curls = '', petals = '', dots = '';
    for (const r of [0, 90, 180, 270]) {
      curls += `<path transform="rotate(${r} 9 9)" d="M9,9 C9,5 12,3.4 14.2,4.9 C15.8,6.2 14.6,8.5 12.8,7.7"/>`;
    }
    for (let i = 0; i < 24; i++) {
      petals += `<ellipse transform="rotate(${i * 15} 125 175)" cx="125" cy="146" rx="3" ry="10"/>`;
      dots += `<circle transform="rotate(${i * 15 + 7.5} 125 175)" cx="125" cy="135.5" r="1.3"/>`;
    }
    const scroll = 'M24,44 C23,27 31,20 43,21 C51,22 50,32 43,31.5 C38,31 38.5,25.5 42.5,25.5';
    return `<svg viewBox="-8 -8 146 198" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="${id}q"><path d="${q}"/></clipPath>
        <pattern id="${id}p" width="18" height="18" patternUnits="userSpaceOnUse">
          <rect width="18" height="18" fill="${ground}"/>
          <g fill="none" stroke="${line}" stroke-width=".8" stroke-linecap="round" stroke-opacity=".9">
            ${curls}
            <path d="M0,4 A4,4 0 0 0 4,0 M14,0 A4,4 0 0 0 18,4 M18,14 A4,4 0 0 0 14,18 M4,18 A4,4 0 0 0 0,14"/>
          </g>
          <circle cx="9" cy="9" r="1.1" fill="${line}"/>
        </pattern>
        <!-- faint paper grain -->
        <filter id="${id}t" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="4"/>
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  .16 0 0 0 0"/>
        </filter>
        <!-- the fold bends the printed back around the crease -->
        <linearGradient id="${id}fr" x1="0" x2="1">
          <stop offset="0" stop-color="${ground}"/><stop offset=".55" stop-color="${ground}"/><stop offset="1" stop-color="${crease}"/>
        </linearGradient>
        <linearGradient id="${id}fb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${ground}"/><stop offset=".55" stop-color="${ground}"/><stop offset="1" stop-color="${crease}"/>
        </linearGradient>
        <linearGradient id="${id}g" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity=".22"/>
          <stop offset=".55" stop-color="#fff" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity=".22"/>
        </linearGradient>
        <linearGradient id="${id}r" x1="0" x2="1">
          <stop offset=".84" stop-color="#000" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity=".28"/>
        </linearGradient>
        <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1">
          <stop offset=".88" stop-color="#000" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity=".25"/>
        </linearGradient>
      </defs>
      <g transform="translate(123 0) scale(-1 1)">
        <!-- inner layers' white borders, slightly out of line along the open (original) edges -->
        <path d="M9.5,-2.6 H118 V168 H-2.4 V9.5 Q-2.4,-2.6 9.5,-2.6 Z" fill="#d6d1c5"/>
        <path d="M10.8,-1.3 H121 V171 H-1.1 V10.8 Q-1.1,-1.3 10.8,-1.3 Z" fill="#f2efe8"/>
        <!-- folded edges: the back design wrapping round the creases -->
        <path d="M120,1 H129.2 Q130.4,1 130.4,3 V176 H120 Z" fill="url(#${id}fr)"/>
        <path d="M1,170 H128 Q130.4,170 130.4,172 V177.4 Q130.4,179.4 128,179.4 H3 Q1,179.4 1,177.4 Z" fill="url(#${id}fb)"/>
        <!-- ink cracked along the creases shows white fibres -->
        <g fill="none" stroke="#fff" stroke-linecap="round">
          <path d="M126.6,6 V173" stroke-opacity=".5" stroke-width=".55" stroke-dasharray="4 2.2 1 3.5 .6 2.4 6 1.8"/>
          <path d="M5,176.4 H124" stroke-opacity=".5" stroke-width=".55" stroke-dasharray="3 2.6 .8 2 5 1.6 1.2 3"/>
          <path d="M128.2,10 V170" stroke-opacity=".22" stroke-width=".4" stroke-dasharray="1 4 2.5 3"/>
        </g>
        <path d="M120,1 H129.2 Q130.4,1 130.4,3 V177.4 Q130.4,179.4 128,179.4 H3 Q1,179.4 1,177.4" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>
        <g clip-path="url(#${id}q)">
          <rect width="125" height="175" fill="#f7f4ec"/>
          <rect x="9" y="9" width="240" height="340" rx="6" fill="${ground}"/>
          <rect x="13" y="13" width="232" height="332" rx="4" fill="url(#${id}p)"/>
          <rect x="13" y="13" width="232" height="332" rx="4" fill="none" stroke="${line}" stroke-width=".8"/>
          <g fill="none" stroke="${line}" stroke-width="1.1" stroke-linecap="round">
            <rect x="18" y="18" width="40" height="40" rx="2" fill="${ground}" stroke-width=".6"/>
            <path d="${scroll}"/><path transform="matrix(0 1 1 0 0 0)" d="${scroll}"/>
          </g>
          <circle cx="23" cy="23" r="2" fill="${line}"/>
          <circle cx="125" cy="175" r="48" fill="${ground}" stroke="${line}" stroke-width="1.2"/>
          <circle cx="125" cy="175" r="43" fill="none" stroke="${line}" stroke-width=".6"/>
          <g fill="none" stroke="${line}" stroke-width=".8">${petals}</g>
          <g fill="${line}">${dots}</g>
          <circle cx="125" cy="175" r="16" fill="none" stroke="${line}" stroke-width="1"/>
          <rect width="125" height="175" filter="url(#${id}t)"/>
          <rect width="125" height="175" fill="url(#${id}g)"/>
          <rect width="125" height="175" fill="url(#${id}r)"/>
          <rect width="125" height="175" fill="url(#${id}b)"/>
        </g>
        <path d="${q}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".8"/>
      </g>
    </svg>`;
  }

  // ---------- Audio (Web Audio, synthesized) ----------
  let ac = null, master = null, noiseBuf = null;

  function initAudio() {
    if (ac) return;
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (_) {}
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ac = new AC({ latencyHint: 'interactive' });
    master = ac.createDynamicsCompressor();
    master.threshold.value = -10;
    master.ratio.value = 4;
    master.attack.value = 0.001;
    master.release.value = 0.2;
    master.connect(ac.destination);
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 0.3, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  function unlockAudio() {
    initAudio();
    if (!ac) return;
    if (ac.state !== 'running') ac.resume().catch(() => {});
    const src = ac.createBufferSource();
    src.buffer = ac.createBuffer(1, 1, 22050);
    src.connect(ac.destination);
    src.start(0);
  }

  function tone(freq, amp, decay, t, out, attack = 0.0015) {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(amp, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + decay + 0.05);
    return o;
  }

  function noise(t, dur, amp, type, freq, q, out) {
    const src = ac.createBufferSource();
    src.buffer = noiseBuf;
    const f = ac.createBiquadFilter();
    f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ac.createGain();
    g.gain.setValueAtTime(amp, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(out);
    src.start(t, Math.random() * 0.2);
    src.stop(t + dur + 0.02);
  }

  function voice(gain) {
    initAudio();
    if (!ac) return null;
    if (ac.state !== 'running') ac.resume().catch(() => {});
    const out = ac.createGain();
    out.gain.value = gain;
    out.connect(master);
    return out;
  }

  // Bright metallic strike with a long, beating decay (inharmonic dome modes)
  function ding() {
    const out = voice(0.55);
    if (!out) return;
    const t = ac.currentTime + 0.004;
    const f0 = 2180 * (1 + (Math.random() - 0.5) * 0.006);
    // [ratio, amplitude, decay seconds]
    const modes = [[1, 1, 3.2], [1.006, 0.5, 2.6], [2.74, 0.42, 1.5], [5.19, 0.2, 0.7], [7.93, 0.09, 0.35]];
    for (const [r, a, d] of modes) {
      tone(f0 * r - 0.9, a * 0.5, d, t, out);
      tone(f0 * r + 0.9, a * 0.5, d * 0.92, t, out);
    }
    tone(f0 * 0.5, 0.06, 0.8, t, out); // faint body hum
    noise(t, 0.018, 0.7, 'highpass', 4500, 0.7, out); // strike click
    noise(t, 0.05, 0.25, 'bandpass', 900, 1.2, out); // plunger tick
  }

  // Dull jammed thunk: hammer hits but the dome is damped
  function clunk() {
    const out = voice(0.9);
    if (!out) return;
    const t = ac.currentTime + 0.004;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.frequency.setValueAtTime(170, t);
    o.frequency.exponentialRampToValueAtTime(70, t + 0.12);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.55, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g).connect(out);
    o.start(t); o.stop(t + 0.2);
    noise(t, 0.07, 0.8, 'lowpass', 700, 0.8, out);
    tone(2180, 0.05, 0.035, t, out);
    tone(5650, 0.02, 0.02, t, out);
    noise(t + 0.045, 0.035, 0.22, 'bandpass', 1400, 2, out); // little rattle
  }

  // Quiet metal-on-metal squeak while the dome is twisted. A resonant
  // sawtooth chopped by a stick-slip LFO; loudness and pitch follow twist speed.
  let squeak = null;
  function squeakStart() {
    if (squeak) return;
    const out = voice(1);
    if (!out) return;
    const t = ac.currentTime;
    const o = ac.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = 950;
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 1900; bp.Q.value = 7;
    const chop = ac.createGain();
    chop.gain.value = 0.5;
    const lfo = ac.createOscillator();
    lfo.type = 'square';
    lfo.frequency.value = 24;
    const lfoDepth = ac.createGain();
    lfoDepth.gain.value = 0.5;
    lfo.connect(lfoDepth).connect(chop.gain);
    const level = ac.createGain();
    level.gain.value = 0;
    o.connect(bp).connect(chop).connect(level).connect(out);
    o.start(t); lfo.start(t);
    squeak = { o, bp, lfo, level, out };
  }
  function squeakMove(degPerMs) {
    if (!squeak) return;
    const s = clamp(Math.abs(degPerMs) / 0.35);
    const t = ac.currentTime;
    const wobble = (Math.random() - 0.5) * 60;
    squeak.level.gain.cancelScheduledValues(t);
    squeak.level.gain.setTargetAtTime(0.012 + s * 0.05, t, 0.02);
    squeak.level.gain.setTargetAtTime(0, t + 0.09, 0.04); // fades if the finger stops
    squeak.o.frequency.setTargetAtTime(850 + s * 650 + wobble, t, 0.03);
    squeak.bp.frequency.setTargetAtTime(1700 + s * 900, t, 0.05);
    squeak.lfo.frequency.setTargetAtTime(16 + s * 34, t, 0.05);
  }
  function squeakStop() {
    if (!squeak) return;
    const { o, lfo, level, out } = squeak;
    squeak = null;
    const t = ac.currentTime;
    level.gain.cancelScheduledValues(t);
    level.gain.setTargetAtTime(0, t, 0.03);
    o.stop(t + 0.25); lfo.stop(t + 0.25);
    setTimeout(() => out.disconnect(), 400);
  }

  // Thread lets go and the dome lifts
  function release() {
    const out = voice(0.6);
    if (!out) return;
    const t = ac.currentTime + 0.004;
    noise(t, 0.03, 0.35, 'bandpass', 2600, 2, out);
    tone(2180, 0.035, 0.5, t + 0.01, out);
    tone(5980, 0.012, 0.25, t + 0.01, out);
  }

  // ---------- Haptics ----------
  // Android: Vibration API. iOS Safari has no Vibration API; toggling a hidden
  // <input type=checkbox switch> inside a user gesture gives a light tap on iOS 18+.
  const hapticLabel = (() => {
    const label = document.createElement('label');
    label.className = 'haptic-switch';
    label.setAttribute('aria-hidden', 'true');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('switch', '');
    input.tabIndex = -1;
    label.appendChild(input);
    document.body.appendChild(label);
    return label;
  })();
  function haptic(ms = 10) {
    if (typeof navigator.vibrate === 'function') {
      try { navigator.vibrate(ms); return; } catch (_) {}
    }
    try { hapticLabel.click(); } catch (_) {}
  }

  // ---------- Wake lock ----------
  let wakeLock = null;
  async function keepAwake() {
    if (!('wakeLock' in navigator) || wakeLock || document.visibilityState !== 'visible') return;
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } catch (_) {}
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') keepAwake();
  });

  // ---------- Elements ----------
  const stage = $('#stage');
  const base = $('#base');
  const dome = $('#dome');
  base.innerHTML = baseSVG();
  dome.innerHTML = domeSVG();
  const spinEl = dome.querySelector('.spin');
  const capEl = dome.querySelector('.cap');
  const hit = $('#bellHit');
  const card = $('#card');
  const cardPose = $('#cardPose');
  const armZones = document.querySelectorAll('.zone.arm');
  const settingsZone = $('#settingsZone');
  const settingsEl = $('#settings');

  function applySettings() {
    cardPose.innerHTML = foldedCardSVG(settings.back);
  }

  // ---------- Routine state ----------
  // ready -> (armed / auto) -> jammed -> (twist) -> opening -> open -> gone
  const UNSCREW_DEG = 360; // one full turn before the dome comes off
  let state = 'ready';
  let armed = false;
  let rings = 0;
  let spin = 0; // degrees the dome has been twisted
  let multiTouch = false;
  let settingsOpen = false;
  let press = null;
  let drag = null;
  let timers = [];

  function setArmed(v) { armed = v; }

  function setSpin(deg) {
    spin = deg;
    spinEl.style.transform = deg ? `rotate(${deg}deg)` : '';
  }

  function reset() {
    state = 'ready';
    setArmed(false);
    rings = 0;
    press = drag = null;
    squeakStop();
    timers.forEach(clearTimeout);
    timers = [];
    [dome, base, capEl, spinEl].forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
    dome.classList.remove('lifting');
    dome.style.transform = '';
    spinEl.style.transition = '';
    setSpin(0);
    card.style.transition = 'none';
    card.style.transform = '';
    card.classList.remove('show', 'lifted');
    stage.classList.remove('open');
  }

  function wake() { unlockAudio(); keepAwake(); }

  // ---------- Bell animations ----------
  function ringFx() {
    ding();
    haptic(10);
    capEl.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(.9)', offset: 0.28 }, { transform: 'scale(1)' }],
      { duration: 190, easing: 'cubic-bezier(.3,.7,.4,1)' }
    );
    dome.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(.992)', offset: 0.3 }, { transform: 'scale(1)' }],
      { duration: 200, easing: 'ease-out' }
    );
  }

  function jamFx() {
    clunk();
    haptic(25);
    capEl.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(.93)', offset: 0.12 },
        { transform: 'scale(.95)', offset: 0.3 },
        { transform: 'scale(.94)', offset: 0.5 },
        { transform: 'scale(.98)', offset: 0.78 },
        { transform: 'scale(1)' }
      ],
      { duration: 460, easing: 'ease-out' }
    );
    dome.animate(
      [
        { transform: 'translate(0,0) rotate(0)' },
        { transform: 'translate(-1.5px,1px) rotate(-1.6deg)', offset: 0.14 },
        { transform: 'translate(1.2px,-.8px) rotate(1.3deg)', offset: 0.32 },
        { transform: 'translate(-.7px,.4px) rotate(-.7deg)', offset: 0.52 },
        { transform: 'translate(.3px,0) rotate(.3deg)', offset: 0.74 },
        { transform: 'translate(0,0) rotate(0)' }
      ],
      { duration: 520, easing: 'ease-out' }
    );
    base.animate(
      [
        { transform: 'translate(0,0)' },
        { transform: 'translate(-1.2px,.6px)', offset: 0.15 },
        { transform: 'translate(1px,-.4px)', offset: 0.35 },
        { transform: 'translate(-.4px,0)', offset: 0.6 },
        { transform: 'translate(0,0)' }
      ],
      { duration: 380 }
    );
  }

  // Thread releases: dome lifts toward the viewer, then is set aside off the top-right
  function liftOff(dir) {
    state = 'opening';
    squeakStop();
    release();
    haptic(15);
    press = null;
    card.style.transition = 'none';
    card.style.transform = '';
    card.classList.add('show');
    spinEl.style.transition = 'transform 500ms cubic-bezier(.2,.8,.3,1)';
    setSpin(spin + dir * 25);
    dome.classList.add('lifting');
    const anim = dome.animate(
      [
        { transform: 'translate(0,0) scale(1) rotate(0)' },
        { transform: 'translate(0,-2%) scale(1.1) rotate(0)', offset: 0.35 },
        { transform: 'translate(52%,-70%) scale(1.06) rotate(20deg)' }
      ],
      { duration: 760, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards' }
    );
    anim.onfinish = () => {
      if (state !== 'opening') return;
      dome.style.transform = 'translate(52%,-70%) scale(1.06) rotate(20deg)';
      anim.cancel();
      state = 'open';
      stage.classList.add('open');
    };
  }

  // ---------- Bell touch handling ----------
  const angleAt = (x, y, c) => Math.atan2(y - c.y, x - c.x) * 180 / Math.PI;

  hit.addEventListener('pointerdown', (e) => {
    if (multiTouch || settingsOpen || !e.isPrimary || press) return;
    wake();
    try { hit.setPointerCapture(e.pointerId); } catch (_) {}
    let sounded = false;
    if (state === 'ready') {
      const jam = armed || (settings.autoJam && rings >= settings.autoJamAfter);
      setArmed(false);
      if (jam) { state = 'jammed'; jamFx(); }
      else { rings++; ringFx(); }
      sounded = true;
    }
    const r = hit.getBoundingClientRect();
    const c = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    press = {
      id: e.pointerId, c, x0: e.clientX, y0: e.clientY,
      lastA: angleAt(e.clientX, e.clientY, c), lastT: e.timeStamp,
      turned: 0, twisting: false, sounded, minR: r.width * 0.12
    };
  });

  hit.addEventListener('pointermove', (e) => {
    if (!press || e.pointerId !== press.id || state !== 'jammed' || multiTouch) return;
    const dx = e.clientX - press.c.x, dy = e.clientY - press.c.y;
    if (Math.hypot(dx, dy) < press.minR) return; // angle is unstable near the centre
    const a = angleAt(e.clientX, e.clientY, press.c);
    let d = a - press.lastA;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    const dt = Math.max(1, e.timeStamp - press.lastT);
    press.lastA = a;
    press.lastT = e.timeStamp;
    press.turned += d;
    if (!press.twisting) {
      if (Math.abs(press.turned) < 6 && Math.hypot(e.clientX - press.x0, e.clientY - press.y0) < 10) return;
      if (Math.abs(press.turned) < 6) return;
      press.twisting = true;
      dome.getAnimations().forEach((an) => an.cancel());
      spinEl.style.transition = 'none';
      squeakStart();
    }
    setSpin(spin + d);
    squeakMove(d / dt);
    if (Math.abs(spin) >= UNSCREW_DEG) liftOff(Math.sign(spin));
  });

  function endPress(e, cancelled) {
    if (!press || e.pointerId !== press.id) return;
    const p = press;
    press = null;
    squeakStop();
    if (multiTouch) return;
    // A partial twist stays where it was left, like a half-unscrewed lid
    if (!p.twisting && !cancelled && state === 'jammed' && !p.sounded) jamFx();
  }
  hit.addEventListener('pointerup', (e) => endPress(e, false));
  hit.addEventListener('pointercancel', (e) => endPress(e, true));

  // ---------- Card drag & flick ----------
  card.addEventListener('pointerdown', (e) => {
    if (state !== 'open' || multiTouch || settingsOpen || !e.isPrimary || drag) return;
    try { card.setPointerCapture(e.pointerId); } catch (_) {}
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, samples: [{ x: e.clientX, y: e.clientY, t: e.timeStamp }] };
    card.style.transition = 'none';
    card.classList.add('lifted');
    haptic(8);
  });

  card.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    drag.dx = e.clientX - drag.x0;
    drag.dy = e.clientY - drag.y0;
    card.style.transform = `translate3d(${drag.dx}px, ${drag.dy}px, 0)`;
    drag.samples.push({ x: e.clientX, y: e.clientY, t: e.timeStamp });
    while (drag.samples.length > 2 && e.timeStamp - drag.samples[0].t > 90) drag.samples.shift();
  });

  function endDrag(e, cancelled) {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    drag = null;
    if (multiTouch) return;
    const a = d.samples[0], b = d.samples[d.samples.length - 1];
    const dt = Math.max(1, b.t - a.t);
    const vx = (b.x - a.x) / dt, vy = (b.y - a.y) / dt; // px per ms
    const W = window.innerWidth, H = window.innerHeight;
    const side = Math.abs(d.dx) > Math.abs(d.dy);
    const down = !side && ((vy > 0.5 && d.dy > 15) || d.dy > H * 0.28);
    const sideways = side && ((Math.abs(vx) > 0.5 && Math.abs(d.dx) > 15) || Math.abs(d.dx) > W * 0.3);
    if (!cancelled && (down || sideways)) {
      // Slide off the nearest edge in the flick direction
      const rect = card.getBoundingClientRect();
      let tx, ty, dur;
      if (down) {
        const dist = H - rect.top + 40;
        dur = clamp(dist / Math.max(vy, 1.4), 160, 360);
        tx = d.dx + vx * dur * 0.4;
        ty = d.dy + dist;
      } else {
        const dir = Math.sign(d.dx);
        const dist = dir > 0 ? W - rect.left + 40 : rect.right + 40;
        dur = clamp(dist / Math.max(Math.abs(vx), 1.4), 160, 360);
        tx = d.dx + dir * dist;
        ty = d.dy + vy * dur * 0.4;
      }
      card.style.transition = `transform ${dur}ms cubic-bezier(.35,0,.9,.6)`;
      card.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(.94)`;
      state = 'gone';
      haptic(15);
      timers.push(setTimeout(() => {
        card.classList.remove('show', 'lifted');
        card.style.transition = 'none';
        card.style.transform = '';
      }, dur + 30));
    } else {
      card.classList.remove('lifted');
      card.style.transition = 'transform 360ms cubic-bezier(.3,1.4,.5,1)';
      card.style.transform = '';
    }
  }
  card.addEventListener('pointerup', (e) => endDrag(e, false));
  card.addEventListener('pointercancel', (e) => endDrag(e, true));

  // ---------- Secret zones ----------
  armZones.forEach((z) => z.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    if (multiTouch || settingsOpen) return;
    wake();
    if (state !== 'ready') return;
    setArmed(!armed);
    if (armed) haptic(12); // only the arm gets a buzz; disarm is silent
  }));

  // The top-left arm zone doubles as the settings trigger (closing settings resets anyway)
  let cornerTaps = [];
  settingsZone.addEventListener('pointerdown', (e) => {
    if (multiTouch || settingsOpen) return;
    const now = e.timeStamp;
    cornerTaps = cornerTaps.filter((t) => now - t < 900);
    cornerTaps.push(now);
    if (cornerTaps.length >= 3) { cornerTaps = []; openSettings(); }
  });

  // ---------- Global touch guards: two-finger reset, no zoom/scroll/callouts ----------
  document.addEventListener('touchstart', (e) => {
    if (settingsOpen) return;
    if (e.touches.length >= 2) {
      e.preventDefault();
      if (!multiTouch) {
        multiTouch = true;
        reset();
        haptic(20);
      }
    }
  }, { passive: false });
  const touchEnd = (e) => {
    unlockAudio();
    if (e.touches.length === 0) multiTouch = false;
  };
  document.addEventListener('touchend', touchEnd, { passive: true });
  document.addEventListener('touchcancel', touchEnd, { passive: true });
  document.addEventListener('touchmove', (e) => {
    if (!settingsOpen) e.preventDefault();
  }, { passive: false });
  ['gesturestart', 'gesturechange', 'contextmenu', 'dblclick', 'selectstart'].forEach((t) =>
    document.addEventListener(t, (e) => e.preventDefault(), { passive: false })
  );

  // ---------- Settings screen ----------
  const previewEl = $('#preview'), backEl = $('#back');
  const autoJamEl = $('#autoJam'), jamCountEl = $('#jamCount');

  function syncSettingsUI() {
    backEl.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.v === settings.back));
    autoJamEl.checked = settings.autoJam;
    jamCountEl.textContent = settings.autoJamAfter;
    previewEl.innerHTML = foldedCardSVG(settings.back);
  }
  function change(patch) { Object.assign(settings, patch); saveSettings(); applySettings(); syncSettingsUI(); }

  backEl.addEventListener('click', (e) => { const v = e.target.dataset.v; if (v) change({ back: v }); });
  autoJamEl.addEventListener('change', () => change({ autoJam: autoJamEl.checked }));
  $('#jamMinus').addEventListener('click', () => change({ autoJamAfter: Math.max(1, settings.autoJamAfter - 1) }));
  $('#jamPlus').addEventListener('click', () => change({ autoJamAfter: Math.min(30, settings.autoJamAfter + 1) }));
  $('#testDing').addEventListener('click', () => { unlockAudio(); ding(); });
  $('#testClunk').addEventListener('click', () => { unlockAudio(); clunk(); });
  $('#testHaptic').addEventListener('click', () => haptic(12));
  $('#done').addEventListener('click', closeSettings);

  function openSettings() {
    settingsOpen = true;
    syncSettingsUI();
    settingsEl.hidden = false;
    settingsEl.scrollTop = 0;
  }
  function closeSettings() {
    settingsOpen = false;
    settingsEl.hidden = true;
    reset();
  }

  // ---------- Boot ----------
  applySettings();
  reset();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    // When a newer service worker takes over (e.g. replacing an old cache-first one),
    // reload once so the page is running the fresh files.
    const hadController = !!navigator.serviceWorker.controller;
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || reloaded || state !== 'ready') return;
      reloaded = true;
      location.reload();
    });
    window.addEventListener('load', () =>
      navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(() => {})
    );
  }
})();
