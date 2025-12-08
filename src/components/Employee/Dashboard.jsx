import { useState, useEffect } from "react";
import { salesByOrganization, salesByMonth } from "../../Services/organizationService";
import DateRangePicker from "./DateRangePicker";
import SalesPieChart from "./PieChart";
import SalesLineChart from "./LineChart";

export default function Dashboard({ token }) {
  const [range, setRange] = useState({
    start: "2024-01-01",
    end: "2025-12-31",
  });

  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);

  const [loadingPie, setLoadingPie] = useState(true);
  const [loadingLine, setLoadingLine] = useState(true);

  const [errorPie, setErrorPie] = useState(null);
  const [errorLine, setErrorLine] = useState(null);

  // Fetch Pie Data
  useEffect(() => {
    setLoadingPie(true);
    setErrorPie(null);

    salesByOrganization(range.start, range.end, token)
      .then((res) => setPieData(res))
      .catch((err) => setErrorPie(err))
      .finally(() => setLoadingPie(false));
  }, [range, token]);

  // Fetch Line Data
  useEffect(() => {
    setLoadingLine(true);
    setErrorLine(null);

    salesByMonth(range.start, range.end, token)
      .then((res) => setLineData(res))
      .catch((err) => setErrorLine(err))
      .finally(() => setLoadingLine(false));
  }, [range, token]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sales Dashboard</h2>

      <DateRangePicker value={range} onChange={setRange} />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "40px",
          marginTop: "40px",
        }}
      >
        {/* Pie Chart Container */}
        <div
          style={{
            flex: "1 1 400px",
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
            height: "450px", // set fixed height
          }}
        >
          <h3>Sales by Organization</h3>
          {loadingPie && <p>Loading Pie Chart...</p>}
          {errorPie && <p>Error: {errorPie.message}</p>}
          {!loadingPie && !errorPie && <SalesPieChart data={pieData || []} />}
        </div>

        {/* Line Chart Container */}
        <div
          style={{
            flex: "1 1 600px",
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
            height: "450px", // set fixed height
          }}
        >
          <h3>Monthly Sales Trend</h3>
          {loadingLine && <p>Loading Line Chart...</p>}
          {errorLine && <p>Error: {errorLine.message}</p>}
          {!loadingLine && !errorLine && <SalesLineChart data={lineData || []} />}
        </div>
      </div>
    </div>
  );
}