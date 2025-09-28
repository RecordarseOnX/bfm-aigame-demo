// src/components/MtbLogo.jsx
import React from "react";

export default function MtbLogo({ letters, color, size = 36 }) {
  return (
    <svg width={size} height={size}>
      <rect width={size} height={size} fill={`#${color}`} rx="6" ry="6" />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fff"
        fontSize={size / 2}
        fontWeight="bold"
      >
        {letters}
      </text>
    </svg>
  );
}
