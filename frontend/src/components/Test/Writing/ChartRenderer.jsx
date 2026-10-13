"use client";

import {
  PieChart,
  BarChart,
  LineChart,
  TableChart,
  ProcessDiagram,
  MapPair,
  ChangeTable,
} from "./WritingAllComponents";

/**
 * Renders one chart object based on its `kind`.
 * Contract: `<chart.kind>` matches one of the WritingAllComponents exports.
 */
export default function ChartRenderer({ chart }) {
  if (!chart) return null;

  switch (chart.kind) {
    case "pie":
      return <PieChart title={chart.title} segments={chart.segments} />;

    case "bar":
      return (
        <BarChart
          title={chart.title}
          xLabels={chart.xLabels}
          yMax={chart.yMax}
          yStep={chart.yStep}
          yUnit={chart.yUnit}
          xUnit={chart.xUnit}
          series={chart.series}
        />
      );

    case "line":
      return (
        <LineChart
          title={chart.title}
          xLabels={chart.xLabels}
          yMax={chart.yMax}
          yStep={chart.yStep}
          yUnit={chart.yUnit}
          xUnit={chart.xUnit}
          series={chart.series}
        />
      );

    case "table":
      return (
        <TableChart
          title={chart.title}
          columns={chart.columns}
          rows={chart.rows}
        />
      );

    case "process":
      return <ProcessDiagram title={chart.title} rows={chart.rows} />;

    case "map":
      return (
        <MapPair
          titleBefore={chart.titleBefore}
          titleAfter={chart.titleAfter}
        />
      );

    case "change_table":
      return <ChangeTable title={chart.title} rows={chart.rows} />;

    default:
      return (
        <div className="mb-6 rounded border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-900">
          Unknown chart kind: <code>{chart.kind}</code>
        </div>
      );
  }
}