export type Direction = 'up' | 'down' | 'left' | 'right';

const GRID_SIZE = 4;

export const generateInitialGrid = (): number[][] => {
  const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
  return spawnRandomTile(spawnRandomTile(grid));
};

export const spawnRandomTile = (grid: number[][]): number[][] => {
  const emptyCells: { x: number; y: number }[] = [];

  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0) emptyCells.push({ x: i, y: j });
    });
  });

  if (emptyCells.length === 0) return grid;

  const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  grid[x][y] = Math.random() < 0.9 ? 2 : 4;

  return [...grid.map(row => [...row])]; // clone
};

const transpose = (grid: number[][]): number[][] =>
  grid[0].map((_, i) => grid.map(row => row[i]));

// const reverse = (grid: number[][]): number[][] =>
//   grid.map(row => [...row].reverse());

const compress = (row: number[]): number[] => {
  const newRow = row.filter(num => num !== 0);
  while (newRow.length < GRID_SIZE) newRow.push(0);
  return newRow;
};

const merge = (row: number[]): { row: number[]; score: number } => {
  let score = 0;
  for (let i = 0; i < GRID_SIZE - 1; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  return { row: compress(row), score };
};

export const moveGrid = (
  grid: number[][],
  direction: Direction
): { newGrid: number[][]; newScore: number; moved: boolean } => {
  let rotated: number[][] = [...grid.map(row => [...row])];
  let moved = false;
  let totalScore = 0;

  if (direction === 'up') {
    rotated = transpose(rotated);
  } else if (direction === 'down') {
    rotated = transpose(rotated).map(row => row.reverse());
  } else if (direction === 'right') {
    rotated = rotated.map(row => row.reverse());
  }

  const newGrid = rotated.map(row => {
    const compressed = compress(row);
    const { row: merged, score } = merge(compressed);
    totalScore += score;
    if (merged.some((val, idx) => val !== row[idx])) moved = true;
    return merged;
  });

  let finalGrid: number[][] = [...newGrid];

  if (direction === 'up') {
    finalGrid = transpose(newGrid);
  } else if (direction === 'down') {
    finalGrid = transpose(newGrid.map(row => row.reverse()));
  } else if (direction === 'right') {
    finalGrid = newGrid.map(row => row.reverse());
  }

  return {
    newGrid: finalGrid,
    newScore: totalScore,
    moved,
  };
};

export const hasLost = (grid: number[][]): boolean => {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === 0) return false;
      if (i < GRID_SIZE - 1 && grid[i][j] === grid[i + 1][j]) return false;
      if (j < GRID_SIZE - 1 && grid[i][j] === grid[i][j + 1]) return false;
    }
  }
  return true;
};