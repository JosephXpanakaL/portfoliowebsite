(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const deck = $('.panel-deck');
  const panels = $$('.panel');
  let activeIndex = 0;
  let wheelLocked = false;

  addEventListener('load', () => setTimeout(() => document.body.classList.add('loaded'), reduced ? 50 : 350));

  const updateActive = index => {
    activeIndex = Math.max(0, Math.min(panels.length - 1, index));
    $$('.side-rail a').forEach(a => a.classList.toggle('active', a.dataset.panel === panels[activeIndex].id));
  };
  const goTo = (target, smooth = true) => {
    const index = typeof target === 'number' ? target : panels.findIndex(p => p.id === target);
    if (index < 0) return;
    updateActive(index);
    panels[index].scrollIntoView({ behavior: reduced || !smooth ? 'auto' : 'smooth', block: 'start' });
  };
  $$('[data-panel]').forEach(link => link.addEventListener('click', e => {
    e.preventDefault();
    goTo(link.dataset.panel);
    closeMenu();
  }));

  deck.addEventListener('wheel', e => {
    if (e.ctrlKey || Math.abs(e.deltaY) < 16 || e.target.closest('.project-grid,.chat-log,.message-form')) return;
    e.preventDefault();
    if (wheelLocked) return;
    wheelLocked = true;
    goTo(activeIndex + (e.deltaY > 0 ? 1 : -1));
    setTimeout(() => { wheelLocked = false; }, reduced ? 150 : 750);
  }, { passive: false });
  addEventListener('keydown', e => {
    if (/INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
    if (['ArrowDown','PageDown'].includes(e.key)) { e.preventDefault(); goTo(activeIndex + 1); }
    if (['ArrowUp','PageUp'].includes(e.key)) { e.preventDefault(); goTo(activeIndex - 1); }
    if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    if (e.key === 'End') { e.preventDefault(); goTo(panels.length - 1); }
  });

  const panelObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) updateActive(panels.indexOf(entry.target));
  }), { root: deck, threshold: .62 });
  panels.forEach(panel => panelObserver.observe(panel));
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  }), { root: deck, threshold: .16 });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  const menu = $('.menu-overlay');
  const menuButton = $('.menu-button');
  function closeMenu() {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    menuButton.setAttribute('aria-expanded', 'false');
  }
  menuButton.addEventListener('click', () => {
    const open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuButton.setAttribute('aria-expanded', String(open));
  });

  if (matchMedia('(pointer:fine)').matches && !reduced) {
    const dot = $('.cursor-dot');
    const ring = $('.cursor-ring');
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    addEventListener('mousemove', e => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
    });
    const animateCursor = () => {
      rx += (x - rx) * .18; ry += (y - ry) * .18;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
    $$('a,button,input,textarea').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('active'));
    });
  }

  let audioContext, gain, oscillators = [];
  const sound = $('.sound-toggle');
  const stopAudio = () => {
    oscillators.forEach(node => { try { node.stop(); } catch {} });
    oscillators = [];
    if (gain && audioContext) gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + .5);
    sound.setAttribute('aria-pressed', 'false');
    $('.sound-label', sound).textContent = 'Sound off';
  };
  sound.addEventListener('click', async () => {
    if (sound.getAttribute('aria-pressed') === 'true') return stopAudio();
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    await audioContext.resume();
    gain = audioContext.createGain();
    gain.gain.setValueAtTime(.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.022, audioContext.currentTime + 1);
    gain.connect(audioContext.destination);
    [55, 82.4, 110].forEach((frequency, i) => {
      const oscillator = audioContext.createOscillator();
      const level = audioContext.createGain();
      oscillator.type = i === 1 ? 'triangle' : 'sine';
      oscillator.frequency.value = frequency;
      level.gain.value = .12 / (i + 1);
      oscillator.connect(level).connect(gain);
      oscillator.start();
      oscillators.push(oscillator);
    });
    sound.setAttribute('aria-pressed', 'true');
    $('.sound-label', sound).textContent = 'Sound on';
  });

  $('.message-form').addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(data.get('subject'));
    const body = encodeURIComponent(`Hi Blessen,\n\n${data.get('message')}\n\nFrom: ${data.get('name')} (${data.get('email')})`);
    $('.form-status').textContent = 'Opening your email app with the message prepared…';
    location.href = `mailto:blessenpshaju@gmail.com?subject=${subject}&body=${body}`;
  });

  const chatLaunch = $('.chat-launch');
  const chatPanel = $('.chat-panel');
  const chatInput = $('#chat-input');
  const chatLog = $('.chat-log');
  const toggleChat = force => {
    const open = force ?? !chatPanel.classList.contains('open');
    chatPanel.classList.toggle('open', open);
    chatPanel.setAttribute('aria-hidden', String(!open));
    chatLaunch.setAttribute('aria-expanded', String(open));
    if (open) setTimeout(() => chatInput.focus(), 250);
  };
  const answers = [
    { keys: ['best','project','work','built'], text: 'Start with RigMasterAI for product thinking, LARS for full-stack fundamentals, and AgroPrescribe for collaborative AI + IoT work.' },
    { keys: ['skill','stack','technology','language'], text: 'Blessen works with Python, Java, C/C++, PHP and JavaScript; PostgreSQL, MySQL and Oracle; plus Linux, Docker, Bash and Git.' },
    { keys: ['education','study','college','degree'], text: 'He is pursuing an MSc in Computer Science at Rajagiri College of Social Sciences after completing a BSc in Computer Science at SSV College under Mahatma Gandhi University.' },
    { keys: ['certificate','credential','course','achievement'], text: 'His credentials include AI Essentials, SQL and Relational Databases 101 from Cognitive Class / IBM, Generative AI for Project Managers from PMI, and Word Processing and Data Entry from KELTRON.' },
    { keys: ['contact','email','hire','available'], text: 'Blessen is open to software, data and cloud opportunities. Use the direct-message form or email blessenpshaju@gmail.com.' }
  ];
  const addMessage = (text, type) => {
    const node = document.createElement('div');
    node.className = `message ${type}`;
    node.textContent = text;
    chatLog.append(node);
    chatLog.scrollTop = chatLog.scrollHeight;
  };
  const ask = question => {
    const text = question.trim();
    if (!text) return;
    addMessage(text, 'user');
    chatInput.value = '';
    const words = text.toLowerCase().split(/\W+/);
    const match = answers.find(item => item.keys.some(key => words.some(word => word.includes(key) || key.includes(word))));
    setTimeout(() => addMessage(match?.text || 'Ask me about Blessen’s projects, skills, education or availability.', 'bot'), 300);
  };
  chatLaunch.addEventListener('click', () => toggleChat());
  $('.chat-panel header button').addEventListener('click', () => toggleChat(false));
  $('.chat-form').addEventListener('submit', e => { e.preventDefault(); ask(chatInput.value); });
  $$('.chat-suggestions button').forEach(button => button.addEventListener('click', () => ask(button.textContent)));
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); toggleChat(false); } });
})();
