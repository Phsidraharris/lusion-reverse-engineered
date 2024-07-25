window.addEventListener('wheel', onWheel);
window.addEventListener('scroll', onScroll);
window.requestAnimationFrame(update)

const pageDistanceThreshold = 0.3;      // As a percentage of page height
const lastScrollCooldown = 350;
let lastScrollTime = 0;
let prevTimestep = 0;

const scrollbar = document.getElementById("scrollbar");
const scrollbarHandle = document.getElementById("scrollbar-handle");
const section2 = document.getElementById("section-2");

function isElementOnScreen(element) {
    let observer;

    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger as soon as even one pixel is visible
    };

    return new Promise((resolve) => {
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    resolve(true);
                    observer.disconnect();
                } else {
                    resolve(false);
                }
            });
        }, observerOptions);

        observer.observe(element);
    });
}

// Usage example:
function onScroll() {
    isElementOnScreen(section2).then(isOnScreen => {
        if (isOnScreen) {
            console.log('Element is on the screen');
        } else {
            console.log('Element is not on the screen');
        }
    });
}

function onWheel(e) {
    lastScrollTime = Date.now();
}

function update(timestep) {
    // Time delta between frames in seconds
    const dt = (timestep - prevTimestep) / 1000;

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
            window.scrollBy(0, targetScrollDelta);
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