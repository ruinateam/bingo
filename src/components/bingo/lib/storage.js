import { normalizeBoard } from "./board";

export function loadStoredBoard(storageKey) {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const rawValue = window.localStorage.getItem(storageKey);

        if (!rawValue) {
            return null;
        }

        const parsedValue = JSON.parse(rawValue);
        const candidateBoard = Array.isArray(parsedValue)
            ? parsedValue
            : parsedValue?.board;

        return normalizeBoard(candidateBoard);
    } catch (error) {
        console.warn("Не удалось прочитать сохранённую карточку", error);
        return null;
    }
}

export function saveStoredBoard(storageKey, board) {
    if (typeof window === "undefined") {
        return;
    }

    try {
        const payload = JSON.stringify({
            version: 1,
            board,
        });

        window.localStorage.setItem(storageKey, payload);
    } catch (error) {
        console.warn("Не удалось сохранить карточку", error);
    }
}
