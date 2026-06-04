function Player({ lane, jumping }) {
  return (
    <div
      className={`player ${jumping ? "jump" : ""}`}
      style={{ left: lane }}
    >
      <div className="player-body">
        <div className="player-shadow"></div>
        🏂
      </div>
    </div>
  );
}

export default Player;