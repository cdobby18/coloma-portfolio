(function () {
  function trackShare(method, result) {
    if (typeof window.cjTrack === "function") {
      window.cjTrack("share", {
        method: method,
        result: result,
        page: window.location.pathname,
      });
    }
  }

  var buttons = document.querySelectorAll("[data-copy-link], .post-share-btn, .cs-share-btn");
  if (!buttons.length) return;

  function legacyCopy(value) {
    var field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.top = "-1000px";
    document.body.appendChild(field);
    field.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(field);
    return ok;
  }

  buttons.forEach(function (button) {
    if (button.tagName === "A") {
      button.addEventListener("click", function () {
        var href = button.getAttribute("href") || "";
        if (href.indexOf("linkedin.com") !== -1) trackShare("linkedin", "click");
        else if (href.indexOf("mailto:") === 0) trackShare("email", "click");
      });
      return;
    }

    button.addEventListener("click", function () {
      var value = button.getAttribute("data-copy-link") || window.location.href;
      var status = button.parentElement.querySelector(".cs-share-status, .post-share-status");
      var original = button.textContent;

      function confirmCopy(ok) {
        button.textContent = ok ? "Copied" : "Copy failed";
        if (status) status.textContent = ok ? "Link copied to clipboard." : "Could not copy the link.";
        trackShare("copy", ok ? "ok" : "failed");
        window.setTimeout(function () {
          button.textContent = original;
          if (status) status.textContent = "";
        }, 1800);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(
          function () { confirmCopy(true); },
          function () { confirmCopy(legacyCopy(value)); }
        );
        return;
      }
      confirmCopy(legacyCopy(value));
    });
  });
})();
