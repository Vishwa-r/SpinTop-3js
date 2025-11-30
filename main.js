import * as THREE from "https://unpkg.com/three@0.164.1/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.164.1/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.164.1/examples/jsm/controls/OrbitControls.js";
import * as app from './app/app.js';


// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe1a0f3);  // #e1a0f3ff

// const camera = new THREE.PerspectiveCamera(
//   75, window.innerWidth / window.innerHeight, 0.1, 1000
// );

const camera = new THREE.OrthographicCamera(
  window.innerWidth / -200,
  window.innerWidth / 200,
  window.innerHeight / 200,
  window.innerHeight / -200,
  0.1,
  1000
);

camera.position.set(1, 1, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.autoRotate = true;

// Load 3D model
let mixer;  // For animations
let ropeMesh, ropeNodes = [];
function load3DModel() {
  const loader = new GLTFLoader();
  loader.load(
    './assets/Rope.glb',  // path to your model
    (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      // Set up animation
      if (gltf.animations && gltf.animations.length) {
        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });
      }


      let child = model.children;
      ropeMesh = child.filter(_ => _.name == 'Rope')[0];
      if (ropeMesh) {
        ropeMesh.geometry.computeBoundingBox();
        ropeMesh.geometry = ropeMesh.geometry.toNonIndexed();
        ropeMesh.castShadow = true;
  
        scene.add(ropeMesh);
      }

      model.position.set(-.5, 0, 0);
      model.traverse((child) => {
      });
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
      console.error('Error loading model', error);
    }
  );
}

load3DModel();

// Resize handler
window.addEventListener('resize', () => {

  const aspect = window.innerWidth / window.innerHeight;
  const frustumSize = 2;
  camera.left = -frustumSize * aspect / 2;
  camera.right = frustumSize * aspect / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Mouse move handler
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
function onMouseMove(event) {

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Project mouse to a point in 3D
  raycaster.setFromCamera(mouse, camera);

  const pt = raycaster.ray.origin.clone().add(
      raycaster.ray.direction.clone().multiplyScalar(2)
  );

  // move first node to mouse position
  // const firstNode = ropeNodes[0];
  // firstNode.m_x.setValue(pt.x, pt.y, pt.z);

  const point = raycaster.ray.at(2, new THREE.Vector3()); // distance from camera
  // ropeMesh.position.copy(point);
  glowSprite.position.copy(point);
}


// Animation loop
const clock = new THREE.Clock();

function animate() {

  requestAnimationFrame(animate);

  // Update the animation mixer if it exists
  if (mixer) {
    mixer.update(0.01); // Update based on time
  }
  controls.update();
  renderer.render(scene, camera);
}

let glowSprite = app.init();
scene.add(glowSprite);
window.addEventListener('mousemove', onMouseMove);

animate();


