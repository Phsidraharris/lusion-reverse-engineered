window.addEventListener('wheel', onWheel);
window.requestAnimationFrame(update)

const lastScrollCooldown = 250;
let lastScrollTime = 0;
let prevTimestep = 0;

function onWheel(e) {
    lastScrollTime = Date.now();
}

function update(timestep) {
    const dt = timestep - prevTimestep;

    updatePageSnapping();

    prevTimestep = timestep;

    window.requestAnimationFrame(update);
}

function updatePageSnapping() {
    const pageDistanceThreshold = 0.3;
    const timeSinceLastScroll = Date.now() - lastScrollTime;

    if (timeSinceLastScroll > lastScrollCooldown) {
        const pageHeight = window.innerHeight;
        const currentPageIndex = Math.round(window.scrollY / pageHeight);
        const targetPageY = currentPageIndex * pageHeight;

        // Distance to target as a percentage of page height
        const distanceToTarget = Math.abs((targetPageY - window.scrollY) / pageHeight);
        if (distanceToTarget < pageDistanceThreshold) {
            window.scroll({ top: targetPageY, behavior: 'smooth' });
        }
    }
}