import React from "react";

const MonsterHealth = ({ current = 0, max = 1, className = "" }) => {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));

  return (
    <div className={className}>
      <div className="text-sm mb-1 opacity-80">Enemy Vitality</div>
      <div
        className="w-full h-5 bg-neutral-800 rounded overflow-hidden border-2 border-red-700"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={current}
        aria-label="Enemy vitality"
      >
        <div
          className="h-full bg-red-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-xs mt-1">{parseInt(current)} / {max} ⚔️</div>
    </div>
  );
};

export default MonsterHealth;
