document.addEventListener("DOMContentLoaded", () => {

  const container = document.querySelector("#oak-leaves-bg");

  if (!container) return;

  const originalSvg = container.querySelector("svg");

  if (!originalSvg) return;


  // ============================================================
  // SETTINGS
  // ============================================================

  // Time for each outline to draw
  const drawDuration = 2600;

  // Delay between outline elements
  const drawStagger = 150;

  // Time for each leaf background to fade in
  const fillDuration = 400;

  // Delay between individual leaf fills
  const fillDelays = {
    backgroundleaf1: 0,
    backgroundleaf2: 120,
    backgroundleaf3: 240,
    backgroundleaf4: 360
  };

  // How gently the wind starts
  const windIntroDuration = 1800;


  // ============================================================
  // CREATE MIRRORED SVG
  // ============================================================

  const rightSvg = originalSvg.cloneNode(true);

  rightSvg.classList.add("oak-leaves-svg-right");

  // Remove the original SVG id if it has one
  // so there are not two identical IDs.
  rightSvg.removeAttribute("id");

  container.appendChild(rightSvg);


  // ============================================================
  // SVGs TO ANIMATE
  // ============================================================

  const svgs = [
    originalSvg,
    rightSvg
  ];


  // Helper function: find an element inside a particular SVG
  const find = (svg, id) => {
    return svg.querySelector(`#${id}`);
  };


  // ============================================================
  // OUTLINE ELEMENTS
  // ============================================================

  const outlineIds = [
    "stem",
    "leaf1",
    "leaf2",
    "leaf3",
    "leaf4"
  ];

  const allOutlines = [];


  svgs.forEach(svg => {

    outlineIds.forEach((id, index) => {

      const path = find(svg, id);

      if (!path) return;

      const length = path.getTotalLength();

      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = "none";
      path.style.opacity = "1";

      allOutlines.push({
        path,
        length,
        delay: index * drawStagger
      });

    });

  });


  // ============================================================
  // LEAF BACKGROUNDS
  // ============================================================

  const backgroundIds = [
    "backgroundleaf1",
    "backgroundleaf2",
    "backgroundleaf3",
    "backgroundleaf4"
  ];

  const allBackgrounds = [];


  svgs.forEach(svg => {

    backgroundIds.forEach(id => {

      const background = find(svg, id);

      if (!background) return;

      background.style.opacity = "0";

      allBackgrounds.push({
        element: background,
        id: id
      });

    });

  });


  // ============================================================
  // LEAF / WIND SETTINGS
  // ============================================================

  const leaves = [
    {
      id: "leaf1",
      x: 33.788,
      y: 71.567,
      amplitude: 3.2,
      period: 5.4,
      phase: 0.2
    },
    {
      id: "leaf2",
      x: 39.129,
      y: 44.900,
      amplitude: 2.8,
      period: 4.8,
      phase: 1.4
    },
    {
      id: "leaf3",
      x: 66.302,
      y: 44.817,
      amplitude: 2.6,
      period: 5.9,
      phase: 3.0
    },
    {
      id: "leaf4",
      x: 65.634,
      y: 28.039,
      amplitude: 3.4,
      period: 5.1,
      phase: 4.5
    }
  ];


  // ============================================================
  // GROUP EACH LEAF WITH ITS BACKGROUND
  // ============================================================

  const groups = [];


  svgs.forEach(svg => {

    leaves.forEach(item => {

      const leaf = find(svg, item.id);

      const background = find(
        svg,
        "background" + item.id
      );

      if (!leaf) return;


      const group = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );


      leaf.parentNode.insertBefore(
        group,
        leaf
      );


      group.appendChild(leaf);


      if (background) {
        group.insertBefore(
          background,
          leaf
        );
      }


      groups.push({
        group,
        x: item.x,
        y: item.y,
        amplitude: item.amplitude,
        period: item.period,
        phase: item.phase
      });

    });

  });


  // ============================================================
  // DRAW OUTLINES
  // ============================================================

  const startDrawing = () => {

    const startTime = performance.now();


    const animateDrawing = now => {

      let allDone = true;


      allOutlines.forEach(item => {

        const elapsed =
          now - startTime - item.delay;


        if (elapsed <= 0) {

          allDone = false;

          return;
        }


        const progress = Math.min(
          elapsed / drawDuration,
          1
        );


        // Ease-out
        const easedProgress =
          1 - Math.pow(
            1 - progress,
            3
          );


        item.path.style.strokeDashoffset =
          item.length *
          (1 - easedProgress);


        if (progress < 1) {
          allDone = false;
        }

      });


      if (!allDone) {

        requestAnimationFrame(
          animateDrawing
        );

      } else {

        startFills(now);
      }

    };


    requestAnimationFrame(
      animateDrawing
    );

  };


  // ============================================================
  // REVEAL FILLS
  // ============================================================

  const startFills = startTime => {

    // IMPORTANT:
    //
    // Start the wind immediately when the fills start.
    // The wind itself eases in slowly, so the leaves don't jump.
    startWind(startTime);


    const animateFills = now => {

      const elapsed =
        now - startTime;


      let allDone = true;


      allBackgrounds.forEach(item => {

        const delay =
          fillDelays[item.id] || 0;


        const localElapsed =
          elapsed - delay;


        if (localElapsed <= 0) {

          item.element.style.opacity = "0";

          allDone = false;

          return;
        }


        const progress =
          Math.min(
            localElapsed /
              fillDuration,
            1
          );


        // Smoothstep
        const easedProgress =
          progress *
          progress *
          (3 - 2 * progress);


        item.element.style.opacity =
          easedProgress;


        if (progress < 1) {
          allDone = false;
        }

      });


      if (!allDone) {

        requestAnimationFrame(
          animateFills
        );

      }

    };


    requestAnimationFrame(
      animateFills
    );

  };


  // ============================================================
  // WIND
  // ============================================================

  const startWind = startTime => {

    const animateWind = now => {

      const elapsed =
        now - startTime;


      const seconds =
        elapsed / 1000;


      // Gradually introduce movement
      const introProgress =
        Math.min(
          elapsed /
            windIntroDuration,
          1
        );


      // Smoothstep
      const introEase =
        introProgress *
        introProgress *
        (3 - 2 * introProgress);


      groups.forEach(item => {

        // Main movement
        const main =
          Math.sin(
            (seconds /
              item.period) *
              Math.PI *
              2 +
              item.phase
          );


        // Secondary movement
        const secondary =
          0.28 *
          Math.sin(
            (seconds /
              (item.period * 1.67)) *
              Math.PI *
              2 +
              item.phase * 1.7
          );


        const targetAngle =
          item.amplitude *
          (
            0.78 * main +
            secondary
          );


        // Starts exactly at zero rotation
        // and gradually becomes full wind motion
        const angle =
          targetAngle *
          introEase;


        item.group.setAttribute(
          "transform",
          `rotate(${angle.toFixed(3)} ${item.x} ${item.y})`
        );

      });


      requestAnimationFrame(
        animateWind
      );

    };


    requestAnimationFrame(
      animateWind
    );

  };


  // ============================================================
  // REDUCED MOTION
  // ============================================================

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (prefersReducedMotion) {

    allOutlines.forEach(item => {
      item.path.style.strokeDashoffset = "0";
    });


    allBackgrounds.forEach(item => {
      item.element.style.opacity = "1";
    });


    return;
  }


  // ============================================================
  // START
  // ============================================================

  startDrawing();

});