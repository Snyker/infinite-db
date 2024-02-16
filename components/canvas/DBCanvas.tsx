import {Group, Layer, Line, Rect, Stage, Text} from "react-konva";
import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import {CanvasGrid} from "@/components/canvas/CanvasGrid";
import {Point, Size, Rectangle} from "@/components/canvas/canvas.type";
import {TableContext} from "@/contexts/table.context";
import {CTable} from "@/components/canvas/table/CTable";
import {GraphContext} from "@/contexts/graph.context";

export const DBCanvas: React.FunctionComponent = () => {

  const tableCtx = useContext(TableContext);
  const graphCtx = useContext(GraphContext);

  const [lines, setLines] = useState<any[]>([]);

  const spatial = useMemo(() => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      center: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        rect: (p: Point, d: number[] | Size): Rectangle => {
          const width = "width" in d ? d.width : d[0];
          const height = "height" in d ? d.height : d[1];
          return { x: p.x - width / 2, y: p.y - height / 2, width: width, height: height}
        }
      },
    }
  }, [window.innerWidth, window.innerHeight]);

  useEffect(() => {
    console.log('use effect graph updated when tables are added or removed');
    tableCtx.tables.forEach(t => graphCtx.addTable(t.uid, { x: spatial.center.x, y: spatial.center.y, width: 250, height: 20}))
  }, [tableCtx.tables]);

  useEffect(() => {
    const _lines: any[] = [];

    tableCtx.tables.forEach((tableA) => {
      if (tableA.relations && tableA.relations.length > 0) {
        tableA.relations.forEach((relation) => {
          const tableB = tableCtx.tables.find((table) => table.uid === relation.tableId);
          if (tableB) {
            const layoutA = graphCtx.tables.find((layout) => layout.uid === tableA.uid);
            const layoutB = graphCtx.tables.find((layout) => layout.uid === tableB.uid);

            if (layoutA && layoutB) {

              // Initialiser les coordonnées pour chaque table
              let startPoints = { x: layoutA.rect.x + spatial.center.x + 250 / 2, y: layoutA.rect.y + spatial.center.y + 80 / 2 };
              let endPoints = { x: layoutB.rect.x + spatial.center.x + 250 / 2, y: layoutB.rect.y + spatial.center.y + 80 / 2 };

              // Si la table B est à gauche de la table A
              if(layoutB.rect.x + layoutB.rect.width < layoutA.rect.x){
                startPoints.x = layoutA.rect.x;
                endPoints.x = layoutB.rect.x + layoutB.rect.width;
              }
              // Si la table B est à droite de la table A
              else if(layoutB.rect.x > layoutA.rect.x + layoutA.rect.width){
                startPoints.x = layoutA.rect.x + layoutA.rect.width;
                endPoints.x = layoutB.rect.x;
              }
              // Si la table B est en haut de la table A
              if(layoutB.rect.y + layoutB.rect.height < layoutA.rect.y){
                startPoints.y = layoutA.rect.y;
                endPoints.y = layoutB.rect.y + layoutB.rect.height;
              }
              // Si la table B est en bas de la table A
              else if(layoutB.rect.y > layoutA.rect.y + layoutA.rect.height){
                startPoints.y = layoutA.rect.y + layoutA.rect.height;
                endPoints.y = layoutB.rect.y;
              }

              // Calculate center points for layouts
              const linePoints = [
                layoutA.rect.x + spatial.center.x + 250,
                layoutA.rect.y + spatial.center.y,
                layoutB.rect.x + spatial.center.x + 250,
                layoutB.rect.y + spatial.center.y
              ];
              _lines.push(<Line key={tableA.uid + '-' + tableB.uid}
                                points={[startPoints.x, startPoints.y, endPoints.x, endPoints.y]}
                                stroke="black"
                                strokeWidth={2} />);
            }
          }
        });
      }
    });

    setLines(_lines);
  }, [tableCtx.tables, graphCtx.tables]);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} >
      <CanvasGrid />
      <Layer>
        {lines}
        {
          tableCtx.tables.map((table) => <CTable spatial={spatial} table={table} key={table.uid} />)
        }
      </Layer>
    </Stage>
  );
};
