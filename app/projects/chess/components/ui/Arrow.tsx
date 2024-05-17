interface ArrowProps {
  arrowCoordinates: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}

export default function Arrow({ arrowCoordinates }: ArrowProps) {
  return (
    <svg
      className="absolute top-0 left-0 z-10 pointer-events-none"
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="green" />
        </marker>
      </defs>
      <line
        x1={arrowCoordinates.x1}
        y1={arrowCoordinates.y1}
        x2={arrowCoordinates.x2}
        y2={arrowCoordinates.y2}
        stroke="green"
        strokeWidth="0.5"
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );
}
