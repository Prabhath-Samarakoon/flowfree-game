export interface Cell {
    r: number;
    c: number;
}

export interface Pair {
    pairId: string;
    color: string;
    start: Cell;
    end: Cell;
}

export interface Level {
    id: string;
    size: number;
    pairs: Pair[];
}

export const LEVELS: Record<number, Level[]> = {
    5: [
        {
            id: '5-1',
            size: 5,
            pairs: [
                { pairId: 'A', color: '#ff4d4d', start: { r: 0, c: 0 }, end: { r: 4, c: 0 } },
                { pairId: 'B', color: '#4dff4d', start: { r: 0, c: 1 }, end: { r: 2, c: 4 } },
                { pairId: 'C', color: '#4d4dff', start: { r: 1, c: 1 }, end: { r: 3, c: 3 } },
            ],
        },
        {
            id: '5-2',
            size: 5,
            pairs: [
                { pairId: 'A', color: '#ff4d4d', start: { r: 0, c: 0 }, end: { r: 0, c: 4 } },
                { pairId: 'B', color: '#ffff4d', start: { r: 4, c: 0 }, end: { r: 4, c: 4 } },
            ],
        },
    ],
    6: [
        {
            id: '6-1',
            size: 6,
            pairs: [
                { pairId: 'A', color: '#ff4d4d', start: { r: 0, c: 0 }, end: { r: 5, c: 5 } },
                { pairId: 'B', color: '#ffff4d', start: { r: 0, c: 1 }, end: { r: 5, c: 4 } },
            ],
        },
    ],
    7: [],
    8: [],
    9: [],
    10: [],
};

export const getLevelsBySize = (size: number): Level[] => {
    return LEVELS[size] || [];
};

export const getLevel = (size: number, levelId?: string): Level | undefined => {
    const levels = getLevelsBySize(size);
    if (levels.length === 0) return undefined;
    if (!levelId) return levels[0];
    return levels.find((l) => l.id === levelId) || levels[0];
};
