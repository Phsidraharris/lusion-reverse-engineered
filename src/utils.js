import * as THREE from "three";

export function pageToWorldCoords(pageX, pageY, camera) {
    const normalisedScreenCoordsX = (pageX / window.innerWidth) * 2 - 1;
    const normalisedScreenCoordsY = -(pageY / window.innerHeight) * 2 + 1;

    var screenPos = new THREE.Vector3(normalisedScreenCoordsX, normalisedScreenCoordsY, 0);
    screenPos.unproject(camera);

    return screenPos;
}