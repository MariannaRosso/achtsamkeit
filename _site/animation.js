document.addEventListener("DOMContentLoaded", () => {
    const path = document.getElementById("river-path");
    const dot = document.getElementById("river-dot");
    if (!path) return;
    const length = path.getTotalLength();
    // Hide initially
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    if (dot) dot.style.opacity = 1;

    async function animate() {
        // DRAW (line + dot travel together)
        const drawAnimation = path.animate(
            [
                  { strokeDashoffset: length,        offset: 0.00 }, // 100%
                  { strokeDashoffset: length * 0.45, offset: 0.45 }, // 65%
                  { strokeDashoffset: 0,             offset: 1.00 }  // 0%
            ],
            {
                duration: 6500,
                easing: "cubic-bezier(0.05, 0.95, 0.3, 1)",
                fill: "forwards"
            }
        );

        if (dot) {
            dot.animate(
                [
                    { offsetDistance: "0%" },
                    { offsetDistance: "100%" }
                ],
                {
                    duration: 6500,
                    easing: "cubic-bezier(0.05, 0.95, 0.3, 1)",
                    fill: "forwards"
                }
            );
        }

        await drawAnimation.finished;

        // Pause
        await new Promise(resolve => setTimeout(resolve, 500));

        // Fade the dot out as the erase begins
        if (dot) {
            dot.animate(
                [{ opacity: 1 }, { opacity: 0 }],
                { duration: 800, easing: "ease-out", fill: "forwards" }
            );
        }

        // ERASE FROM THE BEGINNING
        await path.animate(
            [
                {
                    strokeDasharray: `${length} ${length}`,
                    strokeDashoffset: 0
                },
                {
                    strokeDasharray: `0 ${length}`,
                    strokeDashoffset: -length
                }
            ],
            {
                duration: 5000,
                easing: "ease-out",
                fill: "forwards"
            }
        ).finished;

        // Leave it erased.
        path.style.strokeDasharray = `0 ${length}`;
        path.style.strokeDashoffset = -length;
        if (dot) dot.style.opacity = 0;
    }
    animate();
});