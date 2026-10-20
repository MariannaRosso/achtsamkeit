document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("a[href]").forEach(function (link) {
    const url = new URL(link.href, window.location.href);

    if (url.origin === window.location.origin) {
      // Internal link: same tab
      link.removeAttribute("target");
    } else if (url.protocol === "http:" || url.protocol === "https:") {
      // External link: new tab
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });
});
