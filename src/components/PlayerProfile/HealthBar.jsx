import React from "react";
import { usePlayer } from "../../context/PlayerContext/PlayerContext";

const HealthBar = ({ className = "" }) => {
  const { player } = usePlayer();
  const vit = player?.vitality ?? 0;
  const max = player?.maxVitality ?? 1;
  const pct = Math.max(0, Math.min(100, (vit / max) * 100));

  return (
    <div className={className}>
      <div className="text-sm mb-1 opacity-80">Vitality</div>
      <div
        className="w-full h-5 bg-neutral-700 rounded overflow-hidden border-2 border-red-700"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={vit}
        aria-label="Player vitality"
      >
        <div
          className="h-full bg-red-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex text-sm justify-between">
        <p className="mt-1">{parseInt(vit)} / {max} ❤️</p>
        <p className="mt-1">{player.defense} 🛡️</p>
      </div>
    </div>
  );
};

export default HealthBar;
