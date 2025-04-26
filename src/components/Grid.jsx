import React from "react";
import Cell from "./Cell"


const Grid = ({ grid, setGrid, mode, start, setStart, goal, setGoal }) => {
  const handleClick = (x, y) => {
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    const cell = newGrid[y][x];

    if (mode === "start") {
      if (start) newGrid[start.y][start.x].type = "empty";
      cell.type = "start";
      setStart(cell);
    } else if (mode === "goal") {
      if (goal) newGrid[goal.y][goal.x].type = "empty";
      cell.type = "goal";
      setGoal(cell);
    } else if (mode === "obstacle") {
      if (cell.type === "obstacle") {
        cell.type = "empty";
      } else {
        cell.type = "obstacle";
      }
    }

    setGrid(newGrid);
  };

  return (
    <div className="grid">
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <Cell
            key={`${x},${y}`}
            cell={cell}
            mode={mode}
            onClick={handleClick}
          />
        ))
      )}
    </div>
  );
};

export default Grid;
