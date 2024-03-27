import { useEffect } from "react";
import { useParams } from "react-router-dom";
import SDKGameView from "../common/game";

function Game() {
  const { gameCode, roomId } = useParams();
  useEffect(() => {
    const instance = new SDKGameView({
      root: document.querySelector("#gameRoot"),
      gameCode,
      roomId,
    });
    instance.loadGame({});
  }, []);
  return <div style={{ width: "100vw", height: "100vh" }} id="gameRoot"></div>;
}

export default Game;
