document.addEventListener("DOMContentLoaded", () => {

  const container = document.querySelector("#oak-leaves-bg");

  if (!container) return;

  const originalSvg = container.querySelector("svg");

  if (!originalSvg) return;


  // ============================================================
  // SETTINGS
  // ============================================================

  // Time for each outline to draw
  const drawDuration = 3400;

  // Delay between outline elements
  const drawStagger = 180;

  // Start the fills BEFORE the outlines have finished
  const fillStartDelay = 2000;

  // Time for each background to fade in
  const fillDuration = 220;

  // Existing leaf fill delays — UNCHANGED
  // Acorn backgrounds are added after the leaves.
  const fillDelays = {
    backgroundleaf1: 0,
    backgroundleaf2: 70,
    backgroundleaf3: 140,
    backgroundleaf4: 210,

    "acorn-big-background": 280,
    "acorn-small-background": 340
  };

  // How gently the wind starts
  const windIntroDuration = 1800;


  // ============================================================
  // CREATE SECOND / MIRRORED SVG
  // ============================================================

  const rightSvg = originalSvg.cloneNode(true);

  rightSvg.classList.add("oak-leaves-svg-right");

  // Remove the SVG's own ID so there aren't duplicate SVG IDs.
  rightSvg.removeAttribute("id");

  container.appendChild(rightSvg);


  // ============================================================
  // BRANCH SETTINGS
  // ============================================================

  const branches = [
    {
      svg: originalSvg,
      windDelay: 0,
      phaseOffset: 0
    },
    {
      svg: rightSvg,
      windDelay: 1200,
      phaseOffset: 1.1
    }
  ];


  // ============================================================
  // HELPER
  // ============================================================

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
    "leaf4",

    // NEW ACORN
    "acorn-big-line",
    "acorn-small-line"
  ];

  const allOutlines = [];


  branches.forEach(branch => {

    outlineIds.forEach((id, index) => {

      const path = find(branch.svg, id);

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
  // BACKGROUNDS
  // ============================================================

  const backgroundIds = [
    "backgroundleaf1",
    "backgroundleaf2",
    "backgroundleaf3",
    "backgroundleaf4",

    // NEW ACORN
    "acorn-big-background",
    "acorn-small-background"
  ];

  const allBackgrounds = [];


  branches.forEach(branch => {

    backgroundIds.forEach(id => {

      const background = find(branch.svg, id);

      if (!background) return;

      background.style.opacity = "0";

      allBackgrounds.push({
        element: background,
        id: id
      });

    });

  });


  // ============================================================
  // LEAF / ACORN WIND SETTINGS
  // ============================================================

  const leaves = [

    // ==========================================================
    // EXISTING LEAVES — UNCHANGED
    // ==========================================================

    {
      id: "leaf1",
      x: 33.788,
      y: 71.567,
      amplitude: 5,
      period: 5.4,
      phase: 0.2
    },

    {
      id: "leaf2",
      x: 39.129,
      y: 44.900,
      amplitude: 4,
      period: 4.8,
      phase: 1.4
    },

    {
      id: "leaf3",
      x: 66.302,
      y: 44.817,
      amplitude: 3,
      period: 5.9,
      phase: 3.0
    },

    {
      id: "leaf4",
      x: 65.634,
      y: 28.039,
      amplitude: 4,
      period: 5.1,
      phase: 4.5
    },


    // ==========================================================
    // NEW ACORN
    // ==========================================================

    {
      id: "acorn",

      // Rotation point
      x: 19.1,
      y: 79.5,

      // Smaller movement than the leaves
      amplitude: 3,

      // Slightly slower movement
      period: 5.6,

      // Independent phase
      phase: 2.2
    }

  ];


  // ============================================================
  // GROUP LEAVES + ACORN FOR WIND ANIMATION
  // ============================================================

  const groups = [];


  branches.forEach(branch => {

    leaves.forEach(item => {


      // ========================================================
      // NORMAL LEAVES
      // ========================================================

      if (item.id !== "acorn") {

        const leaf = find(
          branch.svg,
          item.id
        );

        const background = find(
          branch.svg,
          "background" + item.id
        );

        if (!leaf) return;


        const group =
          document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
          );


        leaf.parentNode.insertBefore(
          group,
          leaf
        );


        // Background first
        if (background) {

          group.appendChild(
            background
          );

        }


        // Outline second
        group.appendChild(
          leaf
        );


        groups.push({
          group,
          x: item.x,
          y: item.y,
          amplitude: item.amplitude,
          period: item.period,
          phase: item.phase,
          windDelay: branch.windDelay,
          phaseOffset: branch.phaseOffset
        });


        return;
      }


      // ========================================================
      // ACORN
      // ========================================================

      const bigLine = find(
        branch.svg,
        "acorn-big-line"
      );

      const smallLine = find(
        branch.svg,
        "acorn-small-line"
      );

      const bigBackground = find(
        branch.svg,
        "acorn-big-background"
      );

      const smallBackground = find(
        branch.svg,
        "acorn-small-background"
      );


      if (!bigLine || !smallLine) return;


      const group =
        document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );


      // Put the group where the first acorn
      // outline currently sits.
      bigLine.parentNode.insertBefore(
        group,
        bigLine
      );


      // ========================================================
      // ACORN LAYER ORDER
      // ========================================================

      // Backgrounds first
      if (bigBackground) {

        group.appendChild(
          bigBackground
        );

      }

      if (smallBackground) {

        group.appendChild(
          smallBackground
        );

      }


      // Outlines second
      group.appendChild(
        bigLine
      );

      group.appendChild(
        smallLine
      );


      // ========================================================
      // ADD ACORN TO WIND ANIMATION
      // ========================================================

      groups.push({
        group,
        x: item.x,
        y: item.y,
        amplitude: item.amplitude,
        period: item.period,
        phase: item.phase,
        windDelay: branch.windDelay,
        phaseOffset: branch.phaseOffset
      });

    });

  });


  // ============================================================
  // DRAW OUTLINES
  // ============================================================

  const startDrawing = () => {

    const startTime =
      performance.now();


    // Start fills independently,
    // before drawing is complete.
    setTimeout(() => {

      startFills(
        performance.now()
      );

    }, fillStartDelay);


    const animateDrawing = now => {

      let allDone = true;


      allOutlines.forEach(item => {

        const elapsed =
          now -
          startTime -
          item.delay;


        if (elapsed <= 0) {

          allDone = false;

          return;

        }


        const progress =
          Math.min(
            elapsed / drawDuration,
            1
          );


        // Ease-out cubic
        const easedProgress =
          1 -
          Math.pow(
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

    // Start wind at the same time
    // as the fills.
    startWind(startTime);


    const animateFills = now => {

      const elapsed =
        now -
        startTime;


      let allDone = true;


      allBackgrounds.forEach(item => {

        const delay =
          fillDelays[item.id] || 0;


        const localElapsed =
          elapsed -
          delay;


        if (localElapsed <= 0) {

          item.element.style.opacity =
            "0";

          allDone = false;

          return;

        }


        const progress =
          Math.min(
            localElapsed /
              fillDuration,
            1
          );


        // Smoothstep easing
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

  const startWind = globalStartTime => {

    const animateWind = now => {

      groups.forEach(item => {


        // Every branch has its own wind
        // starting time.
        const branchElapsed =
          now -
          globalStartTime -
          item.windDelay;


        // Branch hasn't started moving yet.
        if (branchElapsed <= 0) {

          item.group.setAttribute(
            "transform",
            `rotate(0 ${item.x} ${item.y})`
          );

          return;

        }


        const seconds =
          branchElapsed / 1000;


        // Gradually introduce movement.
        const introProgress =
          Math.min(
            branchElapsed /
              windIntroDuration,
            1
          );


        // Smoothstep easing
        const introEase =
          introProgress *
          introProgress *
          (3 - 2 * introProgress);


        // Main gentle movement
        const main =
          Math.sin(
            (
              seconds /
              item.period
            ) *
            Math.PI *
            2 +
            item.phase +
            item.phaseOffset
          );


        // Smaller secondary movement
        const secondary =
          0.28 *
          Math.sin(
            (
              seconds /
              (item.period * 1.67)
            ) *
            Math.PI *
            2 +
            item.phase * 1.7 +
            item.phaseOffset * 0.8
          );


        const targetAngle =
          item.amplitude *
          (
            0.78 * main +
            secondary
          );


        // Start from exactly 0 degrees
        // and smoothly transition into
        // continuous movement.
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

      item.path.style.strokeDashoffset =
        "0";

    });


    allBackgrounds.forEach(item => {

      item.element.style.opacity =
        "1";

    });


    return;

  }


  // ============================================================
  // START
  // ============================================================

  startDrawing();

});