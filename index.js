/* ==========================================================================
   COSMIC PIXELVERSE INTERACTIVE LOGIC (FINAL REVISED)
   Client: Guruhari
   ========================================================================== */

// ==========================================
// YOUTUBE PLAYER — Global scope to avoid
// timing race with async YT iframe API load
// ==========================================
const TRACK_ID    = 'nL-6P0x_N-E'; // Space Ambient Music (Cosmic Drift II)
let ytPlayerReady  = false;
let ytPlaying      = false;
let ytMuted        = true;          // muted by default

window.onYouTubeIframeAPIReady = function () {
  window.ytPlayer = new YT.Player('youtube-player', {
    height: '1',
    width:  '1',
    videoId: TRACK_ID,
    playerVars: {
      autoplay:       0,
      controls:       0,
      disablekb:      1,
      fs:             0,
      rel:            0,
      modestbranding: 1,
      loop:           1,
      playlist:       TRACK_ID   // required for loop to work
    },
    events: {
      onReady:       onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
};

function onPlayerReady () {
  ytPlayerReady = true;
  window.ytPlayer.mute();           // start muted
  updateMuteIcon();
}

function onPlayerStateChange (e) {
  const widget = document.getElementById('synth-widget');
  if (e.data === YT.PlayerState.PLAYING) {
    ytPlaying = true;
    if (widget) widget.classList.add('playing');
  } else {
    ytPlaying = false;
    if (widget) widget.classList.remove('playing');
  }
}

function updateMuteIcon () {
  const btn = document.getElementById('synth-mute');
  if (!btn) return;
  btn.innerHTML = ytMuted
    ? '<i class="fa-solid fa-volume-xmark"></i>'
    : '<i class="fa-solid fa-volume-high"></i>';
}

// ==========================================
// DOM READY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

  // ── Inject YouTube API script ──────────────────────────────────────────
  const ytScript = document.createElement('script');
  ytScript.src   = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(ytScript);


  // ==========================================
  // 1. CUSTOM CURSOR
  // ==========================================
  const cursorDot    = document.getElementById('cursor-dot');
  const cursorCircle = document.getElementById('cursor-circle');
  let mouseX = window.innerWidth  / 2;
  let mouseY = window.innerHeight / 2;
  let cx = mouseX, cy = mouseY;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
    }
  });

  (function lagCursor () {
    cx += (mouseX - cx) * 0.12;
    cy += (mouseY - cy) * 0.12;
    if (cursorCircle) {
      cursorCircle.style.left = cx + 'px';
      cursorCircle.style.top  = cy + 'px';
    }
    requestAnimationFrame(lagCursor);
  })();

  document.querySelectorAll('a, button, input, textarea, [data-tilt], .cert-card')
    .forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (cursorCircle) {
          cursorCircle.style.transform   = 'translate(-50%,-50%) scale(1.5)';
          cursorCircle.style.borderColor = 'var(--accent-cyan)';
          cursorCircle.style.background  = 'rgba(6,182,212,0.05)';
        }
        if (cursorDot) {
          cursorDot.style.background = 'var(--accent-purple)';
          cursorDot.style.transform  = 'translate(-50%,-50%) scale(0.5)';
        }
      });
      el.addEventListener('mouseleave', () => {
        if (cursorCircle) {
          cursorCircle.style.transform   = 'translate(-50%,-50%) scale(1)';
          cursorCircle.style.borderColor = 'rgba(168,85,247,0.5)';
          cursorCircle.style.background  = 'transparent';
        }
        if (cursorDot) {
          cursorDot.style.background = 'var(--accent-cyan)';
          cursorDot.style.transform  = 'translate(-50%,-50%) scale(1)';
        }
      });
    });


  // ==========================================
  // 2. GALAXY BACKGROUND CANVAS
  //    Three-layer star field + spiral arms +
  //    nebula clouds + glowing core.
  //    Canvas is FIXED (CSS z-index: -10) so
  //    it never affects scroll or layout.
  // ==========================================
  const cosmicCanvas = document.getElementById('cosmic-canvas');
  if (cosmicCanvas) {
    const ctx = cosmicCanvas.getContext('2d');

    let W = 0, H = 0;
    
    // Cosmic Entities
    let stars = [];
    let nebulas = [];
    let planets = [];
    let galaxies = [];
    let blackHoles = [];
    let wormholes = [];
    let comets = [];
    let nurseryStars = [];

    const TAU = Math.PI * 2;
    const rand = (min, max) => Math.random() * (max - min) + min;

    function resizeCosmic () {
      cosmicCanvas.width  = window.innerWidth;
      cosmicCanvas.height = window.innerHeight;
      W = cosmicCanvas.width;
      H = cosmicCanvas.height;
      initGalaxy();
    }

    function initGalaxy () {
      stars = [];
      nebulas = [];
      planets = [];
      galaxies = [];
      blackHoles = [];
      wormholes = [];
      comets = [];
      nurseryStars = [];

      // 1. Generate 200 Background Stars
      for (let i = 0; i < 200; i++) {
        stars.push({
          x: rand(0, W),
          y: rand(0, H),
          r: rand(0.5, 1.8),
          vx: rand(-0.25, -0.05),
          alpha: rand(0.2, 0.9),
          flicker: rand(0.01, 0.03),
          phase: rand(0, TAU)
        });
      }

      // 2. Generate 3 Stellar Nurseries (Nebulas with dense glowing gas)
      const nebulaColors = [
        'rgba(168, 85, 247, 0.16)', // Violet / Purple
        'rgba(6, 182, 212, 0.14)',  // Cyan / Blue
        'rgba(236, 72, 153, 0.12)'  // Pink / Magenta
      ];
      for (let i = 0; i < 3; i++) {
        const nx = rand(W * 0.15, W * 0.85);
        const ny = rand(H * 0.15, H * 0.85);
        const nr = rand(W * 0.25, W * 0.4);
        nebulas.push({
          x: nx, y: ny, r: nr,
          color: nebulaColors[i],
          vx: rand(-0.06, 0.06),
          vy: rand(-0.04, 0.04)
        });

        // Add 8 baby stars inside this nursery
        for (let j = 0; j < 8; j++) {
          nurseryStars.push({
            nurseryIdx: i,
            relX: rand(-nr * 0.4, nr * 0.4),
            relY: rand(-nr * 0.4, nr * 0.4),
            r: rand(1.5, 3.5),
            color: Math.random() > 0.5 ? '#e0f2fe' : '#fef08a', // bright blue-white or yellow
            pulseSpeed: rand(0.02, 0.05),
            phase: rand(0, TAU)
          });
        }
      }

      // 3. Generate 2 Majestic Spiral Galaxies
      galaxies.push({
        x: W * 0.25,
        y: H * 0.3,
        maxR: Math.min(W, H) * 0.16,
        arms: 2,
        turns: 1.8,
        angle: rand(0, TAU),
        spinSpeed: 0.0012,
        color: 'rgba(6, 182, 212, 0.25)' // Cyan galaxy
      });
      galaxies.push({
        x: W * 0.75,
        y: H * 0.75,
        maxR: Math.min(W, H) * 0.2,
        arms: 3,
        turns: 2.2,
        angle: rand(0, TAU),
        spinSpeed: -0.0008, // rotates other way
        color: 'rgba(168, 85, 247, 0.22)' // Purple galaxy
      });

      // 4. Generate 1 Black Hole (Active Event Horizon)
      blackHoles.push({
        x: W * 0.8,
        y: H * 0.25,
        r: 18,
        diskR: 55,
        angle: 0,
        spinSpeed: 0.02
      });

      // 5. Generate 1 Wormhole (Swirling Space Portal)
      wormholes.push({
        x: W * 0.15,
        y: H * 0.8,
        r: 40,
        angle: 0,
        spinSpeed: -0.015
      });

      // 6. Generate 3 Drifting Planets
      const planetColors = [
        { stop1: '#38bdf8', stop2: '#0369a1' }, // Blue planet
        { stop1: '#fbbf24', stop2: '#9a3412' }, // Orange gas giant
        { stop1: '#34d399', stop2: '#065f46' }  // Emerald world
      ];
      for (let i = 0; i < 3; i++) {
        planets.push({
          x: rand(0, W),
          y: rand(0, H),
          r: rand(14, 28),
          vx: rand(-0.15, -0.04),
          vy: rand(-0.03, 0.03),
          colors: planetColors[i],
          hasRing: i === 1, // Only the gas giant gets a ring
          ringAngle: rand(0, TAU)
        });
      }
    }

    // Helper to draw a shooting comet
    function spawnComet () {
      comets.push({
        x: rand(W * 0.3, W),
        y: 0,
        vx: rand(-4, -2),
        vy: rand(2, 4),
        length: rand(80, 150),
        width: rand(1.5, 3),
        alpha: 1.0,
        decay: rand(0.005, 0.012)
      });
    }

    resizeCosmic();
    window.addEventListener('resize', resizeCosmic);

    let rafId;
    (function drawCosmic () {
      // Clear background
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#02040a'; // Deep space black
      ctx.fillRect(0, 0, W, H);

      // ── 1. Draw Stellar Nurseries (Nebulas) ──
      nebulas.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -n.r || n.x > W + n.r) n.vx *= -1;
        if (n.y < -n.r || n.y > H + n.r) n.vy *= -1;

        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0, n.color);
        g.addColorStop(0.6, n.color.replace('0.1', '0.04'));
        g.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, TAU);
        ctx.fill();
      });

      // ── 2. Draw Baby Stars in Stellar Nurseries ──
      nurseryStars.forEach(s => {
        const parent = nebulas[s.nurseryIdx];
        if (!parent) return;
        
        const absoluteX = parent.x + s.relX;
        const absoluteY = parent.y + s.relY;
        
        s.phase += s.pulseSpeed;
        const currentAlpha = 0.4 + 0.6 * Math.abs(Math.sin(s.phase));
        
        // Star glow
        const sg = ctx.createRadialGradient(absoluteX, absoluteY, 0, absoluteX, absoluteY, s.r * 3);
        sg.addColorStop(0, s.color);
        sg.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.globalAlpha = currentAlpha * 0.8;
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(absoluteX, absoluteY, s.r * 3, 0, TAU);
        ctx.fill();
        
        // Star core
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(absoluteX, absoluteY, s.r * 0.8, 0, TAU);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // ── 3. Draw Majestic Galaxies ──
      galaxies.forEach(g => {
        g.angle += g.spinSpeed;
        const POINTS = 200;
        
        // Draw spiral arms
        for (let a = 0; a < g.arms; a++) {
          const armBase = (a / g.arms) * TAU;
          for (let i = 0; i < POINTS; i++) {
            const t = i / POINTS; // 0 to 1
            const spiralAngle = armBase + t * TAU * g.turns + g.angle;
            const dist = t * g.maxR;
            
            // Scatter particles for organic look
            const scatter = (Math.sin(t * 20) * 8 * (1 - t));
            const px = g.x + (dist + scatter) * Math.cos(spiralAngle);
            const py = g.y + (dist + scatter) * Math.sin(spiralAngle) * 0.7; // slightly tilted
            
            const brightness = (1 - t) * 0.25;
            ctx.fillStyle = g.color;
            ctx.globalAlpha = brightness;
            ctx.beginPath();
            ctx.arc(px, py, rand(0.6, 1.6), 0, TAU);
            ctx.fill();
          }
        }
        
        // Galaxy core glow
        const cg = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.maxR * 0.2);
        cg.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        cg.addColorStop(0.4, g.color);
        cg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = cg;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.maxR * 0.2, 0, TAU);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // ── 4. Draw Black Hole ──
      blackHoles.forEach(bh => {
        bh.angle += bh.spinSpeed;
        
        // Accretion disk (glowing orbiting light)
        ctx.save();
        ctx.translate(bh.x, bh.y);
        ctx.rotate(0.2); // Tilted disk
        
        const dg = ctx.createRadialGradient(0, 0, bh.r, 0, 0, bh.diskR);
        dg.addColorStop(0, '#f97316'); // Bright orange Event Horizon edge
        dg.addColorStop(0.3, '#facc15'); // Yellow accretion
        dg.addColorStop(0.7, 'rgba(236, 72, 153, 0.15)'); // Magenta lens outer halo
        dg.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = dg;
        ctx.beginPath();
        ctx.ellipse(0, 0, bh.diskR, bh.diskR * 0.35, 0, 0, TAU);
        ctx.fill();
        
        ctx.restore();

        // Event Horizon (Absolute Black Center)
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(bh.x, bh.y, bh.r, 0, TAU);
        ctx.fill();

        // Gravitational lensing highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(bh.x, bh.y, bh.r + 1.5, 0, TAU);
        ctx.stroke();
      });

      // ── 5. Draw Wormhole ──
      wormholes.forEach(wh => {
        wh.angle += wh.spinSpeed;
        
        ctx.save();
        ctx.translate(wh.x, wh.y);
        ctx.rotate(wh.angle);
        
        // Swirling vortex layers
        for (let i = 0; i < 6; i++) {
          const size = wh.r * (1 - i * 0.15);
          const wg = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
          wg.addColorStop(0, '#ffffff'); // Singularity core
          wg.addColorStop(0.3, 'rgba(6, 182, 212, 0.35)'); // Cyan swirl
          wg.addColorStop(0.7, 'rgba(99, 102, 241, 0.2)'); // Indigo swirl
          wg.addColorStop(1, 'rgba(0,0,0,0)');
          
          ctx.fillStyle = wg;
          ctx.beginPath();
          ctx.ellipse(0, 0, size, size * 0.6, (i * Math.PI / 6), 0, TAU);
          ctx.fill();
        }
        
        ctx.restore();
      });

      // ── 6. Draw Stars ──
      stars.forEach(s => {
        s.x += s.vx;
        s.phase += s.flicker;
        if (s.x < 0) {
          s.x = W;
          s.y = rand(0, H);
        }

        const currentAlpha = s.alpha * (0.3 + 0.7 * Math.abs(Math.sin(s.phase)));
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, TAU);
        ctx.fill();
      });

      // ── 7. Draw Planets ──
      planets.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.ringAngle += 0.002;
        
        if (p.x < -p.r * 2) {
          p.x = W + p.r * 2;
          p.y = rand(0, H);
        }

        const g = ctx.createRadialGradient(
          p.x - p.r * 0.3, p.y - p.r * 0.3, p.r * 0.1, 
          p.x, p.y, p.r
        );
        g.addColorStop(0, p.colors.stop1);
        g.addColorStop(1, p.colors.stop2);

        if (p.hasRing) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.ringAngle);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r * 2.2, p.r * 0.6, 0, 0, TAU);
          ctx.strokeStyle = `rgba(255, 255, 255, 0.15)`;
          ctx.lineWidth = p.r * 0.25;
          ctx.stroke();
          ctx.restore();
        }

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, TAU);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.arc(p.x + p.r * 0.2, p.y + p.r * 0.2, p.r * 0.9, 0, TAU);
        ctx.fill();
      });

      // ── 8. Draw Comets ──
      if (Math.random() < 0.004 && comets.length < 2) {
        spawnComet();
      }

      comets.forEach((c, idx) => {
        c.x += c.vx;
        c.y += c.vy;
        c.alpha -= c.decay;

        if (c.alpha <= 0 || c.x < -c.length || c.y > H + c.length) {
          comets.splice(idx, 1);
          return;
        }

        ctx.save();
        ctx.beginPath();
        const grad = ctx.createLinearGradient(c.x, c.y, c.x - c.vx * (c.length / 5), c.y - c.vy * (c.length / 5));
        grad.addColorStop(0, `rgba(255, 255, 255, ${c.alpha})`);
        grad.addColorStop(0.15, `rgba(14, 165, 233, ${c.alpha * 0.7})`); // Cyan comet tail
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = c.width;
        ctx.lineCap = 'round';
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x - c.vx * 3, c.y - c.vy * 3); // Head of comet
        ctx.stroke();

        // Draw long tail
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = c.width * 0.4;
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x - c.vx * (c.length / 4), c.y - c.vy * (c.length / 4));
        ctx.stroke();
        
        ctx.restore();
      });

      rafId = requestAnimationFrame(drawCosmic);
    })();
  }


  // ==========================================
  // 3. TYPING GLITCH EFFECT
  // ==========================================
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const phrases = [
      'Building Digital Experiences',
      'Creating Modern Web Applications',
      'Exploring Future Technologies',
      'Turning Ideas into Reality'
    ];
    let pi = 0, ci = 0, deleting = false, speed = 80;

    function type () {
      const phrase = phrases[pi];
      if (deleting) {
        typingEl.textContent = phrase.substring(0, ci - 1);
        ci--;
        speed = 40;
      } else {
        let ch = phrase[ci];
        if (Math.random() < 0.03) {
          ch = '!@#$%/+*{}[]'[Math.floor(Math.random() * 12)];
        }
        typingEl.textContent = phrase.substring(0, ci) + ch;
        ci++;
        speed = 90;
      }
      if (!deleting && ci === phrase.length)  { deleting = true;  speed = 2200; }
      else if (deleting && ci === 0)          { deleting = false; pi = (pi + 1) % phrases.length; speed = 400; }
      setTimeout(type, speed);
    }
    setTimeout(type, 1000);
  }


  // ==========================================
  // 4. INTERACTIVE 3D SKILLS GALAXY
  // ==========================================
  const skillsCanvas = document.getElementById('skills-canvas');
  if (skillsCanvas) {
    const sCtx = skillsCanvas.getContext('2d');

    const nodes = [
      { name: 'HTML',       type: 'FRONTEND', level: '95%', val: 95, color: '#06b6d4', sx:  0.8,  sy:  0.2, sz:  0.1 },
      { name: 'CSS',        type: 'FRONTEND', level: '90%', val: 90, color: '#06b6d4', sx: -0.7,  sy:  0.4, sz:  0.3 },
      { name: 'JavaScript', type: 'FRONTEND', level: '88%', val: 88, color: '#06b6d4', sx:  0.1,  sy: -0.8, sz:  0.5 },
      { name: 'React',      type: 'FRONTEND', level: '85%', val: 85, color: '#06b6d4', sx:  0.5,  sy: -0.4, sz: -0.7 },
      { name: 'Next.js',    type: 'FRONTEND', level: '75%', val: 75, color: '#06b6d4', sx: -0.4,  sy: -0.5, sz: -0.6 },
      { name: 'Node.js',    type: 'BACKEND',  level: '80%', val: 80, color: '#a855f7', sx: -0.3,  sy:  0.8, sz: -0.3 },
      { name: 'Express.js', type: 'BACKEND',  level: '80%', val: 80, color: '#a855f7', sx:  0.4,  sy:  0.7, sz: -0.4 },
      { name: 'MongoDB',    type: 'DATABASE', level: '75%', val: 75, color: '#a855f7', sx: -0.8,  sy: -0.2, sz:  0.4 }
    ];

    const FOCAL = 300;
    let radius  = 165;
    let aX = 0.005, aY = 0.005;
    let dragging = false, lastMX = 0, lastMY = 0;
    let cmX = -9999, cmY = -9999;
    let hovered = null;
    const particles = [];

    const hudDefault = document.getElementById('hud-default-text');
    const hudActive  = document.getElementById('hud-active-text');
    const hudName    = document.getElementById('hud-skill-name');
    const hudType    = document.getElementById('hud-skill-type');
    const hudPct     = document.getElementById('hud-skill-percent');
    const hudFill    = document.getElementById('hud-skill-fill');

    function resizeSkills () {
      const p = skillsCanvas.parentElement;
      if (p) { skillsCanvas.width = p.clientWidth; skillsCanvas.height = p.clientHeight; }
      radius = skillsCanvas.width < 500 ? 110 : 165;
    }
    window.addEventListener('resize', resizeSkills);
    resizeSkills();

    skillsCanvas.addEventListener('mousedown', e => {
      dragging = true;
      const r = skillsCanvas.getBoundingClientRect();
      lastMX = e.clientX - r.left; lastMY = e.clientY - r.top;
    });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      const r = skillsCanvas.getBoundingClientRect();
      const nx = e.clientX - r.left, ny = e.clientY - r.top;
      aY = (nx - lastMX) * 0.005;
      aX = (ny - lastMY) * -0.005;
      lastMX = nx; lastMY = ny;
    });
    window.addEventListener('mouseup', () => { dragging = false; });

    skillsCanvas.addEventListener('mousemove', e => {
      const r = skillsCanvas.getBoundingClientRect();
      cmX = e.clientX - r.left; cmY = e.clientY - r.top;
    });
    skillsCanvas.addEventListener('mouseleave', () => {
      cmX = -9999; cmY = -9999; hovered = null;
      if (hudActive)  hudActive.classList.add('hidden');
      if (hudDefault) hudDefault.classList.remove('hidden');
    });

    function sparks (x, y, color) {
      for (let i = 0; i < 8; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          size: Math.random() * 2 + 1,
          life: 1.0,
          decay: Math.random() * 0.03 + 0.02,
          color
        });
      }
    }

    (function drawSkills () {
      sCtx.clearRect(0, 0, skillsCanvas.width, skillsCanvas.height);
      const cx = skillsCanvas.width / 2, cy = skillsCanvas.height / 2;

      if (!dragging) {
        aX += (0.002 - aX) * 0.03;
        aY += (0.002 - aY) * 0.03;
      }

      // rotate each node
      nodes.forEach(n => {
        const x1 = n.sx * Math.cos(aY) - n.sz * Math.sin(aY);
        const z1 = n.sz * Math.cos(aY) + n.sx * Math.sin(aY);
        const y2 = n.sy * Math.cos(aX) - z1 * Math.sin(aX);
        const z2 = z1 * Math.cos(aX) + n.sy * Math.sin(aX);
        n.sx = x1; n.sy = y2; n.sz = z2;

        const ax = n.sx * radius, ay = n.sy * radius, az = n.sz * radius;
        const sc = FOCAL / (FOCAL + az);
        n.projX = cx + ax * sc;
        n.projY = cy + ay * sc;
        n.projSize = Math.max(12, (n.sz + 1.2) * 15 * sc);
        n.depthZ = az;
      });

      const sorted = [...nodes].sort((a, b) => b.depthZ - a.depthZ);

      // connection lines
      for (let i = 0; i < sorted.length; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
          const a = sorted[i], b = sorted[j];
          const d = Math.hypot(a.sx - b.sx, a.sy - b.sy, a.sz - b.sz);
          if (d < 1.45) {
            const alpha = Math.min(0.25, (a.depthZ + radius) / (radius * 2) * 0.3);
            sCtx.strokeStyle = `rgba(168,85,247,${alpha})`;
            sCtx.lineWidth = 1;
            sCtx.beginPath();
            sCtx.moveTo(a.projX, a.projY);
            sCtx.lineTo(b.projX, b.projY);
            sCtx.stroke();
          }
        }
      }

      // hover detection
      let curHover = null, minD = 20;
      sorted.forEach(n => {
        const d = Math.hypot(cmX - n.projX, cmY - n.projY);
        if (d < n.projSize && d < minD) { curHover = n; minD = d; }
      });

      // draw nodes
      sorted.forEach(n => {
        const isHov = curHover === n;
        const da    = (n.depthZ + radius) / (radius * 2);
        const alpha = 0.2 + da * 0.8;

        sCtx.shadowBlur   = isHov ? 25 : 8;
        sCtx.shadowColor  = n.color;
        sCtx.fillStyle    = isHov ? n.color : 'rgba(10,17,36,0.8)';
        sCtx.beginPath();
        sCtx.arc(n.projX, n.projY, n.projSize / 2, 0, Math.PI * 2);
        sCtx.fill();

        sCtx.strokeStyle = n.color;
        sCtx.lineWidth   = isHov ? 3 : 1.5;
        sCtx.globalAlpha = alpha;
        sCtx.beginPath();
        sCtx.arc(n.projX, n.projY, n.projSize / 2, 0, Math.PI * 2);
        sCtx.stroke();
        sCtx.globalAlpha = 1;

        if (n.depthZ > -radius * 0.6) {
          sCtx.shadowBlur  = 0;
          sCtx.font        = `${isHov ? 'bold ' : ''}11px "JetBrains Mono",monospace`;
          sCtx.fillStyle   = isHov ? '#fff' : `rgba(148,163,184,${alpha})`;
          sCtx.textAlign   = 'center';
          sCtx.fillText(n.name, n.projX, n.projY + n.projSize + 5);
        }

        if (isHov && hovered !== n) {
          hovered = n;
          sparks(n.projX, n.projY, n.color);
          if (hudDefault) hudDefault.classList.add('hidden');
          if (hudActive)  {
            hudActive.classList.remove('hidden');
            hudName.textContent      = n.name;
            hudType.textContent      = n.type;
            hudPct.textContent       = n.level;
            hudFill.style.width      = n.level;
            hudFill.style.background = n.color;
          }
        }
      });
      sCtx.shadowBlur = 0;

      // particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        sCtx.fillStyle   = p.color;
        sCtx.globalAlpha = p.life;
        sCtx.beginPath();
        sCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        sCtx.fill();
      }
      sCtx.globalAlpha = 1;

      requestAnimationFrame(drawSkills);
    })();
  }


  // ==========================================
  // 5. GITHUB CONTRIBUTION MATRIX
  // ==========================================
  const matrixGrid = document.getElementById('matrix-grid');
  if (matrixGrid) {
    const cells = [];
    const TOTAL = 364; // 52 weeks × 7 days

    for (let i = 0; i < TOTAL; i++) {
      const cell  = document.createElement('div');
      const factor = i / TOTAL;
      const rand   = Math.random();
      let level = 0;
      if (rand < 0.12 + factor * 0.22) {
        level = Math.floor(Math.random() * 4) + 1;
      }
      cell.className = `matrix-cell level-${level}`;
      matrixGrid.appendChild(cell);
      cells.push(cell);
    }

    // wave pulse animation
    function pulse () {
      for (let col = 0; col < 52; col++) {
        setTimeout(() => {
          for (let row = 0; row < 7; row++) {
            const cell = cells[col * 7 + row];
            if (!cell) return;
            cell.style.transform  = 'scale(1.25)';
            cell.style.boxShadow  = '0 0 8px rgba(6,182,212,0.4)';
            setTimeout(() => {
              cell.style.transform = 'scale(1)';
              cell.style.boxShadow = 'none';
            }, 300);
          }
        }, col * 18);
      }
    }
    setTimeout(pulse, 1800);
    setInterval(pulse, 10000);
  }


  // ==========================================
  // 6. MUSIC PLAYER CONTROLS (Play / Stop / Mute / Toggle)
  // ==========================================
  const playBtn = document.getElementById('synth-play');
  const stopBtn = document.getElementById('synth-stop');
  const muteBtn = document.getElementById('synth-mute');
  const toggleBtn = document.getElementById('synth-toggle');
  const synthWidget = document.getElementById('synth-widget');

  if (toggleBtn && synthWidget) {
    toggleBtn.addEventListener('click', () => {
      synthWidget.classList.toggle('expanded');
      const icon = toggleBtn.querySelector('i');
      if (synthWidget.classList.contains('expanded')) {
        icon.classList.remove('fa-chevron-left');
        icon.classList.add('fa-chevron-right');
      } else {
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-chevron-left');
      }
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (!ytPlayerReady || !window.ytPlayer) return;
      // unmute on first play so user hears something
      if (ytMuted) {
        window.ytPlayer.unMute();
        ytMuted = false;
        updateMuteIcon();
      }
      window.ytPlayer.playVideo();
    });
  }

  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      if (!ytPlayerReady || !window.ytPlayer) return;
      window.ytPlayer.pauseVideo();
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      if (!ytPlayerReady || !window.ytPlayer) return;
      if (ytMuted) {
        window.ytPlayer.unMute();
        ytMuted = false;
      } else {
        window.ytPlayer.mute();
        ytMuted = true;
      }
      updateMuteIcon();
    });
  }


  // ==========================================
  // 7. 3D CARD TILT
  // ==========================================
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const tX  = ((e.clientY - r.top)  / r.height - 0.5) * -16;
      const tY  = ((e.clientX - r.left) / r.width  - 0.5) *  16;
      card.style.transform = `rotateX(${tX}deg) rotateY(${tY}deg) translateY(-8px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
  });


  // ==========================================
  // 8. SCROLL REVEAL
  // ==========================================
  const reveals = document.querySelectorAll('.scroll-reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('revealed'));
  }


  // ── Active nav link on scroll ─────────────────────────────────────────
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 250) current = sec.id;
    });
    navItems.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  });


  // ── Mobile nav toggle ─────────────────────────────────────────────────
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks   = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    navItems.forEach(a => a.addEventListener('click', () => navLinks.classList.remove('active')));
  }


  // ==========================================
  // 9. REAL-TIME VISITOR COUNTER
  // ==========================================
  const visitorEl = document.getElementById('visitor-count');

  async function fetchVisitors () {
    let count = 407;
    try {
      const res  = await fetch('https://api.counterapi.dev/v1/guruhari_portfolio_visits/global/up');
      const data = await res.json();
      if (data.value !== undefined) count = data.value;
      else if (data.count !== undefined) count = data.count;
    } catch {
      let backup = parseInt(localStorage.getItem('grh_visitors') || '407');
      backup++;
      localStorage.setItem('grh_visitors', backup);
      count = backup;
    }

    if (!visitorEl) return;
    const target = count.toString().padStart(6, '0');
    let tick = 0;
    function animate () {
      if (tick <= count) {
        visitorEl.textContent = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
        tick += Math.max(1, Math.floor(count / 30));
        setTimeout(animate, 25);
      } else {
        visitorEl.textContent = target;
      }
    }
    setTimeout(animate, 800);
  }
  fetchVisitors();


  // ── Footer year ───────────────────────────────────────────────────────
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  // ==========================================
  // 10. CONTACT FORM
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formResp    = document.getElementById('form-response');
  const submitBtn   = document.getElementById('btn-submit');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      submitBtn.innerHTML  = '<span>TRANSMITTING...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
      submitBtn.disabled   = true;
      setTimeout(() => {
        contactForm.classList.add('hidden');
        if (formResp) formResp.classList.remove('hidden');
      }, 1500);
    });
  }

}); // end DOMContentLoaded
