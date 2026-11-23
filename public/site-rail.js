/* Injects the portfolio's left rail / mobile nav into the static blog pages. */
(function () {
  var EMAIL = "carljoshuamcoloma@gmail.com";
  var LINKS = [
    { label: "Experience", href: "/#experience" },
    { label: "Projects", href: "/#projects" },
    { label: "Stack", href: "/#stack" },
    { label: "Certifications", href: "/#certs" },
    { label: "Contact", href: "/#contact" },
    { label: "Blog", href: "/blog.html", active: true },
  ];

  var ICONS = {
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>',
    system: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M9 21h6M12 17v4"/></svg>',
    light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  };

  var THEME_OPTIONS = [
    { value: "system", label: "System theme", icon: ICONS.system },
    { value: "light", label: "Light theme", icon: ICONS.light },
    { value: "dark", label: "Dark theme", icon: ICONS.dark },
  ];

  function themeSwitch() {
    return (
      '<div class="site-theme" role="group" aria-label="Theme">' +
      THEME_OPTIONS.map(function (option) {
        return (
          '<button type="button" class="site-theme-opt" data-theme-opt="' + option.value + '"' +
          ' aria-label="' + option.label + '" title="' + option.label + '" aria-pressed="false">' +
          option.icon +
          "</button>"
        );
      }).join("") +
      "</div>"
    );
  }

  function linkMarkup(link, index) {
    return (
      '<a class="site-rail-link' + (link.active ? " is-active" : "") + '" href="' + link.href + '"' +
      (link.active ? ' aria-current="page"' : "") + ">" +
      '<span class="site-num">' + String(index + 1).padStart(2, "0") + "</span>" +
      '<span class="site-text">' + link.label + "</span>" +
      '<span class="site-go" aria-hidden="true">→</span>' +
      "</a>"
    );
  }

  function menuMarkup(link, index) {
    return (
      '<a class="site-menu-link" href="' + link.href + '">' +
      '<span class="site-menu-link-main">' +
      '<span class="site-menu-num">' + String(index + 1).padStart(2, "0") + "</span>" +
      link.label +
      "</span>" +
      '<span aria-hidden="true">→</span>' +
      "</a>"
    );
  }

  var brand =
    '<a class="site-brand" href="/">' +
    '<span class="site-brand-mark"><img src="/cjlogo.png" alt="CJ logo" /></span>' +
    '<span class="site-brand-text">' +
    '<span>Carl Coloma</span>' +
    '<span class="site-brand-role">AI &amp; Automation</span>' +
    "</span>" +
    "</a>";

  var rail =
    '<aside class="site-rail" aria-label="Site">' +
    '<div class="site-rail-head">' +
    brand +
    "</div>" +
    '<nav class="site-rail-links" aria-label="Sections">' +
    LINKS.map(linkMarkup).join("") +
    "</nav>" +
    '<div class="site-rail-actions">' +
    '<a class="site-ask" href="/#ask">' + ICONS.spark + "Ask AI" +
    '<span class="site-kbd">↗</span></a>' +
    themeSwitch() +
    "</div>" +
    '<div class="site-rail-contact">' +
    '<span class="site-label">Contact</span>' +
    "<p>For work, collabs &amp; everything else, reach me at</p>" +
    '<a href="mailto:' + EMAIL + '">' + EMAIL + "</a>" +
    "</div>" +
    "</aside>";

  var topbar =
    '<header class="site-topbar">' +
    brand +
    '<div class="site-topbar-actions">' +
    themeSwitch() +
    '<button class="site-hamburger" type="button" aria-label="Toggle menu" aria-expanded="false" aria-controls="siteMenu">' +
    ICONS.menu +
    "</button>" +
    "</div>" +
    "</header>";

  var menu =
    '<div class="site-menu" id="siteMenu">' +
    LINKS.map(menuMarkup).join("") +
    '<div class="site-menu-foot">' +
    '<a class="site-ask" href="/#ask" style="width:auto">' + ICONS.spark + "Ask AI</a>" +
    themeSwitch() +
    "</div>" +
    '<div class="site-menu-contact">' +
    "<p>For work, collabs &amp; everything else, reach me at</p>" +
    '<a href="mailto:' + EMAIL + '">' + EMAIL + "</a>" +
    "</div>" +
    "</div>";

  var mount = document.createElement("div");
  mount.innerHTML = rail + topbar + menu;
  var fragment = document.createDocumentFragment();
  while (mount.firstChild) fragment.appendChild(mount.firstChild);
  document.body.insertBefore(fragment, document.body.firstChild);

  /* theme switch */
  function syncTheme() {
    var mode = window.siteTheme ? window.siteTheme.pref() : "system";
    document.querySelectorAll(".site-theme-opt").forEach(function (button) {
      var active = button.getAttribute("data-theme-opt") === mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }
  document.querySelectorAll(".site-theme-opt").forEach(function (button) {
    button.addEventListener("click", function () {
      if (window.siteTheme) window.siteTheme.set(button.getAttribute("data-theme-opt"));
      syncTheme();
    });
  });
  document.addEventListener("site-theme-change", syncTheme);
  syncTheme();

  /* mobile menu */
  var hamburger = document.querySelector(".site-hamburger");
  var menuEl = document.getElementById("siteMenu");
  function setMenu(open) {
    if (!menuEl || !hamburger) return;
    menuEl.classList.toggle("is-open", open);
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    hamburger.innerHTML = open ? ICONS.close : ICONS.menu;
  }
  if (hamburger) {
    hamburger.addEventListener("click", function () {
      setMenu(!menuEl.classList.contains("is-open"));
    });
  }
  if (menuEl) {
    menuEl.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
  }
  window.addEventListener("resize", function () {
    if (window.innerWidth > 960) setMenu(false);
  });
})();
