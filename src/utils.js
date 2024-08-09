import * as THREE from "three";

export function pageToWorldCoords(pageX, pageY, camera) {
    const normalisedScreenCoordsX = (pageX / window.innerWidth) * 2 - 1;
    const normalisedScreenCoordsY = -(pageY / window.innerHeight) * 2 + 1;

    // 1 = far + cam pos, = -1000 + 10 = -990
    // -1 = near + cam pos = 0 + 10 = 10
    // express world 0, as percentage between -990 and 10
    const t = THREE.MathUtils.inverseLerp(-990, 10, -camera.position.z);

    var screenPos = new THREE.Vector3(normalisedScreenCoordsX, normalisedScreenCoordsY, -t);
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