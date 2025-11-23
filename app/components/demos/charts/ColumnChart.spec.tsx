import { act, render } from "@testing-library/react";

import { ColumnChart } from "./ColumnChart";

const sampleData = [
  { category: "A", value: 10 },
  { category: "B", value: 20 },
];

const multiSeriesData = [
  { category: "A", apples: 5, oranges: 3 },
  { category: "B", apples: 2, oranges: 4 },
];

describe("ColumnChart", () => {
  it("renders single-series columns", async () => {
    const { container } = render(
      <ColumnChart data={sampleData} xKey="category" yKey="value" width={200} height={120} />
    );

    await act(async () => {
      await Promise.resolve();
    });

    const rects = container.querySelectorAll("rect");
    expect(rects.length).toBe(2);
  });

  it("renders grouped bars for multi series", async () => {
    const { container } = render(
      <ColumnChart
        data={multiSeriesData}
        xKey="category"
        yKey="apples"
        multiSeries
        width={200}
        height={120}
      />
    );

    await act(async () => {
      await Promise.resolve();
    });

    const rects = container.querySelectorAll("rect");
    expect(rects.length).toBeGreaterThanOrEqual(4);
  });

  it("renders stacked bars when stacked is true", async () => {
    const { container } = render(
      <ColumnChart
        data={multiSeriesData}
        xKey="category"
        yKey="apples"
        multiSeries
        stacked
        width={200}
        height={120}
      />
    );

    await act(async () => {
      await Promise.resolve();
    });

    const rects = container.querySelectorAll("rect");
    expect(rects.length).toBeGreaterThanOrEqual(4);
  });

  it("handles empty data gracefully", async () => {
    const { container } = render(
      <ColumnChart data={[]} xKey="category" yKey="value" width={200} height={120} />
    );

    await act(async () => Promise.resolve());

    const rects = container.querySelectorAll("rect");
    expect(rects.length).toBe(0);
  });
});
