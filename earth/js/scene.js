const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
const loader = new THREE.TextureLoader();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Achtergrond
scene.background = loader.load("./assets/galaxy.jpg");

// Aarde
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const redMaterial = new THREE.MeshStandardMaterial({ color: "red" });
const earthMaterial = new THREE.MeshStandardMaterial({
  map: loader.load("./assets/earth.jpg"),
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);

scene.add(earth);
const ambientLight = new THREE.AmbientLight("white");
scene.add(ambientLight);
camera.position.z = 5;

// torus
const torusGeometry = new THREE.TorusKnotGeometry(6, 0.4, 100, 16);
const torusMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff6347, // Stel de kleur in
  metalness: 0.9, // Stel de metallic waarde in
  roughness: 0.2, // Stel de ruwheid in
  reflectivity: 1, // Stel de reflectiviteit in
});

const torus = new THREE.Mesh(torusGeometry, torusMaterial);

torus.castShadow = true;

scene.add(torus);

const spotLight = new THREE.SpotLight("blue", 2);
spotLight.position.set(3, 3, 3);
spotLight.castShadow = true;
scene.add(spotLight);

// animation
function animateTorus() {
  torus.rotation.x += 0.003;
  torus.rotation.y += 0.003;
}

function animate() {
  requestAnimationFrame(animate);
  // camera.position.z += 0.01;
  earth.rotation.y += 0.001;
  renderer.render(scene, camera);
  camera.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
  camera.rotation.x = Math.sin(3424345 + Date.now() * 0.001) * 0.1;

  animateTorus();
}
animate();

// interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const infoDiv = document.getElementById("infoDiv");
function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (event.clientY / window.innerHeight) * 2 - 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(earth);

  if (intersects.length > 0) {
    infoDiv.style.display = "block";
  } else {
    infoDiv.style.display = "none";
  }
}

window.addEventListener("click", onMouseClick, false);
