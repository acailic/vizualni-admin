import get from "lodash/get";
import { describe, expect, it } from "vitest";
import { getFullDataDownloadFilters } from "@/components/data-download";
describe("getFullDataDownloadFilters", () => {
    it("should not have componentIds", () => {
        const rawFilters = {
            iri: "ABC",
            componentIds: ["DEF"],
        };
        const filters = getFullDataDownloadFilters(rawFilters);
        expect(get(filters, "componentIds")).toBeFalsy();
    });
});
