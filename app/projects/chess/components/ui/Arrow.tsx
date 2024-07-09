import { useState, useEffect } from "react";
import { ArrowProps } from "../../types";

export default function Arrow({ x1, y1, x2, y2, isStockfish }: ArrowProps) {
  const [headLength, setHeadLength] = useState(0);
  const [opacity] = useState(0.7);

  useEffect(() => {
    const vmin = Math.min(window.innerWidth, window.innerHeight);
    const calculatedHeadLength = vmin * 0.0065;
    setHeadLength(calculatedHeadLength);
  }, []);

  const angle = Math.atan2(y2 - y1, x2 - x1);
  const adjustedX2 = x2 - headLength * Math.cos(angle) * 0.85;
  const adjustedY2 = y2 - headLength * Math.sin(angle) * 0.85;

  const arrowPointX = x2 - headLength * Math.cos(angle - Math.PI / 6);
  const arrowPointY = y2 - headLength * Math.sin(angle - Math.PI / 6);
  const arrowPointX2 = x2 - headLength * Math.cos(angle + Math.PI / 6);
  const arrowPointY2 = y2 - headLength * Math.sin(angle + Math.PI / 6);

  return (
    <svg
      className="absolute top-0 left-0 z-10 pointer-events-none"
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
    >
      <line
        x1={x1}
        y1={y1}
        x2={adjustedX2}
        y2={adjustedY2}
        stroke={isStockfish ? "blue" : "green"}
        strokeWidth={"0.19375vmin"}
        opacity={opacity}
      />
      <polygon
        points={`${x2},${y2} ${arrowPointX},${arrowPointY} ${arrowPointX2},${arrowPointY2}`}
        fill={isStockfish ? "blue" : "green"}
        opacity={opacity}
      />
    </svg>
  );
}
