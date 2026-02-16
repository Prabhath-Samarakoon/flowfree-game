import React from 'react';
import { useNavigate } from 'react-router-dom';

import { getLevelsBySize } from '../levels/levels';

const LevelSelect: React.FC = () => {
    const navigate = useNavigate();
    const gridSizes = [5, 6, 7, 8, 9, 10];

    const handleSizeSelect = (size: number) => {
        const levels = getLevelsBySize(size);
        if (levels.length > 0) {
            navigate(`/game/${size}/${levels[0].id}`);
        } else {
            // Fallback if no levels defined for this size yet
            navigate(`/game/${size}`);
        }
    };

    return (
        <div className="card">
            <h1>Select Grid Size</h1>
            <div className="level-grid">
                {gridSizes.map((size) => (
                    <button
                        key={size}
                        className="btn btn-primary"
                        onClick={() => handleSizeSelect(size)}
                        id={`level-${size}x${size}`}
                    >
                        {size} x {size}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LevelSelect;
