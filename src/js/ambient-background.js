/* Atmospheric Ambient Obsidian Canvas Engine
   - Pitch Obsidian Black Base (#030204)
   - Multi-layer slow-morphing Deep Ruby & Vibrant Crimson Aurora Glows
   - Ultra-clean subtle geometric tech dot matrix grid
   - Gentle floating luminous starlight micro-particles
   - Low-energy 60fps canvas engine with automatic tab-pause lifecycle
*/

export function initAmbientBackground() {
  const canvas = document.getElementById('ambient-canvas') || 
                 document.getElementById('galaxy-canvas') || 
                 document.getElementById('color-bends-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let animationFrameId = null;
  let dpr = 1;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  // Atmospheric Radial Aurora Glow Blobs with rich Crimson & Dark Ruby tones
  const auroras = [
    {
      xRatio: 0.20,
      yRatio: 0.25,
      baseRadius: 520,
      radius: 520,
      color: 'rgba(225, 29, 72, 0.24)', // Vibrant Crimson Red
      colorOuter: 'rgba(10, 2, 5, 0.0)',
      angle: 0.5,
      speed: 0.0004,
      driftX: 130,
      driftY: 85
    },
    {
      xRatio: 0.85,
      yRatio: 0.35,
      baseRadius: 580,
      radius: 580,
      color: 'rgba(190, 18, 60, 0.26)', // Deep Ruby Wine
      colorOuter: 'rgba(10, 2, 5, 0.0)',
      angle: 2.1,
      speed: -0.0003,
      driftX: 150,
      driftY: 95
    },
    {
      xRatio: 0.50,
      yRatio: 0.65,
      baseRadius: 620,
      radius: 620,
      color: 'rgba(244, 63, 94, 0.20)', // Radiant Rose Red Glow
      colorOuter: 'rgba(10, 2, 5, 0.0)',
      angle: 4.2,
      speed: 0.00025,
      driftX: 160,
      driftY: 90
    },
    {
      xRatio: 0.15,
      yRatio: 0.80,
      baseRadius: 480,
      radius: 480,
      color: 'rgba(159, 18, 57, 0.22)', // Rich Wine Red
      colorOuter: 'rgba(10, 2, 5, 0.0)',
      angle: 1.1,
      speed: -0.0002,
      driftX: 120,
      driftY: 75
    }
  ];

  // Subtle Floating Stardust
  const STARDUST_COUNT = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 16000), 45);
  const stardust = [];

  function createStardust() {
    stardust.length = 0;
    for (let i = 0; i < STARDUST_COUNT; i++) {
      const isRed = Math.random() > 0.5;
      stardust.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.4,
        baseAlpha: Math.random() * 0.4 + 0.15,
        pulseSpeed: Math.random() * 0.012 + 0.006,
        pulsePhase: Math.random() * Math.PI * 2,
        vy: -(Math.random() * 0.2 + 0.05),
        vx: (Math.random() - 0.5) * 0.08,
        color: isRed ? 'rgba(251, 113, 133, ' : 'rgba(255, 255, 255, '
      });
    }
  }

  window.addEventListener('resize', () => {
    resize();
    createStardust();
  }, { passive: true });

  resize();
  createStardust();

  let time = 0;

  function render() {
    if (!ctx) return;
    time += 1;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0A0205';
    ctx.fillRect(0, 0, width, height);

    // Subtle Geometric Dot Grid
    const gridSpacing = 44;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
    for (let gx = gridSpacing / 2; gx < width; gx += gridSpacing) {
      for (let gy = gridSpacing / 2; gy < height; gy += gridSpacing) {
        ctx.beginPath();
        ctx.arc(gx, gy, 0.75, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Morphing Ambient Aurora Blobs
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    auroras.forEach((aurora, i) => {
      aurora.angle += aurora.speed;
      
      const cx = width * aurora.xRatio + Math.cos(aurora.angle + i) * aurora.driftX;
      const cy = height * aurora.yRatio + Math.sin(aurora.angle * 0.8 + i) * aurora.driftY;
      const r = aurora.baseRadius + Math.sin(time * 0.006 + i) * 35;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, aurora.color);
      grad.addColorStop(0.6, aurora.color.replace(/[\d\.]+\)$/, '0.02)'));
      grad.addColorStop(1, aurora.colorOuter);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();

    // Floating Stardust Particles
    for (let i = 0; i < stardust.length; i++) {
      const p = stardust[i];

      p.y += p.vy;
      p.x += p.vx;
      p.pulsePhase += p.pulseSpeed;

      if (p.y < -10) p.y = height + 10;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      const pulse = Math.sin(p.pulsePhase) * 0.2;
      const currentAlpha = Math.max(0.08, Math.min(1, p.baseAlpha + pulse));

      ctx.fillStyle = `${p.color || 'rgba(255, 255, 255, '}${currentAlpha * 0.75})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    } else if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }
  });

  render();
}
