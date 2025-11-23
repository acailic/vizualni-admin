import { act, renderHook } from "@testing-library/react";
import mittEmitter from "next/dist/shared/lib/mitt";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createUseDataSourceStore } from "@/stores/data-source";
import { setURLParam } from "@/utils/router/helpers";
vi.mock("@/utils/router/helpers", async () => {
    const original = await vi.importActual("@/utils/router/helpers");
    return {
        getURLParam: original.getURLParam,
        setURLParam: vi.fn(),
    };
});
const createRouter = ({ query }) => {
    const router = {
        pathname: "https://data.gov.rs/",
        query: query || {},
        events: mittEmitter(),
        isReady: true,
        ready: (f) => {
            // Use setTimeout instead of invoking directly for the callbacks
            // to be called after the datasource has been correctly set up.
            // This follows the async nature of ready on the real router
            setTimeout(f, 0);
        },
    };
    return router;
};
vi.mock("../env", () => ({
    WHITELISTED_DATA_SOURCES: ["Prod"],
    ENDPOINT: "sparql+https://data.gov.rs/sparql", // Default is Prod in tests
}));
describe("datasource state hook", () => {
    const setup = ({ localStorageValue = undefined, initialURL = "https://data.gov.rs", } = {}) => {
        if (localStorageValue) {
            localStorage.setItem("dataSource", localStorageValue);
        }
        const url = new URL(initialURL);
        const urlDataSourceLabel = url.searchParams.get("dataSource");
        // @ts-ignore
        delete window.location;
        // @ts-ignore
        window.location = {
            href: url.toString(),
        };
        // Initialize router with a proper query based on initialUrl.
        const router = createRouter({
            query: { dataSource: urlDataSourceLabel },
        });
        const useDataSourceStore = createUseDataSourceStore(router);
        const hook = renderHook(() => useDataSourceStore());
        const res = {
            hook,
            router,
            getState: () => hook.result.current.dataSource,
            setState: (v) => hook.result.current.setDataSource(v),
        };
        return new Promise((resolve) => {
            router.ready(() => resolve(res));
        });
    };
    beforeEach(() => {
        localStorage.clear();
        setURLParam.mockClear();
    });
    it("should have the correct default state when nothing is there", async () => {
        const { getState } = await setup({
            initialURL: "https://data.gov.rs/",
            localStorageValue: undefined,
        });
        expect(getState()).toEqual({
            type: "sparql",
            url: "https://data.gov.rs/sparql",
        });
    });
    it("should have the correct default state from local storage", async () => {
        const { getState } = await setup({
            initialURL: "https://data.gov.rs/",
            localStorageValue: "Prod",
        });
        expect(getState()).toEqual({
            type: "sparql",
            url: "https://data.gov.rs/sparql",
        });
    });
    it("should have the correct default state from URL in priority", async () => {
        const { getState } = await setup({
            initialURL: "https://data.gov.rs/?dataSource=Prod",
            localStorageValue: "Prod",
        });
        expect(getState()).toEqual({
            type: "sparql",
            url: "https://data.gov.rs/sparql",
        });
    });
    it("should keep both localStorage and router updated", async () => {
        const { setState } = await setup({
            initialURL: "https://data.gov.rs/",
            localStorageValue: undefined,
        });
        act(() => {
            setState({
                type: "sparql",
                url: "https://data.gov.rs/sparql",
            });
        });
        // setURLParam should be called when setting the data source
        expect(setURLParam).toHaveBeenCalled();
        expect(localStorage.getItem("dataSource")).toBe("Prod");
    });
});
