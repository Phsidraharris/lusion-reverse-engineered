import { MathUtils } from "three";

window.addEventListener('wheel', onWheel);
window.requestAnimationFrame(update)

const pageDistanceThreshold = 0.3;      // As a percentage of page height
const lastScrollCooldown = 350;
let lastScrollTime = 0;
let prevTimestep = 0;

function onWheel(e) {
    lastScrollTime = Date.now();
}

function update(timestep) {
    const dt = timestep - prevTimestep;

    updatePageSnapping(dt);

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