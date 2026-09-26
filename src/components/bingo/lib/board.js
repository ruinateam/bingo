import { cellCount, gridSize } from "../constants";

export function createBoard(predictions) {
    if (predictions.length < cellCount) {
        throw new Error(
            "Недостаточно предсказаний для заполнения карточки. Нужны минимум 25.",
        );
    }

    return shuffleItems(predictions)
        .slice(0, cellCount)
        .map((text, index) => createCell(text, index));
}

export function createCell(text, index) {
    return {
        id: createCellId(index),
        text,
        active: false,
    };
}

export function createCellId(index) {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return `cell-${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`;
}

export function shuffleItems(items) {
    const array = [...items];

    for (let index = array.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [array[index], array[randomIndex]] = [
            array[randomIndex],
            array[index],
        ];
    }

    return array;
}

export function buildWinningLines() {
    const lines = [];

    for (let row = 0; row < gridSize; row += 1) {
        const baseIndex = row * gridSize;
        lines.push(
            Array.from({ length: gridSize }, (_, offset) => baseIndex + offset),
        );
    }

    for (let column = 0; column < gridSize; column += 1) {
        lines.push(
            Array.from(
                { length: gridSize },
                (_, offset) => column + offset * gridSize,
            ),
        );
    }

    lines.push(
        Array.from(
            { length: gridSize },
            (_, index) => index * (gridSize + 1),
        ),
    );
    lines.push(
        Array.from(
            { length: gridSize },
            (_, index) => (index + 1) * (gridSize - 1),
        ),
    );

    return lines;
}

export function normalizeBoard(candidateBoard) {
    if (!Array.isArray(candidateBoard) || candidateBoard.length !== cellCount) {
        return null;
    }

    return candidateBoard.map((cell, index) => normalizeCell(cell, index));
}

export function normalizeCell(cell, index) {
    const text =
        typeof cell?.text === "string" && cell.text.trim()
            ? cell.text
            : "Неизвестное событие";

    return {
        id: typeof cell?.id === "string" && cell.id ? cell.id : createCellId(index),
        text,
        active: Boolean(cell?.active),
    };
}

export function buildShareText({
    board,
    hasBingo,
    completedLineCount,
    lineLabel,
    activeCount,
}) {
    const markedItems = board
        .filter((cell) => cell.active)
        .map((cell) => `• ${cell.text}`);

    const headline = hasBingo
        ? `Minecraft Live Bingo: собрано ${completedLineCount} ${lineLabel}.`
        : `Minecraft Live Bingo: отмечено ${activeCount} из ${cellCount}.`;

    return [
        headline,
        "",
        markedItems.length ? markedItems.join("\n") : "Пока без отметок.",
    ]
        .filter(Boolean)
        .join("\n");
}
