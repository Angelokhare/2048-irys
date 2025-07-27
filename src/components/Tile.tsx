import React from 'react';
import './Tile.css';

interface TileProps {
  value: number;
}

const Tile: React.FC<TileProps> = ({ value }) => {
  return <div className={`tile tile-${value}`}>{value !== 0 ? value : ''}</div>;
};

export default Tile;