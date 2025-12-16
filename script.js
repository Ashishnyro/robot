/* =========================================================
   GLOBAL INIT
========================================================= */
AOS.init({ once: true });

/* =========================================================
   COUNTDOWN TIMER
========================================================= */
const countdownEl = document.getElementById("countdown");
const eventDate = new Date("2026-02-01T00:00:00").getTime();

if (countdownEl) {
  setInterval(() => {
    const now = Date.now();
    const diff = eventDate - now;

    if (diff <= 0) {
      countdownEl.textContent = "Competition is Live!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    countdownEl.textContent = `Next Competition in: ${days} days`;
  }, 1000);
}

/* =========================================================
   DARK MODE TOGGLE
========================================================= */
const darkToggle = document.getElementById("darkToggle");
if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("invert");
  });
}

/* =========================================================
   INNOVATION LAB – SPEED SLIDER
========================================================= */
const speed = document.getElementById("speed");
const speedVal = document.getElementById("speedVal");

if (speed && speedVal) {
  speed.addEventListener("input", () => {
    speedVal.textContent = speed.value;
  });
}

/* =========================================================
   FAKE SENSOR DATA
========================================================= */
setInterval(() => {
  const distance = document.getElementById("distance");
  const battery = document.getElementById("battery");

  if (distance) distance.textContent = Math.floor(Math.random() * 80 + 10);
  if (battery) battery.textContent = Math.floor(Math.random() * 40 + 60);
}, 2000);

/* =========================================================
   ANIMATED METRICS
========================================================= */
function animateCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;

  let count = 0;
  const step = Math.ceil(target / 60);

  const interval = setInterval(() => {
    count += step;
    if (count >= target) {
      count = target;
      clearInterval(interval);
    }
    el.textContent = count;
  }, 30);
}

animateCounter("robotsBuilt", 24);
animateCounter("competitions", 12);
animateCounter("members", 48);
animateCounter("projects", 9);

/* =========================================================
   JOURNAL LIKE BUTTONS
========================================================= */
document.querySelectorAll(".like-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const span = btn.querySelector("span");
    span.textContent = Number(span.textContent) + 1;
  });
});

/* =========================================================
   THREE.JS ROBOT ANIMATION (SINGLE, CLEAN, FINAL)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("robot-container");
  if (!container || !window.THREE) return;

  /* Scene */
  const scene = new THREE.Scene();

  /* Camera */
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 7);

  /* Renderer */
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  /* Lights */
  scene.add(new THREE.AmbientLight(0x00ffff, 0.6));
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  /* Material */
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    metalness: 0.7,
    roughness: 0.3
  });

  /* Robot Group */
  const robot = new THREE.Group();

  /* Body */
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2.6, 1.6),
    material
  );
  robot.add(body);

  /* Head */
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 1.6, 1.6),
    material
  );
  head.position.y = 2.4;
  robot.add(head);

  /* Eyes */
  const eyeGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.35, 0.2, 0.9);

  const rightEye = leftEye.clone();
  rightEye.position.x = 0.35;

  head.add(leftEye, rightEye);

  /* Arms */
  const armGeo = new THREE.CylinderGeometry(0.2, 0.2, 2);

  const leftArm = new THREE.Mesh(armGeo, material);
  leftArm.position.set(-1.7, 0.3, 0);
  leftArm.rotation.z = Math.PI / 4;

  const rightArm = new THREE.Mesh(armGeo, material);
  rightArm.position.set(1.7, 0.3, 0);
  rightArm.rotation.z = -Math.PI / 4;

  robot.add(leftArm, rightArm);
  scene.add(robot);

  /* Animation */
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    robot.rotation.y = Math.sin(t * 0.6) * 0.4;
    robot.position.y = Math.sin(t * 1.5) * 0.15;
    head.rotation.y = Math.sin(t) * 0.4;

    renderer.render(scene, camera);
  }
  animate();

  /* Responsive */
  window.addEventListener("resize", () => {
    const w = container.clientWidth;
    const h = container.clientHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && ["c", "u", "s"].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
});
