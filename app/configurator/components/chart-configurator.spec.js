import { describe, expect, it } from "vitest";
import { getFilterReorderCubeFilters } from "@/configurator/components/chart-configurator";
describe("getFilterReorderCubeFilters", () => {
    it("should load dimension values", () => {
        const cubeFilters = getFilterReorderCubeFilters({ cubes: [{ filters: {} }], fields: {} }, { joinByIds: [] });
        expect(cubeFilters[0].loadValues).toBe(true);
    });
});
