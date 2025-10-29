import { usePlayer } from "../context/PlayerContext/PlayerContext";
// import { Regions } from "../../"

export const Home = () => {
  const { player } = usePlayer();

  return (
    <div>
      <Regions />
    </div>
  );
};
