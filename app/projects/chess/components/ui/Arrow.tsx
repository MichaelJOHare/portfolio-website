import { useState, useEffect } from "react";

interface ArrowProps {
  arrowCoordinates: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}

export default function Arrow({ arrowCoordinates }: ArrowProps) {
  const [headLength, setHeadLength] = useState(0);
  const [opacity] = useState(0.7);

  useEffect(() => {
    const vmin = Math.min(window.innerWidth, window.innerHeight);
    const calculatedHeadLength = vmin * 0.0065;
    setHeadLength(calculatedHeadLength);
  }, []);

  const angle = Math.atan2(
    arrowCoordinates.y2 - arrowCoordinates.y1,
    arrowCoordinates.x2 - arrowCoordinates.x1
  );
  const adjustedX2 = arrowCoordinates.x2 - headLength * Math.cos(angle) * 0.85;
  const adjustedY2 = arrowCoordinates.y2 - headLength * Math.sin(angle) * 0.85;

  const arrowPointX =
    arrowCoordinates.x2 - headLength * Math.cos(angle - Math.PI / 6);
  const arrowPointY =
    arrowCoordinates.y2 - headLength * Math.sin(angle - Math.PI / 6);
  const arrowPointX2 =
    arrowCoordinates.x2 - headLength * Math.cos(angle + Math.PI / 6);
  const arrowPointY2 =
    arrowCoordinates.y2 - headLength * Math.sin(angle + Math.PI / 6);

  return (
    <svg
      className="absolute top-0 left-0 z-10 pointer-events-none"
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
    >
      <line
        x1={arrowCoordinates.x1}
        y1={arrowCoordinates.y1}
        x2={adjustedX2}
        y2={adjustedY2}
        stroke="green"
        strokeWidth="0.19375vmin"
        opacity={opacity}
      />
      <polygon
        points={`${arrowCoordinates.x2},${arrowCoordinates.y2} ${arrowPointX},${arrowPointY} ${arrowPointX2},${arrowPointY2}`}
        fill="green"
        opacity={opacity}
      />
    </svg>
  );
}
