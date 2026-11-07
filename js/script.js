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
  
    // Re-measure once every logo image has actually loaded — image dimensions
    // aren't known at script-run time, so the initial measurement is often
    // wrong and would make the loop point jump.
    var trackImages = track.querySelectorAll('img');
    var loaded = 0;
    if (trackImages.length) {
      trackImages.forEach(function (img) {
        if (img.complete) {
          loaded++;
        } else {
          img.addEventListener('load', function () {
            loaded++;
            if (loaded === trackImages.length) measure();
          });
          img.addEventListener('error', function () {
            loaded++;
            if (loaded === trackImages.length) measure();
          });
        }
      });
      if (loaded === trackImages.length) measure();
    }
  
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
  

// Contact form — submits to Formspree via fetch so visitors stay on the
// page and see an inline status message instead of being redirected away.
var contactForm = document.getElementById('contactForm');
if (contactForm) {
  var formStatus = document.getElementById('formStatus');
  var submitBtn = contactForm.querySelector('button[type="submit"]');
 
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
 
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    if (formStatus) {
      formStatus.textContent = '';
      formStatus.classList.remove('form-status-error', 'form-status-success');
    }
 
    fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          contactForm.reset();
          if (formStatus) {
            formStatus.textContent = "Thanks — your message is on its way. I'll get back to you soon.";
            formStatus.classList.add('form-status-success');
          }
        } else {
          return response.json().then(function (data) {
            var message = (data && data.errors && data.errors.length)
              ? data.errors.map(function (err) { return err.message; }).join(', ')
              : 'Something went wrong sending that — please try again or email me directly.';
            throw new Error(message);
          });
        }
      })
      .catch(function (err) {
        if (formStatus) {
          formStatus.textContent = err.message || 'Something went wrong sending that — please try again or email me directly.';
          formStatus.classList.add('form-status-error');
        }
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      });
  });
}
 
  // Eased in-page anchor scrolling (e.g. the hero "scroll to next section" cue).
  // Native `scroll-behavior: smooth` gives no control over speed/easing, so
  // this replaces it with a slower, cubic-eased glide for anchor links.
  (function () {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
  
    function headerHeight() {
      var val = getComputedStyle(document.documentElement).getPropertyValue('--header-h');
      return parseInt(val, 10) || 0;
    }
  
    function smoothScrollTo(targetY, duration) {
      var startY = window.pageYOffset;
      var distance = targetY - startY;
      var startTime = null;
  
      function step(timestamp) {
        if (startTime === null) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startY + distance * easeInOutCubic(progress));
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href').slice(1);
        if (!id) return;
        var target = document.getElementById(id);
        if (!target) return;
  
        e.preventDefault();
        // Default: align the target's TOP edge below the sticky header.
        // Add data-scroll-align="bottom" on a link to instead align the
        // target's BOTTOM edge with the bottom of the viewport.
        var align = link.getAttribute('data-scroll-align') || 'top';
        var rect = target.getBoundingClientRect();
        var targetY;
        if (align === 'bottom') {
          targetY = rect.bottom + window.pageYOffset - window.innerHeight;
        } else {
          targetY = rect.top + window.pageYOffset - headerHeight() - 24;
        }
  
        if (reduceMotion) {
          window.scrollTo(0, targetY);
        } else {
          smoothScrollTo(targetY, 900);
        }
      });
    });
  })();