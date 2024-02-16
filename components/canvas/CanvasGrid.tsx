"use client"

import {Layer, Line} from "react-konva";

export const CanvasGrid = () => {
  return (
    <Layer>
      <Grid width={window.innerWidth} height={window.innerHeight} />
    </Layer>
  );
};


const GRID_SIZE = 20; // Taille d'une cellule de la grille (en pixels)

// Fonction pour dessiner une ligne de la grille (vertical ou horizontal)
const GridLine = ({ points }: { points: number[]}) => (
  <Line points={points} stroke="#ddd" strokeWidth={0.5} />
);

// Fonction pour dessiner la grille entière
const Grid = ({ width, height }: { width: number, height: number }) => {
  const gridLines = [];

  for (let i = 0; i < width; i += GRID_SIZE) {
    gridLines.push(<GridLine key={`top-${i}`} points={[i, 0, i, height]} />);
  }

  for (let j = 0; j < height; j += GRID_SIZE) {
    gridLines.push(<GridLine key={`side-${j}`} points={[0, j, width, j]} />);
  }

  return gridLines;
};
