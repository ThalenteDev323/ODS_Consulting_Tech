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
  // Shows once per browser session (the inline script in <head>
  // already hid it instantly via CSS on repeat page loads within
  // the same session - this block only runs the animated version
  // the first time). Sequence: fill the loading bar over ~1.6s,
  // hold briefly, fade the whole screen out - finished well under
  // 3 seconds total - then unlock page scroll and remember it's
  // been shown so it doesn't appear again this session.
  // ------------------------------------------------------------
  var splash = document.getElementById('splashScreen');
  if (splash && !document.documentElement.classList.contains('skip-splash')) {
    var splashBarFill = document.getElementById('splashBarFill');
    document.body.style.overflow = 'hidden';

    // Start the bar filling on the next frame (so the CSS transition animates
    // from 0% rather than jumping straight to 100%).
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (splashBarFill) splashBarFill.classList.add('fill');
      });
    });

    setTimeout(function () {
      splash.classList.add('splash-hide');
      sessionStorage.setItem('odsSplashShown', '1');
      document.body.style.overflow = '';
    }, 1800);
  } else if (splash) {
    splash.style.display = 'none';
  }

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
});
