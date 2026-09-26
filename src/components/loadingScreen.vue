<template>
    <transition name="preloaderFade">
        <div v-if="visible" class="preloader" role="status">
            <div class="preloader__content">
                <img
                    class="preloader__emote"
                    :src="emoteSrc"
                    width="74"
                    height="74"
                    alt=""
                    aria-hidden="true"
                />
                <div class="preloader__bar" aria-hidden="true">
                    <div class="preloader__barFill"></div>
                </div>
                <p class="preloader__label">
                    Загрузка<span class="preloader__dots" aria-hidden="true">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                </p>
            </div>
        </div>
    </transition>
</template>

<script setup>
defineProps({
    emoteSrc: {
        type: String,
        required: true,
    },
    visible: {
        type: Boolean,
        required: true,
    },
});
</script>

<style scoped>
.preloader {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: grid;
    place-items: center;
    background: var(--color-bg);
}

.preloader__content {
    width: min(320px, calc(100vw - 40px));
    display: grid;
    justify-items: center;
    gap: 16px;
}

.preloader__emote {
    width: 74px;
    height: 74px;
    object-fit: contain;
    -webkit-user-drag: none;
}

.preloader__bar {
    width: 100%;
    height: 10px;
    padding: 2px;
    border-radius: var(--radius-pill);
    background: var(--color-surface);
    box-shadow: inset 0 0 0 1px var(--color-hairline);
    overflow: hidden;
}

.preloader__barFill {
    width: 40%;
    height: 100%;
    border-radius: var(--radius-pill);
    background: linear-gradient(90deg, #2d2d30, #57575f, #2d2d30);
    animation: preloaderBar 1.1s ease-in-out infinite;
}

.preloader__label {
    margin: 0;
    color: var(--color-text);
    font-family: var(--font-display);
    font-size: var(--text-label);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.preloader__dots {
    display: inline-flex;
    min-width: 18px;
    justify-content: flex-start;
}

.preloader__dots span {
    opacity: 0.18;
    animation: preloaderDot 1.2s steps(1, end) infinite;
}

.preloader__dots span:nth-child(2) {
    animation-delay: 0.2s;
}

.preloader__dots span:nth-child(3) {
    animation-delay: 0.4s;
}

.preloaderFade-enter-active,
.preloaderFade-leave-active {
    transition: opacity 0.28s ease;
}

.preloaderFade-enter-from,
.preloaderFade-leave-to {
    opacity: 0;
}

@keyframes preloaderBar {
    0% {
        transform: translateX(-90%);
    }

    100% {
        transform: translateX(240%);
    }
}

@keyframes preloaderDot {
    0%,
    20% {
        opacity: 0.18;
    }

    40%,
    100% {
        opacity: 1;
    }
}

@media (prefers-reduced-motion: reduce) {
    .preloader__dots span {
        opacity: 1;
    }
}
</style>
