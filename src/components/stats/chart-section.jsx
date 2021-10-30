import Chart from "react-google-charts";

export default function ChartSection({ ar }) {
  let data = ar.map((v) => v.data()).map((v) => [new Date(v.date), v.count]);

  return (
    <div>
      <Chart
        width={"100%"}
        height={"400px"}
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={[["x", "🍅"], ...data]}
        options={{
          hAxis: {
            title: "Date"
          },
          vAxis: {
            title: "🍅"
          },
          backgroundColor: "transparent",
          legend: "none"
        }}
        rootProps={{ "data-testid": "1" }}
      />
    </div>
  );
}
