import { useState, useRef, useEffect } from "react";

import Cell from "./Cell";
import "./Game.css";

// const pixelRatio = window.devicePixelRatio;
// const availWidth = window.screen.availWidth;
// const availHeight = window.screen.availHeight;
const CELL_SIZE = 20;
const WIDTH = 600;
const HEIGHT = 400;
const cols = WIDTH / CELL_SIZE;
const rows = HEIGHT / CELL_SIZE;

const Game = () => {
  const boardRef = useRef();
  //   console.log(pixelRatio);
  //   console.log(availWidth * pixelRatio);
  //   console.log(availHeight * pixelRatio);

  // Create an empty board
  const makeEmptyBoard = (rows, cols) => {
    let board = new Array(rows);
    for (let i = 0; i < board.length; i++) {
      board[i] = new Array(cols);
    }
    return board;
  };

  let newBoard = makeEmptyBoard(rows, cols);
  const [boardState, setBoardState] = useState(newBoard);

  const [cells, setCells] = useState([]);
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

  const [interval, setInterval] = useState(100);
  const handleIntervalChange = (event) => {
    setInterval(event.target.value);
  };

  const [isRunning, setIsRunning] = useState(false);

  const runGame = () => {
    setIsRunning(true);
    runIteration();
  };
  const stopGame = () => {
    setIsRunning(false);
    // if (timeoutHandler) {
    //   window.clearTimeout(timeoutHandler);
    //   timeoutHandler = null;
    // }
  };

  /**
   * Calculate the number of neighbors at point (x, y)
   * @param {Array} board
   * @param {int} x
   * @param {int} y
   */
  const calculateNeighbors = (board, x, y) => {
    let neighbors = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let row = (x + i + rows) % rows;
        let col = (y + j + cols) % cols;
        // console.log("row:", row, "col:", col, "board:", board[row][col]);
        board[row][col] && neighbors++;
      }
    }
    neighbors -= board[x][y];
    return neighbors;
  };

  const runIteration = () => {
    console.log("running iteration");
    let next = makeEmptyBoard(rows, cols);

    // console.log(calculateNeighbors(boardState, 1, 1));

    // Compute next iteration based on current board
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let currentState = boardState[i][j];
        // Count live neighbors!
        let neighbors = calculateNeighbors(boardState, i, j);
        // console.log(
        //   "neighbors of",
        //   i,
        //   j,
        //   ":",
        //   neighbors,
        //   "self:",
        //   currentState
        // );

        if (currentState) {
          if (neighbors === 2 || neighbors === 3) {
            next[i][j] = true;
          } else {
            next[i][j] = false;
          }
        } else {
          if (neighbors === 3) {
            next[i][j] = true;
          } else {
            next[i][j] = currentState;
          }
        }
      }
    }

    setBoardState(next);
    stopGame();
  };

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
    // console.table(boardState);
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

      <div className="controls">
        Update every
        <input value={interval} onChange={handleIntervalChange} />
        msec
        {isRunning ? (
          <button className="button" onClick={stopGame}>
            Stop
          </button>
        ) : (
          <button className="button" onClick={runGame}>
            Run
          </button>
        )}
      </div>
    </div>
  );
};

export default Game;
