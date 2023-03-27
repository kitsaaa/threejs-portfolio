import * as THREE from 'https://unpkg.com/three@latest/build/three.module.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({color: 0xB2BEB5, wireframe: true});
const torus = new THREE.Mesh(geometry, material);

const loadingManager = new THREE.LoadingManager();

const controlsCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
controlsCamera.position.setZ(30);



scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
const ambientLight = new THREE.AmbientLight(0xffffff);
pointLight.position.set(20,20,20)

scene.add(pointLight, ambientLight);



function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);



const nickTexture = new THREE.TextureLoader(loadingManager).load('nick.JPG');

const nick = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({map: nickTexture})
);

scene.add(nick);



// const moonTexture = new THREE.TextureLoader(loadingManager).load('moon.jpg');
// const normalTexture = new THREE.TextureLoader(loadingManager).load('normal.jpg');
const displacementMap = new THREE.TextureLoader(loadingManager).load( 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg' );
const moonTexture = new THREE.TextureLoader(loadingManager).load("https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg")

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshPhongMaterial ( 
    { color: 0xffffff ,
      map: moonTexture ,
      displacementMap: displacementMap,
      displacementScale: 0.06,
      bumpMap: displacementMap,
      bumpScale: 0.04,
     reflectivity:0, 
     shininess :0
    }) 
);
// 

// );

// const moon = new THREE.Mesh( moonGeometry, moonMaterial );

scene.add(moon);

moon.position.z = 20;
moon.position.setX(-10);

nick.position.z = -5;
nick.position.x = 2;

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  nick.rotation.y += 0.01;
  nick.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;

}


document.body.onscroll = moveCamera;
moveCamera();

function animate() {
  requestAnimationFrame( animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  nick.rotation.x += 0.001;
  nick.rotation.y += 0.0005;
  nick.rotation.z += 0.001;



  renderer.render(scene, camera);
}

loadingManager.onLoad = () => {
  animate();
};

