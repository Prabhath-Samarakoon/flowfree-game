import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import HudBar from '../components/HudBar';
import { getLevel, type Cell, type Pair } from '../levels/levels';

const cellToKey = (r: number, c: number) => `${r},${c}`;
const keyToCell = (key: string): Cell => {
    const [r, c] = key.split(',').map(Number);
    return { r, c };
};

const isAdjacent = (cell1: string, cell2: string) => {
    const { r: r1, c: c1 } = keyToCell(cell1);
    const { r: r2, c: c2 } = keyToCell(cell2);
    return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
};

interface GameState {
    paths: Record<string, string[]>;
    moves: number;
}

const GameBoard: React.FC = () => {
    const { size, levelId } = useParams<{ size: string; levelId: string }>();
    const gridSize = parseInt(size || '5', 10);
    const level = useMemo(() => getLevel(gridSize, levelId), [gridSize, levelId]);

    const [paths, setPaths] = useState<Record<string, string[]>>({});
    const [moves, setMoves] = useState(0);
    const [activePairId, setActivePairId] = useState<string | null>(null);
    const [history, setHistory] = useState<GameState[]>([]);

    // Reset game state when level changes
    useEffect(() => {
        setPaths({});
        setMoves(0);
        setHistory([]);
    }, [level]);

    const dots = useMemo(() => {
        const map = new Map<string, { pair: Pair; type: 'start' | 'end' }>();
        if (!level) return map;
        level.pairs.forEach(p => {
            map.set(cellToKey(p.start.r, p.start.c), { pair: p, type: 'start' });
            map.set(cellToKey(p.end.r, p.end.c), { pair: p, type: 'end' });
        });
        return map;
    }, [level]);

    const occupied = useMemo(() => {
        const map: Record<string, string> = {};
        Object.entries(paths).forEach(([pairId, path]) => {
            path.forEach(key => {
                map[key] = pairId;
            });
        });
        return map;
    }, [paths]);

    const coverage = useMemo(() => {
        const filledCells = Object.keys(occupied).length;
        return Math.round((filledCells / (gridSize * gridSize)) * 100);
    }, [occupied, gridSize]);

    const completed = useMemo(() => {
        const set = new Set<string>();
        if (!level) return set;
        level.pairs.forEach(pair => {
            const path = paths[pair.pairId] || [];
            const startKey = cellToKey(pair.start.r, pair.start.c);
            const endKey = cellToKey(pair.end.r, pair.end.c);
            if (path.includes(startKey) && path.includes(endKey)) {
                set.add(pair.pairId);
            }
        });
        return set;
    }, [paths, level]);

    const isLevelComplete = level && completed.size === level.pairs.length && coverage === 100;

    const saveHistory = useCallback(() => {
        setHistory(prev => [...prev.slice(-19), { paths: { ...paths }, moves }]);
    }, [paths, moves]);

    const handlePointerDown = (key: string) => {
        if (isLevelComplete) return;
        const dot = dots.get(key);
        if (dot) {
            saveHistory();
            setActivePairId(dot.pair.pairId);
            setPaths(prev => ({
                ...prev,
                [dot.pair.pairId]: [key]
            }));
            setMoves(prev => prev + 1);
        } else if (occupied[key]) {
            const pairId = occupied[key];
            saveHistory();
            setActivePairId(pairId);
            setPaths(prev => {
                const path = prev[pairId] || [];
                const index = path.indexOf(key);
                return { ...prev, [pairId]: path.slice(0, index + 1) };
            });
            setMoves(prev => prev + 1);
        }
    };

    const handlePointerEnter = (key: string) => {
        if (!activePairId || isLevelComplete) return;

        const currentPath = paths[activePairId] || [];
        if (currentPath.length === 0) return;

        const lastKey = currentPath[currentPath.length - 1];
        if (lastKey === key) return;

        if (!isAdjacent(lastKey, key)) return;

        const targetDot = dots.get(key);
        if (targetDot && targetDot.pair.pairId !== activePairId) return;

        if (currentPath.includes(key)) {
            const index = currentPath.indexOf(key);
            setPaths(prev => ({
                ...prev,
                [activePairId]: currentPath.slice(0, index + 1)
            }));
            return;
        }

        // If target cell is occupied by another pair, block
        if (occupied[key] && occupied[key] !== activePairId) return;

        // If current path already connects both dots, block further expansion
        const pair = level?.pairs.find(p => p.pairId === activePairId);
        if (pair) {
            const startKey = cellToKey(pair.start.r, pair.start.c);
            const endKey = cellToKey(pair.end.r, pair.end.c);
            if (currentPath.includes(startKey) && currentPath.includes(endKey)) return;
        }

        setPaths(prev => ({
            ...prev,
            [activePairId]: [...currentPath, key]
        }));
    };

    const handlePointerUp = () => {
        setActivePairId(null);
    };

    const handleUndo = () => {
        if (history.length > 0) {
            const lastState = history[history.length - 1];
            setPaths(lastState.paths);
            setMoves(lastState.moves);
            setHistory(prev => prev.slice(0, -1));
        }
    };

    const handleClear = () => {
        setPaths({});
        setMoves(0);
        setHistory([]);
    };

    if (!level) {
        return (
            <div className="game-container">
                <div className="card">
                    <h1>Level Not Found</h1>
                    <Link to="/levels" className="btn btn-primary">Back to Selection</Link>
                </div>
            </div>
        );
    }

    return (
        <div
            className="game-container"
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            <Link to="/levels" className="back-link" id="back-to-levels">
                ← Back to Level Selection
            </Link>

            <HudBar
                moves={moves}
                coverage={coverage}
                onUndo={handleUndo}
                onClear={handleClear}
            />

            {isLevelComplete && (
                <div className="win-banner">
                    ✅ Level Complete!
                </div>
            )}

            <div
                className="game-grid"
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    width: 'min(90vw, 500px)',
                    height: 'min(90vw, 500px)',
                    touchAction: 'none'
                }}
            >
                {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                    const r = Math.floor(index / gridSize);
                    const c = index % gridSize;
                    const key = cellToKey(r, c);
                    const dot = dots.get(key);
                    const pairId = occupied[key];
                    const isPathCell = !!pairId;
                    const pair = isPathCell ? level.pairs.find(p => p.pairId === pairId) : undefined;

                    return (
                        <div
                            key={key}
                            className="grid-cell"
                            onPointerDown={() => handlePointerDown(key)}
                            onPointerEnter={() => handlePointerEnter(key)}
                            id={`cell-${key}`}
                            style={{
                                backgroundColor: isPathCell ? `${pair?.color}33` : undefined,
                            }}
                        >
                            {dot && (
                                <div
                                    className="cell-dot"
                                    style={{ backgroundColor: dot.pair.color }}
                                />
                            )}
                            {isPathCell && !dot && (
                                <div
                                    className="path-dot"
                                    style={{ backgroundColor: pair?.color }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GameBoard;
