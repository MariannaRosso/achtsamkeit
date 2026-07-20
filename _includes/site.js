document.addEventListener("DOMContentLoaded", function () {

  const text = "Flaky is on holiday from 25.10 to 2.11. Orders can still be placed and will be ready for pickup after this period.";
  const target = document.getElementById("announcement-text");

  // 💥 IMPORTANT: If the element isn't found, stop
  if (!target) {
    console.error("announcement-text element not found!");
    return;
  }

  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      target.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  }

  typeWriter();
});
