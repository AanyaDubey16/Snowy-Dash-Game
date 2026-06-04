function HUD({ score, totalCoins }) {

  return (

    <div className="hud">

      <div className="score-box">
        SCORE: {score}
      </div>

      <div className="coin-box">
        💎 {totalCoins}
      </div>

    </div>

  );
}

export default HUD;