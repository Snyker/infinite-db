import {Group, Text, Image} from "react-konva";
import {forwardRef, useEffect, useState} from "react";
import Konva from "konva";
import {RelationType} from "@/services/mysql.service";
import {Rectangle} from "@/components/canvas/canvas.type";
import { canvasTextStyle} from "@/lib/utils.canvas";
import {FaKey} from "react-icons/fa";
import {renderToString} from "react-dom/server";

type CTableRelationProps = {
  rel: RelationType;
  index: number;
  position: Rectangle
}

export const CTableRelation = forwardRef<Konva.Group, CTableRelationProps>(({ rel, index, position }, ref) => {
  const [image, setImage] = useState(new window.Image());
  const [iconLoaded, setIconLoaded] = useState(false);

  useEffect(() => {
    const svgString = renderToString(<FaKey style={{color:'silver'}} />);
    const svg = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svg);
    const img = new window.Image();

    img.onload = () => {
      setIconLoaded(true); // Une fois l'image chargée, on indique qu'on peut la dessiner
    }
    img.src = url;
    setImage(img);
  }, []); // On s'assure que ce useEffect n'est exécuté qu'une fois au montage du composant

  const positionTypeWithIndex = position.x - 20;

  return (
    <Group ref={ref}>
      <Text
        text={`${rel.table}.${rel.name}`}
        x={position.x}
        y={position.y + (index * 20)}
        width={position.width}
        {...canvasTextStyle()}
      />
      {
        iconLoaded && <Image x={position.x + position.width - 16} y={position.y + (index * 20)} image={image} />
      }
    </Group>
  );
});
