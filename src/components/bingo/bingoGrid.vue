<template>
    <div
        class="bingo__grid"
        role="group"
        aria-label="Игровое поле пять на пять"
    >
        <button
            v-for="(cell, index) in board"
            :key="cell.id"
            class="bingo__cell"
            :aria-label="getCellAriaLabel(cell, index)"
            :aria-pressed="cell.active"
            :class="{
                'bingo__cell--active': cell.active,
                'bingo__cell--bingo': highlightedIndices.has(index),
            }"
            type="button"
            @click="$emit('toggleCell', index)"
        >
            <span
                class="bingo__cell-label"
                :class="labelSizeClass(cell.text)"
                :title="cell.text"
                >{{ cell.text }}</span
            >
            <svg
                v-if="cell.active"
                class="bingo__cell-check"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M3.25 7.5 5.75 10 10.75 4"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </button>
    </div>
</template>

<script setup>
defineProps({
    board: {
        type: Array,
        required: true,
    },
    getCellAriaLabel: {
        type: Function,
        required: true,
    },
    highlightedIndices: {
        type: Object,
        required: true,
    },
});

defineEmits(["toggleCell"]);

// Cell text is not a uniform length, and the cell must stay a square, so the
// label steps down as the prediction gets longer.
function labelSizeClass(text) {
    const length = text?.length ?? 0;

    if (length > 34) {
        return "bingo__cell-label--xlong";
    }

    if (length > 26) {
        return "bingo__cell-label--long";
    }

    if (length > 18) {
        return "bingo__cell-label--medium";
    }

    return "";
}
</script>
