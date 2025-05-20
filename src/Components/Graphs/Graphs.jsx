import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import "../Schedule/Schedule.css";
import "../AllTeams/AllTeams.css";

const TeamLineGraph = ({
  title = "Season's Score",
  chartData,
  dataKey = "score",
  useResultColor = true,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="teamgraph">
      <center>
        <p style={{ fontSize: "32px" }}>{title}</p>
      </center>
      <ResponsiveContainer width="99%" height={270}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <XAxis dataKey="game" />
          <YAxis />
          <Line
            type="linear"
            dataKey={dataKey}
            stroke="#00b7ff"
            strokeWidth={2}
            isAnimationActive={false}
            activeDot={false}
            dot={({ cx, cy, payload, index }) => {
              const isHovered = hoveredIndex === index;

              let color = "#00b7ff"; // Default
              if (useResultColor && payload.result) {
                color = payload.result === "W" ? "#4CAF50" : "#F44336";
              }
              return (
                <g
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <circle cx={cx} cy={cy} r={8} fill={color} />
                  {isHovered && (
                    <text
                      x={cx}
                      y={cy - 10}
                      textAnchor="middle"
                      fontSize={24}
                      stroke="#fff"
                    >
                      {payload[dataKey]}
                    </text>
                  )}
                </g>
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TeamLineGraph;
