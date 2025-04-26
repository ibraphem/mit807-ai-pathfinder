import React from 'react';

const Cell = ({ cell, mode, onClick }) => {
  const getClassName = () => {
    if (cell.inPath) return 'cell path'; // Prioritize path over visited
    if (cell.type === 'start') return 'cell start';
    if (cell.type === 'goal') return 'cell goal';
    if (cell.type === 'obstacle') return 'cell obstacle';
    if (cell.visited) return 'cell visited';
    return 'cell';
  };

  return (
    <div
      className={getClassName()}
      onClick={() => onClick(cell.x, cell.y)}
    />
  );
};

export default Cell;