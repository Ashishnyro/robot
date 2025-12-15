AOS.init();

// Countdown Timer
const eventDate = new Date("2026-02-01").getTime();
setInterval(() => {
  const now = new Date().getTime();
  const diff = eventDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  document.getElementById("countdown").innerText =
    `Next Competition in: ${days} days`;
}, 1000);

// Mock Project Data (Firebase Structure Ready)
const projects = [
  {
    title: "Autonomous Line Follower",
    tech: "Arduino, IR Sensors",
    learning: "PID control and sensor fusion",
  },
  {
    title: "Smart Surveillance Rover",
    tech: "Raspberry Pi, AI",
    learning: "Computer vision & navigation",
  },
];

const grid = document.getElementById("projectsGrid");
projects.forEach(p => {
  const div = document.createElement("div");
  div.className = "border p-4";
  div.innerHTML = `
    <h3 class="text-cyan-400">${p.title}</h3>
    <p>${p.tech}</p>
    <p><strong>What We Learned:</strong> ${p.learning}</p>
  `;
  grid.appendChild(div);
});

// Simple Simulator
const canvas = document.getElementById("simulator");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "cyan";
ctx.fillRect(50, 50, 50, 50);

// Dark Mode
document.getElementById("darkToggle").onclick = () =>
  document.documentElement.classList.toggle("invert");
/* ================= THREE.JS ROBOT ANIMATION ================= */

const container = document.getElementById("robot-container");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.z = 7;

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

/* Lights */
scene.add(new THREE.AmbientLight(0x00ffff, 0.6));

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

/* Robot Material */
const robotMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ffff,
  metalness: 0.75,
  roughness: 0.25
});

/* Robot Group */
const robot = new THREE.Group();

/* Body */
const body = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2.6, 1.6),
  robotMaterial
);
robot.add(body);

/* Head */
const head = new THREE.Mesh(
  new THREE.BoxGeometry(1.6, 1.6, 1.6),
  robotMaterial
);
head.position.y = 2.4;
robot.add(head);

/* Eyes */
const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const eyeGeo = new THREE.SphereGeometry(0.15, 16, 16);

const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
leftEye.position.set(-0.35, 0.2, 0.9);

const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
rightEye.position.set(0.35, 0.2, 0.9);

head.add(leftEye, rightEye);

/* Arms */
const armGeo = new THREE.CylinderGeometry(0.2, 0.2, 2);

const leftArm = new THREE.Mesh(armGeo, robotMaterial);
leftArm.position.set(-1.7, 0.3, 0);
leftArm.rotation.z = Math.PI / 4;

const rightArm = new THREE.Mesh(armGeo, robotMaterial);
rightArm.position.set(1.7, 0.3, 0);
rightArm.rotation.z = -Math.PI / 4;

robot.add(leftArm, rightArm);
scene.add(robot);

/* Animation */
const clock = new THREE.Clock();

function animateRobot() {
  requestAnimationFrame(animateRobot);
  const t = clock.getElapsedTime();

  robot.rotation.y = Math.sin(t * 0.6) * 0.4;
  head.rotation.y = Math.sin(t) * 0.5;
  robot.position.y = Math.sin(t * 1.5) * 0.15;

  renderer.render(scene, camera);
}
animateRobot();

/* Responsive Resize */
window.addEventListener("resize", () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});
/* ================= INNOVATION LAB LOGIC ================= */

// Speed slider
const speed = document.getElementById("speed");
const speedVal = document.getElementById("speedVal");

if (speed && speedVal) {
  speed.addEventListener("input", () => {
    speedVal.textContent = speed.value;
  });
}

// Fake sensor data
setInterval(() => {
  const distance = document.getElementById("distance");
  const battery = document.getElementById("battery");

  if (distance && battery) {
    distance.textContent = Math.floor(Math.random() * 80 + 10);
    battery.textContent = Math.floor(Math.random() * 40 + 60);
  }
}, 2000);

// Animated counters
function animateCounter(id, target) {
  let count = 0;
  const el = document.getElementById(id);
  const interval = setInterval(() => {
    count++;
    el.textContent = count;
    if (count >= target) clearInterval(interval);
  }, 30);
}

animateCounter("robotsBuilt", 24);
animateCounter("competitions", 12);
animateCounter("members", 48);
animateCounter("projects", 9);
/* ================= ROBOTICS JOURNAL INTERACTION ================= */

document.querySelectorAll(".like-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const count = btn.querySelector("span");
    count.textContent = Number(count.textContent) + 1;
  });
});

/* ================= AI CHATBOT FRONTEND ================= */

const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const sendBtn = document.getElementById("sendBtn");
const typing = document.getElementById("typing");
const closeChat = document.getElementById("closeChat");
const chatbot = document.getElementById("chatbot");

function addMessage(sender, text, alignRight = false) {
  const msg = document.createElement("div");
  msg.className = alignRight
    ? "text-right text-gray-200"
    : "text-gray-300";
  msg.innerHTML = `<span class="text-${alignRight ? "purple" : "cyan"}-400">
    ${sender}:</span> ${text}`;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  addMessage("You", message, true);
  chatInput.value = "";

  typing.classList.remove("hidden");

  try {
    const res = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    typing.classList.add("hidden");

    addMessage("RoboBot", data.reply || "Sorry, I couldn't understand that.");

  } catch (err) {
    typing.classList.add("hidden");
    addMessage("RoboBot", "Server not connected. Please try again later.");
  }
}

sendBtn.addEventListener("click", sendMessage);

chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

closeChat.addEventListener("click", () => {
  chatbot.classList.add("hidden");
});

/* ================= ROBOT ANIMATION FIX ================= */

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("robot-container");
  if (!container || !window.THREE) {
    console.error("Robot container or Three.js missing");
    return;
  }

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0x00ffff, 0.7));
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  // Robot material
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    metalness: 0.6,
    roughness: 0.3
  });

  const robot = new THREE.Group();

  // Body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 2.4, 1.4),
    material
  );
  robot.add(body);

  // Head
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.4, 1.4),
    material
  );
  head.position.y = 2.1;
  robot.add(head);

  // Eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const eyeGeo = new THREE.SphereGeometry(0.12, 16, 16);

  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.25, 0.15, 0.8);

  const rightEye = leftEye.clone();
  rightEye.position.x = 0.25;

  head.add(leftEye, rightEye);

  scene.add(robot);

  // Animation
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    robot.rotation.y = Math.sin(t * 0.5) * 0.4;
    robot.position.y = Math.sin(t * 1.5) * 0.1;
    renderer.render(scene, camera);
  }
  animate();

  // Resize fix
  window.addEventListener("resize", () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
});

/* =================Lottie / Three.js Placeholder=================*/

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("robot-container");

  if (!container || !window.THREE) {
    console.error("Robot container or Three.js not found");
    return;
  }

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 6;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0x00ffff, 0.7));
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  // Material
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    metalness: 0.6,
    roughness: 0.3
  });

  // Robot
  const robot = new THREE.Group();

  // Body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 2.4, 1.4),
    material
  );
  robot.add(body);

  // Head
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.4, 1.4),
    material
  );
  head.position.y = 2.1;
  robot.add(head);

  // Eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const eyeGeo = new THREE.SphereGeometry(0.12, 16, 16);

  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.25, 0.15, 0.8);

  const rightEye = leftEye.clone();
  rightEye.position.x = 0.25;

  head.add(leftEye, rightEye);

  scene.add(robot);

  // Animation
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    robot.rotation.y = Math.sin(t * 0.5) * 0.4;
    robot.position.y = Math.sin(t * 1.5) * 0.1;

    renderer.render(scene, camera);
  }

  animate();

  // Resize handling
  window.addEventListener("resize", () => {
    const w = container.clientWidth;
    const h = container.clientHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
});
