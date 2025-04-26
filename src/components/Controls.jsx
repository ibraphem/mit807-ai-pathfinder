import React, { useState } from "react";

const Controls = ({ mode, setMode, speed, setSpeed, onRun, onReset }) => {
  const [algorithm, setAlgorithm] = useState("bfs");

  const handleRunClick = () => {
    onRun(algorithm);
  };

  return (
    <div className="controls">
      <button onClick={() => setMode("start")}>Set Start</button>
      <button onClick={() => setMode("goal")}>Set Goal</button>
      <button onClick={() => setMode("obstacle")}>Toggle Obstacles</button>

      <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
        <option value="bfs">DFS</option>
        <option value="dfs">BFS</option>
        <option value="astar">A*</option>
      </select>

      <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
        <option value={100}>Slow</option>
        <option value={50}>Normal</option>
        <option value={10}>Fast</option>
      </select>

      <button onClick={handleRunClick}>Run</button>
      <button onClick={onReset}>Reset</button>
    </div>
  );
};

export default Controls;
