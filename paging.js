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
    const timeSinceLastScroll = Date.now() - lastScrollTime;

    if (timeSinceLastScroll > lastScrollCooldown) {
        const currentPageIndex = Math.round(window.scrollY / window.innerHeight);
        const currentPageY = currentPageIndex * window.innerHeight;

        window.scroll({ top: currentPageY, behavior: 'smooth' });
    }

    prevTimestep = timestep;

    window.requestAnimationFrame(update);
}