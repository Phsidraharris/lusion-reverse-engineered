window.addEventListener('wheel', onWheel);
window.requestAnimationFrame(update)

const pageDistanceThreshold = 0.3;      // As a percentage of page height
const lastScrollCooldown = 350;
let lastScrollTime = 0;
let prevTimestep = 0;

const scrollbar = document.getElementById("scrollbar");
const scrollbarHandle = document.getElementById("scrollbar-handle");
const article2 = document.getElementById("article-2");

function onWheel(e) {
    lastScrollTime = Date.now();
}

function update(timestep) {
    const dt = timestep - prevTimestep;

    updatePageSnapping(dt);
    updateScrollbar();

    prevTimestep = timestep;
    window.requestAnimationFrame(update);
}

function updatePageSnapping(dt) {
    const timeSinceLastScroll = Date.now() - lastScrollTime;

    if (timeSinceLastScroll > lastScrollCooldown) {
        const pageHeight = window.innerHeight;
        const currentPageIndex = Math.round(window.scrollY / pageHeight);
        const currentPageY = currentPageIndex * pageHeight;

        // Distance to target as a percentage of page height
        const distanceToTarget = Math.abs((currentPageY - window.scrollY) / pageHeight);
        const targetScrollY = distanceToTarget < pageDistanceThreshold ? currentPageY : window.scrollY;

        if (distanceToTarget < pageDistanceThreshold) {
            const targetScrollDelta = targetScrollY - window.scrollY;
            window.scrollBy(0, Math.round(targetScrollDelta * 0.1 + 0.5));
        }
    }
}

function updateScrollbar() {
    // Height as a function of the viewport. This tells us how tall our total scrollable content using the 
    // viewport's height as the unit of measurement.
    const heightPerViewport = document.body.clientHeight / window.innerHeight;
    scrollbarHandle.style.height = `${scrollbar.clientHeight / heightPerViewport}px`;

    const scrollProgress = window.scrollY / (document.body.clientHeight);
    scrollbarHandle.style.top = `${scrollProgress * 100}%`;
}