import { Radio, Select, Table } from "antd";
import React, { useState, useRef } from "react";
import Input from "./Input";
import "./styles.css";
import { parse, unparse } from "papaparse";

const TransactionTable = ({ transactions = [] }) => {
  const { Option } = Select;
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const fileInputRef = useRef(null);
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Tag", dataIndex: "tag", key: "tag" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Date", dataIndex: "date", key: "date" },
  ];

  // Add 'key' to each row (prefer document id)
  const dataSource = transactions.map((t, idx) => ({
    key: t.id ?? idx,
    ...t,
  }));

  // Filter the dataSource (so each item keeps the 'key')
  const filtered = dataSource.filter((item) => {
    const matchesName = item.name?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter ? item.type === typeFilter : true;
    return matchesName && matchesType;
  });

  // Sort without mutating original
  const sortedTransaction = [...filtered].sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

function exportCSV() {
  const csv = unparse({
    fields: ["name", "type", "tag", "date", "amount"],
    data: transactions,
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const csvURL = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = csvURL;
  link.download = "transactions.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function importFromCSV(event) {
  const file = event?.target?.files?.[0];
  if (!file) return;
  parse(file, {
    header: true,
    complete: async function (results) {
      for (const transaction of results.data) {
        const newTransaction = {
          ...transaction,
          amount: parseFloat(transaction.amount),
        };
        if (typeof transaction === "function") {
          await transaction(newTransaction, true);
        }
      }
    },
    error: function (err) {
      console.error("CSV parse error:", err);
    },
  });
  // reset input so the same file can be chosen again
  if (event.target) event.target.value = null;
}

  return (
    <div style={{margin:'10px -15px'}}>
      <div className="input-fields">
        <div className="input-flex">
          <i className="fa-brands fa-searchengin"></i>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name"
            style={{ marginBottom: "10px", padding: "8px" }}
          />
        </div>

        <div className="input-select">
          <Select
            className="select-input"
            onChange={(value) => setTypeFilter(value || "")}
            value={typeFilter || undefined}
            placeholder="Filter"
            allowClear
            style={{ width: 200, marginLeft: "10px" }}
          >
            <Option value="">All</Option>
            <Option value="income">Income</Option>
            <Option value="expense">Expense</Option>
          </Select>
        </div>
      </div>

      <div className="secont-input">
        <div>
          <h2>My Transactions</h2>
        </div>
        <div>
          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
        </div>
        <div style={{display:'flex',gap:'10px'}}>
          <button style={{width:'150px'}} onClick={exportCSV} className="btn-blue">Export to CSV</button>
          <button style={{width:'150px'}} className="btn" onClick={() => fileInputRef.current?.click()}>Import from CSV</button>
          <input type="file" accept=".csv" ref={fileInputRef} style={{ display: "none" }} onChange={importFromCSV} />
        </div>
          {/* <button className="btn">Import to CSV</button> */}
      </div>

      <Table dataSource={sortedTransaction} columns={columns} rowKey="key" />
    </div>
  );
};


export default TransactionTable;
