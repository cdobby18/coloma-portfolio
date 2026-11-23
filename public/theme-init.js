/* Three-mode theme bootstrap (system / light / dark) for the static blog pages.
   Loaded synchronously in <head> so there is no flash of the wrong theme. */
(function () {
  var KEY = "op-theme";
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function pref() {
    try {
      var value = localStorage.getItem(KEY);
      if (value === "dark" || value === "light" || value === "system") return value;
    } catch (e) { /* ignore */ }
    return "system";
  }

  function isDark(mode) {
    return mode === "dark" || (mode === "system" && !!mq && mq.matches);
  }

  function apply() {
    var mode = pref();
    var dark = isDark(mode);
    root.setAttribute("data-theme", dark ? "dark" : "light");
    root.style.colorScheme = dark ? "dark" : "light";
    root.style.background = dark ? "#0a0a0b" : "#fcfcfc";
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#0a0a0b" : "#fcfcfc");
    document.dispatchEvent(new CustomEvent("site-theme-change", { detail: { mode: mode, dark: dark } }));
  }

  function set(mode) {
    if (mode !== "dark" && mode !== "light" && mode !== "system") return;
    try { localStorage.setItem(KEY, mode); } catch (e) { /* ignore */ }
    apply();
  }

  window.siteTheme = { pref: pref, isDark: isDark, apply: apply, set: set };

  apply();

  if (mq) {
    var onChange = function () { if (pref() === "system") apply(); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }
})();
