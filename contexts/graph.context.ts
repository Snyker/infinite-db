import {createContext} from "react";
import {Rectangle} from "@/components/canvas/canvas.type";

export type GraphContextType = {
  tables: GraphTable[];
  addTable: (tableId: string, rect: Rectangle) => boolean;
  removeTable: (tableId: string) => boolean;
  editTable: (tableId: string, rect: Partial<Rectangle>) => boolean;
}

export type GraphTable = {
  uid: string;
  rect: Rectangle;
}

const GraphContext = createContext<GraphContextType>({
  tables: [],
  addTable: () => {
    throw new Error("Not implemented");
  },
  editTable: () => {
    throw new Error("Not implemented");
  },
  removeTable: () => {
    throw new Error("Not implemented");
  }
});

export {
  GraphContext
}
