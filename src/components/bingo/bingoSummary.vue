<template>
    <footer class="bingo__summary">
        <div class="bingo__summary-stats">
            <div class="bingo__summary-item">
                <span class="bingo__summary-label">Отмечено</span>
                <span class="bingo__summary-value"
                    >{{ activeCount }} / {{ cellCount }}</span
                >
            </div>
            <div class="bingo__summary-item">
                <span class="bingo__summary-label">Прогресс</span>
                <span class="bingo__summary-value">{{ completionRate }}%</span>
            </div>
            <div
                class="bingo__summary-item"
                :class="{ 'bingo__summary-item--highlight': hasBingo }"
            >
                <span class="bingo__summary-label">Собрано</span>
                <span class="bingo__summary-value">
                    {{ completedLineCount }} {{ lineLabel }}
                </span>
            </div>
        </div>

        <div class="bingo__summary-actions-wrap">
            <div class="bingo__summary-actions">
                <button
                    type="button"
                    class="bingo__button bingo__button--ghost"
                    :class="{ 'bingo__button--danger-ready': activeCount > 0 }"
                    :disabled="activeCount === 0"
                    @click="$emit('clearBoard')"
                >
                    <svg
                        class="bingo__button-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M3 6h18"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                        />
                        <path
                            d="M8 6V4h8v2"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M6 6l1 13h10l1-13"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M10 10v5M14 10v5"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                        />
                    </svg>
                    Сбросить отметки
                </button>
                <button
                    type="button"
                    class="bingo__button bingo__button--ghost bingo__button--copy"
                    @click="$emit('copyBoardStatus')"
                >
                    <svg
                        class="bingo__button-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <rect
                            x="9"
                            y="9"
                            width="10"
                            height="10"
                            rx="2"
                            stroke="currentColor"
                            stroke-width="2"
                        />
                        <path
                            d="M7 15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                    Скопировать статус
                </button>
            </div>

            <span class="bingo__copy-feedback" role="status">
                {{ copyFeedback }}
            </span>
        </div>

        <p class="visually-hidden" role="status">
            {{ hasBingo ? statusMessage : "" }}
        </p>

        <p
            class="bingo__status"
            :class="{ 'bingo__status--success': hasBingo }"
        >
            {{ statusMessage }}
        </p>
    </footer>
</template>

<script setup>
defineProps({
    activeCount: {
        type: Number,
        required: true,
    },
    cellCount: {
        type: Number,
        required: true,
    },
    completedLineCount: {
        type: Number,
        required: true,
    },
    completionRate: {
        type: Number,
        required: true,
    },
    copyFeedback: {
        type: String,
        default: "",
    },
    hasBingo: {
        type: Boolean,
        required: true,
    },
    lineLabel: {
        type: String,
        required: true,
    },
    statusMessage: {
        type: String,
        required: true,
    },
});

defineEmits(["clearBoard", "copyBoardStatus"]);
</script>
