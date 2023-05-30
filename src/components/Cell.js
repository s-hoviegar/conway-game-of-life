import "./Cell.css";

const Cell = (props) => {
  const { x, y, size } = props;
  return (
    <div
      className="Cell"
      style={{
        left: `${size * x + 1}px`,
        top: `${size * y + 1}px`,
        width: `${size - 1}px`,
        height: `${size - 1}px`,
      }}
    />
  );
};

export default Cell;
