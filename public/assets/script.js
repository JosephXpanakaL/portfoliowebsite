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
    const previousIndex = activeIndex;
    activeIndex = Math.max(0, Math.min(panels.length - 1, index));
    $$('.side-rail a').forEach(a => a.classList.toggle('active', a.dataset.panel === panels[activeIndex].id));
    panels.forEach((panel, panelIndex) => {
      panel.classList.toggle('is-active', panelIndex === activeIndex);
      panel.classList.toggle('is-before', panelIndex < activeIndex);
      panel.classList.toggle('is-after', panelIndex > activeIndex);
    });
    document.documentElement.dataset.scrollDirection = activeIndex >= previousIndex ? 'next' : 'previous';
  };
  const playTransition = () => {
    if (reduced) return;
    const veil = $('.transition-veil');
    veil.classList.remove('play');
    void veil.offsetWidth;
    veil.classList.add('play');
  };
  const goTo = (target, smooth = true) => {
    const index = typeof target === 'number' ? target : panels.findIndex(p => p.id === target);
    if (index < 0) return;
    if (index !== activeIndex) playTransition();
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
  updateActive(0);

  const portraitStage = $('.hero-portrait-stage');
  if (portraitStage && !reduced && matchMedia('(pointer:fine)').matches) {
    portraitStage.addEventListener('pointermove', event => {
      const rect = portraitStage.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * 16;
      const y = ((event.clientY - rect.top) / rect.height - .5) * 12;
      portraitStage.style.setProperty('--portrait-x', `${x}px`);
      portraitStage.style.setProperty('--portrait-y', `${y}px`);
    });
    portraitStage.addEventListener('pointerleave', () => {
      portraitStage.style.setProperty('--portrait-x', '0px');
      portraitStage.style.setProperty('--portrait-y', '0px');
    });
  }

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

  const bgm = $('#portfolio-bgm');
  bgm.volume = .2;
  const sound = $('.sound-toggle');
  let fadeTimer;
  const fadeAudio = (target, duration = 650) => {
    clearInterval(fadeTimer);
    const start = bgm.volume;
    const started = performance.now();
    fadeTimer = setInterval(() => {
      const progress = Math.min(1, (performance.now() - started) / duration);
      bgm.volume = start + (target - start) * progress;
      if (progress === 1) clearInterval(fadeTimer);
    }, 30);
  };
  const stopAudio = () => {
    fadeAudio(0, 450);
    setTimeout(() => bgm.pause(), 470);
    sound.setAttribute('aria-pressed', 'false');
    $('.sound-label', sound).textContent = 'Sound off';
  };
  sound.addEventListener('click', async () => {
    if (sound.getAttribute('aria-pressed') === 'true') return stopAudio();
    bgm.volume = 0;
    await bgm.play();
    fadeAudio(.2, 900);
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
    { patterns: ['who is blessen','who is blesson','tell me about blessen','introduce blessen','blessen profile','short biography'], text: 'Blessen P Shaju is a computer science postgraduate student and early-career developer from Kerala. He focuses on software engineering, data analytics, databases and cloud-ready applications.' },
    { patterns: ['where is blessen from','blessen location','where does he live','which state is he from','is he from kerala'], text: 'Blessen is based in Kerala, India.' },
    { patterns: ['what is he studying','current studies','current course','academic background','education summary','study details'], text: 'Blessen is currently pursuing an MSc in Computer Science at Rajagiri College of Social Sciences. He previously completed a BSc in Computer Science under Mahatma Gandhi University.' },
    { patterns: ['msc details','masters degree','postgraduate course','where is he doing msc','rajagiri studies','current college'], text: 'His current postgraduate programme is MSc Computer Science at Rajagiri College of Social Sciences, Kerala, with study across software systems, algorithms, databases, cloud infrastructure and data analytics.' },
    { patterns: ['bsc details','bachelors degree','undergraduate course','where did he study bsc','ssv college','mahatma gandhi university'], text: 'He completed his BSc in Computer Science at SSV College, Valayanchirangara, affiliated with Mahatma Gandhi University.' },
    { patterns: ['what are his skills','core skills','technical skills','technology stack','programming languages','developer toolkit'], text: 'Blessen works with Python, Java, C, C++, PHP and JavaScript, alongside HTML5 and CSS3. His toolkit also includes SQL databases, Linux, Docker, Bash, Git and GitHub.' },
    { patterns: ['database skills','which databases','sql experience','data skills','data analytics skills','etl knowledge'], text: 'His data toolkit includes Python, Pandas, PostgreSQL, MySQL, Oracle SQL, relational database design and ETL concepts.' },
    { patterns: ['cloud skills','devops skills','deployment experience','linux knowledge','docker experience','version control'], text: 'His cloud and engineering foundations include Linux, Docker, Bash, Git, GitHub and application deployment.' },
    { patterns: ['computer science subjects','engineering foundations','academic skills','cs fundamentals','what concepts does he know'], text: 'His foundations include data structures, algorithms, DBMS, computer networks, operating systems and REST APIs.' },
    { patterns: ['show his projects','what has he built','project list','portfolio work','selected work','best projects'], text: 'Featured projects include RigMasterAI, LARS, Signal Pipeline and AgroPrescribe. Together they demonstrate product development, full-stack systems, data engineering and AI + IoT collaboration.' },
    { patterns: ['what is rigmaster','rigmasterai details','pc builder project','ai pc project','best live project'], text: 'RigMasterAI is a live intelligent PC-configuration product that uses compatibility reasoning to help users plan computer builds.' },
    { patterns: ['what is lars','lars project','lab system project','full stack project','role based system'], text: 'LARS is a role-based full-stack lab system for submissions, attendance and reporting, built around PHP, MySQL and access-control concepts.' },
    { patterns: ['what is signal pipeline','data pipeline project','job analysis project','python data project','pandas project'], text: 'Signal Pipeline is a data-engineering project focused on cleaning, transforming and explaining complex datasets using Python, SQL and Pandas.' },
    { patterns: ['what is agroprescribe','agriculture project','ai iot project','pesticide project','esp32 project'], text: 'AgroPrescribe combines AI and IoT concepts for crop diagnosis and precision pesticide mapping, using TypeScript, AI workflows and ESP32 hardware.' },
    { patterns: ['certificates list','what certificates','professional credentials','completed courses','certifications','verified learning'], text: 'His credentials include AI Essentials, SQL and Relational Databases 101 from Cognitive Class / IBM, Generative AI for Project Managers from PMI, and Word Processing and Data Entry from KELTRON.' },
    { patterns: ['ai certificate','artificial intelligence course','ai essentials','generative ai certificate','pmi course'], text: 'His AI-focused learning includes AI Essentials and PMI’s Generative AI for Project Managers credential.' },
    { patterns: ['sql certificate','database certificate','relational databases course','ibm certificate','cognitive class'], text: 'He completed SQL and Relational Databases 101 through Cognitive Class / IBM.' },
    { patterns: ['achievements','awards','professional achievement','presentation experience','public speaking','communication skills'], text: 'Blessen has developed professional confidence through public presentation, explaining ideas clearly and learning in public. The portfolio also shows him presenting and receiving recognition on stage.' },
    { patterns: ['hobbies','personal interests','what does he enjoy','interests outside study','free time activities'], text: 'The portfolio does not claim a separate personal-hobbies list. His demonstrated interests are building useful technology, exploring software and data systems, continuous learning and presenting ideas clearly.' },
    { patterns: ['strengths','best qualities','what is he good at','why hire him','professional qualities','soft skills'], text: 'His strongest qualities are practical problem-solving, clear communication, continuous learning and the ability to connect software, data and deployment into useful outcomes.' },
    { patterns: ['career goals','what roles','job interests','career interests','future plans','preferred field'], text: 'He is interested in early-career opportunities across software engineering, data analytics, databases and cloud-oriented development.' },
    { patterns: ['is he available','open to work','can i hire him','collaboration','internship availability','job availability'], text: 'Yes. Blessen is open to early-career software, data and cloud opportunities, as well as ambitious technical collaborations.' },
    { patterns: ['contact blessen','email address','how to reach him','send a message','get in touch','contact information'], text: 'Use the direct-message form in the Contact section or email Blessen at blessenpshaju@gmail.com.' },
    { patterns: ['github profile','see his code','source code','project links','github account'], text: 'Open the project cards in the Work section to visit the live products and their GitHub repositories. His GitHub profile is also linked in the navigation menu.' },
    { patterns: ['linkedin profile','professional profile','social profile','connect on linkedin'], text: 'Blessen’s LinkedIn profile is linked in the navigation menu, alongside GitHub.' },
    { patterns: ['hello','hi there','hey blessen','good morning','good evening'], text: 'Hello! I can help with Blessen’s profile, education, projects, skills, certificates, interests, availability or contact details.' },
    { patterns: ['thank you','thanks','that helps','great answer'], text: 'You’re welcome. Ask another question, or use the chapter index to explore the full portfolio.' }
  ];
  const simplify = value => value.toLowerCase().replace(/blesson|blessin/g, 'blessen').replace(/[^a-z0-9+]+/g, ' ').trim();
  const distance = (a, b) => {
    if (Math.abs(a.length - b.length) > 1) return 2;
    const row = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let i = 1; i <= a.length; i++) {
      let previous = row[0]; row[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const saved = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
        previous = saved;
      }
    }
    return row[b.length];
  };
  const stopWords = new Set(['a','an','the','is','are','was','were','who','what','where','when','how','tell','me','about','his','he','does','did','can','i']);
  const matchAnswer = question => {
    const cleanQuestion = simplify(question);
    const questionWords = cleanQuestion.split(' ').filter(word => word && !stopWords.has(word));
    let best = { score: 0, answer: null };
    answers.forEach(answer => answer.patterns.forEach(pattern => {
      const cleanPattern = simplify(pattern);
      const patternWords = cleanPattern.split(' ').filter(word => word && !stopWords.has(word));
      let score = cleanQuestion.includes(cleanPattern) ? 8 : 0;
      patternWords.forEach(patternWord => {
        if (questionWords.some(word => word === patternWord)) score += 3;
        else if (patternWord.length > 4 && questionWords.some(word => distance(word, patternWord) <= 1)) score += 1.5;
      });
      if (score > best.score) best = { score, answer };
    }));
    return best.score >= 3 ? best.answer : null;
  };
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
    const match = matchAnswer(text);
    setTimeout(() => addMessage(match?.text || 'I may not have that detail yet. Try asking about Blessen’s profile, studies, projects, technical skills, certificates, interests, availability or contact information.', 'bot'), 300);
  };
  chatLaunch.addEventListener('click', () => toggleChat());
  $('.chat-panel header button').addEventListener('click', () => toggleChat(false));
  $('.chat-form').addEventListener('submit', e => { e.preventDefault(); ask(chatInput.value); });
  $$('.chat-suggestions button').forEach(button => button.addEventListener('click', () => ask(button.textContent)));
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); toggleChat(false); } });
})();
