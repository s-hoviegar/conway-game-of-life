import { useState, useRef, useEffect } from "react";

import Cell from "./Cell";
import "./Game.css";

// const pixelRatio = window.devicePixelRatio;
// const availWidth = window.screen.availWidth;
// const availHeight = window.screen.availHeight;
const CELL_SIZE = 20;
const WIDTH = 600;
const HEIGHT = 400;
const rows = HEIGHT / CELL_SIZE;
const cols = WIDTH / CELL_SIZE;

const Game = () => {
  const boardRef = useRef();
  //   console.log(pixelRatio);
  //   console.log(availWidth * pixelRatio);
  //   console.log(availHeight * pixelRatio);
  // Create an empty board
  const makeEmptyBoard = (rows, cols) => {
    let board = [];
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < cols; j++) {
        board[i][j] = false;
      }
    }
    return board;
  };

  let board = makeEmptyBoard(rows, cols);

  const [boardState, setBoardState] = useState(board);
  const [cells, setCells] = useState([]);
  //   console.table(boardState);

  useEffect(() => {
    // Create cells from board
    const newCells = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (boardState[i][j]) {
          newCells.push({ i, j });
        }
      }
    }
    setCells(newCells);
    //   console.log(cells);
  }, [boardState]);

  const getElementOffset = () => {
    // console.log(boardRef.current);
    const rect = boardRef.current.getBoundingClientRect();
    // console.log(rect);
    const doc = document.documentElement;
    // console.log(doc);

    return {
      x: rect.left + window.pageXOffset - doc.clientLeft,
      y: rect.top + window.pageYOffset - doc.clientTop,
    };
  };

  const handleClick = (event) => {
    const elemOffset = getElementOffset();
    // console.log(elemOffset);
    const offsetX = event.clientX - elemOffset.x;
    // console.log(offsetX);
    const offsetY = event.clientY - elemOffset.y;

    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);
    // console.log(x, y);

    if (x >= 0 && x <= cols && y >= 0 && y <= rows) {
      setBoardState((prevBoard) => {
        const newBoard = JSON.parse(JSON.stringify(prevBoard));
        newBoard[y][x] = !newBoard[y][x];
        return newBoard;
      });
    }
    console.table(boardState);
  };

  return (
    <div>
      <div
        className="Board"
        style={{
          width: WIDTH,
          height: HEIGHT,
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
        }}
        onClick={handleClick}
        ref={boardRef}
      >
        {cells.map((cell) => (
          <Cell
            x={cell.j}
            y={cell.i}
            size={CELL_SIZE}
            key={`${cell.i},${cell.j}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Game;
