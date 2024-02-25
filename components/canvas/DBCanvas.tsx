import {Group, Layer, Line, Rect, Stage, StageProps, Text} from "react-konva";
import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import {CanvasGrid} from "@/components/canvas/CanvasGrid";
import {Point, Size, Rectangle} from "@/components/canvas/canvas.type";
import {TableContext} from "@/contexts/table.context";
import {CTable} from "@/components/canvas/table/CTable";
import {GraphContext} from "@/contexts/graph.context";

export const DBCanvas: React.FunctionComponent<Omit<StageProps, "width" | "height">> = (props) => {

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
  }, []);

  useEffect(() => {
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

              // Calculate center points for layouts
              const linePoints = [
                layoutA.rect.x + spatial.center.x + 250 / 2,
                layoutA.rect.y + spatial.center.y + 80 / 2,
                layoutB.rect.x + spatial.center.x + 250 / 2,
                layoutB.rect.y + spatial.center.y + 80 / 2
              ];
              _lines.push(<Line key={tableA.uid + '-' + tableB.uid}
                                points={linePoints}
                                stroke={tableB.color}
                                strokeWidth={2} />);
            }
          }
        });
      }
    });

    setLines(_lines);
  }, [tableCtx.tables, graphCtx.tables]);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} {...props} >
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
