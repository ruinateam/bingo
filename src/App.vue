<template>
    <div class="appShell">
        <ConfettiOverlay ref="confettiOverlayRef" />

        <LoadingScreen :visible="isLoading" :emote-src="loadingEmote" />

        <div class="page" :class="{ 'page--ready': !isLoading }">
            <header class="page__hero">
                <h1 class="visually-hidden">Minecraft Live Бинго</h1>

                <button
                    ref="celebrateButtonRef"
                    type="button"
                    class="page__celebrateButton"
                    aria-label="Запустить конфетти"
                    @click="handleBingoAchieved"
                >
                    <svg
                        class="page__pillIcon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M10.5 3.5 12.1 8.9 17.5 10.5 12.1 12.1 10.5 17.5 8.9 12.1 3.5 10.5 8.9 8.9 10.5 3.5Z"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M18.5 16.5v3.5M16.75 18.25h3.5"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                        />
                    </svg>
                    Конфетти
                </button>

                <button
                    ref="settingsButtonRef"
                    type="button"
                    class="page__settingsButton"
                    :class="{ 'page__settingsButton--open': isSettingsOpen }"
                    aria-controls="settingsPanel"
                    :aria-expanded="isSettingsOpen"
                    @click="toggleSettings"
                >
                    <svg
                        class="page__pillIcon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            stroke="currentColor"
                            d="M12 3.75a2.25 2.25 0 0 1 2.17 1.67l.12.45a1 1 0 0 0 .95.73h.48a2.25 2.25 0 0 1 1.95 1.12l.24.4a2.25 2.25 0 0 1-.12 2.47l-.29.39a1 1 0 0 0 0 1.2l.29.39a2.25 2.25 0 0 1 .12 2.47l-.24.4a2.25 2.25 0 0 1-1.95 1.12h-.48a1 1 0 0 0-.95.73l-.12.45A2.25 2.25 0 0 1 12 20.25a2.25 2.25 0 0 1-2.17-1.67l-.12-.45a1 1 0 0 0-.95-.73h-.48a2.25 2.25 0 0 1-1.95-1.12l-.24-.4a2.25 2.25 0 0 1 .12-2.47l.29-.39a1 1 0 0 0 0-1.2l-.29-.39a2.25 2.25 0 0 1-.12-2.47l.24-.4A2.25 2.25 0 0 1 8.28 6.6h.48a1 1 0 0 0 .95-.73l.12-.45A2.25 2.25 0 0 1 12 3.75Z"
                            stroke-width="2"
                        />
                        <circle
                            cx="12"
                            cy="12"
                            r="2.6"
                            stroke="currentColor"
                            stroke-width="2"
                        />
                    </svg>
                    Настройки
                </button>

                <Transition name="panel">
                    <div
                        v-if="isSettingsOpen"
                        id="settingsPanel"
                        ref="settingsPanelRef"
                        class="page__settingsPanel"
                    >
                        <button
                            type="button"
                            class="page__settingsAction"
                            @click="handleResetBoard"
                        >
                            <svg
                                class="page__settingsActionIcon"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M20 12a8 8 0 1 1-2.34-5.66"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M20 4v6h-6"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                            Обновить карточку
                        </button>
                    </div>
                </Transition>

                <div class="page__hero-content">
                    <div class="page__logo-wrap">
                        <div
                            class="page__logo-glow"
                            :class="{ 'page__logo-glow--bingo': isBingo }"
                        ></div>
                        <img
                            class="page__logo"
                            :class="{ 'page__logo--bingo': isBingo }"
                            :src="bingoLogo"
                            width="208"
                            height="162"
                            decoding="async"
                            alt=""
                        />
                    </div>
                    <p
                        ref="bingoStatusRef"
                        class="page__bingo-status"
                        :class="{ 'page__bingo-status--visible': isBingo }"
                        aria-hidden="true"
                    >
                        <svg
                            class="page__bingo-status-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M11.5 4 11 6"
                                opacity=".8"
                            />
                            <path
                                fill="currentColor"
                                fill-rule="evenodd"
                                d="M20 4a1 1 0 1 0-2 0 1 1 0 1 0 0 2 1 1 0 1 0 2 0 1 1 0 1 0 0-2Z"
                                clip-rule="evenodd"
                                opacity=".5"
                            />
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m15 9-1 1"
                                opacity=".7"
                            />
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m18 13 2-.5"
                                opacity=".8"
                            />
                            <path
                                fill="currentColor"
                                fill-rule="evenodd"
                                d="M6 4a1 1 0 0 0-2 0 1 1 0 0 0 0 2 1 1 0 0 0 2 0 1 1 0 0 0 0-2Zm11 15a1 1 0 0 1 1-1 1 1 0 1 1 2 0 1 1 0 1 1 0 2 1 1 0 1 1-2 0 1 1 0 0 1-1-1Z"
                                clip-rule="evenodd"
                            />
                            <path
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M14 16.518 7.482 10l-4.39 9.58a1 1 0 0 0 1.329 1.329L14 16.518Z"
                                opacity=".8"
                            />
                        </svg>
                        Бинго!
                    </p>
                </div>
            </header>

            <main class="page__main">
                <BingoBoard
                    ref="bingoBoardRef"
                    @bingo-achieved="handleBingoAchieved"
                    @bingo-change="handleBingoChange"
                />
            </main>
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import bingoLogo from "../assets/bingo.webp";
import confettiParticleA from "../assets/confettiParticleA.png";
import confettiParticleB from "../assets/confettiParticleB.png";
import loadingEmote from "../assets/loadingEmote.webp";
import BingoBoard from "./components/bingoBoard.vue";
import ConfettiOverlay from "./components/confettiOverlay.vue";
import LoadingScreen from "./components/loadingScreen.vue";

const isBingo = ref(false);
const isLoading = ref(true);
const isSettingsOpen = ref(false);
const bingoBoardRef = ref(null);
const bingoStatusRef = ref(null);
const confettiOverlayRef = ref(null);
const settingsButtonRef = ref(null);
const settingsPanelRef = ref(null);

function handleBingoChange(value) {
    isBingo.value = value;
}

function handleBingoAchieved() {
    const statusBounds = bingoStatusRef.value?.getBoundingClientRect();

    confettiOverlayRef.value?.burst({
        originX: statusBounds
            ? statusBounds.left + statusBounds.width / 2
            : window.innerWidth / 2,
        originY: statusBounds
            ? statusBounds.top + statusBounds.height / 2
            : Math.min(window.innerHeight * 0.2, 180),
        particleCount: 144,
        spreadX: statusBounds ? Math.max(20, statusBounds.width * 0.4) : 56,
        spreadY: statusBounds ? Math.max(10, statusBounds.height * 0.35) : 18,
    });
}

function toggleSettings() {
    isSettingsOpen.value = !isSettingsOpen.value;
}

function closeSettings({ returnFocus = false } = {}) {
    if (!isSettingsOpen.value) {
        return;
    }

    isSettingsOpen.value = false;

    if (returnFocus) {
        settingsButtonRef.value?.focus();
    }
}

function handleDocumentPointerDown(event) {
    if (!isSettingsOpen.value) {
        return;
    }

    if (
        settingsPanelRef.value?.contains(event.target) ||
        settingsButtonRef.value?.contains(event.target)
    ) {
        return;
    }

    closeSettings();
}

function handleDocumentKeydown(event) {
    if (event.key === "Escape") {
        closeSettings({ returnFocus: true });
    }
}

function handleResetBoard() {
    bingoBoardRef.value?.resetBoard();
    closeSettings();
}

onMounted(async () => {
    document.addEventListener("pointerdown", handleDocumentPointerDown);
    document.addEventListener("keydown", handleDocumentKeydown);

    await Promise.all([waitForMinimumLoad(), preloadCriticalAssets()]);
    isLoading.value = false;
});

onBeforeUnmount(() => {
    document.removeEventListener("pointerdown", handleDocumentPointerDown);
    document.removeEventListener("keydown", handleDocumentKeydown);
    confettiOverlayRef.value?.stop();
});

function waitForMinimumLoad() {
    return new Promise((resolve) => {
        window.setTimeout(resolve, 1300);
    });
}

async function preloadCriticalAssets() {
    const tasks = [
        preloadImage(bingoLogo),
        preloadImage(loadingEmote),
        preloadImage(confettiParticleA),
        preloadImage(confettiParticleB),
    ];

    if (typeof document !== "undefined" && document.fonts?.ready) {
        tasks.push(document.fonts.ready);
    }

    await Promise.allSettled(tasks);
}

function preloadImage(src) {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve();
        image.onerror = () => resolve();
        image.src = src;

        if (image.complete) {
            resolve();
        }
    });
}
</script>

<style scoped>
.appShell {
    position: relative;
}

.page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.28s var(--ease-out);
}

.page--ready {
    opacity: 1;
}

.page__hero {
    display: grid;
    gap: 6px;
    justify-items: center;
    text-align: center;
    padding-top: 0;
    position: relative;
}

.page__settingsButton,
.page__celebrateButton {
    position: absolute;
    top: 0;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
    padding: 0 14px;
    border: none;
    border-radius: var(--radius-pill);
    background: var(--color-surface-control);
    color: var(--color-text);
    font-family: var(--font-body);
    font-size: var(--text-control);
    font-weight: 700;
    box-shadow: inset 0 0 0 1px var(--color-hairline);
    transition:
        background-color var(--duration-hover) var(--ease-out),
        color var(--duration-hover) var(--ease-out),
        box-shadow var(--duration-hover) var(--ease-out),
        translate var(--duration-hover) var(--ease-out),
        scale var(--duration-press) var(--ease-out);
}

.page__settingsButton {
    right: 0;
}

.page__celebrateButton {
    left: 0;
    background: var(--color-celebrate-surface);
    color: var(--color-celebrate);
    box-shadow: inset 0 0 0 1px var(--color-celebrate-edge);
}

.page__pillIcon {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
}

.page__settingsButton--open {
    background: var(--color-surface-control-hover);
}

.page__settingsButton:active,
.page__celebrateButton:active {
    scale: 0.96;
}

@media (hover: hover) {
    .page__settingsButton:hover {
        translate: 0 -1px;
        background: var(--color-surface-control-hover);
        box-shadow:
            inset 0 0 0 1px var(--color-hairline-strong),
            0 10px 18px rgba(12, 10, 9, 0.22);
    }

    .page__celebrateButton:hover {
        translate: 0 -1px;
        background: rgba(120, 53, 15, 0.46);
        box-shadow:
            inset 0 0 0 1px rgba(252, 211, 77, 0.28),
            0 10px 18px rgba(67, 20, 7, 0.22);
    }
}

.page__settingsPanel {
    position: absolute;
    top: 46px;
    right: 0;
    display: grid;
    gap: 6px;
    min-width: 190px;
    padding: 8px;
    border-radius: var(--radius-panel);
    background: var(--color-surface-panel);
    backdrop-filter: blur(16px);
    box-shadow:
        inset 0 0 0 1px var(--color-hairline),
        0 18px 40px rgba(12, 10, 9, 0.24);
    z-index: 3;
}

.panel-enter-active,
.panel-leave-active {
    transition:
        opacity var(--duration-hover) var(--ease-out),
        transform var(--duration-hover) var(--ease-out);
}

.panel-enter-from {
    opacity: 0;
    transform: translateY(-8px);
}

.panel-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

.page__settingsAction {
    min-height: 40px;
    padding: 0 14px;
    border: none;
    border-radius: var(--radius-control);
    background: linear-gradient(
        180deg,
        var(--color-accent),
        var(--color-accent-strong)
    );
    color: var(--color-text);
    font-family: var(--font-body);
    font-size: var(--text-control);
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition:
        translate var(--duration-hover) var(--ease-out),
        box-shadow var(--duration-hover) var(--ease-out),
        scale var(--duration-press) var(--ease-out);
}

.page__settingsActionIcon {
    width: 15px;
    height: 15px;
    flex: 0 0 auto;
}

.page__settingsAction:active {
    scale: 0.96;
}

@media (hover: hover) {
    .page__settingsAction:hover {
        translate: 0 -1px;
        box-shadow: 0 10px 18px rgba(6, 95, 70, 0.22);
    }
}

.page__hero-content {
    position: relative;
    display: grid;
    justify-items: center;
    gap: 2px;
    min-height: 132px;
    padding-bottom: 18px;
}

.page__logo-wrap {
    position: relative;
    display: grid;
    place-items: center;
    width: min(320px, 72vw);
    min-height: 76px;
}

.page__logo-glow {
    position: absolute;
    width: min(420px, 88vw);
    height: 136px;
    border-radius: var(--radius-pill);
    background: radial-gradient(
        circle,
        rgba(239, 68, 68, 0.2) 0%,
        rgba(236, 72, 153, 0.12) 42%,
        rgba(0, 0, 0, 0) 78%
    );
    filter: blur(22px);
    transform: translateY(-6px);
    transition:
        transform 0.45s var(--ease-out),
        filter 0.45s var(--ease-out),
        opacity 0.45s var(--ease-out);
}

.page__logo {
    position: relative;
    width: 100%;
    height: auto;
    -webkit-user-drag: none;
    transform-origin: center top;
    transition:
        filter 0.45s var(--ease-out),
        transform 0.45s var(--ease-out);
}

.page__logo--bingo {
    filter: hue-rotate(180deg) saturate(1.1) brightness(1.02);
    transform: translateY(-3px) scale(0.955);
}

.page__logo-glow--bingo {
    filter: blur(22px) hue-rotate(180deg) saturate(1.1);
}

.page__bingo-status {
    position: absolute;
    left: 0;
    right: 0;
    width: max-content;
    bottom: 0;
    margin: 0 auto;
    transform: translate3d(0, 4px, 0);
    color: var(--color-accent-soft);
    font-family: var(--font-display);
    font-size: var(--text-label);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    opacity: 0;
    pointer-events: none;
    transition:
        opacity 0.35s var(--ease-out),
        transform 0.35s var(--ease-out);
}

.page__bingo-status-icon {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
}

.page__bingo-status--visible {
    opacity: 1;
    transform: translate3d(0, 0, 0);
}

.page__main {
    flex: 1;
}

@media (max-width: 640px) {
    .page__hero-content {
        min-height: 120px;
    }

    .page__logo-wrap {
        width: min(280px, 74vw);
        min-height: 64px;
    }

    .page__settingsButton,
    .page__celebrateButton {
        min-height: 36px;
        padding: 0 12px;
    }

    .page__settingsPanel {
        top: 42px;
        min-width: 170px;
    }
}

@media (pointer: coarse) {
    .page__settingsButton,
    .page__celebrateButton,
    .page__settingsAction {
        min-height: 44px;
    }
}
</style>
