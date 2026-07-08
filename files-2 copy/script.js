// Footer year
document.querySelectorAll('#year').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// Mobile nav toggle
var navToggle = document.getElementById('navToggle');
var navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Portfolio dropdown in nav (hover on desktop via CSS, click-toggle for touch/mobile)
document.querySelectorAll('.nav-dropdown').forEach(function (dropdown) {
  var toggle = dropdown.querySelector('.nav-drop-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', function (e) {
    e.preventDefault();
    var isOpen = dropdown.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
  document.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// Scroll reveal — fade/slide sections and cards in as they enter the viewport
(function () {
  var revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(function (el) { observer.observe(el); });
})();

// Logo carousel — auto-scrolls, pauses on hover, arrows nudge it manually
(function () {
  var track = document.getElementById('logoTrack');
  var viewport = document.getElementById('logoCarousel');
  if (!track || !viewport) return;

  var offset = 0;
  var speed = 0.4; // px per frame
  var paused = false;
  var half = 0;

  function measure() {
    half = track.scrollWidth / 2; // track content is duplicated once
  }
  measure();
  window.addEventListener('resize', measure);

  function tick() {
    if (!paused) {
      offset += speed;
      if (offset >= half) offset -= half;
      track.style.transform = 'translateX(' + (-offset) + 'px)';
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  viewport.addEventListener('mouseenter', function () { paused = true; });
  viewport.addEventListener('mouseleave', function () { paused = false; });

  var resumeTimer;
  function nudge(amount) {
    offset += amount;
    if (offset < 0) offset += half;
    if (offset >= half) offset -= half;
    track.style.transform = 'translateX(' + (-offset) + 'px)';
    paused = true;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(function () { paused = false; }, 2200);
  }

  var prevBtn = document.getElementById('logoPrev');
  var nextBtn = document.getElementById('logoNext');
  if (prevBtn) prevBtn.addEventListener('click', function () { nudge(-220); });
  if (nextBtn) nextBtn.addEventListener('click', function () { nudge(220); });
})();

// Portfolio filter + view toggle + lightbox gallery
(function () {
  var filterBar = document.getElementById('filterBar');
  var grid = document.getElementById('portfolioGrid');
  if (!grid) return;

  var items = Array.prototype.slice.call(grid.querySelectorAll('.portfolio-item'));

  function applyFilter(filter) {
    items.forEach(function (item) {
      var match = filter === 'all' || item.getAttribute('data-category') === filter;
      item.classList.toggle('hidden', !match);
    });
  }

  if (filterBar) {
    var buttons = filterBar.querySelectorAll('.filter-btn');
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      applyFilter(btn.getAttribute('data-filter'));
    });

    // Pre-filter from ?cat= param (used by the nav dropdown links)
    var params = new URLSearchParams(window.location.search);
    var cat = params.get('cat');
    if (cat) {
      var target = filterBar.querySelector('[data-filter="' + cat + '"]');
      if (target) {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        target.classList.add('active');
        applyFilter(cat);
      }
    }
  }

  // Grid / Gallery view toggle
  var gridBtn = document.getElementById('viewGridBtn');
  var galleryBtn = document.getElementById('viewGalleryBtn');
  if (gridBtn && galleryBtn) {
    gridBtn.addEventListener('click', function () {
      grid.classList.remove('gallery-mode');
      gridBtn.classList.add('active');
      galleryBtn.classList.remove('active');
    });
    galleryBtn.addEventListener('click', function () {
      grid.classList.add('gallery-mode');
      galleryBtn.classList.add('active');
      gridBtn.classList.remove('active');
    });
  }

  // Lightbox
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  var lbPlate = document.getElementById('lightboxPlate');
  var lbTitle = document.getElementById('lightboxTitle');
  var lbCount = document.getElementById('lightboxCount');
  var currentIndex = 0;

  function visibleItems() {
    return items.filter(function (item) { return !item.classList.contains('hidden'); });
  }

  function openLightbox(index) {
    var visible = visibleItems();
    if (!visible.length) return;
    currentIndex = (index + visible.length) % visible.length;
    var item = visible[currentIndex];
    var fig = item.querySelector('.plate').getAttribute('data-fig');
    var iconMarkup = item.querySelector('.plate-icon').outerHTML;
    var title = item.querySelector('h3').textContent;
    lbPlate.setAttribute('data-fig', fig);
    lbPlate.innerHTML = iconMarkup;
    lbTitle.textContent = title;
    lbCount.textContent = (currentIndex + 1) + ' / ' + visible.length;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach(function (item) {
    var plate = item.querySelector('.plate');
    plate.classList.add('plate-hoverable');
    plate.addEventListener('click', function () {
      var visible = visibleItems();
      openLightbox(visible.indexOf(item));
    });
  });

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', function () { openLightbox(currentIndex - 1); });
  document.getElementById('lightboxNext').addEventListener('click', function () { openLightbox(currentIndex + 1); });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
  });
})();

// Contact form (static placeholder — no backend on GitHub Pages)
var contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('This form is a placeholder. Connect it to Formspree, Getform, or another form service to receive submissions on GitHub Pages.');
  });
}
