import { describe, expect, it } from "vitest";
import { getSparqlEditorUrl } from "./sparql-utils";
describe("getSparqlEditorUrl", () => {
    const testData = [
        "",
        "int.",
        "test.",
    ].map((d) => ({
        dataSource: {
            type: "sparql",
            url: `https://${d}lindas.admin.ch/query`,
        },
        urlPrefix: d,
    }));
    it("should correctly create url based on data source", () => {
        testData.forEach(({ dataSource, urlPrefix }) => {
            const stringUrl = getSparqlEditorUrl({
                query: "SELECT * FROM TABLE",
                dataSource,
            });
            const url = new URL(stringUrl);
            expect(url.origin + url.pathname).toEqual(`https://${urlPrefix}lindas.admin.ch/sparql`);
        });
    });
});
