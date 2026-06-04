function Coin({ lane, y }) {
  return (
    <div
      className="coin"
      style={{
        left: lane,
        top: `${y}px`,
        transform: "translateX(-50%)"
      }}
    >
      💎
    </div>
  );
}

export default Coin;