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
    'brand_low_normal':   {name:'Starter', price:'89', desc:'Logo i boje vrhunskog kvaliteta — odlična startna tačka.', features:['Glavni logo + varijante','Paleta od 3-5 brand boja','Set highlights ikona','Svi formati','Isporuka 2-3 dana']},
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
    'ads_mid_normal':     {name:'Standard', price:'80', desc:'Najpopularniji paket — 3 vrhunske kreative.', features:['3 različite oglasne kreative','3 udarna naslova','Story verzije','Isporuka 3-5 dana']},
    'ads_mid_flexible':   {name:'Standard', price:'80', desc:'Set vrhunskih kreativa za dobru oglasnu kampanju.', features:['3 različite oglasne kreative','3 udarna naslova','Story verzije']},
    'ads_high_urgent':    {name:'Standard', price:'80', desc:'Najveći paket koji se može brzo isporučiti.', features:['3 oglasne kreative','3 naslova','Isporuka 3-5 dana']},
    'ads_high_normal':    {name:'Premium', price:'150', desc:'Veliki set za višemesečnu kampanju + retargeting.', features:['6 vrhunskih oglasnih objava','Story verzije','Retargeting kreative','Isporuka 5-7 dana']},
    'ads_high_flexible':  {name:'Premium', price:'150', desc:'Kompletna oglasna strategija — 6 vrhunskih kreativa.', features:['6 vrhunskih oglasnih objava','Story verzije','Retargeting kreative','Plan rotacije']},
    'both_low_urgent':    {name:'Basic + Starter', price:'119', desc:'Brzi start — logo + 1 oglas.', features:['Logo + brand boje','1 oglasna kreativa','Story verzija','Isporuka 3-5 dana']},
    'both_low_normal':    {name:'Starter', price:'89', desc:'Počnimo sa vrhunskim brendom — oglase dodajemo kasnije.', features:['Logo + brand boje','Highlights ikone','Svi formati']},
    'both_low_flexible':  {name:'Starter', price:'89', desc:'Vrhunski start — logo prvo, oglasi kad budu gotovi.', features:['Logo + brand boje','Highlights ikone','Postupna nadogradnja']},
    'both_mid_urgent':    {name:'Business', price:'249', desc:'Kompletan profil + možemo dodati oglase odmah.', features:['Logo + brand boje','Digitalni izlog','3 šablona','Isporuka 5-7 dana']},
    'both_mid_normal':    {name:'Business + Standard', price:'329', desc:'Najpopularnija kombinacija — kompletan brend + oglasne kreative.', features:['Sve iz Business paketa','3 oglasne kreative + naslovi','Story verzije','Isporuka 7-10 dana']},
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
// INTERAKTIVNI HERO KAKTUS — prati miš (parallax tilt)
// =========================================================
(function(){
  const hero3d = document.querySelector('.hero-3d');
  if (!hero3d) return;

  // Samo na desktopu (touch nema miša)
  if (window.matchMedia('(hover: none)').matches) return;

  let targetRotX = 0, targetRotY = 0;
  let curRotX = 0, curRotY = 0;
  let rafId = null;

  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    // Pozicija miša relativno na centar hero sekcije (-1 do 1)
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    // Blagi tilt — max 12deg
    targetRotY = px * 24;
    targetRotX = -py * 16;
    if (!rafId) animate();
  });

  heroSection.addEventListener('mouseleave', () => {
    targetRotX = 0;
    targetRotY = 0;
    if (!rafId) animate();
  });

  function animate(){
    // Lerp ka cilju (smooth)
    curRotX += (targetRotX - curRotX) * 0.08;
    curRotY += (targetRotY - curRotY) * 0.08;

    hero3d.style.transform = `perspective(1000px) rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg)`;

    // Nastavi dok se ne smiri
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
    brandNames: { 1: 'Branding — Logo+', 2: 'Branding — Identitet', 3: 'Branding — Pun brend' },
    addons: { vizit: 25, memo: 20, stampa: 35 },
    addonNames: { vizit: 'Vizit karta', memo: 'Memorandum', stampa: 'Priprema za štampu' },
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
  window.calc2Update = function(){
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
        ? 'Standard: ti šalješ gotov naslov, CTA i koncept — mi dizajniramo.'
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
      // Dodaci
      ['vizit','memo','stampa'].forEach(a => {
        const cb = document.getElementById('add-'+a);
        if (cb && cb.checked) {
          total += PRICES.addons[a];
          breakdown.push({ label: PRICES.addonNames[a], price: PRICES.addons[a], sub: true });
        }
      });
    }

    // META ADS
    if (wantMeta) {
      const n = parseInt(document.getElementById('meta-slider').value, 10);
      document.getElementById('meta-count').textContent = n >= 10 ? '10+' : n;
      const base = PRICES.metaBase[state.metaLevel];
      const disc = metaDiscount(n);
      let meta = Math.round(base * (1 - disc) * n);
      total += meta;
      let lbl = `Meta Ads — ${n>=10?'10+':n} ${n===1?'kreativa':'kreativa'} (${state.metaLevel==='prem'?'Premium':'Standard'})`;
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
      priceEl.textContent = '—';
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
      let cls = item.sub ? 'calc2-bd-sub' : '';
      if (item.discount) cls += ' calc2-bd-disc';
      const price = item.price === 0 ? '' : (item.price < 0 ? item.price+'€' : item.price+'€');
      return `<li class="${cls}"><span>${item.label}</span><span>${price}</span></li>`;
    }).join('');

    // WhatsApp link sa specifikacijom
    let msg = 'Zdravo! Zainteresovan/a sam za:\n\n';
    breakdown.forEach(item => {
      if (item.note || item.discount) return;
      msg += `• ${item.label}: ${item.price}€\n`;
    });
    msg += `\nUkupno (okvirno): ${total}€\n\nPoslato preko kalkulatora na sajtu.`;
    waEl.href = 'https://wa.me/381600750754?text=' + encodeURIComponent(msg);
    waEl.hidden = false;
  };

  // Reset
  window.calc2Reset = function(){
    ['cat-logo','cat-branding','cat-meta','add-vizit','add-memo','add-stampa'].forEach(id => {
      const el = document.getElementById(id); if (el) el.checked = false;
    });
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
