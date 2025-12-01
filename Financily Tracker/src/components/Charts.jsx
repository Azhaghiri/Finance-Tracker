import { Line, Pie } from "@ant-design/charts";
import React from "react";
import "./styles.css";

const Charts = ({ transactions = [] }) => {
  // Line chart data
  const data = transactions.map((item) => ({
    date: item.date,
    amount: Number(item.amount) || 0,
  }));

  const config = {
    data,
    autoFit: true,
    height: 300,
    xField: "date",
    yField: "amount",
    smooth: true,
    point: { size: 5, shape: "diamond" },
    label: {
      style: { fill: "#666", fontSize: 12 },
    },
  };

  const expenseItems = transactions
    .filter((t) => t.type === "expense")
    .map((t) => ({ tag: t.tag || "Other", amount: Number(t.amount) || 0 }));

  const aggregated = expenseItems.reduce((acc, cur) => {
    const key = cur.tag;
    if (!acc[key]) acc[key] = { tag: cur.tag, amount: 0 };
    acc[key].amount += cur.amount;
    return acc;
  }, {});

  const pieData = Object.values(aggregated);

  const hasPieData = pieData.length > 0;

  const spendingConfig = {
    data: pieData,
    angleField: "amount",
    colorField: "tag",
    radius: 0.8,
    height: 300,
    autoFit: true,
    tooltip: {
      formatter: (datum) => ({ name: datum.tag, value: datum.amount }),
    },
    label: {
      type: "outer",
      content: (obj) => {
        const percent = (obj.percent * 100).toFixed(0);
        return `${obj.tag} ${percent}%`;
      },
    },
  };

  return (
    <div className="chart-container">
      <div className="wrapperchart1">
        <h2 className="chart-title">Your Analytics</h2>
        <Line {...config} />
      </div>

      <div className="wrapperchart2">
        <h2 className="chart-title">Your Spendings</h2>

        {hasPieData ? (
          <>
            <Pie {...spendingConfig} />

            {/* 🔥 Expense Category Totals */}
            <div className="spending-summary">
              {pieData.map((item) => (
                <p key={item.tag} className="spending-item">
                  <span  className="spending-tag">{item.tag}</span>
                  <span className="spending-amount">: ₹{item.amount}</span>
                </p>
              ))}
            </div> 
          </>
        ) : (
          <p style={{ textAlign: "center", color: "#666", padding: 20 }}>
            No expense data to show
          </p>
        )}
      </div>
    </div>
  );
};

export default Charts;
