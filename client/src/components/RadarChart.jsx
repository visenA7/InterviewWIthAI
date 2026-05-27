import React, { useMemo } from 'react';
import './RadarChart.css';

export default function RadarChart({ dimensions }) {
  // dimensions: { relevance: { score: N }, depth: { score: N }, clarity: { score: N }, accuracy: { score: N }, communication: { score: N } }
  
  const width = 320;
  const height = 300;
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = 90;

  const skillData = useMemo(() => {
    if (!dimensions) return [];
    
    return [
      { key: 'Relevance', score: dimensions.relevance?.score || 0 },
      { key: 'Depth', score: dimensions.depth?.score || 0 },
      { key: 'Clarity', score: dimensions.clarity?.score || 0 },
      { key: 'Accuracy', score: dimensions.accuracy?.score || 0 },
      { key: 'Delivery', score: dimensions.communication?.score || 0 }
    ];
  }, [dimensions]);

  // Compute SVG points
  const points = useMemo(() => {
    return skillData.map((d, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const radius = (d.score / 10) * maxRadius;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      return { x, y, label: d.key, score: d.score, angle };
    });
  }, [skillData, cx, cy, maxRadius]);

  // Polygon coordinate string
  const polygonPointsStr = useMemo(() => {
    return points.map(p => `${p.x},${p.y}`).join(' ');
  }, [points]);

  // Background grids (concentric pentagons)
  const grids = [0.2, 0.4, 0.6, 0.8, 1.0].map((ratio) => {
    const r = ratio * maxRadius;
    const gridPoints = Array.from({ length: 5 }).map((_, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
    return { points: gridPoints, label: ratio * 10 };
  });

  return (
    <div className="radar-chart-container">
      <svg width={width} height={height} className="radar-svg">
        <defs>
          <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity="0.02" />
          </radialGradient>
        </defs>

        {/* Dynamic Glowing Web Area */}
        <polygon 
          points={polygonPointsStr} 
          fill="url(#radar-glow)" 
          stroke="var(--accent-primary)" 
          strokeWidth="2.5"
          className="radar-polygon"
        />

        {/* Concentric grids */}
        {grids.map((grid, idx) => (
          <polygon
            key={idx}
            points={grid.points}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines & Labels */}
        {points.map((p, i) => {
          // Axis line
          const axisX = cx + maxRadius * Math.cos(p.angle);
          const axisY = cy + maxRadius * Math.sin(p.angle);
          
          // Label displacement
          const textDist = maxRadius + 18;
          const textX = cx + textDist * Math.cos(p.angle);
          const textY = cy + textDist * Math.sin(p.angle);
          
          // Align text dynamically based on position
          let textAnchor = 'middle';
          if (Math.cos(p.angle) > 0.1) textAnchor = 'start';
          if (Math.cos(p.angle) < -0.1) textAnchor = 'end';

          return (
            <g key={i}>
              <line
                x1={cx}
                y1={cy}
                x2={axisX}
                y2={axisY}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1.5"
              />
              <text
                x={textX}
                y={textY + 4}
                className="radar-label"
                textAnchor={textAnchor}
              >
                {p.label}
              </text>
              {/* Individual circular points */}
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="var(--text-primary)"
                stroke="var(--accent-secondary)"
                strokeWidth="2"
                className="radar-point"
              />
              <text
                x={p.x}
                y={p.y - 8}
                className="radar-score-badge"
                textAnchor="middle"
              >
                {p.score}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
