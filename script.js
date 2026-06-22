// =========================================================
// KAKTUS DIZAJN - GLOBAL SCRIPT
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Mobile nav toggle ----------
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navToggle.classList.contains('open'));
    });
    // Close on link click (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // ---------- FAQ accordion ----------
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    if (!q) return;
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Open clicked (unless it was already open)
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ---------- Scroll reveal (subtle fade-in) ----------
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
  }

  // ---------- Active nav link ----------
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === 'index.html' && href === '/') || (path === '' && href === '/')) {
      link.classList.add('active');
    }
  });

  // ---------- Year in footer ----------
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});

// =========================================================
// PRENETE FUNKCIJE sa starog sajta
// (custom kurzor, scroll progress, floating kaktus,
//  magnetic dugmici, hero kaktus load, kalkulator)
// =========================================================

(function(){
  const isDesktop = window.matchMedia('(min-width: 769px)').matches;

  // ---------- Custom kurzor (samo desktop, ne na touch uređajima) ----------
  const dot = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');
  if (dot && outline && isDesktop && !('ontouchstart' in window)) {
    document.documentElement.classList.add('has-cursor');
    let mx = 0, my = 0, ox = 0, oy = 0;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });
    (function loop(){
      ox += (mx - ox) * 0.15;
      oy += (my - oy) * 0.15;
      outline.style.left = ox + 'px';
      outline.style.top = oy + 'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,.faq-item,.portfolio-item,.calc-option,.marquee-item,.service-card,.pricing-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ---------- Scroll progress + floating kaktus ----------
  const progressBar = document.querySelector('.scroll-progress');
  const floatingCactus = document.getElementById('floatingCactus');
  const heroEl = document.querySelector('.hero');
  let cactusActive = false;
  let ctx = 0, cty = 0, ccx = 0, ccy = 0, cInit = false;

  function onScroll(){
    if (progressBar) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (h > 0 ? (window.scrollY / h * 100) : 0) + '%';
    }
    updateFloating();
  }

  function updateFloating(){
    if (!floatingCactus || !heroEl) return;
    if (window.innerWidth <= 900) { floatingCactus.classList.remove('active'); return; }
    const heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    if (scrollY > heroBottom - 200) {
      if (!cactusActive) { floatingCactus.classList.add('active'); cactusActive = true; }
    } else {
      if (cactusActive) { floatingCactus.classList.remove('active'); cactusActive = false; }
      return;
    }

    const footer = document.querySelector('footer');
    if (footer && scrollY + vh > footer.offsetTop + 100) {
      floatingCactus.style.opacity = '0';
      return;
    } else {
      floatingCactus.style.opacity = '';
    }

    const sp = (scrollY - heroBottom) / 600;
    const xs1 = Math.sin(sp * 0.7) * 0.5;
    const xs2 = Math.sin(sp * 1.9 + 1.3) * 0.3;
    const hPos = (xs1 + xs2) * 0.5 + 0.5;
    const ys1 = Math.sin(sp * 1.1 + 0.5) * 0.3;
    const ys2 = Math.cos(sp * 0.6) * 0.2;
    const vOffset = (ys1 + ys2) * 120;

    const margin = 80, size = 75;
    const maxX = window.innerWidth - size - margin * 2;
    ctx = margin + hPos * maxX;
    cty = vh / 2 - size / 2 + vOffset;

    if (!cInit) { ccx = ctx; ccy = cty; cInit = true; }
  }

  if (progressBar || floatingCactus) {
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (floatingCactus) {
    (function loop(){
      if (cactusActive && cInit) {
        ccx += (ctx - ccx) * 0.04;
        ccy += (cty - ccy) * 0.04;
        floatingCactus.style.left = ccx + 'px';
        floatingCactus.style.top = ccy + 'px';
      }
      requestAnimationFrame(loop);
    })();
  }

  // ---------- Magnetic dugmići ----------
  if (isDesktop) {
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.3) + 'px)';
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  // ---------- KALKULATOR ----------
  const calcAnswers = {};
  const packages = {
    'brand_low_urgent':   {name:'Starter', price:'89', desc:'Brzi vrhunski logo + boje + highlights ikone.', features:['Glavni logo + varijante','Paleta od 3-5 brand boja','Set highlights ikona','Svi formati','Isporuka 2-3 dana']},
    'brand_low_normal':   {name:'Starter', price:'89', desc:'Logo i boje vrhunskog kvaliteta - odlična startna tačka.', features:['Glavni logo + varijante','Paleta od 3-5 brand boja','Set highlights ikona','Svi formati','Isporuka 2-3 dana']},
    'brand_low_flexible': {name:'Starter', price:'89', desc:'Vrhunski logo i osnovni vizualni identitet.', features:['Glavni logo + varijante','Paleta brand boja','Highlights ikone','Svi formati']},
    'brand_mid_urgent':   {name:'Starter', price:'89', desc:'Brz i vrhunski logo bez čekanja.', features:['Glavni logo + varijante','Paleta brand boja','Highlights ikone','Isporuka 2-3 dana']},
    'brand_mid_normal':   {name:'Business', price:'249', desc:'Kompletan vrhunski vizuelni identitet.', features:['Sve iz Starter paketa','Unikatna brand pozadina','Cover, ikone, profilna','3 gotova šablona','Isporuka 5-7 dana']},
    'brand_mid_flexible': {name:'Business', price:'249', desc:'Kompletan vrhunski brending za biznise koji žele profesionalan profil.', features:['Sve iz Starter paketa','Unikatna brand pozadina','Cover, ikone, profilna','3 gotova šablona']},
    'brand_high_urgent':  {name:'Business', price:'249', desc:'Najveći paket koji možemo brzo isporučiti.', features:['Sve iz Starter','Unikatna pozadina','Digitalni izlog','3 šablona','Isporuka 5-7 dana']},
    'brand_high_normal':  {name:'Full Brand Kit', price:'850', desc:'Kompletan brand sistem.', features:['Sve iz Business paketa','Brand book sa pravilima','Premium vizit karte','Materijali za štampu','Isporuka 14 dana']},
    'brand_high_flexible':{name:'Full Brand Kit', price:'850', desc:'Najkompletniji brending paket.', features:['Sve iz Business paketa','Brand book','Premium vizit karte','Materijali za štampu','Isporuka 14 dana']},
    'ads_low_urgent':     {name:'Basic', price:'30', desc:'Brza i upečatljiva oglasna kreativa.', features:['1 oglasna kreativa','Story verzija','Svi formati','Isporuka 24-48h']},
    'ads_low_normal':     {name:'Basic', price:'30', desc:'Najpovoljniji način da dobiješ vrhunski oglas.', features:['1 oglasna kreativa','Story verzija','Svi formati','Isporuka 24-48h']},
    'ads_low_flexible':   {name:'Basic', price:'30', desc:'Idealna ulazna tačka.', features:['1 oglasna kreativa','Story verzija','Svi formati']},
    'ads_mid_urgent':     {name:'Standard', price:'80', desc:'3 različite vrhunske kreative koje algoritam testira.', features:['3 različite oglasne kreative','3 udarna naslova','Story verzije','Isporuka 3-5 dana']},
    'ads_mid_normal':     {name:'Standard', price:'80', desc:'Najpopularniji paket - 3 vrhunske kreative.', features:['3 različite oglasne kreative','3 udarna naslova','Story verzije','Isporuka 3-5 dana']},
    'ads_mid_flexible':   {name:'Standard', price:'80', desc:'Set vrhunskih kreativa za dobru oglasnu kampanju.', features:['3 različite oglasne kreative','3 udarna naslova','Story verzije']},
    'ads_high_urgent':    {name:'Standard', price:'80', desc:'Najveći paket koji se može brzo isporučiti.', features:['3 oglasne kreative','3 naslova','Isporuka 3-5 dana']},
    'ads_high_normal':    {name:'Premium', price:'150', desc:'Veliki set za višemesečnu kampanju + retargeting.', features:['6 vrhunskih oglasnih objava','Story verzije','Retargeting kreative','Isporuka 5-7 dana']},
    'ads_high_flexible':  {name:'Premium', price:'150', desc:'Kompletna oglasna strategija - 6 vrhunskih kreativa.', features:['6 vrhunskih oglasnih objava','Story verzije','Retargeting kreative','Plan rotacije']},
    'both_low_urgent':    {name:'Basic + Starter', price:'119', desc:'Brzi start - logo + 1 oglas.', features:['Logo + brand boje','1 oglasna kreativa','Story verzija','Isporuka 3-5 dana']},
    'both_low_normal':    {name:'Starter', price:'89', desc:'Počnimo sa vrhunskim brendom - oglase dodajemo kasnije.', features:['Logo + brand boje','Highlights ikone','Svi formati']},
    'both_low_flexible':  {name:'Starter', price:'89', desc:'Vrhunski start - logo prvo, oglasi kad budu gotovi.', features:['Logo + brand boje','Highlights ikone','Postupna nadogradnja']},
    'both_mid_urgent':    {name:'Business', price:'249', desc:'Kompletan profil + možemo dodati oglase odmah.', features:['Logo + brand boje','Digitalni izlog','3 šablona','Isporuka 5-7 dana']},
    'both_mid_normal':    {name:'Business + Standard', price:'329', desc:'Najpopularnija kombinacija - kompletan brend + oglasne kreative.', features:['Sve iz Business paketa','3 oglasne kreative + naslovi','Story verzije','Isporuka 7-10 dana']},
    'both_mid_flexible':  {name:'Business', price:'249', desc:'Kompletan vrhunski brending sada, oglasi po potrebi.', features:['Logo + boje','Digitalni izlog','3 šablona']},
    'both_high_urgent':   {name:'Business + Standard', price:'329', desc:'Najveći paket koji se može brzo isporučiti.', features:['Kompletan brend','3 oglasne kreative','Isporuka 7-10 dana']},
    'both_high_normal':   {name:'Full Brand Kit + Premium', price:'1000', desc:'Naša najbolja ponuda.', features:['Sve iz Full Brand Kit','6 oglasnih kreativa','Retargeting kampanja','Materijali za štampu','Brand book']},
    'both_high_flexible': {name:'Full Brand Kit', price:'850', desc:'Vrhunski brand sistem.', features:['Sve iz Business paketa','Brand book','Vizit karte','Materijali za štampu']}
  };

  window.selectOption = function(btn, key, value){
    btn.parentElement.querySelectorAll('.calc-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    calcAnswers[key] = value;
    setTimeout(nextStep, 350);
  };
  function nextStep(){
    const cur = document.querySelector('.calc-step.active');
    if (!cur) return;
    const curNum = parseInt(cur.dataset.step);
    const nextNum = curNum + 1;
    cur.classList.remove('active');
    const nx = document.querySelector('[data-step="' + nextNum + '"]');
    if (nx) {
      nx.classList.add('active');
      const dots = document.querySelectorAll('.calc-dot');
      if (dots[nextNum - 1]) dots[nextNum - 1].classList.add('active');
      if (nextNum === 4) showResult();
    }
  }
  function showResult(){
    const key = calcAnswers.need + '_' + calcAnswers.budget + '_' + calcAnswers.urgency;
    const pkg = packages[key] || packages['ads_mid_normal'];
    const $ = id => document.getElementById(id);
    if ($('resultPackage')) $('resultPackage').textContent = pkg.name;
    if ($('resultPrice'))   $('resultPrice').innerHTML = pkg.price + '<span>€</span>';
    if ($('resultDesc'))    $('resultDesc').textContent = pkg.desc;
    if ($('resultFeatures'))$('resultFeatures').innerHTML = pkg.features.map(f => '<li>' + f + '</li>').join('');
    const msg = 'Zdravo! Kalkulator mi je preporučio paket ' + pkg.name + ' (' + pkg.price + '€). Zanima me više informacija.';
    if ($('resultWaLink'))  $('resultWaLink').href = 'https://wa.me/381600750754?text=' + encodeURIComponent(msg);
  }
  window.restartCalc = function(){
    document.querySelectorAll('.calc-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.calc-dot').forEach((d, i) => d.classList.toggle('active', i === 0));
    document.querySelectorAll('.calc-option').forEach(o => o.classList.remove('selected'));
    const first = document.querySelector('[data-step="1"]');
    if (first) first.classList.add('active');
    Object.keys(calcAnswers).forEach(k => delete calcAnswers[k]);
  };

})();

// =========================================================
// INTERAKTIVNI HERO KAKTUS - tilt na miš (desktop) i dodir (mobilni)
// =========================================================
(function(){
  const hero3d = document.querySelector('.hero-3d');
  if (!hero3d) return;

  let targetRotX = 0, targetRotY = 0;
  let curRotX = 0, curRotY = 0;
  let rafId = null;

  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  function setTilt(clientX, clientY){
    const rect = heroSection.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width - 0.5;
    const py = (clientY - rect.top) / rect.height - 0.5;
    targetRotY = px * 24;
    targetRotX = -py * 16;
    if (!rafId) animate();
  }
  function resetTilt(){
    targetRotX = 0; targetRotY = 0;
    if (!rafId) animate();
  }

  // Desktop: prati miš
  heroSection.addEventListener('mousemove', (e) => setTilt(e.clientX, e.clientY));
  heroSection.addEventListener('mouseleave', resetTilt);

  // Mobilni: reaguje na dodir/prevlačenje (#10)
  heroSection.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      setTilt(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
  heroSection.addEventListener('touchend', resetTilt);

  function animate(){
    curRotX += (targetRotX - curRotX) * 0.08;
    curRotY += (targetRotY - curRotY) * 0.08;
    hero3d.style.transform = `perspective(1000px) rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg)`;
    if (Math.abs(targetRotX - curRotX) > 0.05 || Math.abs(targetRotY - curRotY) > 0.05) {
      rafId = requestAnimationFrame(animate);
    } else {
      rafId = null;
    }
  }
})();

// =========================================================
// KALKULATOR CENE v2 (Kaktus Dizajn)
// =========================================================
(function(){
  // Stanje
  const state = {
    logoConcepts: 1, logoLevel: 'std', logoRev: 2,
    brandLevel: 1,
    metaLevel: 'std'
  };
  window.__calc2state = state;

  // Cene
  const PRICES = {
    logoBase: 70,
    logoConcept: { 1: 0, 3: 25, 5: 45 },
    logoRev: { 2: 0, 5: 15, 'unl': 35 },
    levelMult: { 'std': 1.0, 'prem': 1.35 },
    brand: { 1: 70, 2: 240, 3: 590 },
    brandNames: { 1: 'Branding - Logo+', 2: 'Branding - Identitet', 3: 'Branding - Pun brend' },
    addons: { vizit: 25, memo: 20, koverat: 18, flajer: 30, brosura: 45, rollup: 35, plakat: 28, nalepnice: 22, ambalaza: 55, uniforme: 40, jelovnik: 35, stampa: 15 },
    addonNames: { vizit: 'Vizit karta', memo: 'Memorandum', koverat: 'Koverat', flajer: 'Flajer / letak', brosura: 'Brošura / katalog', rollup: 'Roll-up baner', plakat: 'Plakat / poster', nalepnice: 'Nalepnice / etikete', ambalaza: 'Ambalaža', uniforme: 'Uniforme / radna odeća', jelovnik: 'Jelovnik / cenovnik', stampa: 'Priprema za štampu' },
    fullBrandFree: ['vizit','memo','stampa','flajer','uniforme'],  // auto-besplatni u Pun brendu
    metaBase: { 'std': 15, 'prem': 30 }
  };

  // Volume popust za Meta (blaži)
  function metaDiscount(n){
    if (n <= 2) return 0;
    if (n <= 5) return 0.07;
    if (n <= 9) return 0.12;
    return 0.15;
  }

  // Segmented dugme handler
  window.calc2Seg = function(btn, key, val){
    const group = btn.parentElement;
    group.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state[key] = val;
    calc2Update();
  };

  // Glavni update
  let __clickCounter = 0;
  window.calc2Update = function(){
    // Prati redosled klikanja dodataka (za "prvi gratis" logiku u Pun brendu)
    ['vizit','memo','koverat','flajer','brosura','rollup','plakat','nalepnice','ambalaza','uniforme','jelovnik','stampa'].forEach(a => {
      const cb = document.getElementById('add-'+a);
      if (!cb) return;
      if (cb.checked && !cb.dataset.clickOrder) {
        cb.dataset.clickOrder = String(++__clickCounter);
      } else if (!cb.checked && cb.dataset.clickOrder) {
        delete cb.dataset.clickOrder;  // otčekiran - oslobodi redni broj
      }
    });

    const wantLogo = document.getElementById('cat-logo').checked;
    const wantBrand = document.getElementById('cat-branding').checked;
    const wantMeta = document.getElementById('cat-meta').checked;

    // Logo se sakriva ako je Branding čekiran (logo je već u brendingu)
    const logoCat = document.querySelector('label.calc2-cat:has(#cat-logo)');
    if (wantBrand) {
      if (logoCat) logoCat.classList.add('calc2-cat-disabled');
      document.getElementById('cat-logo').checked = false;
    } else {
      if (logoCat) logoCat.classList.remove('calc2-cat-disabled');
    }
    const logoActive = document.getElementById('cat-logo').checked && !wantBrand;

    // Prikaži/sakrij sekcije
    document.getElementById('sec-logo').hidden = !logoActive;
    document.getElementById('sec-branding').hidden = !wantBrand;
    document.getElementById('sec-meta').hidden = !wantMeta;

    // Meta hint po nivou
    const metaHint = document.getElementById('meta-hint');
    if (metaHint) {
      metaHint.textContent = state.metaLevel === 'std'
        ? 'Standard: ti šalješ gotov naslov, CTA i koncept - mi dizajniramo.'
        : 'Premium: mi smišljamo naslov, CTA i celu kompoziciju kreative.';
    }

    let total = 0;
    const breakdown = [];

    // LOGO
    if (logoActive) {
      let logo = PRICES.logoBase + PRICES.logoConcept[state.logoConcepts];
      logo = logo * PRICES.levelMult[state.logoLevel];
      logo += PRICES.logoRev[state.logoRev];
      logo = Math.round(logo);
      total += logo;
      let lbl = `Logo (${state.logoConcepts} ${state.logoConcepts==1?'koncept':'koncepta'}`;
      lbl += state.logoLevel==='prem' ? ', Premium' : '';
      lbl += state.logoRev!==2 ? `, ${state.logoRev==='unl'?'neogr.':state.logoRev} revizija` : '';
      lbl += ')';
      breakdown.push({ label: lbl, price: logo });
    }

    // BRANDING
    if (wantBrand) {
      let brand = PRICES.brand[state.brandLevel];
      breakdown.push({ label: PRICES.brandNames[state.brandLevel], price: brand });
      total += brand;

      const isFullBrand = (state.brandLevel === 3);
      const addonsNote = document.getElementById('brand-addons-note');
      if (addonsNote) addonsNote.hidden = !isFullBrand;

      const allAddons = ['vizit','memo','koverat','flajer','brosura','rollup','plakat','nalepnice','ambalaza','uniforme','jelovnik','stampa'];
      const freeSet = PRICES.fullBrandFree;  // auto-besplatni u Pun brendu

      // Pronađi "prvi po izboru gratis" = čekiran ne-auto dodatak sa NAJRANIJIM klikom
      let firstChosenFree = null;
      if (isFullBrand) {
        let earliest = Infinity;
        for (const a of allAddons) {
          if (freeSet.includes(a)) continue;
          const cb = document.getElementById('add-'+a);
          if (cb && cb.checked) {
            const order = parseInt(cb.dataset.clickOrder || '0', 10);
            if (order > 0 && order < earliest) { earliest = order; firstChosenFree = a; }
          }
        }
      }

      allAddons.forEach(a => {
        const cb = document.getElementById('add-'+a);
        if (!cb) return;
        const wrapper = cb.closest('.calc2-chip');

        if (isFullBrand && freeSet.includes(a)) {
          // Auto-besplatan, onemogućen
          cb.disabled = true;
          if (wrapper) { wrapper.classList.add('calc2-chip-included'); wrapper.classList.remove('calc2-chip-free'); }
          breakdown.push({ label: PRICES.addonNames[a], price: 0, included: true });
        } else if (isFullBrand && a === firstChosenFree) {
          // Prvi po izboru (najraniji klik) - gratis
          cb.disabled = false;
          if (wrapper) { wrapper.classList.add('calc2-chip-free'); wrapper.classList.remove('calc2-chip-included'); }
          breakdown.push({ label: PRICES.addonNames[a] + ' (gratis)', price: 0, included: true });
        } else {
          // Normalno se naplaćuje
          cb.disabled = false;
          if (wrapper) { wrapper.classList.remove('calc2-chip-included','calc2-chip-free'); }
          if (cb.checked) {
            total += PRICES.addons[a];
            breakdown.push({ label: PRICES.addonNames[a], price: PRICES.addons[a], sub: true });
          }
        }
      });
    } else {
      // Nije branding - resetuj sve chip stilove i disabled
      ['vizit','memo','koverat','flajer','brosura','rollup','plakat','nalepnice','ambalaza','uniforme','jelovnik','stampa'].forEach(a => {
        const cb = document.getElementById('add-'+a);
        if (cb) { cb.disabled = false; const w = cb.closest('.calc2-chip'); if (w) w.classList.remove('calc2-chip-included','calc2-chip-free'); }
      });
    }

    // META ADS
    if (wantMeta) {
      let n = parseInt(document.getElementById('meta-slider').value, 10);
      const customWrap = document.getElementById('meta-custom');
      const customInput = document.getElementById('meta-custom-input');

      if (n >= 10) {
        // Prikaži polje za tačan unos
        if (customWrap) customWrap.hidden = false;
        let custom = parseInt(customInput.value, 10);
        if (isNaN(custom) || custom < 10) custom = 10;
        n = custom;
        document.getElementById('meta-count').textContent = n;
      } else {
        if (customWrap) customWrap.hidden = true;
        document.getElementById('meta-count').textContent = n;
      }

      const base = PRICES.metaBase[state.metaLevel];
      const disc = metaDiscount(n);
      let meta = Math.round(base * (1 - disc) * n);
      total += meta;
      let lbl = `Meta Ads - ${n} kreativa (${state.metaLevel==='prem'?'Premium':'Standard'})`;
      breakdown.push({ label: lbl, price: meta });
      if (disc > 0) {
        breakdown.push({ label: `Količinski popust −${Math.round(disc*100)}%`, price: 0, note: true });
      }
      // -10% popust na Meta deo
      const metaDisc10 = Math.round(meta * 0.10);
      if (metaDisc10 > 0) {
        total -= metaDisc10;
        breakdown.push({ label: 'Meta popust −10%', price: -metaDisc10, discount: true });
      }
    }

    // Render
    const priceEl = document.getElementById('calc2-price');
    const noteEl = document.getElementById('calc2-note');
    const bdEl = document.getElementById('calc2-breakdown');
    const waEl = document.getElementById('calc2-wa');
    const resetEl = document.getElementById('calc2-reset-btn');

    const anything = logoActive || wantBrand || wantMeta;

    if (!anything || total <= 0) {
      priceEl.textContent = '-';
      noteEl.textContent = 'Izaberi bar jednu uslugu da vidiš cenu.';
      noteEl.hidden = false;
      bdEl.innerHTML = '';
      waEl.hidden = true;
      resetEl.hidden = true;
      return;
    }

    priceEl.textContent = total + '€';
    noteEl.hidden = true;
    resetEl.hidden = false;

    // Breakdown lista
    bdEl.innerHTML = breakdown.map(item => {
      if (item.note) return `<li class="calc2-bd-note">${item.label}</li>`;
      if (item.included) return `<li class="calc2-bd-sub calc2-bd-incl"><span>${item.label}</span><span>uklj.</span></li>`;
      let cls = item.sub ? 'calc2-bd-sub' : '';
      if (item.discount) cls += ' calc2-bd-disc';
      const price = item.price === 0 ? '' : (item.price < 0 ? item.price+'€' : item.price+'€');
      return `<li class="${cls}"><span>${item.label}</span><span>${price}</span></li>`;
    }).join('');

    // WhatsApp link sa specifikacijom
    let msg = 'Zdravo! Zainteresovan/a sam za:\n\n';
    breakdown.forEach(item => {
      if (item.note || item.discount) return;
      if (item.included) { msg += `• ${item.label}: uključeno\n`; return; }
      msg += `• ${item.label}: ${item.price}€\n`;
    });
    msg += `\nUkupno (okvirno): ${total}€\n\nPoslato preko kalkulatora na sajtu.`;
    waEl.href = 'https://wa.me/381600750754?text=' + encodeURIComponent(msg);
    waEl.hidden = false;
  };

  // Reset
  window.calc2Reset = function(){
    ['cat-logo','cat-branding','cat-meta','add-vizit','add-memo','add-koverat','add-flajer','add-brosura','add-rollup','add-plakat','add-nalepnice','add-ambalaza','add-uniforme','add-jelovnik','add-stampa'].forEach(id => {
      const el = document.getElementById(id); if (el) { el.checked = false; el.disabled = false; }
    });
    document.querySelectorAll('.calc2-chip').forEach(c => c.classList.remove('calc2-chip-included','calc2-chip-free'));
    document.getElementById('meta-slider').value = 1;
    Object.assign(state, { logoConcepts:1, logoLevel:'std', logoRev:2, brandLevel:1, metaLevel:'std' });
    // Reset segmented dugmad
    document.querySelectorAll('.calc2-segmented, .calc2-levels').forEach(g => {
      g.querySelectorAll('button').forEach((b,i) => b.classList.toggle('active', i===0));
    });
    calc2Update();
  };

  // Init na učitavanje
  if (document.getElementById('calc2-price')) {
    calc2Update();
  }
})();

// =========================================================
// HERO VIDEO - bira desktop ili mobilni izvor po širini ekrana
// =========================================================
(function(){
  const v = document.querySelector('.hero-video');
  if (!v) return;
  const isDesktop = window.matchMedia('(min-width: 921px)').matches;
  const webm = isDesktop ? v.dataset.desktopWebm : v.dataset.mobileWebm;
  const mp4  = isDesktop ? v.dataset.desktopMp4  : v.dataset.mobileMp4;
  if (!webm) return;
  const sources = v.querySelectorAll('source');
  if (sources[0]) sources[0].src = webm;
  if (sources[1]) sources[1].src = mp4;
  v.load();
  // Pokušaj autoplay (neki browseri ga blokiraju dok se ne učita)
  v.play().catch(()=>{});
})();

// =========================================================
// KALKULATOR WIZARD - korak po korak + sticky footer
// =========================================================
(function(){
  if (!document.getElementById('calc2-price')) return;

  let step = 0;  // 0 = izbor kategorija, 1 = opcije
  const stepsEl = document.getElementById('calc2-steps');
  const navEl = document.getElementById('calc2-nav');
  const backBtn = document.getElementById('calc2-back');
  const nextBtn = document.getElementById('calc2-next');
  const sticky = document.getElementById('calc2-sticky');

  function anyCategory(){
    return document.getElementById('cat-logo').checked ||
           document.getElementById('cat-branding').checked ||
           document.getElementById('cat-meta').checked;
  }

  function renderStep(){
    // Prikaži blokove po koraku
    document.querySelectorAll('[data-wizard="0"]').forEach(el => el.style.display = (step===0)?'':'none');
    document.querySelectorAll('[data-wizard="1"]').forEach(el => {
      // korak 1 sekcije se prikazuju samo ako su relevantne (calc2Update upravlja hidden)
      el.style.display = (step===1)?'':'none';
    });

    // Step dots
    if (stepsEl) {
      stepsEl.hidden = false;
      stepsEl.querySelectorAll('.calc2-step-dot').forEach(d => {
        d.classList.toggle('active', parseInt(d.dataset.step,10) <= step);
      });
    }

    // Navigacija
    if (step === 0) {
      backBtn.hidden = true;
      nextBtn.hidden = false;
      nextBtn.textContent = 'Dalje →';
      nextBtn.disabled = !anyCategory();
    } else {
      backBtn.hidden = false;
      nextBtn.hidden = true;
    }

    // Sticky footer se vidi tek na koraku 1
    if (sticky) sticky.hidden = (step !== 1);

    // Pozoveri update da osveži vidljivost sekcija
    if (window.calc2Update) window.calc2Update();
  }

  window.calc2Step = function(dir){
    const newStep = step + dir;
    if (newStep < 0 || newStep > 1) return;
    if (newStep === 1 && !anyCategory()) return;
    step = newStep;
    renderStep();
    // Skrol na vrh kalkulatora
    document.getElementById('kalkulator').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Kad se promeni kategorija, omogući/onemogući Dalje
  ['cat-logo','cat-branding','cat-meta'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => { if (step===0) nextBtn.disabled = !anyCategory(); });
  });

  // Toggle detalja u sticky footeru
  window.calc2ToggleDetail = function(){
    const panel = document.getElementById('calc2-detail-panel');
    const btn = document.getElementById('calc2-detail-btn');
    if (!panel) return;
    panel.hidden = !panel.hidden;
    if (btn) btn.textContent = panel.hidden ? 'Detalji' : 'Sakrij';
  };

  // Override reset da vrati na korak 0
  const origReset = window.calc2Reset;
  window.calc2Reset = function(){
    if (origReset) origReset();
    step = 0;
    renderStep();
  };

  // Init
  renderStep();
})();

// =========================================================
// META PIXEL — Lead event na WhatsApp klikove i kalkulator upit
// =========================================================
(function(){
  if (typeof fbq === 'undefined') return;

  // Hvata SVE klikove na WhatsApp linkove (nav, hero, footer, paketi, kalkulator)
  document.addEventListener('click', function(e){
    const link = e.target.closest('a[href*="wa.me/381600750754"]');
    if (link) {
      // Da li je upit iz kalkulatora (sticky dugme) ili obično WhatsApp dugme
      const isCalc = link.id === 'calc2-wa' || link.closest('.calc2-sticky');
      fbq('track', 'Lead', {
        content_name: isCalc ? 'Kalkulator upit' : 'WhatsApp kontakt',
        content_category: isCalc ? 'calculator' : 'whatsapp'
      });
    }
  }, true);
})();
