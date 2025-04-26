export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  export function reconstructPath(end, getGrid) {
    const path = [];
    let current = end;
    path.unshift(current);
  
    while (current.parentCoords) {
      const grid = getGrid(); // Get the latest grid state
      const { x, y } = current.parentCoords;
      current = grid[y][x];
      path.unshift(current);
    }
    return path;
  }
  