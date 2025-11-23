import { act, render } from "@testing-library/react";

import { LineChart } from "./LineChart";

const seriesData = [
  { year: "2020", value: 5, alt: 7 },
  { year: "2021", value: 8, alt: 9 },
  { year: "2022", value: 12, alt: 13 },
];

describe("LineChart", () => {
  it("renders single line path", async () => {
    const { container } = render(
      <LineChart data={seriesData} xKey="year" yKey="value" width={200} height={120} />
    );

    await act(async () => Promise.resolve());

    const paths = container.querySelectorAll("path");
    expect(paths.length).toBeGreaterThan(0);
  });

  it("renders multiple series when multiSeries is true", async () => {
    const { container } = render(
      <LineChart
        data={seriesData}
        xKey="year"
        yKey="value"
        multiSeries
        width={200}
        height={120}
      />
    );

    await act(async () => Promise.resolve());

    const paths = container.querySelectorAll("path");
    expect(paths.length).toBeGreaterThan(1);
  });

  it("handles empty data without drawing", async () => {
    const { container } = render(
      <LineChart data={[]} xKey="year" yKey="value" width={200} height={120} />
    );

    await act(async () => Promise.resolve());
    expect(container.querySelectorAll("path").length).toBe(0);
  });
});
