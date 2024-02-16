import {Rectangle} from "@/components/canvas/canvas.type";
import Konva from "konva";
import {RefObject} from "react";
import {text} from "node:stream/consumers";

const canvasTextStyle = (): Konva.TextConfig => {
  return {
    fontStyle:'400',
    fontSize:14,
    wrap:'center',
    fill:'#565656',
  }
}

const canvasCenterText = (text: string, rect: Rectangle): Konva.TextConfig => {
  const kt = new Konva.Text({
    text: text,
    ...canvasTextStyle(),
    fontSize: 16,
    fontStyle: '600'
  })

  return {
    x: rect.x + (rect.width - kt.textWidth ) / 2,
    y: rect.y,
    width: rect.width,
    text,
    ...canvasTextStyle(),
    fontSize: 16,
    fontStyle: '600'
  };
}

const canvasRightText = (text: string, rect: Rectangle): Konva.TextConfig => {
  const kt = new Konva.Text({
    text: text,
    ...canvasTextStyle()
  })
  return {
    x: rect.x + rect.width - kt.textWidth,
    y: rect.y,
    width: rect.width,
    text,
    ...canvasTextStyle(),
  };
}

export {
  canvasCenterText,
  canvasTextStyle,
  canvasRightText
}
