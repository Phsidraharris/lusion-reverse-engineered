export function animate(callback, duration) {
    const startTime = performance.now();

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const percent = Math.min(elapsed / duration, 1);

        callback(percent);

        if (percent < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}