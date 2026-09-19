(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const menuBtn = $('.menu-button');
  const menu = $('.menu-overlay');
  const toggleMenu = (force) => {
    const open = force ?? !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  };
  menuBtn.addEventListener('click', () => toggleMenu());
  $$('.menu-overlay a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') { toggleMenu(false); closeChat(); } });

  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: .14 });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  const splitObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting || entry.target.dataset.split) return;
    entry.target.dataset.split = 'true';
    const nodes = [...entry.target.childNodes];
    nodes.forEach(node => {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) return;
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((word, i) => {
        if (!word.trim()) return frag.append(word);
        const span = document.createElement('span');
        span.textContent = word;
        span.style.transitionDelay = `${i * 34}ms`;
        frag.append(span, ' ');
      });
      node.replaceWith(frag);
    });
    requestAnimationFrame(() => entry.target.classList.add('split-visible'));
    splitObserver.unobserve(entry.target);
  }), { threshold: .25 });
  $$('.split-text').forEach(el => { el.style.setProperty('--split-ready', 1); splitObserver.observe(el); });

  const work = $('.work-section');
  const track = $('.project-track');
  const progress = $('.work-progress span');
  const updateScroll = () => {
    const y = scrollY;
    if (!reduced) $$('.parallax-layer').forEach(el => {
      const section = el.closest('section');
      const rect = section.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < innerHeight) el.style.transform = `translate3d(0,${rect.top * Number(el.dataset.speed || .1)}px,0) scale(1.08)`;
    });
    if (innerWidth > 900) {
      const start = work.offsetTop;
      const available = work.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, (y - start) / available));
      const maxX = Math.max(0, track.scrollWidth - (innerWidth - innerWidth * .32));
      track.style.transform = `translate3d(${-p * maxX}px,0,0)`;
      progress.style.width = `${p * 100}%`;
    }
  };
  addEventListener('scroll', updateScroll, { passive: true });
  addEventListener('resize', updateScroll); updateScroll();

  if (!reduced && matchMedia('(pointer:fine)').matches) {
    const dot = $('.cursor-dot'), ring = $('.cursor-ring');
    let mx = innerWidth/2, my = innerHeight/2, rx = mx, ry = my;
    addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; dot.style.transform=`translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`; });
    const loop = () => { rx += (mx-rx)*.14; ry += (my-ry)*.14; ring.style.transform=`translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`; requestAnimationFrame(loop); }; loop();
    $$('[data-cursor],a,button').forEach(el => {
      el.addEventListener('mouseenter', () => { ring.classList.add('active'); $('span', ring).textContent = el.dataset.cursor || ''; });
      el.addEventListener('mouseleave', () => ring.classList.remove('active'));
    });
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => { const r=el.getBoundingClientRect(); el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.12}px)`; });
      el.addEventListener('mouseleave', () => el.style.transform='');
    });
    $$('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => { const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5; card.style.transform=`perspective(1400px) rotateY(${x*2.6}deg) rotateX(${-y*2.2}deg)`; });
      card.addEventListener('mouseleave', () => card.style.transform='');
    });
  }

  let audioCtx, master, nodes = [];
  const soundBtn = $('.sound-toggle');
  const stopSound = () => {
    nodes.forEach(n => { try { n.stop(); } catch {} }); nodes=[];
    if (master) master.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + .8);
    soundBtn.setAttribute('aria-pressed','false'); $('.sound-label',soundBtn).textContent='Sound off';
  };
  const startSound = async () => {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)(); await audioCtx.resume();
    master = audioCtx.createGain(); master.gain.setValueAtTime(.0001,audioCtx.currentTime); master.gain.exponentialRampToValueAtTime(.028,audioCtx.currentTime+1.4); master.connect(audioCtx.destination);
    [55,82.41,110].forEach((freq,i)=>{ const o=audioCtx.createOscillator(),g=audioCtx.createGain(),f=audioCtx.createBiquadFilter(); o.type=i===1?'triangle':'sine';o.frequency.value=freq;g.gain.value=.16/(i+1);f.type='lowpass';f.frequency.value=420;o.connect(f).connect(g).connect(master);o.start();nodes.push(o); });
    soundBtn.setAttribute('aria-pressed','true'); $('.sound-label',soundBtn).textContent='Sound on';
  };
  soundBtn.addEventListener('click', () => soundBtn.getAttribute('aria-pressed')==='true' ? stopSound() : startSound());

  const chatLaunch = $('.chat-launch'), chatPanel = $('.chat-panel'), chatClose = $('.chat-head button'), chatForm = $('.chat-form'), chatInput = $('#chat-input'), chatLog = $('.chat-log');
  const toggleChat = (force) => { const open=force ?? !chatPanel.classList.contains('open'); chatPanel.classList.toggle('open',open); chatPanel.setAttribute('aria-hidden',String(!open)); chatLaunch.setAttribute('aria-expanded',String(open)); document.body.classList.toggle('chat-open',open && innerWidth<560); if(open) setTimeout(()=>chatInput.focus(),350); };
  function closeChat(){ toggleChat(false); }
  const responses = [
    {keys:['best','project','work','built','portfolio'],text:'Start with RigMasterAI for product thinking, LARS for full-stack fundamentals, and AgroPrescribe for collaborative AI + IoT work. The Selected Work section links directly to each project.'},
    {keys:['skill','stack','technology','language','know'],text:'Blessen works with Python, Java, C/C++, PHP and JavaScript; PostgreSQL, MySQL and Oracle; plus Linux, Docker, Bash and Git.'},
    {keys:['education','study','college','degree','msc'],text:'He is pursuing an MSc in Computer Science at Rajagiri College of Social Sciences after completing a BSc in Computer Science under Mahatma Gandhi University.'},
    {keys:['contact','email','hire','reach','available'],text:'He is open to early-career software, data and cloud opportunities. Email blessenpshaju@gmail.com or use the LinkedIn link in the contact section.'},
    {keys:['data','sql','analytics','python'],text:'His data practice covers relational modelling, SQL, Python/Pandas cleaning and transformation, multi-table analysis and reporting pipelines.'},
    {keys:['cloud','docker','linux','devops'],text:'His systems toolkit includes Linux administration, Docker-based environments, Bash scripting, Git workflows and cloud deployment fundamentals.'}
  ];
  const answer = q => { const words=q.toLowerCase().split(/\W+/); let best={score:0,text:''}; responses.forEach(r=>{ const score=r.keys.reduce((n,k)=>n+(words.some(w=>w.includes(k)||k.includes(w))?1:0),0); if(score>best.score)best={score,text:r.text}; }); return best.score?best.text:'I can help with Blessen’s projects, skills, education, data work, cloud experience or contact details. Try one of those topics.'; };
  const addMessage = (text,type) => { const div=document.createElement('div');div.className=`message ${type}`;div.textContent=text;chatLog.append(div);chatLog.scrollTop=chatLog.scrollHeight; };
  const submitChat = q => { if(!q.trim())return;addMessage(q,'user');chatInput.value='';setTimeout(()=>addMessage(answer(q),'bot'),380); };
  chatLaunch.addEventListener('click',()=>toggleChat());chatClose.addEventListener('click',closeChat);chatForm.addEventListener('submit',e=>{e.preventDefault();submitChat(chatInput.value)});$$('.chat-suggestions button').forEach(b=>b.addEventListener('click',()=>submitChat(b.textContent)));
})();
