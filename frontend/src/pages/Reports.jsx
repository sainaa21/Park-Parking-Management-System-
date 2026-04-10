import { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export default function Reports() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5003/api/reports")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <div>Loading...</div>;

  // Line Chart (Revenue)
  const lineData = {
    labels: data.revenueByDay.map(item => item.date),
    datasets: [
      {
        label: "Revenue",
        data: data.revenueByDay.map(item => item.total),
        borderColor: "blue",
        fill: false
      }
    ]
  };

  // Bar Chart (simple example)
  const barData = {
    labels: ["Total Vehicles"],
    datasets: [
      {
        label: "Vehicles",
        data: [data.totalVehicles],
        backgroundColor: "green"
      }
    ]
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      {/* Summary Cards */}
<div className="grid grid-cols-2 gap-4 mb-6">
  <div className="p-4 bg-black/40 text-white rounded">
    <h2>Total Revenue</h2>
    <p className="text-xl">₹{data.totalRevenue}</p>
  </div>

  <div className="p-4 bg-black/40 text-white rounded">
    <h2>Total Vehicles</h2>
    <p className="text-xl">{data.totalVehicles}</p>
  </div>
</div>

      {/* Charts */}
      <div className="mb-6">
        <h2 className="mb-2">Revenue Trend</h2>
        <Line data={lineData} />
      </div>

      <div>
        <h2 className="mb-2">Vehicle Stats</h2>
        <Bar data={barData} />
      </div>
    </div>
  );
}