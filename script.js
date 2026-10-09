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
  // every 5 seconds, pauses while the visitor is hovering or
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

    // Starts the automatic 5-second slide rotation. (To change the speed, change 5000 - it is in milliseconds.)
    // clearInterval first, so two timers can never run at once (that made slides change at odd moments).
    function startAutoplay() {
      if (reduceMotion) return;
      clearInterval(timer);
      timer = setInterval(next, 5000);
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
  // Submits to Formspree (see the big comment above the <form> tag
  // in contact.html for the one-time setup needed) - Formspree takes
  // the submission and forwards it to hello@odsconsulting.tech as a
  // real email. The page itself never reloads: the submission happens
  // quietly in the background (fetch), and the button/status text
  // just reports whether it worked.
  //
  // The Subject field auto-fills when arriving via a link like
  // contact.html?subject=Enquiry%20for%20Power%20BI - this is how
  // the "Talk to us about..." buttons on the Services page work.
  // ------------------------------------------------------------
  var form = document.querySelector('.contact-form');
  if (form) {
    var subjectField = document.getElementById('subject');
    if (subjectField) {
      var params = new URLSearchParams(window.location.search);
      var subjectFromUrl = params.get('subject');
      if (subjectFromUrl) subjectField.value = subjectFromUrl;
    }

    var statusEl = document.getElementById('formStatus');

    function setStatus(message, kind) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.className = 'form-status' + (kind ? ' form-status-' + kind : '');
    }

    // ------------------------------------------------------------
    // Email validation: checks the typed value actually looks like
    // an email address (something@something.something), not just
    // relying on the browser's own built-in popup, which looks
    // different in every browser and some people miss entirely.
    // Shows/hides a specific message right under the field instead.
    // ------------------------------------------------------------
    var emailField = document.getElementById('email');
    var emailError = document.getElementById('emailError');
    var emailTouched = false; // only nag once they've left the field once, not while first typing

    function emailLooksValid() {
      // deliberately simple: "something@something.something", no spaces
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim());
    }

    function validateEmail() {
      var ok = emailField.value.trim() === '' ? !emailField.required : emailLooksValid();
      emailField.classList.toggle('is-invalid', !ok);
      if (emailError) {
        if (ok) {
          emailError.textContent = '';
          emailError.classList.remove('visible');
        } else {
          emailError.textContent = emailField.value.trim() === ''
            ? 'Please enter your email address.'
            : 'That doesn\u2019t look like a valid email address - please check it (e.g. name@example.com).';
          emailError.classList.add('visible');
        }
      }
      return ok;
    }

    if (emailField) {
      emailField.addEventListener('blur', function () { emailTouched = true; validateEmail(); });
      emailField.addEventListener('input', function () { if (emailTouched) validateEmail(); });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault(); // stop the default page-reload behaviour

      // Block the actual send if the email address doesn't check out.
      if (emailField) {
        emailTouched = true;
        if (!validateEmail()) {
          emailField.focus();
          return;
        }
      }

      var btn = form.querySelector('.btn-send');
      var originalHTML = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = 'Sending...';
      setStatus('', '');

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            setStatus('Thanks - your message has been sent. We\u2019ll be in touch shortly.', 'success');
            form.reset();
          } else {
            return response.json().then(function (data) {
              throw new Error((data && data.errors) ? data.errors.map(function (x) { return x.message; }).join(', ') : 'Submission failed');
            });
          }
        })
        .catch(function () {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
          setStatus('Something went wrong sending that - please try again, or email us directly at hello@odsconsulting.tech.', 'error');
        });
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

  // ------------------------------------------------------------
  // 9) POP-UP PANES THAT OPEN ON HOVER
  // Used by the Services "What We Deliver" cards and the Our Values
  // cards. Each card has data-modal="tm1" (or "clarity" etc) that
  // matches a pane with id="modal-tm1".
  //
  // With a MOUSE (or trackpad / pen):
  //   - resting the pointer on a card for a moment opens its pane
  //     (the tiny delay stops panes flashing open as you sweep past)
  //   - it stays open while the pointer is on the card OR the pane,
  //     and closes a moment after the pointer leaves both
  //   - moving onto another card that's still visible switches panes
  //   - the page is NOT locked and the dim layer lets the mouse through
  // With a FINGER (phones, tablets, touch screens): a tap opens the pane
  //   like a normal pop-up - the backdrop blocks the page; tap it (or the
  //   X) to close.
  // Keyboard: Tab to a card, Enter/Space opens it, Escape closes it.
  //
  // NOTE: this deliberately reacts to the pointer that is ACTUALLY being
  // used, instead of asking the browser "does this device have hover?".
  // Touch-screen laptops (and some browsers) answer that question wrongly,
  // which used to switch hover off even though a mouse was in use.
  // ------------------------------------------------------------
  var hoverCards = document.querySelectorAll('.value-card[data-modal], .capability-card[data-modal], .glance-card[data-modal]');
  var hoverOverlay = document.getElementById('modalOverlay');
  if (hoverCards.length && hoverOverlay) {
    var HAS_POINTER_EVENTS = !!window.PointerEvent;
    var vOpenCard = null, vOpenPane = null, vPinned = false, vScrollAt = 0;
    var vMode = 'hover';                       // 'hover' (mouse) or 'modal' (finger)
    var vLocked = false;                       // did WE lock the page scroll?
    var vOpenTimer, vCloseTimer;
    var vMouseX = -1, vMouseY = -1, vSuppressCard = null, vLastPointer = 'mouse';

    // true for a real mouse / trackpad / pen, false for a finger
    function isMouseLike(e) {
      return !HAS_POINTER_EVENTS || e.pointerType === 'mouse' || e.pointerType === 'pen';
    }

    // Remember the last kind of pointer used, and where the mouse is, so that when the
    // visitor dismisses a pane (X / Escape) we can tell which card is under the pointer
    // and NOT instantly re-open it.
    if (HAS_POINTER_EVENTS) {
      document.addEventListener('pointermove', function (e) {
        vLastPointer = e.pointerType;
        if (isMouseLike(e)) { vMouseX = e.clientX; vMouseY = e.clientY; }
      }, { passive: true });
      document.addEventListener('pointerdown', function (e) { vLastPointer = e.pointerType; }, { passive: true, capture: true });
    } else {
      document.addEventListener('mousemove', function (e) { vMouseX = e.clientX; vMouseY = e.clientY; }, { passive: true });
    }

    function vCardUnderPointer() {
      if (vMouseX < 0) return null;
      var els = document.elementsFromPoint(vMouseX, vMouseY);
      for (var i = 0; i < els.length; i++) {
        var c = els[i].closest ? els[i].closest('.value-card, .capability-card, .glance-card') : null;
        if (c) return c;
      }
      return null;
    }

    function vClose() {
      clearTimeout(vOpenTimer);
      clearTimeout(vCloseTimer);
      if (!vOpenPane) return;
      vOpenPane.classList.remove('open');
      hoverOverlay.classList.remove('open');
      if (vLocked) { document.body.style.overflow = ''; vLocked = false; }
      vOpenPane = null; vOpenCard = null; vPinned = false;
    }

    function vCloseByVisitor() {
      vSuppressCard = (vLastPointer !== 'touch') ? vCardUnderPointer() : null;
      vClose();
    }

    function vOpen(card, pin, viaTouch) {
      var pane = document.getElementById('modal-' + card.getAttribute('data-modal'));
      if (!pane) return;
      clearTimeout(vCloseTimer);
      if (vOpenPane && vOpenPane !== pane) vOpenPane.classList.remove('open');
      vMode = viaTouch ? 'modal' : 'hover';
      hoverOverlay.classList.toggle('is-hover', vMode === 'hover');   // see-through to the mouse only for mouse users
      pane.classList.add('open');
      hoverOverlay.classList.add('open');
      if (vMode === 'modal' && !vLocked) { document.body.style.overflow = 'hidden'; vLocked = true; }
      if (vMode === 'hover' && vLocked) { document.body.style.overflow = ''; vLocked = false; }
      vOpenPane = pane; vOpenCard = card; vPinned = !!pin;
      vScrollAt = window.pageYOffset;
    }

    function vScheduleClose() {
      clearTimeout(vCloseTimer);
      if (vPinned || vMode !== 'hover') return;     // keyboard-opened / finger-opened: stays until Escape / X / tap outside
      vCloseTimer = setTimeout(vClose, 220);
    }

    var enterEvent = HAS_POINTER_EVENTS ? 'pointerenter' : 'mouseenter';
    var leaveEvent = HAS_POINTER_EVENTS ? 'pointerleave' : 'mouseleave';

    hoverCards.forEach(function (card) {
      card.addEventListener(enterEvent, function (e) {
        if (!isMouseLike(e)) return;                  // a finger touching the card is handled by "click" below
        if (card === vSuppressCard) return;           // just dismissed while over this card
        clearTimeout(vCloseTimer);
        if (vOpenCard === card) return;
        clearTimeout(vOpenTimer);
        // brief pause before opening; switch instantly if another pane is already open
        vOpenTimer = setTimeout(function () { vOpen(card, false, false); }, vOpenPane ? 0 : 140);
      });
      card.addEventListener(leaveEvent, function (e) {
        if (!isMouseLike(e)) return;
        if (card === vSuppressCard) vSuppressCard = null;
        clearTimeout(vOpenTimer);
        vScheduleClose();
      });
      card.addEventListener('click', function (e) {
        var t = (e.pointerType !== undefined && e.pointerType !== '') ? e.pointerType : vLastPointer;
        vOpen(card, false, t === 'touch');
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          vOpen(card, true, false);
        }
      });
    });

    document.querySelectorAll('.modal-pane').forEach(function (pane) {
      pane.addEventListener(enterEvent, function (e) { if (isMouseLike(e)) clearTimeout(vCloseTimer); });
      pane.addEventListener(leaveEvent, function (e) { if (isMouseLike(e)) vScheduleClose(); });
    });
    document.querySelectorAll('.modal-pane .modal-close').forEach(function (btn) {
      btn.addEventListener('click', vCloseByVisitor);
    });
    hoverOverlay.addEventListener('click', vClose);           // finger: tap the dark backdrop
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') vCloseByVisitor();
    });
    document.addEventListener('click', function (e) {         // click anywhere else closes it
      if (!vOpenPane) return;
      if (vOpenPane.contains(e.target)) return;
      if (e.target.closest && e.target.closest('.value-card, .capability-card, .glance-card')) return;
      vClose();
    });
    window.addEventListener('scroll', function () {           // scrolling the page away closes a mouse-opened pane
      if (vMode === 'hover' && vOpenPane && Math.abs(window.pageYOffset - vScrollAt) > 40) vClose();
    }, { passive: true });
  }
});

/* ---------------------------------------------------------------
   VIDEO SHOWCASE
   Plays the video only while it is on screen; pauses when scrolled away.
--------------------------------------------------------------- */
(function () {
  var vid = document.querySelector('.video-frame video, .video-full video');
  if (!vid) return;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); }
        else { vid.pause(); }
      });
    }, { threshold: 0.35 }).observe(vid);
  } else { vid.setAttribute('autoplay', ''); }
})();

/* ===== WHY ODS PHOTO SLIDER =====
   Photo 1 shows for 5s, photo 2 slides up from the bottom and stays 10s, then photo 1 slides back up, and so on. */
(function(){
  var box = document.getElementById('photoSlider');
  if (!box) return;
  var a = box.querySelector('.ps-current'), b = box.querySelector('.ps-next');
  if (!a || !b) return;
  var showingFirst = true, timer;
  function swap(){
    /* the photo coming in is placed below, then slides up over the other */
    var incoming = showingFirst ? b : a, outgoing = showingFirst ? a : b;
    incoming.style.transition = 'none';
    incoming.style.transform = 'translateY(100%)';
    incoming.style.zIndex = 2; outgoing.style.zIndex = 1;
    void incoming.offsetWidth;
    incoming.style.transition = '';
    incoming.style.transform = 'translateY(0)';
    showingFirst = !showingFirst;
    timer = setTimeout(swap, showingFirst ? 5000 : 10000);
  }
  timer = setTimeout(swap, 5000);
})();

/* ===== "CLICK HERE TO LEARN MORE" PANES (Services page) =====
   A button with data-learn="tm1-more" opens the pane with id="modal-tm1-more".
   Closes with the X, a click on the dark backdrop, or Escape. */
(function () {
  var buttons = document.querySelectorAll('[data-learn]');
  var overlay = document.getElementById('modalOverlay');
  if (!buttons.length || !overlay) return;
  var openPane = null, lastButton = null;
  function open(btn) {
    var pane = document.getElementById('modal-' + btn.getAttribute('data-learn'));
    if (!pane) return;
    openPane = pane; lastButton = btn;
    overlay.classList.remove('is-hover');
    overlay.classList.add('open');
    pane.classList.add('open');
    pane.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    var x = pane.querySelector('.modal-close'); if (x) x.focus();
  }
  function close() {
    if (!openPane) return;
    openPane.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    openPane = null;
    if (lastButton) lastButton.focus();
  }
  buttons.forEach(function (b) { b.addEventListener('click', function () { open(b); }); });
  document.querySelectorAll('.modal-learn .modal-close').forEach(function (x) { x.addEventListener('click', close); });
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();

