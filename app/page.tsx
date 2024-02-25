"use client"

import React, {useState} from "react";
import dynamic from "next/dynamic";
import {TableProvider} from "@/contexts/providers/table.provider";
import {GraphProvider} from "@/contexts/providers/graph.provider";
import {Dictionnary} from "@/components/Dictionnary";
import Konva from "konva";
import {ContextMenuSheet} from "@/components/context-menu/ContextMenuSheet";
import {Shape, ShapeConfig} from "konva/lib/Shape";
import {Stage} from "konva/lib/Stage";
const DBCanvas = dynamic(  () => import('../components/canvas/DBCanvas').then(r => r.DBCanvas), { ssr: false });

export default function Home() {

  const [contextOpen, setContextOpen] = useState(false);
  const [contextValue, setContextValue] = useState<Shape<ShapeConfig> | Stage | undefined>()

  const handleClick = (evt: Konva.KonvaEventObject<PointerEvent>) => {
    setContextOpen(false);
  }


  return (
    <TableProvider>
      <GraphProvider>
        <header>
          <Dictionnary />
        </header>
        <main className="flex min-h-screen flex-col items-center justify-between">
          <DBCanvas onClick={handleClick} onContextMenu={(e: Konva.KonvaEventObject<PointerEvent>) => {
            e.evt.preventDefault();
            console.log(e.target);
            setContextOpen(true);
            setContextValue(e.target)
          }}/>
          <ContextMenuSheet id={"context-menu-sheet"} open={contextOpen} value={contextValue} />
        </main>
      </GraphProvider>
    </TableProvider>
  );
}
