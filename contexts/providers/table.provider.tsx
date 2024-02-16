"use client"

import {TableContext, TableContextType} from "@/contexts/table.context";
import React, {useMemo, useState} from "react";
import {TableType} from "@/services/mysql.service";

export const TableProvider: React.FC<React.PropsWithChildren> = ({children}) => {

  const [tables, setTables] = useState<TableType[]>([]);

  const tableMemo = useMemo<TableContextType>(() => ({
    tables,
    addTable: (e) => {
      const exists = tables.some(t => t.uid === e.uid || e.name.toLowerCase() === t.name.toLowerCase());
      if(exists) return false;
      setTables([...tables, e]);
      return true;
    },
    editTable: (e) => {
      const exists = tables.some(t => t.uid === e.uid || e.name.toLowerCase() === t.name.toLowerCase());
      if(!exists) return false;
      setTables(tables.map(t => t.uid === e.uid ? e : t));
      return true;
    },
    removeTable: (e) => {
      setTables(tables.filter(table => table !== e));
    },
    tableIdsAndNames: () => {
      return tables.map(table => [table.uid, table.name].join('|'));
    },
    columnNames: (tableNameOrId) => {
      if(!tableNameOrId)
        return tables.flatMap(table => table.columns.map(col => col.name));

      return tables.find(table => table.uid.includes(tableNameOrId) || table.name.includes(tableNameOrId))
      ?.columns.map(col => col.name) || [];
    }
  }), [tables]);

  return (
    <TableContext.Provider value={tableMemo}>
      {children}
    </TableContext.Provider>
  )
}

