import React from "react";
import { usePlayer } from "../../context/PlayerContext/PlayerContext";

const StaminaBar = ({ className = "" }) => {
  const { player } = usePlayer();
  const stamina = player?.stamina ?? 0;
  const max = 100;
  const pct = Math.max(0, Math.min(100, (stamina / max) * 100));

  return (
    <div className={className}>
      <div
        className="w-full h-2 bg-neutral-700 rounded overflow-hidden border-2 border-yellow-700"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={stamina}
        aria-label="Player Stamina"
      >
        <div
          className="h-full bg-yellow-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* <div className="flex text-xs justify-between">
        <p className="mt-1">{parseInt(stamina)} / {max} 🏃‍♂️</p>
      </div> */}
    </div>
  );
};

export default StaminaBar;
