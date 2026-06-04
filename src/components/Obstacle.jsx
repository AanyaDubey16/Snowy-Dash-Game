function Obstacle({ lane, y }) {
  return (
    <div
      className="obstacle"
      style={{
        left: lane,
        top: `${y}px`,
        transform: "translateX(-50%)"
      }}
    >
      🌲
    </div>
  );
}

export default Obstacle;