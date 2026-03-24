import React from "react";
// import { usePlayer } from "../../context/PlayerContext/PlayerContext";
import { usePlayer } from "../../store/usePlayerStore";

const StaminaBar = ({ className = "" }) => {
  const player = usePlayer();
  const stamina = player?.stamina ?? 0;
  const max = 100;
  const pct = Math.max(0, Math.min(100, (stamina / max) * 100));

  return (
    <div className={className}>
      <p className="text-sm mb-1">Stamina {parseInt(stamina)} / {max} 🏃‍♂️</p>
      <div
        className="w-full h-2 bg-neutral-600 rounded overflow-hidden "
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={stamina}
        aria-label="Player Stamina"
      >
        <div
          className="h-full bg-yellow-300 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default StaminaBar;
