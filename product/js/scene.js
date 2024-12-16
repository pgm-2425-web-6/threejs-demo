const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer( { antialias : true});
const loader = new THREE.TextureLoader();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);


const controls = new THREE.OrbitControls(camera, renderer.domElement);

const GLTFLoader = new THREE.GLTFLoader();
let cameraModel = null;
GLTFLoader.load('./assets/vintage_camera/scene.gltf', 
  (gltf) => {
    cameraModel  = gltf.scene;
    cameraModel.scale.set(4,4,4);
    cameraModel.position.set(0, -1, 0);
    // cameraModel.rotation.y = Math.PI / 3;
    // cameraModel.rotation.x = - Math.PI / 10;
    scene.add(cameraModel)
  },
  (xhr) => {
      console.log(`Model laden: ${(xhr.loaded / xhr.total) * 100}% voltooid.`);
  },
  (error) => {
      console.error('Fout bij laden van model:', error);
  }
)


const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
const positions = [
  [10, 10, 10],
  [-10, 10, 10],
  [10, -10, 10],
  [-10, -10, 10],
  [10, 10, -10],
  [-10, 10, -10]
];

for (let i = 0; i < colors.length; i++) {
  const pointLight = new THREE.PointLight(colors[i], 1, 100);
  pointLight.position.set(...positions[i]);
  scene.add(pointLight);
}


camera.position.set(0,0,8)

function animate(){
  requestAnimationFrame(animate);
  scene.traverse((object) => {
    if (object.isPointLight) {
      object.position.x += Math.sin(Date.now() * 0.001) * 0.1;
      object.position.y += Math.cos(Date.now() * 0.001) * 0.1;
    }
  });
  renderer.render(scene, camera);
}

animate(); 


window.addEventListener('resize' , () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
})



// interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const heroText = document.getElementById('hero-text');

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (event.clientY / window.innerHeight) * 2 - 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(cameraModel);
  if(intersects.length > 0){
    heroText.classList.add('active');
    // heroText.classList.remove('hidden')
  }
  else{
    // heroText.classList.add('hidden');
    heroText.classList.remove('active')
  }
}

window.addEventListener("click", onMouseClick, false);


