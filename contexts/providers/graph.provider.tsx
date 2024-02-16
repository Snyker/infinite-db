"use client"

import {GraphContext, GraphContextType, GraphTable} from "@/contexts/graph.context";
import React, {useMemo, useState} from "react";

export const GraphProvider: React.FC<React.PropsWithChildren> = ({children}) => {

  const [tables, setTables] = useState<GraphTable[]>([]);

  const graphMemo = useMemo<GraphContextType>(() => ({
    tables,
    addTable: (tableId, rect) => {
      const exists = tables.some(t => t.uid === tableId);
      if(exists) return false;
      setTables([...tables, { uid: tableId, rect }]);
      return true;
    },
    editTable: (tableId, rect) => {
      const exists = tables.some(t => t.uid === tableId);
      if(!exists) return false
      setTables(tables.map(t => t.uid === tableId ? { ...t, rect: {...t.rect, ...rect } } : t));
      return true;
    },
    removeTable: (tableId) => {
      setTables(tables.filter(table => table.uid !== tableId));
      return true;
    }
  }), [tables]);

  return (
    <GraphContext.Provider value={graphMemo}>
      {children}
    </GraphContext.Provider>
  )
}
