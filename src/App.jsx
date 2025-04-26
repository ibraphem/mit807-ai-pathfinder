import { useState, useCallback } from 'react';
import Grid from './components/Grid';
import Controls from './components/Controls';
import { dfs, bfs, astar } from './utils/algorithms';

const App = () => {
  const size = 20;
  const [grid, setGrid] = useState(createEmptyGrid(size));
  const [start, setStart] = useState(null);
  const [goal, setGoal] = useState(null);
  const [mode, setMode] = useState('obstacle');
  const [speed, setSpeed] = useState(50);
  const [stats, setStats] = useState('');

  function createEmptyGrid(size) {
    return Array.from({ length: size }, (_, y) =>
      Array.from({ length: size }, (_, x) => ({
        x,
        y,
        type: 'empty',
        visited: false,
        inPath: false,
        parent: null,
      }))
    );
  }

  const resetGrid = () => {
    setGrid(createEmptyGrid(size));
    setStart(null);
    setGoal(null);
    setStats('');
  };

  const getGrid = useCallback(() => {
    return grid.map(row => row.map(cell => ({ ...cell })));
  }, [grid]);

  const handleRun = async (algorithm) => {
    if (!start || !goal) {
      alert('Please set both start and goal positions.');
      return;
    }

    // Reset the grid state
    const freshGrid = grid.map(row => row.map(cell => ({
      ...cell,
      visited: false,
      inPath: false,
      parent: null,
    })));
    setGrid(freshGrid);

    // Update start and goal references to point to the new grid
    const newStart = freshGrid[start.y][start.x];
    const newGoal = freshGrid[goal.y][goal.x];
    setStart(newStart); // Update the start state
    setGoal(newGoal);   // Update the goal state

    const t0 = performance.now();
    let result;
    if (algorithm === 'dfs') result = await dfs(getGrid, newStart, newGoal, speed, setGrid);
    else if (algorithm === 'bfs') result = await bfs(getGrid, newStart, newGoal, speed, setGrid);
    else result = await astar(getGrid, newStart, newGoal, speed, setGrid);
    const t1 = performance.now();

    const time = (t1 - t0).toFixed(2);
    const pathLength = result.path.length > 0 ? result.path.length - 1 : 0; // Exclude start node from path length
    const steps = result.steps;
    setStats(`Path length: ${pathLength}, Steps: ${steps}, Time: ${time} ms`);
  };

  return (
    <div className="app">
      <h1>AI Pathfinding Visualizer</h1>
      <Controls
        mode={mode}
        setMode={setMode}
        speed={speed}
        setSpeed={setSpeed}
        onRun={handleRun}
        onReset={resetGrid}
      />
      <Grid
        grid={grid}
        setGrid={setGrid}
        mode={mode}
        start={start}
        setStart={setStart}
        goal={goal}
        setGoal={setGoal}
      />
      <div className="stats">{stats}</div>
    </div>
  );
};

export default App;