import { useEffect, useState } from "react";
import axios from "axios";
import {useHistory} from 'react-router-dom'
export default () => {
  const [gameList, setGameList] = useState([]);
	const history = useHistory()
  useEffect(() => {
		// 获取游戏列表
    axios
      .post("https://gateway.bxyuer.com/kaleido/outside/getKaleConfig", {
        source: "sug_game_list",
        resourceId: 4549,
      })
      .then((res) => {
        console.log(JSON.parse(res.data.result).data);
        setGameList(
          JSON.parse(res.data.result).data.filter((item) => item.gameCode)
        );
      });
  }, []);

  const toGame = (item) => {
		history.push(`game/${item.gameCode}/${(Math.random() + '').replace('.', '')}`)
	};

  return (
    <div style={{ padding: "12px" }}>
      <h2>必玩精选</h2>
      <div>
        {gameList.map((v) => (
          <div
            onClick={() => toGame(v)}
            style={{ display: "flex", alignItems: "center", marginBottom: 18 }}
            key={v.id}
          >
            <img
              style={{
                width: 80,
                height: 80,
                marginRight: 12,
                borderRadius: 12,
              }}
              src={v.thumbnail}
            />
            <div>
              <div>{v.title}</div>
              <div style={{ color: "#aaa", fontSize: 14 }}>{v.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
