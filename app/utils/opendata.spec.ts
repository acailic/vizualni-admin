import { describe, expect, it } from "vitest";

import { DataCubeMetadata } from "@/domain/data";
import { makeOpenDataLink } from "@/utils/opendata";

describe("makeOpenDataLink", () => {
  it("should create correct link to Serbian Open Data Portal", () => {
    const cube = {
      identifier: `https://data.gov.rs/datasets/example-dataset`,
      creator: {
        iri: `https://data.gov.rs/org/example-org`,
      },
    } as DataCubeMetadata;

    expect(makeOpenDataLink("sr", cube)).toBe(
      `https://data.gov.rs/sr/datasets/${encodeURIComponent(cube.identifier)}`
    );
  });
});
