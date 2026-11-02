(function () {
  // mobilni meni
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  if (header && toggle) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open);
    });
    var closeNav = function () {
      header.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', false);
    };
    Array.prototype.forEach.call(header.querySelectorAll('.menu a'), function (a) {
      a.addEventListener('click', closeNav);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeNav();
    });
  }

  // senka ispod headera pri skrolovanju
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // hero slajder
  Array.prototype.forEach.call(document.querySelectorAll('[data-slider]'), function (root) {
    var slides = root.querySelectorAll('.hero-slide');
    var dotsWrap = root.querySelector('.hero-dots');
    var interval = parseInt(root.getAttribute('data-interval'), 10) || 6000;
    var dots = [];
    var current = 0;
    var timer;

    Array.prototype.forEach.call(slides, function (slide, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Слајд ' + (i + 1));
      dot.addEventListener('click', function () { go(i); restart(); });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function go(i) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(function () { go(current + 1); }, interval);
    }

    root.querySelector('.hero-prev').addEventListener('click', function () { go(current - 1); restart(); });
    root.querySelector('.hero-next').addEventListener('click', function () { go(current + 1); restart(); });
    root.addEventListener('mouseenter', function () { clearInterval(timer); });
    root.addEventListener('mouseleave', restart);

    // prevlacenje prstom na telefonu
    var startX = null, startY = 0;
    root.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      startX = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        go(current + (dx < 0 ? 1 : -1));
        restart();
      }
    }, { passive: true });

    go(0);
    restart();
  });

  // brojevi zaposlenih po grupama
  Array.prototype.forEach.call(document.querySelectorAll('.team-group'), function (group) {
    var count = group.querySelector('.count');
    if (count) count.textContent = group.querySelectorAll('.person').length;
  });

  // animacija pri skrolovanju
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-visible'); });
  }
})();
