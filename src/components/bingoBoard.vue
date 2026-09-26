<template>
    <section class="bingo">
        <div class="bingo__frame">
            <BingoGrid
                :board="board"
                :get-cell-aria-label="getCellAriaLabel"
                :highlighted-indices="highlightedIndices"
                @toggle-cell="toggleCell"
            />
        </div>

        <BingoSummary
            :active-count="activeCount"
            :cell-count="cellCount"
            :completed-line-count="completedLineCount"
            :completion-rate="completionRate"
            :copy-feedback="copyFeedback"
            :has-bingo="hasBingo"
            :line-label="lineLabel"
            :status-message="statusMessage"
            @clear-board="clearBoard"
            @copy-board-status="copyBoardStatus"
        />
    </section>
</template>

<script setup>
import { watch } from "vue";
import BingoGrid from "./bingo/bingoGrid.vue";
import BingoSummary from "./bingo/bingoSummary.vue";
import { useBingoBoard } from "./bingo/composables/useBingoBoard";

const emit = defineEmits(["bingoAchieved", "bingoChange"]);

const {
    activeCount,
    board,
    cellCount,
    clearBoard,
    completedLineCount,
    completionRate,
    copyBoardStatus,
    copyFeedback,
    getCellAriaLabel,
    hasBingo,
    highlightedIndices,
    lineLabel,
    resetBoard,
    statusMessage,
    toggleCell,
} = useBingoBoard();

watch(
    hasBingo,
    (value) => {
        emit("bingoChange", value);
    },
    { immediate: true },
);

watch(completedLineCount, (value, previousValue) => {
    if (value > previousValue) {
        emit("bingoAchieved");
    }
});

defineExpose({
    resetBoard,
});
</script>

<style scoped>
.bingo {
    --bingo-panel: var(--color-surface-board);
    --bingo-card: var(--color-surface);
    --bingo-card-strong: var(--color-surface-strong);
    --bingo-text: var(--color-text);
    --bingo-text-muted: var(--color-text-muted);
    --bingo-success: var(--color-accent-soft);
    width: min(640px, 100%);
    margin: 0 auto;
    display: grid;
    gap: 12px;
}

.bingo__frame {
    position: relative;
    padding: 14px;
    border-radius: var(--radius-frame);
    background: var(--bingo-panel);
    backdrop-filter: blur(18px);
    box-shadow:
        inset 0 0 0 1px var(--color-hairline),
        0 22px 60px rgba(12, 10, 9, 0.34);
}

.bingo__frame::before {
    content: "";
    position: absolute;
    inset: -6px 24px auto;
    height: 80px;
    border-radius: var(--radius-pill);
    background: radial-gradient(
        circle,
        rgba(239, 68, 68, 0.14) 0%,
        rgba(236, 72, 153, 0.08) 48%,
        rgba(0, 0, 0, 0) 78%
    );
    filter: blur(24px);
    pointer-events: none;
}

:deep(.bingo__grid) {
    position: relative;
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(5, minmax(0, 1fr));
}

:deep(.bingo__cell) {
    position: relative;
    border: none;
    border-radius: var(--radius-cell);
    aspect-ratio: 1 / 1;
    min-height: 0;
    overflow: hidden;
    container-type: inline-size;
    background: var(--bingo-card-strong);
    color: var(--bingo-text);
    padding: 10px;
    display: flex;
    align-items: center;
    align-items: safe center;
    justify-content: center;
    text-align: center;
    box-shadow:
        inset 0 0 0 1px var(--color-hairline),
        0 1px 0 rgba(250, 250, 249, 0.03);
    transition:
        background-color var(--duration-hover) var(--ease-out),
        box-shadow var(--duration-hover) var(--ease-out),
        color var(--duration-hover) var(--ease-out),
        translate var(--duration-hover) var(--ease-out),
        scale var(--duration-press) var(--ease-out);
}

@media (hover: hover) {
    :deep(.bingo__cell:hover) {
        translate: 0 -2px;
        background: var(--color-surface-soft);
        box-shadow:
            inset 0 0 0 1px var(--color-hairline-strong),
            0 10px 18px rgba(12, 10, 9, 0.24);
    }
}

:deep(.bingo__cell:active) {
    scale: 0.96;
}

:deep(.bingo__cell--active) {
    background: var(--color-accent-surface);
    box-shadow:
        inset 0 0 0 1px var(--color-accent-ring),
        0 12px 24px rgba(6, 95, 70, 0.18);
}

:deep(.bingo__cell--bingo) {
    box-shadow:
        inset 0 0 0 1px var(--color-accent-ring),
        0 12px 24px rgba(6, 95, 70, 0.18);
}

:deep(.bingo__cell-label) {
    display: block;
    width: 100%;
    font-family: var(--font-body);
    font-size: clamp(0.6875rem, 25cqw, var(--cell-label-size, 1rem));
    font-weight: 600;
    line-height: var(--leading-snug);
    hyphens: auto;
}

:deep(.bingo__cell-label--medium) {
    --cell-label-size: 0.9375rem;
}

:deep(.bingo__cell-label--long) {
    --cell-label-size: 0.875rem;
}

:deep(.bingo__cell-label--xlong) {
    --cell-label-size: 0.8125rem;
}

:deep(.bingo__cell-check) {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 14px;
    height: 14px;
    color: var(--bingo-success);
}

:deep(.bingo__summary) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

:deep(.bingo__summary-stats) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
}

:deep(.bingo__summary-item) {
    background: var(--bingo-card);
    border-radius: 14px;
    min-width: 104px;
    padding: 8px 12px;
    display: grid;
    gap: 4px;
    box-shadow: inset 0 0 0 1px var(--color-hairline-strong);
}

:deep(.bingo__summary-item--highlight) {
    box-shadow: inset 0 0 0 1px rgba(245, 245, 244, 0.14);
}

:deep(.bingo__summary-label) {
    font-family: var(--font-display);
    font-size: var(--text-label);
    line-height: var(--leading-tight);
    color: var(--color-text-soft);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
}

:deep(.bingo__summary-value) {
    font-family: var(--font-display);
    font-size: var(--text-value);
    line-height: var(--leading-tight);
    font-variant-numeric: tabular-nums;
    color: var(--bingo-text);
}

:deep(.bingo__summary-actions-wrap) {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

:deep(.bingo__summary-actions) {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    justify-content: center;
}

:deep(.bingo__button) {
    font-family: var(--font-body);
    font-size: var(--text-control);
    font-weight: 700;
    line-height: 1;
    border: none;
    border-radius: var(--radius-pill);
    background: linear-gradient(180deg, #5a2e37, #3b1f27);
    color: var(--color-text);
    min-height: 40px;
    padding: 0 14px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition:
        background-color var(--duration-hover) var(--ease-out),
        box-shadow var(--duration-hover) var(--ease-out),
        color var(--duration-hover) var(--ease-out),
        translate var(--duration-hover) var(--ease-out),
        scale var(--duration-press) var(--ease-out);
}

:deep(.bingo__button-icon) {
    width: 15px;
    height: 15px;
    flex: 0 0 auto;
}

:deep(.bingo__button:active:not([disabled])) {
    scale: 0.96;
}

@media (hover: hover) {
    :deep(.bingo__button:hover:not([disabled])) {
        translate: 0 -1px;
        box-shadow: 0 8px 16px rgba(90, 46, 55, 0.26);
    }
}

:deep(.bingo__button--ghost) {
    background: var(--bingo-card);
    color: var(--bingo-text-muted);
    box-shadow: inset 0 0 0 1px var(--color-hairline);
}

:deep(.bingo__button--danger-ready) {
    background: linear-gradient(
        180deg,
        rgba(127, 29, 29, 0.55),
        rgba(69, 10, 10, 0.62)
    );
    color: #fecaca;
    box-shadow: inset 0 0 0 1px rgba(239, 68, 68, 0.22);
}

:deep(.bingo__button--copy) {
    background: linear-gradient(
        180deg,
        rgba(202, 138, 4, 0.22),
        rgba(120, 53, 15, 0.38)
    );
    color: #fde68a;
    box-shadow: inset 0 0 0 1px rgba(245, 158, 11, 0.18);
}

@media (hover: hover) {
    :deep(.bingo__button--danger-ready:hover:not([disabled])) {
        box-shadow:
            inset 0 0 0 1px rgba(248, 113, 113, 0.28),
            0 8px 16px rgba(127, 29, 29, 0.22);
    }

    :deep(.bingo__button--copy:hover:not([disabled])) {
        box-shadow:
            inset 0 0 0 1px rgba(251, 191, 36, 0.22),
            0 8px 16px rgba(180, 83, 9, 0.18);
    }

    :deep(.bingo__button--ghost:hover:not([disabled])) {
        background: var(--bingo-card-strong);
        box-shadow: inset 0 0 0 1px var(--color-hairline-strong);
    }
}

:deep(.bingo__button[disabled]) {
    opacity: 0.5;
    box-shadow: none;
}

:deep(.bingo__status) {
    flex-basis: 100%;
    width: 100%;
    max-width: 62ch;
    margin: 0 auto;
    padding: 0 2px;
    color: var(--bingo-text-muted);
    font-size: var(--text-control);
    line-height: var(--leading-body);
    text-align: center;
    text-wrap: pretty;
}

:deep(.bingo__status--success) {
    color: var(--bingo-success);
}

:deep(.bingo__copy-feedback) {
    position: absolute;
    left: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
    color: var(--bingo-success);
    font-size: var(--text-label);
    font-weight: 600;
    white-space: nowrap;
    pointer-events: none;
}

@media (max-width: 960px) {
    .bingo {
        width: min(620px, 100%);
    }

    .bingo__frame {
        padding: 12px;
        border-radius: 26px;
    }
}

@media (max-width: 680px) {
    .bingo {
        width: 100%;
        gap: 10px;
    }

    .bingo__frame {
        padding: 10px;
        border-radius: 24px;
    }

    :deep(.bingo__grid) {
        gap: 10px;
    }

    :deep(.bingo__summary) {
        gap: 8px;
    }

    :deep(.bingo__summary-stats) {
        gap: 6px;
    }

    :deep(.bingo__summary-actions-wrap) {
        width: 100%;
    }

    :deep(.bingo__copy-feedback) {
        left: 50%;
        top: calc(100% + 6px);
        transform: translateX(-50%);
        width: max-content;
        max-width: min(100%, 220px);
        text-align: center;
        white-space: normal;
    }
}

@media (max-width: 520px) {
    .bingo__frame {
        padding: 8px;
        border-radius: 20px;
    }

    :deep(.bingo__grid) {
        gap: 8px;
    }

    :deep(.bingo__cell) {
        border-radius: 12px;
        padding: 5px;
    }

    :deep(.bingo__cell-check) {
        top: 5px;
        right: 5px;
        width: 11px;
        height: 11px;
    }

    :deep(.bingo__summary-item) {
        min-width: 88px;
        padding: 6px 10px;
    }
}

@media (pointer: coarse) {
    :deep(.bingo__button) {
        min-height: 44px;
    }
}
</style>
