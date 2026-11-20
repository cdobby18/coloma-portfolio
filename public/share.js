(function () {
  var buttons = document.querySelectorAll("[data-copy-link]");
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
    button.addEventListener("click", function () {
      var value = button.getAttribute("data-copy-link") || window.location.href;
      var status = button.parentElement.querySelector(".cs-share-status, .post-share-status");
      var original = button.textContent;

      function confirmCopy(ok) {
        button.textContent = ok ? "Copied" : "Copy failed";
        if (status) status.textContent = ok ? "Link copied to clipboard." : "Could not copy the link.";
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
