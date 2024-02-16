"use client"

import React from "react";
import dynamic from "next/dynamic";
import {TableProvider} from "@/contexts/providers/table.provider";
import {GraphProvider} from "@/contexts/providers/graph.provider";
import {Dictionnary} from "@/components/Dictionnary";
const DBCanvas = dynamic(  () => import('../components/canvas/DBCanvas').then(r => r.DBCanvas), { ssr: false });

export default function Home() {

  return (
    <TableProvider>
      <GraphProvider>
        <header>
          <Dictionnary />
        </header>
        <main className="flex min-h-screen flex-col items-center justify-between">
          <DBCanvas/>
        </main>
      </GraphProvider>
    </TableProvider>
  );
}
