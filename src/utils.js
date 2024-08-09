import * as THREE from "three";

export function pageToWorldCoords(pageX, pageY, camera) {
    const normalisedScreenCoordsX = (pageX / window.innerWidth) * 2 - 1;
    const normalisedScreenCoordsY = -(pageY / window.innerHeight) * 2 + 1;

    var screenPos = new THREE.Vector3(normalisedScreenCoordsX, normalisedScreenCoordsY, 0);
    screenPos.unproject(camera);

    return screenPos;
}

export function updateCameraIntrisics(cameraRef, frustum) {
    const aspect = window.innerWidth / window.innerHeight;
    const horizontal = frustum * aspect / 2;
    const vertical = frustum / 2;
    cameraRef.left = -horizontal;
    cameraRef.right = horizontal;
    cameraRef.top = vertical;
    cameraRef.bottom = -vertical;
    cameraRef.updateProjectionMatrix();
}