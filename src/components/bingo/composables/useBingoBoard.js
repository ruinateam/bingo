import { computed, onBeforeUnmount, ref, watch } from "vue";
import { predictions } from "../../../data/predictions";
import {
  cellCount,
  copyFeedbackDurationMs,
  gridSize,
  storageKey,
} from "../constants";
import { buildShareText, buildWinningLines, createBoard } from "../lib/board";
import { copyText } from "../lib/clipboard";
import { loadStoredBoard, saveStoredBoard } from "../lib/storage";
import { pluralizeCellSuffix, pluralizeLines } from "../lib/text";

const winningLines = buildWinningLines();

export function useBingoBoard() {
  const board = ref(createInitialBoard());
  const copyFeedback = ref("");

  const completedLines = computed(() =>
    winningLines.filter((line) =>
      line.every((index) => board.value[index]?.active),
    ),
  );
  const highlightedIndices = computed(
    () => new Set(completedLines.value.flat()),
  );
  const completedLineCount = computed(() => completedLines.value.length);
  const activeCount = computed(
    () => board.value.filter((cell) => cell.active).length,
  );
  const hasBingo = computed(() => completedLineCount.value > 0);
  const completionRate = computed(() =>
    Math.round((activeCount.value / cellCount) * 100),
  );
  const lineLabel = computed(() => pluralizeLines(completedLineCount.value));
  const statusMessage = computed(() =>
    hasBingo.value
      ? `Бинго собрано: ${completedLineCount.value} ${lineLabel.value}.`
      : `До первого бинго осталось замкнуть одну из линий. Сейчас отмечено ${activeCount.value} клет${pluralizeCellSuffix(activeCount.value)}.`,
  );

  let copyFeedbackTimer = null;

  function toggleCell(index) {
    const cell = board.value[index];

    if (!cell) {
      return;
    }

    board.value[index] = {
      ...cell,
      active: !cell.active,
    };
  }

  function clearBoard() {
    board.value = board.value.map((cell) => ({
      ...cell,
      active: false,
    }));
  }

  function resetBoard() {
    board.value = createBoard(predictions);
    setCopyFeedback("Карточка обновлена.");
  }

  async function copyBoardStatus() {
    const payload = buildShareText({
      board: board.value,
      hasBingo: hasBingo.value,
      completedLineCount: completedLineCount.value,
      lineLabel: lineLabel.value,
      activeCount: activeCount.value,
    });

    try {
      await copyText(payload);
      setCopyFeedback("Статус скопирован в буфер обмена.");
    } catch (error) {
      console.warn("Не удалось скопировать статус карточки", error);
      setCopyFeedback(
        "Не удалось скопировать автоматически. Попробуйте ещё раз в другом браузере.",
      );
    }
  }

  function getCellAriaLabel(cell, index) {
    const row = Math.floor(index / gridSize) + 1;
    const column = (index % gridSize) + 1;
    const state = cell.active ? "отмечено" : "не отмечено";

    return `Строка ${row}, столбец ${column}: ${cell.text}. ${state}.`;
  }

  function setCopyFeedback(message) {
    copyFeedback.value = message;

    if (copyFeedbackTimer) {
      window.clearTimeout(copyFeedbackTimer);
    }

    if (typeof window !== "undefined") {
      copyFeedbackTimer = window.setTimeout(() => {
        copyFeedback.value = "";
      }, copyFeedbackDurationMs);
    }
  }

  onBeforeUnmount(() => {
    if (copyFeedbackTimer) {
      window.clearTimeout(copyFeedbackTimer);
    }
  });

  watch(
    board,
    (value) => {
      saveStoredBoard(storageKey, value);
    },
    { deep: true },
  );

  return {
    activeCount,
    board,
    cellCount,
    completedLineCount,
    completionRate,
    copyBoardStatus,
    copyFeedback,
    clearBoard,
    getCellAriaLabel,
    gridSize,
    hasBingo,
    highlightedIndices,
    lineLabel,
    resetBoard,
    statusMessage,
    toggleCell,
  };
}

function createInitialBoard() {
  const savedBoard = loadStoredBoard(storageKey);

  if (savedBoard) {
    return savedBoard;
  }

  return createBoard(predictions);
}
