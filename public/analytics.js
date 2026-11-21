(function () {
  function track(name, data) {
    if (!name) return;
    var payload = data || {};

    // Vercel Web Analytics custom events. The queue stub lives in each page
    // head so events sent before the script loads are not lost.
    try {
      if (typeof window.va === "function") {
        window.va("event", { name: name, data: payload });
      }
    } catch (e) {}

    // Optional provider hooks. They are no-ops unless the provider is present.
    try {
      if (typeof window.plausible === "function") {
        window.plausible(name, { props: payload });
      }
    } catch (e) {}
    try {
      if (window.umami && typeof window.umami.track === "function") {
        window.umami.track(name, payload);
      }
    } catch (e) {}

    // Useful for local debugging and for adding a provider later without
    // touching every call site.
    try {
      window.dispatchEvent(new CustomEvent("cj:analytics", { detail: { name: name, data: payload } }));
    } catch (e) {}
  }

  window.cjTrack = track;
})();
