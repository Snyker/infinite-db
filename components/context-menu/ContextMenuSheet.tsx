"use client";
import React, {HTMLAttributes, PropsWithChildren, useEffect, useState} from "react";
import {cn} from "@/lib/utils";
import {BsDatabaseAdd} from "react-icons/bs";
import {TbCirclesRelation} from "react-icons/tb";
import {Shape, ShapeConfig} from "konva/lib/Shape";
import {Stage} from "konva/lib/Stage";

export const ContextMenuSheet = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> &
  { open: boolean, value: Shape<ShapeConfig> | Stage | undefined }>(({open,value,className, children, ...props}, ref) => {
  const [contextPosition, setContextPosition] = useState({left: 0, top: 0});
  const [mouse, setMouse] = useState<any>();

  const updatePosition = () => {
    const contextMenuSheet = document.getElementById('context-menu-sheet');
    if(contextMenuSheet && mouse) {
      const rect = { width: contextMenuSheet.offsetWidth, height: contextMenuSheet.offsetHeight, x: contextMenuSheet.getBoundingClientRect().x, y: contextMenuSheet.getBoundingClientRect().y };

      //If the bouding rect is outside the window, then replace the position in the window
      let y = mouse.y;
      let x = mouse.x + 4;

      if(rect.width + x > window.innerWidth) {
        x = x - rect.width - 4;
      }
      if(rect.height + y > window.innerHeight) {
        y = y - rect.height - 4;
      }

      setContextPosition({
        top: y,
        left: x
      })
    }
  }

  useEffect(() => {
    function mf(e: MouseEvent) {
      setMouse({x: e.x, y: e.y, cx: e.clientX, cy: e.clientY});
    }

    window.addEventListener("mousemove", mf)
    return () => {
      window.removeEventListener("mousemove", mf);
    }
  }, []);

  useEffect(() => {
    updatePosition();
  }, [open]);

  return (
    <div ref={ref} className={
      cn('absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-100',
        !open ? "hidden" : "",
        className)
    } style={contextPosition} {...props}>
      <Button>
        <BsDatabaseAdd />
        Ajouter une entitée
      </Button>
      <Button>
        <TbCirclesRelation />Ajouter une relation</Button>
    </div>
  )
});

const Button: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <div
      className={'relative cursor-pointer hover:bg-secondary flex gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground'}>
      {children}
    </div>

  )
}
