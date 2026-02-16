import React from 'react';

interface HudBarProps {
  coverage: number;
  moves: number;
  onUndo: () => void;
  onClear: () => void;
}

const HudBar: React.FC<HudBarProps> = ({ coverage, moves, onUndo, onClear }) => {
  return (
    <div className="hud-bar">
      <div className="hud-stats">
        <div className="stat-item">
          <span className="stat-label">Coverage</span>
          <span className="stat-value">{coverage}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Moves</span>
          <span className="stat-value">{moves}</span>
        </div>
      </div>
      <div className="hud-actions">
        <button className="btn btn-secondary" onClick={onUndo} id="undo-btn">
          Undo
        </button>
        <button className="btn btn-danger" onClick={onClear} id="clear-btn">
          Clear
        </button>
      </div>
    </div>
  );
};

export default HudBar;
