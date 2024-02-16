import {Group, Rect, Text} from "react-konva";
import React, {forwardRef, useContext} from "react";
import Konva from "konva";
import {TableType} from "@/services/mysql.service";
import {CTableColumn} from "@/components/canvas/table/CTableColumn";
import {canvasCenterText} from "@/lib/utils.canvas";
import {CTableRelation} from "@/components/canvas/table/CTableRelation";
import KonvaEventObject = Konva.KonvaEventObject;
import {GraphContext} from "@/contexts/graph.context";

const TABLE_WIDTH = 250;
const BANNER_COLOR_HEIGHT = 6;
const TITLE_COLOR_HEIGHT = 28;
const TEXT_HEIGHT = 14;

export const CTable = forwardRef<Konva.Group, { table: TableType, spatial: any}>(({ table, spatial }, ref) => {

  const graphContext = useContext(GraphContext);

  const calcHeightTable = (): number => {
    return BANNER_COLOR_HEIGHT +
      TITLE_COLOR_HEIGHT +
      table.columns.length * (TEXT_HEIGHT + 8) +
      (table.relations.length > 0 ? 8 + table.relations.length * (TEXT_HEIGHT + 8) : 0);
  }

  const handleDragMove = (evt: KonvaEventObject<DragEvent>) => {
    graphContext.editTable(table.uid, { x: evt.currentTarget.x(), y: evt.currentTarget.y() })
  }

  return (
    <Group
      ref={ref}
      onDragMove={handleDragMove}
      draggable>
      {/* BACKGROUND */}
      <Rect
        fill={'white'}
        shadowColor={'#505050'}
        shadowBlur={5}
        shadowOpacity={0.5}
        shadowOffset={{ x: 0, y: 2}}
        x={spatial.center.x}
        y={spatial.center.y}
        width={TABLE_WIDTH}
        height={calcHeightTable()}
      />

      {/* COLOR HEADER */}
      <Rect
        fill={table.color}
        {...spatial.center}
        width={TABLE_WIDTH}
        height={BANNER_COLOR_HEIGHT}
      />
      {/* HEADER TITLE */}
      <Rect
        x={spatial.center.x}
        y={spatial.center.y + BANNER_COLOR_HEIGHT}
        width={TABLE_WIDTH}
        height={TITLE_COLOR_HEIGHT}
        fill={'#f3f3f3'}
      />
      <Text
        {...canvasCenterText(table.name.toLowerCase(), {
          x: spatial.center.x,
          y: spatial.center.y + (TITLE_COLOR_HEIGHT / 2)-2,
          width: TABLE_WIDTH,
          height: 0
        })}
      />

      {
        table.columns.map((column, index) =>
          <CTableColumn col={column}
                        index={index}
                        position={{
                          width: TABLE_WIDTH-16,
                          height: 0,
                          x: spatial.center.x + 8,
                          y: spatial.center.y + BANNER_COLOR_HEIGHT + TITLE_COLOR_HEIGHT + 6 }}
                        key={column.uid} />)
      }

      {
        table.relations.length > 0 &&
          <Rect
            x={spatial.center.x + 16}
            y={spatial.center.y + BANNER_COLOR_HEIGHT + TITLE_COLOR_HEIGHT + 6 + table.columns.length * 20}
            width={TABLE_WIDTH - 32}
            height={1}
            fill={'black'}
          />
      }

      {
        table.relations.map((relation, index) =>
          <CTableRelation rel={relation}
                          index={index}
                          position={{
                            width: TABLE_WIDTH-16,
                            height: 0,
                            x: spatial.center.x + 8,
                            y: spatial.center.y + BANNER_COLOR_HEIGHT + TITLE_COLOR_HEIGHT + 6 + 8 + table.columns.length * 20 }}
                          key={relation.uid} />)
      }
    </Group>
  );
});
