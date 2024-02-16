import {createContext} from "react";
import {TableType} from "@/services/mysql.service";

export type TableContextType = {
  tables: TableType[];
  addTable: (e: TableType) => boolean;
  removeTable: (e: TableType | string) => void;
  editTable: (e: TableType) => boolean;
  tableIdsAndNames: () => string[];
  columnNames: (tableNameOrId?: string) => string[];
}

const TableContext = createContext<TableContextType>({
  tables: [],
  addTable: () => {
    throw new Error("Not implemented");
  },
  removeTable: () => {
    throw new Error("Not implemented")
  },
  editTable: () => {
    throw new Error("Not implemented");
  },
  tableIdsAndNames: () => {
    throw new Error("Not implemented");
  },
  columnNames: () => {
    throw new Error("Not implemented");
  }
});

export {
  TableContext
}
