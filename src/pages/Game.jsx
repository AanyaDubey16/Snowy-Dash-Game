import { useEffect, useRef, useState } from "react";

import Player from "../components/Player";
import Obstacle from "../components/Obstacle";
import Coin from "../components/Coin";
import HUD from "../components/HUD";

import "../styles/game.css";

const lanes = ["20%", "50%", "80%"];

function Game() {
  const [lane, setLane] = useState(1);
  const laneRef = useRef(1);

  const [jumping, setJumping] = useState(false);
  const jumpingRef = useRef(false);

  const [obstacles, setObstacles] = useState([]);
  const obstaclesRef = useRef([]);

  const [coins, setCoins] = useState([]);
  const coinsRef = useRef([]);

  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);

  const [totalCoins, setTotalCoins] = useState(0);
  const totalCoinsRef = useRef(0);

  const [speed, setSpeed] = useState(14);
  const speedRef = useRef(14);

  const [gameOver, setGameOver] = useState(false);
  const gameOverRef = useRef(false);

  const [started, setStarted] = useState(false);

  useEffect(() => { laneRef.current = lane; }, [lane]);
  useEffect(() => { jumpingRef.current = jumping; }, [jumping]);
  useEffect(() => { obstaclesRef.current = obstacles; }, [obstacles]);
  useEffect(() => { coinsRef.current = coins; }, [coins]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { totalCoinsRef.current = totalCoins; }, [totalCoins]);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  useEffect(() => {
    const handleKey = (e) => {
      if (gameOverRef.current || !started) return;

      if (e.key === "ArrowLeft") {
        setLane(prev => Math.max(0, prev - 1));
      }

      if (e.key === "ArrowRight") {
        setLane(prev => Math.min(2, prev + 1));
      }

      if (e.key === "ArrowUp" && !jumpingRef.current) {
        setJumping(true);
        jumpingRef.current = true;
        setTimeout(() => {
          setJumping(false);
          jumpingRef.current = false;
        }, 600);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started]);

  useEffect(() => {
    if (!started || gameOver) return;

    const obstacleInterval = setInterval(() => {
      setObstacles(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          lane: Math.floor(Math.random() * 3),
          y: -120
        }
      ]);
    }, 1200);

    const coinInterval = setInterval(() => {
      setCoins(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          lane: Math.floor(Math.random() * 3),
          y: -120
        }
      ]);
    }, 900);

    return () => {
      clearInterval(obstacleInterval);
      clearInterval(coinInterval);
    };
  }, [started, gameOver]);

  useEffect(() => {
    if (!started || gameOver) return;


    let rafId;

const loop = () => {
  const currentSpeed = speedRef.current;


      let nextObstacles = [];
      let nextCoins = [];
      let hit = false;

      setObstacles(prev => {
        nextObstacles = prev
          .map(obs => ({ ...obs, y: obs.y + currentSpeed }))
          .filter(obs => obs.y < 900);
        obstaclesRef.current = nextObstacles;
        return nextObstacles;
      });

      setCoins(prev => {
        nextCoins = prev
          .map(coin => ({ ...coin, y: coin.y + currentSpeed }))
          .filter(coin => coin.y < 900);
        coinsRef.current = nextCoins;
        return nextCoins;
      });

      const currentLane = laneRef.current;
      const isJumping = jumpingRef.current;

      const obstacleCollision = obstaclesRef.current.some(obs => obs.lane === currentLane &&
        obs.y > 600 &&
        obs.y < 710 &&
        !isJumping
      );

      if (obstacleCollision) {
        hit = true;
        setGameOver(true);
        gameOverRef.current = true;
      }

      if (!hit) {
        const collectedCoins = coinsRef.current.filter(coin => coin.lane === currentLane &&
          coin.y > 600 &&
          coin.y < 710
        );

        if (collectedCoins.length > 0) {
          setTotalCoins(prev => {
            const next = prev + collectedCoins.length;
            totalCoinsRef.current = next;
            return next;
          });

          setCoins(prev => {
            const remaining = prev.filter(
              coin => !collectedCoins.some(c => c.id === coin.id)
            );
            coinsRef.current = remaining;
            return remaining;
          });
        }
      }

      setScore(prev => {
        const next = prev + 1;
        scoreRef.current = next;

        const newSpeed = 14 + Math.floor(next / 200);
        setSpeed(newSpeed);
        speedRef.current = newSpeed;

        return next;
      });

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  }, [started, gameOver]);

  const restartGame = () => {
    setLane(1);
    setJumping(false);
    setObstacles([]);
    setCoins([]);
    setScore(0);
    setTotalCoins(0);
    setSpeed(14);
    setGameOver(false);

    laneRef.current = 1;
    jumpingRef.current = false;
    obstaclesRef.current = [];
    coinsRef.current = [];
    scoreRef.current = 0;
    totalCoinsRef.current = 0;
    speedRef.current = 14;
    gameOverRef.current = false;
  };

  if (!started) {
    return (
      <div className="start-screen">
        <h1>❄️ Snowy Dash</h1>
        <p>Escape the avalanche and survive!</p>
        <button onClick={() => setStarted(true)}>PLAY</button>
      </div>
    );
  }

  return (
    <div className="game">
      <div className="track"></div>

      <HUD score={score} totalCoins={totalCoins} />

      <Player lane={lanes[lane]} jumping={jumping} />

      {obstacles.map(obs => (
        <Obstacle key={obs.id} lane={lanes[obs.lane]} y={obs.y} />
      ))}

      {coins.map(coin => (
        <Coin key={coin.id} lane={lanes[coin.lane]} y={coin.y} />
      ))}

      {gameOver && (
        <div className="game-over">
          <h1>Game Over</h1>
          <h2>Score: {score}</h2>
          <h2>Coins: 💎 {totalCoins}</h2>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
    </div>
  );
}

export default Game;