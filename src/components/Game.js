import { useState, useRef, useEffect, useCallback } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
  const [showControls, setShowControls] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState(true);

  const handleCloseControls = () => setShowControls(false);
  const handleShowControls = () => setShowControls(true);
  const changeDrawMode = () => setDrawMode((pervState) => !pervState);

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

  const [liveCells, setLiveCells] = useState([]);
  useEffect(() => {
    // Create live cells from board
    const newCells = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (boardState[i][j]) {
          newCells.push({ i, j });
        }
      }
    }
    setLiveCells(newCells);
    //   console.log(liveCells);
  }, [boardState]);

  const [seconds, setSeconds] = useState(75);

  const handleIntervalChange = (event) => {
    if (event.target.value !== 0) setSeconds(event.target.value);
    else setSeconds(1);
  };

  const [isRunning, setIsRunning] = useState(false);

  const runGame = () => {
    setIsRunning(true);
    runIteration();
  };
  const stopGame = () => {
    setIsRunning(false);
  };

  const clearBoard = () => {
    setIsRunning(false);
    newBoard = makeEmptyBoard(rows, cols);
    setBoardState(newBoard);
  };

  const randomBoard = () => {
    setIsRunning(false);
    const newCells = makeEmptyBoard(rows, cols);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        newCells[i][j] = Math.random() >= 0.8;
      }
    }
    setBoardState(newCells);
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

  const runIteration = useCallback(() => {
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
  }, [boardState]);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        runIteration();
      }, seconds);
    } else if (!isRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, boardState, seconds, runIteration]);

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

  const handleMouseDown = (event) => {
    stopGame();
    setIsDrawing(true);
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
        newBoard[y][x] = drawMode;
        return newBoard;
      });
    }
    // console.table(boardState);
  };

  const handleMouseMove = (event) => {
    if (!isDrawing) {
      return;
    }
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
        newBoard[y][x] = drawMode;
        return newBoard;
      });
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
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
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={boardRef}
      >
        {liveCells.map((cell) => (
          <Cell
            x={cell.j}
            y={cell.i}
            size={CELL_SIZE}
            key={`${cell.i},${cell.j}`}
          />
        ))}
      </div>
      <br />
      <Container>
        <Row>
          <Col></Col>
          <Col>
            <center>
              <Button variant="dark" onClick={handleShowControls}>
                Show Controls
              </Button>{" "}
              <Button variant="outline-secondary" onClick={changeDrawMode}>
                {drawMode ? "Draw" : "Erase"}
              </Button>
            </center>
          </Col>
          <Col></Col>
        </Row>
      </Container>
      <Offcanvas show={showControls} onHide={handleCloseControls}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Game Of Life - Settings</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <center>
            <Form.Label>Update every {seconds} msec</Form.Label>
            <Form.Range value={seconds} onChange={handleIntervalChange} />
            {isRunning ? (
              <Button variant="outline-dark" onClick={stopGame}>
                Stop
              </Button>
            ) : (
              <Button variant="success" onClick={runGame}>
                Run Game
              </Button>
            )}{" "}
            <Button variant="outline-info" onClick={randomBoard}>
              Randomize
            </Button>{" "}
            <Button variant="outline-danger" onClick={clearBoard}>
              Clear
            </Button>
          </center>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Game;
