// ============================================================
// ODS CONSULTING WEBSITE - SHARED JAVASCRIPT
// This one file runs on every page (index, about, services,
// solutions, clients, contact). It controls: the left-side
// slide-in menu, the mobile nav dropdown, the homepage hero
// slideshow, and the contact form's "fake" submit confirmation.
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ------------------------------------------------------------
  // 0) SPLASH SCREEN
  // No JS needed here at all - the splash's whole show/fade-out
  // sequence runs as a plain CSS animation (see ".splash-screen"
  // and "@keyframes splash-sequence" in styles.css), so it plays
  // the same way on every single page load/refresh, and it can
  // never get "stuck" even if something else on the page errors.
  // ------------------------------------------------------------

  // ------------------------------------------------------------
  // 1) LEFT-SIDE SLIDE-IN MENU (the "Menu" burger button + panel)
  // Grabs the button, the sliding panel, the dark background
  // overlay, and the "X" close button by their HTML id.
  // ------------------------------------------------------------
  var menuBtn = document.getElementById('menuBtn');
  var menuPanel = document.getElementById('menuPanel');
  var menuOverlay = document.getElementById('menuOverlay');
  var menuClose = document.getElementById('menuClose');

  // Opens the menu: slides the panel in, fades in the overlay,
  // and locks page scrolling so the page behind the menu doesn't
  // scroll at the same time. The waffle icon animates to an "open"
  // look via CSS (see .menu-btn[aria-expanded="true"] in styles.css).
  function openMenu() {
    menuPanel.classList.add('open');
    menuOverlay.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  // Closes the menu: reverses everything openMenu() did.
  function closeMenu() {
    menuPanel.classList.remove('open');
    menuOverlay.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Wires up everything that should open or close the menu:
  // - clicking the burger button toggles it open/closed
  // - clicking the "X" closes it
  // - clicking the dark overlay (outside the panel) closes it
  // - clicking any link inside the menu closes it (so it
  //   doesn't stay open after navigating to a new page)
  // - pressing the Escape key closes it
  if (menuBtn && menuPanel && menuOverlay) {
    menuBtn.addEventListener('click', function () {
      if (menuPanel.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);
    menuPanel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // ------------------------------------------------------------
  // 1b) "COMPANY" DROPDOWN IN THE TOP NAV
  // Opens on hover (mouse users see it immediately, no click
  // needed) with a short delay before closing so moving the mouse
  // from the button down into the menu doesn't accidentally close
  // it. Also still opens/closes on click (for touch and keyboard
  // users), closes when clicking elsewhere, choosing a link inside
  // it, or pressing Escape.
  // ------------------------------------------------------------
  var dropdownWrap = document.querySelector('.nav-dropdown');
  var dropdownTrigger = document.querySelector('.nav-dropdown-trigger');
  var dropdownMenu = document.querySelector('.nav-dropdown-menu');
  if (dropdownWrap && dropdownTrigger && dropdownMenu) {
    var closeTimer;

    function openDropdown() {
      clearTimeout(closeTimer);
      dropdownMenu.classList.add('open');
      dropdownTrigger.setAttribute('aria-expanded', 'true');
    }
    function closeDropdownNow() {
      dropdownMenu.classList.remove('open');
      dropdownTrigger.setAttribute('aria-expanded', 'false');
    }
    function closeDropdownSoon() {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(closeDropdownNow, 250);
    }

    dropdownWrap.addEventListener('mouseenter', openDropdown);
    dropdownWrap.addEventListener('mouseleave', closeDropdownSoon);

    dropdownTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (dropdownMenu.classList.contains('open')) {
        closeDropdownNow();
      } else {
        openDropdown();
      }
    });
    document.addEventListener('click', function (e) {
      if (!dropdownMenu.contains(e.target) && e.target !== dropdownTrigger) {
        closeDropdownNow();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDropdownNow();
    });
  }

  // ------------------------------------------------------------
  // 2) MOBILE TOP-NAV DROPDOWN
  // NOTE: the right-side hamburger this used to control has been
  // removed from every page (the left-side "Menu" panel is now the
  // only mobile navigation). This block is harmless leftover code -
  // it just does nothing if .nav-toggle doesn't exist on the page.
  // On small screens the main horizontal nav links collapse
  // behind a hamburger icon (separate from the left-side menu
  // above). This just shows/hides that dropdown list.
  // ------------------------------------------------------------
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  // ------------------------------------------------------------
  // 3) HOMEPAGE HERO SLIDESHOW
  // Only runs on index.html (it looks for #hero-slider, which
  // doesn't exist on the other pages, so this whole block is
  // skipped everywhere else). Auto-advances through the slides
  // every 6 seconds, pauses while the visitor is hovering or
  // focused on it, and lets them click the dots to jump slides.
  // ------------------------------------------------------------
  var slider = document.getElementById('hero-slider');
  if (slider) {
    var slides = slider.querySelectorAll('.slide');
    var dots = slider.querySelectorAll('.dot');
    var current = 0;
    var timer;
    // Respect the visitor's OS-level "reduce motion" setting -
    // if they've asked for less animation, don't auto-rotate.
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Switches from the current slide/dot to the one at "index".
    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    // Moves to the next slide, looping back to the first after the last.
    function next() {
      goTo((current + 1) % slides.length);
    }

    // Starts the automatic 6-second slide rotation.
    function startAutoplay() {
      if (reduceMotion) return;
      timer = setInterval(next, 6000);
    }

    // Stops the automatic rotation (used on hover/focus/manual click).
    function stopAutoplay() {
      clearInterval(timer);
    }

    // Clicking a dot jumps straight to that slide, then restarts autoplay.
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        stopAutoplay();
        goTo(parseInt(dot.getAttribute('data-index'), 10));
        startAutoplay();
      });
    });

    // Pause the slideshow while someone is looking at or interacting
    // with it (mouse hover or keyboard focus), resume when they leave.
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('focusin', stopAutoplay);
    slider.addEventListener('focusout', startAutoplay);

    startAutoplay();
  }

  // ------------------------------------------------------------
  // 3b) INNER-PAGE HEADER MINI-SLIDESHOWS
  // Runs on About/Services/Solutions/Clients/Contact. Each of
  // these pages has its own small 2-slide header (look for the
  // ".mini-slider" class). Works the same way as the homepage
  // hero slideshow above, just simpler and set up so more than
  // one could exist on a page without interfering with each other.
  // ------------------------------------------------------------
  document.querySelectorAll('.mini-slider').forEach(function (slider) {
    var slides = slider.querySelectorAll('.mini-slide');
    var dots = slider.querySelectorAll('.mini-dots .dot');
    if (!slides.length || !dots.length) return;

    var current = 0;
    var timer;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }
    function next() {
      goTo((current + 1) % slides.length);
    }
    function start() {
      if (reduceMotion) return;
      timer = setInterval(next, 5500);
    }
    function stop() {
      clearInterval(timer);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        stop();
        goTo(parseInt(dot.getAttribute('data-index'), 10));
        start();
      });
    });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);

    start();
  });

  // ------------------------------------------------------------
  // 4) CONTACT FORM (contact.html only)
  // IMPORTANT: this form does NOT actually send an email or
  // message anywhere yet. This just prevents the page from
  // reloading, shows a fake "Message received" confirmation on
  // the button for 2.5 seconds, then resets the form fields.
  // To make this real, connect the form to a service like
  // Formspree (or your own backend/CRM) - see the note in
  // contact.html for where that would go.
  // ------------------------------------------------------------
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // stop the default page-reload behaviour
      var btn = form.querySelector('button');
      var original = btn.textContent;
      btn.textContent = 'Message received';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
      }, 2500);
    });
  }

  // ------------------------------------------------------------
  // 5) SCROLL PROGRESS BAR
  // The thin bar fixed to the top of every page. Its width tracks
  // how far down the page the visitor has scrolled (0% at the top,
  // 100% at the bottom); the dashed pattern inside it keeps sliding
  // via a CSS animation for extra motion as you browse.
  // ------------------------------------------------------------
  var progressBar = document.getElementById('scrollProgressBar');
  if (progressBar) {
    var updateProgress = function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  // ------------------------------------------------------------
  // 6) ANIMATED STAT COUNTERS
  // The "16+ / 4 / 2" numbers in the homepage intro section. Each
  // one has a data-count-to="16" attribute (and an optional
  // data-suffix="+") in the HTML. When the numbers scroll into
  // view, they count up from 0 to that target over about 1.4
  // seconds, then stay put - each one only ever runs once.
  // ------------------------------------------------------------
  var reduceMotionGlobal = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var counters = document.querySelectorAll('[data-count-to]');
  if (counters.length) {
    var animateCounter = function (el) {
      var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduceMotionGlobal) {
        el.textContent = target + suffix;
        return;
      }
      var duration = 1400;
      var startTime = null;
      function step(timestamp) {
        if (startTime === null) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // ease-out so it starts fast and settles gently on the final number
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      var counterObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { counterObserver.observe(el); });
    } else {
      // No IntersectionObserver support - just show the final numbers.
      counters.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
        el.textContent = target + (el.getAttribute('data-suffix') || '');
      });
    }
  }

  // ------------------------------------------------------------
  // 7) SUBTLE PARALLAX ON THE HERO GRAPHICS
  // As the mouse moves over the homepage hero, its background
  // graphic (line chart / bars / network) shifts a few pixels in
  // the same direction - a common "depth" effect. Skipped
  // entirely if the visitor has reduced motion turned on, and
  // naturally does nothing on touch devices (no mouse to move).
  // ------------------------------------------------------------
  var heroForParallax = document.getElementById('hero-slider');
  if (heroForParallax && !reduceMotionGlobal) {
    var maxShift = 14; // pixels - kept small so it reads as "subtle"
    heroForParallax.addEventListener('mousemove', function (e) {
      var rect = heroForParallax.getBoundingClientRect();
      var relX = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 to 0.5
      var relY = (e.clientY - rect.top) / rect.height - 0.5;
      var px = (relX * maxShift * 2).toFixed(1) + 'px';
      var py = (relY * maxShift * 2).toFixed(1) + 'px';
      heroForParallax.querySelectorAll('.slide-visual').forEach(function (visual) {
        visual.style.setProperty('--px', px);
        visual.style.setProperty('--py', py);
      });
    });
    heroForParallax.addEventListener('mouseleave', function () {
      heroForParallax.querySelectorAll('.slide-visual').forEach(function (visual) {
        visual.style.setProperty('--px', '0px');
        visual.style.setProperty('--py', '0px');
      });
    });
  }

  // ------------------------------------------------------------
  // 8) ANIMATED "HOW WE WORK" DIAGRAM
  // The four steps (Discover / Adapt / Analyse / Train) start
  // dimmed. As each one scrolls into view it "lights up" (its
  // circle badge fills solid white, its text brightens), and the
  // connecting line behind them fills in step by step, so the
  // diagram builds itself as you scroll down the section.
  // ------------------------------------------------------------
  var processSteps = document.querySelectorAll('.process-step');
  var processTrackFill = document.getElementById('processTrackFill');
  if (processSteps.length) {
    if (reduceMotionGlobal || !('IntersectionObserver' in window)) {
      processSteps.forEach(function (step) { step.classList.add('active'); });
      if (processTrackFill) { processTrackFill.style.width = '100%'; processTrackFill.style.height = '100%'; }
    } else {
      var highestStepReached = 0;
      var stepObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            var stepNum = parseInt(entry.target.getAttribute('data-step'), 10) || 0;
            if (stepNum > highestStepReached) {
              highestStepReached = stepNum;
              var pct = (highestStepReached / processSteps.length) * 100 + '%';
              if (processTrackFill) {
                processTrackFill.style.width = pct;
                processTrackFill.style.height = pct;
              }
            }
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      processSteps.forEach(function (step) { stepObserver.observe(step); });
    }
  }
});
