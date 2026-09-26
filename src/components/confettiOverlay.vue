<template>
    <canvas ref="canvasRef" class="confettiOverlay" aria-hidden="true"></canvas>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import confettiParticleA from "../../assets/confettiParticleA.png";
import confettiParticleB from "../../assets/confettiParticleB.png";

const canvasRef = ref(null);

const particleImages = [];
const particles = [];
let context = null;
let animationFrameId = 0;
let imageLoadPromise = null;
let lastTimestamp = 0;

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function prefersReducedMotion() {
    return (
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}

function loadImage(source) {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null);
        image.src = source;
    });
}

async function ensureImages() {
    if (particleImages.length > 0) {
        return particleImages;
    }

    if (!imageLoadPromise) {
        imageLoadPromise = Promise.all([
            loadImage(confettiParticleA),
            loadImage(confettiParticleB),
        ]).then((images) => {
            const resolvedImages = images.filter(Boolean);

            particleImages.splice(0, particleImages.length, ...resolvedImages);

            return particleImages;
        });
    }

    return imageLoadPromise;
}

function setupCanvas() {
    const canvas = canvasRef.value;

    if (!canvas) {
        return;
    }

    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * devicePixelRatio);
    canvas.height = Math.floor(height * devicePixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    context = canvas.getContext("2d");

    if (context) {
        context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        context.clearRect(0, 0, width, height);
    }
}

function createParticle(originX, originY, index, spreadX, spreadY) {
    const image = particleImages[index % particleImages.length] || null;
    const angle = randomBetween(-2.85, -0.25);
    const speed = randomBetween(360, 760);

    return {
        age: 0,
        drag: randomBetween(0.93, 0.975),
        gravity: randomBetween(720, 980),
        image,
        life: randomBetween(1500, 2300),
        opacity: 1,
        rotation: randomBetween(0, Math.PI * 2),
        rotationVelocity: randomBetween(-5.6, 5.6),
        size: randomBetween(10, 18),
        x: originX + randomBetween(-spreadX, spreadX),
        y: originY + randomBetween(-spreadY, spreadY),
        vx: Math.cos(angle) * speed + randomBetween(-180, 180),
        vy: Math.sin(angle) * speed - randomBetween(20, 120),
    };
}

function drawParticle(particle) {
    if (!context || !particle.image) {
        return;
    }

    context.save();
    context.globalAlpha = particle.opacity;
    context.translate(particle.x, particle.y);
    context.rotate(particle.rotation);
    context.drawImage(
        particle.image,
        -particle.size / 2,
        -particle.size / 2,
        particle.size,
        particle.size,
    );
    context.restore();
}

function renderParticles() {
    if (!context) {
        return;
    }

    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const particle of particles) {
        drawParticle(particle);
    }
}

function updateParticles(deltaSeconds) {
    for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];

        particle.age += deltaSeconds * 1000;
        particle.vx *= particle.drag;
        particle.vy += particle.gravity * deltaSeconds;
        particle.x += particle.vx * deltaSeconds;
        particle.y += particle.vy * deltaSeconds;
        particle.rotation += particle.rotationVelocity * deltaSeconds;
        particle.opacity = Math.max(0, 1 - particle.age / particle.life);

        if (
            particle.opacity <= 0 ||
            particle.y - particle.size > window.innerHeight + 48
        ) {
            particles.splice(index, 1);
        }
    }
}

function step(timestamp) {
    if (!context) {
        animationFrameId = 0;
        return;
    }

    if (!lastTimestamp) {
        lastTimestamp = timestamp;
    }

    const deltaMilliseconds = Math.min(32, timestamp - lastTimestamp);
    const deltaSeconds = deltaMilliseconds / 1000;

    lastTimestamp = timestamp;

    updateParticles(deltaSeconds);
    renderParticles();

    if (particles.length > 0) {
        animationFrameId = window.requestAnimationFrame(step);
        return;
    }

    animationFrameId = 0;
    lastTimestamp = 0;
}

function startAnimation() {
    if (animationFrameId) {
        return;
    }

    lastTimestamp = 0;
    animationFrameId = window.requestAnimationFrame(step);
}

async function burst(options = {}) {
    // Motion is the whole effect here, so it is skipped when the user asks for less of it.
    if (prefersReducedMotion()) {
        return;
    }

    await ensureImages();

    if (particleImages.length === 0) {
        return;
    }

    setupCanvas();

    const originX = options.originX ?? window.innerWidth / 2;
    const originY = options.originY ?? Math.min(window.innerHeight * 0.24, 210);
    const particleCount = options.particleCount ?? 128;
    const spreadX = options.spreadX ?? 56;
    const spreadY = options.spreadY ?? 18;

    for (let index = 0; index < particleCount; index += 1) {
        particles.push(
            createParticle(originX, originY, index, spreadX, spreadY),
        );
    }

    startAnimation();
}

function stop() {
    if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
    }

    particles.length = 0;
    lastTimestamp = 0;

    if (context) {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
}

function handleResize() {
    setupCanvas();
}

onMounted(async () => {
    setupCanvas();
    window.addEventListener("resize", handleResize, { passive: true });
    await ensureImages();
});

onBeforeUnmount(() => {
    stop();
    window.removeEventListener("resize", handleResize);
});

defineExpose({
    burst,
    stop,
});
</script>

<style scoped>
.confettiOverlay {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 18;
    pointer-events: none;
}
</style>
