import * as THREE from 'three';

let glowSprite;
export function init() {
    // create a glowing ball to follow the mouse in 3D space
    let globe = new THREE.SphereGeometry(1, 24, 24);
    let glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff, // #000000ff 
        transparent: true,
        opacity: .3,
        side: THREE.DoubleSide,
        // fog: true,
        // wireframe: true
    });
    glowSprite = new THREE.Mesh(globe, glowMaterial);
    glowSprite.scale.set(0.1, 0.1, 0.1);

    return glowSprite;
}
