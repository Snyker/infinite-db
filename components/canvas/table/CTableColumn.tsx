import {Group, Text, Image} from "react-konva";
import {forwardRef, useEffect, useRef, useState} from "react";
import Konva from "konva";
import {ColumnType} from "@/services/mysql.service";
import {Rectangle} from "@/components/canvas/canvas.type";
import {canvasCenterText, canvasRightText, canvasTextStyle} from "@/lib/utils.canvas";
import Path = Konva.Path;
import {FaKey, FaLock} from "react-icons/fa";
import {renderToString} from "react-dom/server";

type CTableColumnProps = {
  col: ColumnType;
  index: number;
  position: Rectangle
}

export const CTableColumn = forwardRef<Konva.Group, CTableColumnProps>(({ col, index, position }, ref) => {
  const [image, setImage] = useState(new window.Image());
  const [iconLoaded, setIconLoaded] = useState(false);

  useEffect(() => {
    let renderIndex = null;
    switch (col.index) {
      case "primary":
        renderIndex = <FaKey style={{color:'gold'}} />
        break;
      case "index":
        renderIndex = <FaKey style={{color:'silver'}} />
        break;
      case "unique":
        renderIndex = <FaLock style={{color:'silver'}} />
        break;
      default:
        break;
    }

    if(renderIndex) {
      const svgString = renderToString(renderIndex);
      const svg = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
      const url = URL.createObjectURL(svg);
      const img = new window.Image();

      img.onload = () => {
        setIconLoaded(true); // Une fois l'image chargée, on indique qu'on peut la dessiner
      }
      img.src = url;
      setImage(img);
    }
  }, []); // On s'assure que ce useEffect n'est exécuté qu'une fois au montage du composant

  const positionTypeWithIndex = col.index !== 'none' ? position.x - 20 : position.x

  return (
    <Group ref={ref}>
      <Text
        text={col.name}
        x={position.x}
        y={position.y + (index * 20)}
        width={position.width}
        {...canvasTextStyle()}
      />
      <Text
        {...canvasRightText(col.type, {
          x: positionTypeWithIndex,
          width: position.width,
          y: position.y + (index * 20),
          height: 0
        })}
      />
      {
        iconLoaded && <Image x={position.x + position.width - 16} y={position.y + (index * 20)} image={image} />
      }
    </Group>
  );
});
