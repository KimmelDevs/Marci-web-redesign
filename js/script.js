// ============ MOTION PREFERENCE ============
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============ FOOTER YEAR ============
document.getElementById('year').textContent = new Date().getFullYear();

// ============ MOBILE NAV ============
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

// ============ ACTIVE NAV ON SCROLL ============
const sections = ['top','listings','move','about','contact'].map(id => document.getElementById(id)).filter(Boolean);
const navLinks = [...mainNav.querySelectorAll('a')];
const setActive = () => {
  let current = sections[0];
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current.id);
  });
};
window.addEventListener('scroll', setActive, { passive: true });
setActive();

// ============ SCROLL REVEALS ============
const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
if (prefersReducedMotion) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObs.observe(el));
}

// ============ HERO PARALLAX ============
if (!prefersReducedMotion) {
  const heroMedia = document.querySelector('.hero-media');
  const hero = document.querySelector('.hero');
  if (heroMedia && hero) {
    window.addEventListener('scroll', () => {
      const heroHeight = hero.offsetHeight;
      if (window.scrollY < heroHeight) {
        heroMedia.style.transform = `translateY(${window.scrollY * 0.28}px) scale(1.06)`;
      }
    }, { passive: true });
  }
}

// ============ ANIMATED STAT COUNTERS (one orchestrated reveal) ============
const counters = document.querySelectorAll('.stat-number[data-count-to]');
const animateCounter = (el) => {
  const target = parseFloat(el.dataset.countTo);
  const decimals = parseInt(el.dataset.decimal || '0', 10);
  const duration = 1400;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = decimals ? value.toFixed(decimals) : Math.round(value);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
if (counters.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => obs.observe(c));
}

// ============ GALLERY (real photos of the Mountain Falls community) ============
const galleryItems = [
  { label: 'Mountain Falls clubhouse & pools', bg: "url('images/gallery-clubhouse-pools.png')", big: true },
  { label: 'Pickleball & tennis courts', bg: "url('images/gallery-courts-1.png')" },
  { label: 'Community clubhouse', bg: "url('images/gallery-courts-2.png')" },
  { label: 'Home for sale — aerial view', bg: "url('images/gallery-home-pool-1.png')" },
  { label: 'Backyard pool & spa', bg: "url('images/gallery-home-pool-2.png')" },
  { label: 'Desert-view sunroom', bg: "url('images/gallery-sunroom.png')" },
  { label: 'Neighborhood pond & fairway', bg: "url('images/gallery-neighborhood-pond.png')" },
];

const galleryGrid = document.getElementById('gallery-grid');
galleryItems.forEach((item, index) => {
  const el = document.createElement('div');
  el.className = 'gallery-item' + (item.big ? ' big' : '') + (prefersReducedMotion ? '' : ' card-in');
  if (!prefersReducedMotion) el.style.animationDelay = `${Math.min(index * 0.08, 0.6)}s`;
  el.style.backgroundImage = item.bg;
  el.innerHTML = `<span>${item.label}</span>`;
  el.addEventListener('click', () => openLightbox(item.bg));
  galleryGrid.appendChild(el);
});

const lightbox = document.getElementById('lightbox');
const lightboxMedia = document.getElementById('lightbox-media');
function openLightbox(bg) {
  lightboxMedia.style.backgroundImage = bg;
  lightbox.classList.add('open');
}
document.getElementById('lightbox-close').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.remove('open'); });

// ============ LISTINGS (sample data + client-side filter/sort) ============
const sampleListings = [
  { addr: '412 Calvada Blvd, Pahrump, NV', price: 349000, beds: 3, baths: 2, type: 'single-family', date: '2026-08-20', bg: 'linear-gradient(135deg,#A8501F,#C79A3E)' },
  { addr: '88 Mountain Falls Dr, Pahrump, NV', price: 525000, beds: 4, baths: 3, type: 'single-family', date: '2026-07-02', bg: 'linear-gradient(135deg,#223140,#6C7A5B)' },
  { addr: '215 Basin Ave, Pahrump, NV', price: 189000, beds: 2, baths: 1, type: 'manufactured', date: '2026-08-30', bg: 'linear-gradient(135deg,#6C7A5B,#3f4a34)' },
  { addr: '9 Homestead Rd, Pahrump, NV', price: 95000, beds: 0, baths: 0, type: 'land', date: '2026-06-15', bg: 'linear-gradient(135deg,#C79A3E,#7E3B15)' },
  { addr: '760 Ridgecrest Way, Pahrump, NV', price: 412000, beds: 3, baths: 2, type: 'single-family', date: '2026-08-05', bg: 'linear-gradient(135deg,#7E3B15,#223140)' },
  { addr: '33 Vineyard Ct, Pahrump, NV', price: 275000, beds: 2, baths: 2, type: 'condo', date: '2026-07-22', bg: 'linear-gradient(135deg,#3f4a34,#A8501F)' },
];

const listingGrid = document.getElementById('listing-grid');

function money(n) {
  return '$' + n.toLocaleString('en-US');
}

function renderListings(items) {
  listingGrid.innerHTML = '';
  if (!items.length) {
    listingGrid.innerHTML = '<p class="listing-empty">No sample listings match those filters — try widening your search.</p>';
    return;
  }
  items.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'listing-card' + (prefersReducedMotion ? '' : ' card-in');
    if (!prefersReducedMotion) card.style.animationDelay = `${Math.min(index * 0.08, 0.5)}s`;
    const bedsBaths = item.type === 'land'
      ? 'Vacant land'
      : `${item.beds} bd &middot; ${item.baths} ba`;
    card.innerHTML = `
      <div class="listing-photo" style="background-image:${item.bg}"></div>
      <div class="listing-body">
        <p class="listing-price">${money(item.price)}</p>
        <p class="listing-addr">${item.addr}</p>
        <p class="listing-meta">${bedsBaths}</p>
      </div>`;
    listingGrid.appendChild(card);
  });
}
renderListings(sampleListings);

document.getElementById('search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const type = document.getElementById('f-type').value;
  const sort = document.getElementById('f-sort').value;
  const beds = parseInt(document.getElementById('f-beds').value, 10);
  const baths = parseInt(document.getElementById('f-baths').value, 10);
  const min = parseFloat(document.getElementById('f-min').value) || 0;
  const max = parseFloat(document.getElementById('f-max').value) || Infinity;

  let results = sampleListings.filter(item =>
    (!type || item.type === type) &&
    item.beds >= beds &&
    item.baths >= baths &&
    item.price >= min &&
    item.price <= max
  );

  const sorters = {
    newest: (a, b) => new Date(b.date) - new Date(a.date),
    oldest: (a, b) => new Date(a.date) - new Date(b.date),
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'beds-asc': (a, b) => a.beds - b.beds,
    'beds-desc': (a, b) => b.beds - a.beds,
  };
  results.sort(sorters[sort] || sorters.newest);
  renderListings(results);
  document.getElementById('listing-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ============ CONTACT FORM (front-end only — no backend wired up) ============
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!contactForm.checkValidity()) {
    formStatus.textContent = 'Please fill in your name and a valid email.';
    return;
  }
  const name = document.getElementById('c-name').value.trim();
  formStatus.textContent = `Thanks${name ? ', ' + name : ''} — Marci's team will be in touch shortly.`;
  contactForm.reset();
});