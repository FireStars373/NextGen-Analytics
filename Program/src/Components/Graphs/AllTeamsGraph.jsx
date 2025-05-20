import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "../Schedule/Schedule.css";
import "../AllTeams/AllTeams.css";
import { data } from "react-router-dom";

const TeamLineGraph = ({
  title = "Season's Score",
  chartData,
  dataKey = "score",
  secondDataKey = "score1",
  useResultColor = true,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredIndex1, setHoveredIndex1] = useState(null);

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
          <Legend />
          <Line
            type="linear"
            dataKey={dataKey}
            stroke="#00b7ff"
            name="Home Team"
            strokeWidth={2}
            isAnimationActive={false}
            activeDot={false}
            dot={({ cx, cy, payload, index }) => {
              const isHovered = hoveredIndex === index;

              let color = "#00b7ff"; // Default
              if (useResultColor && payload.result) {
                color = payload.result === "W" ? "#4CAF50" : "#00b7ff";
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
          <Line
            type="linear"
            dataKey={secondDataKey}
            stroke="#c300ff"
            name="Away Team"
            strokeWidth={2}
            isAnimationActive={false}
            activeDot={false}
            dot={({ cx, cy, payload, index }) => {
              const isHovered1 = hoveredIndex1 === index;

              let color = "#c300ff"; // Default
              if (useResultColor && payload.result1) {
                color = payload.result1 === "W" ? "#4CAF50" : "#c300ff";
              }
              return (
                <g
                  onMouseEnter={() => setHoveredIndex1(index)}
                  onMouseLeave={() => setHoveredIndex1(null)}
                >
                  <circle cx={cx} cy={cy} r={8} fill={color} />
                  {isHovered1 && (
                    <text
                      x={cx}
                      y={cy - 10}
                      textAnchor="middle"
                      fontSize={24}
                      stroke="#fff"
                    >
                      {payload[secondDataKey]}
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
