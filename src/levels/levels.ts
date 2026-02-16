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
    difficulty: 'easy' | 'medium' | 'hard';
    pairs: Pair[];
}

/**
 * Checkerboard parity helper.
 * Cell colors alternate: (r + c) % 2
 */
export const isOppositeColor = (cellA: Cell, cellB: Cell): boolean => {
    const parityA = (cellA.r + cellA.c) % 2;
    const parityB = (cellB.r + cellB.c) % 2;
    return parityA !== parityB;
};

export const LEVELS: Record<number, Level[]> = {
    5: [
        {
            id: '5-1',
            size: 5,
            difficulty: 'easy',
            pairs: [
                { pairId: 'A', color: '#f44336', start: { r: 0, c: 0 }, end: { r: 4, c: 0 } }, // Red (B-B)
                { pairId: 'B', color: '#ffeb3b', start: { r: 0, c: 1 }, end: { r: 0, c: 4 } }, // Yellow (W-B)
                { pairId: 'C', color: '#2196f3', start: { r: 4, c: 1 }, end: { r: 4, c: 4 } }, // Blue (W-B)
            ],
        },
        {
            id: '5-2',
            size: 5,
            difficulty: 'medium',
            pairs: [
                { pairId: 'A', color: '#f44336', start: { r: 0, c: 0 }, end: { r: 4, c: 4 } }, // Red (B-B)
                { pairId: 'B', color: '#2196f3', start: { r: 0, c: 1 }, end: { r: 1, c: 0 } }, // Blue (W-W)
                { pairId: 'C', color: '#4caf50', start: { r: 0, c: 4 }, end: { r: 4, c: 0 } }, // Green (B-B)
                { pairId: 'D', color: '#ffeb3b', start: { r: 1, c: 1 }, end: { r: 1, c: 2 } }, // Yellow (B-W)
            ],
        },
        {
            id: '5-3',
            size: 5,
            difficulty: 'hard',
            pairs: [
                { pairId: 'A', color: '#f44336', start: { r: 0, c: 0 }, end: { r: 2, c: 2 } }, // Red (B-B)
                { pairId: 'B', color: '#2196f3', start: { r: 0, c: 4 }, end: { r: 4, c: 4 } }, // Blue (B-B)
                { pairId: 'C', color: '#4caf50', start: { r: 4, c: 0 }, end: { r: 1, c: 2 } }, // Green (B-W)
                { pairId: 'D', color: '#ffeb3b', start: { r: 1, c: 1 }, end: { r: 2, c: 0 } }, // Yellow (B-W)
                { pairId: 'E', color: '#9c27b0', start: { r: 4, c: 1 }, end: { r: 4, c: 3 } }, // Purple (W-W)
            ],
        },
    ],
    6: [
        {
            id: '6-1',
            size: 6,
            difficulty: 'easy',
            pairs: [
                { pairId: 'A', color: '#f44336', start: { r: 0, c: 0 }, end: { r: 5, c: 0 } }, // Red (B-W)
                { pairId: 'B', color: '#ffeb3b', start: { r: 0, c: 1 }, end: { r: 5, c: 1 } }, // Yellow (W-B)
                { pairId: 'C', color: '#2196f3', start: { r: 0, c: 2 }, end: { r: 5, c: 2 } }, // Blue (B-W)
                { pairId: 'D', color: '#4caf50', start: { r: 0, c: 3 }, end: { r: 5, c: 3 } }, // Green (W-B)
            ],
        },
        {
            id: '6-2',
            size: 6,
            difficulty: 'medium',
            pairs: [
                { pairId: 'A', color: '#f44336', start: { r: 0, c: 0 }, end: { r: 4, c: 4 } }, // Red (B-W)
                { pairId: 'B', color: '#2196f3', start: { r: 1, c: 1 }, end: { r: 5, c: 5 } }, // Blue (B-W)
                { pairId: 'C', color: '#ffeb3b', start: { r: 0, c: 5 }, end: { r: 5, c: 0 } }, // Yellow (W-B)
                { pairId: 'D', color: '#4caf50', start: { r: 5, c: 1 }, end: { r: 1, c: 5 } }, // Green (W-B)
                { pairId: 'E', color: '#9c27b0', start: { r: 2, c: 2 }, end: { r: 3, c: 3 } }, // Purple (B-W)
            ],
        },
        {
            id: '6-3',
            size: 6,
            difficulty: 'hard',
            pairs: [
                { pairId: 'A', color: '#f44336', start: { r: 0, c: 0 }, end: { r: 3, c: 3 } }, // Red (B-W)
                { pairId: 'B', color: '#2196f3', start: { r: 0, c: 5 }, end: { r: 4, c: 0 } }, // Blue (W-B)
                { pairId: 'C', color: '#4caf50', start: { r: 5, c: 5 }, end: { r: 1, c: 2 } }, // Green (B-W)
                { pairId: 'D', color: '#ffeb3b', start: { r: 5, c: 0 }, end: { r: 0, c: 4 } }, // Yellow (B-B)
                { pairId: 'E', color: '#9c27b0', start: { r: 3, c: 2 }, end: { r: 4, c: 5 } }, // Purple (W-W)
            ],
        },
    ],
};

/**
 * Validates a level's parity rules.
 * On odd grids, full coverage requires an odd number of same-color paths.
 * The user's specific request mentions opposite colors as a rule, 
 * so we log warnings according to their instruction.
 */
const validateLevel = (level: Level) => {
    level.pairs.forEach((pair) => {
        const opposite = isOppositeColor(pair.start, pair.end);
        if (!opposite) {
            console.warn(`[Level Validation] Level ${level.id} (${level.size}x${level.size}): ` +
                `Pair ${pair.pairId} starts/ends on the same color. Path coverage might be affected.`);
        }
    });
};

export const getLevelsBySize = (size: number): Level[] => {
    const levels = LEVELS[size] || [];
    // Validation helper call as requested
    levels.forEach(validateLevel);
    return levels;
};

export const getLevel = (size: number, levelId?: string): Level | undefined => {
    const levels = getLevelsBySize(size);
    if (levels.length === 0) return undefined;
    if (!levelId) return levels[0];
    return levels.find((l) => l.id === levelId) || levels[0];
};

