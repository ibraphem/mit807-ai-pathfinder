import { sleep, reconstructPath } from "./helpers";

export async function dfs(getGrid, start, goal, speed, setGrid) {
    const stack = [start];
    const visited = new Set();
    let steps = 0;
  
    console.log(`Starting DFS: Start at (${start.x}, ${start.y}), Goal at (${goal.x}, ${goal.y})`);
  
    while (stack.length) {
      const current = stack.pop();
      const key = `${current.x},${current.y}`;
      if (visited.has(key)) continue;
      visited.add(key);
      steps++;
  
      // Compare coordinates instead of object references
      if (current.x === goal.x && current.y === goal.y) {
        console.log(`Goal found at (${current.x}, ${current.y}) after ${steps} steps`);
        const path = reconstructPath(current);
        console.log(`Path length: ${path.length}`, path);
        markPath(path, setGrid);
        return { path, steps };
      }
  
      if (current.x !== start.x || current.y !== start.y) { // Avoid marking start as visited
        setGrid(prevGrid => {
          const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
          const cell = newGrid[current.y][current.x];
          if (cell.x !== start.x || cell.y !== start.y) {
            cell.visited = true;
          }
          return newGrid;
        });
        await sleep(speed);
      }
  
      const grid = getGrid();
      for (let neighbor of getNeighbors(current, grid)) {
        if (!visited.has(`${neighbor.x},${neighbor.y}`)) {
          setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
            newGrid[neighbor.y][neighbor.x].parent = current;
            return newGrid;
          });
          stack.push(neighbor);
        }
      }
    }
    console.log("No path found after", steps, "steps");
    return { path: [], steps };
  }

  export async function bfs(getGrid, start, goal, speed, setGrid) {
    const queue = [start];
    const visited = new Set();
    let steps = 0;
  
    console.log(`Starting BFS: Start at (${start.x}, ${start.y}), Goal at (${goal.x}, ${goal.y})`);
  
    while (queue.length) {
      const current = queue.shift();
      const key = `${current.x},${current.y}`;
      if (visited.has(key)) continue;
      visited.add(key);
      steps++;
  
      // Compare coordinates instead of object references
      if (current.x === goal.x && current.y === goal.y) {
        console.log(`Goal found at (${current.x}, ${current.y}) after ${steps} steps`);
        const path = reconstructPath(current);
        console.log(`Path length: ${path.length}`, path);
        markPath(path, setGrid);
        return { path, steps };
      }
  
      if (current.x !== start.x || current.y !== start.y) { // Avoid marking start as visited
        setGrid(prevGrid => {
          const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
          const cell = newGrid[current.y][current.x];
          if (cell.x !== start.x || cell.y !== start.y) {
            cell.visited = true;
          }
          return newGrid;
        });
        await sleep(speed);
      }
  
      const grid = getGrid();
      for (let neighbor of getNeighbors(current, grid)) {
        if (!visited.has(`${neighbor.x},${neighbor.y}`)) {
          setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
            newGrid[neighbor.y][neighbor.x].parent = current;
            return newGrid;
          });
          queue.push(neighbor);
        }
      }
    }
    console.log("No path found after", steps, "steps");
    return { path: [], steps };
  }

  export async function astar(getGrid, start, goal, speed, setGrid) {
    const openSet = [start];
    const gScore = new Map();
    const fScore = new Map();
    let steps = 0;
  
    gScore.set(start, 0);
    fScore.set(start, heuristic(start, goal));
  
    while (openSet.length > 0) {
      openSet.sort((a, b) => (fScore.get(a) || Infinity) - (fScore.get(b) || Infinity));
      const current = openSet.shift();
      steps++;
  
      // Compare coordinates instead of object references
      if (current.x === goal.x && current.y === goal.y) {
        console.log(`Goal found at (${current.x}, ${current.y}) after ${steps} steps`);
        const path = reconstructPath(current);
        console.log(`Path length: ${path.length}`, path);
        markPath(path, setGrid);
        return { path, steps };
      }
  
      if (current.x !== start.x || current.y !== start.y) { // Avoid marking start as visited
        setGrid(prevGrid => {
          const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
          const cell = newGrid[current.y][current.x];
          if (cell.x !== start.x || cell.y !== start.y) {
            cell.visited = true;
          }
          return newGrid;
        });
        await sleep(speed);
      }
  
      const grid = getGrid();
      for (const neighbor of getNeighbors(current, grid)) {
        const tentativeG = (gScore.get(current) || Infinity) + 1;
        if (tentativeG < (gScore.get(neighbor) || Infinity)) {
          setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
            newGrid[neighbor.y][neighbor.x].parent = current;
            return newGrid;
          });
          gScore.set(neighbor, tentativeG);
          fScore.set(neighbor, tentativeG + heuristic(neighbor, goal));
          if (!openSet.includes(neighbor)) openSet.push(neighbor);
        }
      }
    }
  
    console.log("No path found after", steps, "steps");
    return { path: [], steps };
  }

// -----------------------------
// Shared utilities
// -----------------------------

function updateGrid(grid, setGrid) {
  setGrid(grid.map((row) => row.map((cell) => ({ ...cell }))));
}

function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); // Manhattan Distance
}

function markPath(path, setGrid) {
  setGrid((prevGrid) => {
    const newGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell })));
    for (let node of path) {
      if (node.type !== "start" && node.type !== "goal") {
        newGrid[node.y][node.x].inPath = true;
      }
    }
    return newGrid;
  });
}

function getNeighbors(cell, grid) {
    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    const neighbors = [];
  
    for (const [dx, dy] of dirs) {
      const nx = cell.x + dx;
      const ny = cell.y + dy;
  
      if (
        ny >= 0 &&
        ny < grid.length &&
        nx >= 0 &&
        nx < grid[0].length &&
        grid[ny][nx].type !== 'obstacle'
      ) {
        neighbors.push(grid[ny][nx]);
      }
    }
  
    return neighbors;
  }
