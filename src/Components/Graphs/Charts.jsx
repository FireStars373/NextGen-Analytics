import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const Charts = ({ rating }) => {
  return (
    <div>
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: 10, label: "40 minutes", color: "#646e6d" },
              { id: 1, value: 15, label: "48 minutes", color: "#2c3b39" },
              { id: 2, value: 1, label: "15 minutes", color: "#1c7065" },
            ],
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 20, additionalRadius: -20, color: "gray" },
          },
        ]}
        width={600}
        height={300}
        tooltip={false}
        slotProps={{
          legend: {
            labelStyle: {
              fontSize: 20,
              fill: "white",
            },
          },
        }}
      />
    </div>
  );
};

export default Charts;
