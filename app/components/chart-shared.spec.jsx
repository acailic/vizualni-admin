import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi, } from "vitest";
import { ChartMoreButton } from "@/components/chart-shared";
import { useChartTablePreview } from "@/components/chart-table-preview";
import { useConfiguratorState } from "@/configurator/configurator-state/context";
import { useLocale } from "@/locales/use-locale";
vi.mock("@/configurator/configurator-state/context", () => ({
    useConfiguratorState: vi.fn(),
}));
vi.mock("@/locales/use-locale", () => ({
    useLocale: vi.fn(),
}));
vi.mock("@/components/chart-table-preview", () => ({
    useChartTablePreview: vi.fn(),
}));
vi.mock("@/utils/use-event-callback", () => ({
    useEventCallback: vi.fn((fn) => fn),
}));
vi.mock("@/utils/time-unit-to-formatter", () => ({
    timeUnitToFormatter: {
        Day: vi.fn(() => "2024-01-01"),
    },
}));
vi.mock("@lingui/macro", () => ({
    Trans: ({ children }) => children,
    defineMessage: ({ message }) => message,
}));
describe("ChartMoreButton", () => {
    const mockUseConfiguratorState = useConfiguratorState;
    const mockUseLocale = useLocale;
    const mockUseChartTablePreview = useChartTablePreview;
    const createMockChartConfig = (overrides = {}) => ({
        key: "chart1",
        version: "1.0.0",
        chartType: "table",
        meta: {
            title: { "sr-Latn": "Test", "sr-Cyrl": "Test", en: "Test Chart" },
            description: { "sr-Latn": "", "sr-Cyrl": "", en: "" },
            label: { "sr-Latn": "", "sr-Cyrl": "", en: "" },
        },
        cubes: [],
        limits: {},
        conversionUnitsByComponentId: {},
        activeField: undefined,
        fields: {},
        ...overrides,
    });
    const createMockState = (overrides = {}) => ({
        state: "PUBLISHED",
        version: "1.0.0",
        dataSource: {
            type: "sparql",
            url: "https://example.com/query",
        },
        layout: {
            type: "dashboard",
            layout: "canvas",
            layouts: {},
            blocks: [],
            meta: {
                title: { "sr-Latn": "", "sr-Cyrl": "", en: "" },
                description: { "sr-Latn": "", "sr-Cyrl": "", en: "" },
                label: { "sr-Latn": "", "sr-Cyrl": "", en: "" },
            },
            activeField: undefined,
        },
        chartConfigs: [createMockChartConfig()],
        activeChartKey: "chart1",
        dashboardFilters: undefined,
        ...overrides,
    });
    const defaultProps = {
        chartKey: "chart1",
        components: [],
        disableDatabaseRelatedActions: false,
    };
    beforeEach(() => {
        mockUseLocale.mockReturnValue("en");
        mockUseChartTablePreview.mockReturnValue({
            setIsTableRaw: vi.fn(),
            setIsTable: vi.fn(),
            containerRef: { current: null },
            containerHeight: 0,
            isTable: false,
            computeContainerHeight: vi.fn(),
        });
    });
    afterEach(() => {
        cleanup();
    });
    it("should not render button when previewing a table chart in dashboard layout", () => {
        const mockState = createMockState({
            layout: {
                type: "dashboard",
                layout: "canvas",
                layouts: {},
                blocks: [],
                meta: {
                    title: { "sr-Latn": "", "sr-Cyrl": "", en: "" },
                    description: { "sr-Latn": "", "sr-Cyrl": "", en: "" },
                    label: { "sr-Latn": "", "sr-Cyrl": "", en: "" },
                },
                activeField: undefined,
            },
            chartConfigs: [createMockChartConfig({ chartType: "table" })],
        });
        mockUseConfiguratorState.mockReturnValue([mockState, vi.fn()]);
        const { container } = render(<ChartMoreButton {...defaultProps}/>);
        expect(container.firstChild).toBeNull();
        expect(screen.queryByTestId("chart-more-button")).toBeNull();
    });
    it("should render button when previewing a non-table chart in dashboard layout", () => {
        const mockState = createMockState({
            layout: {
                type: "dashboard",
                layout: "canvas",
                layouts: {},
                blocks: [],
                meta: {
                    title: { "sr-Latn": "", "sr-Cyrl": "", en: "" },
                    description: { "sr-Latn": "", "sr-Cyrl": "", en: "" },
                    label: { "sr-Latn": "", "sr-Cyrl": "", en: "" },
                },
                activeField: undefined,
            },
            chartConfigs: [createMockChartConfig({ chartType: "bar" })],
        });
        mockUseConfiguratorState.mockReturnValue([mockState, vi.fn()]);
        render(<ChartMoreButton {...defaultProps}/>);
        expect(screen.queryByTestId("chart-more-button")).toBeTruthy();
    });
    it("should render button when previewing a table chart in non-dashboard layout with database actions", () => {
        const mockState = createMockState({
            layout: {
                type: "singleURLs",
                publishableChartKeys: [],
                blocks: [],
                meta: {
                    title: { "sr-Latn": "", "sr-Cyrl": "", en: "" },
                    description: { "sr-Latn": "", "sr-Cyrl": "", en: "" },
                    label: { "sr-Latn": "", "sr-Cyrl": "", en: "" },
                },
                activeField: undefined,
            },
            chartConfigs: [createMockChartConfig({ chartType: "table" })],
        });
        mockUseConfiguratorState.mockReturnValue([mockState, vi.fn()]);
        render(<ChartMoreButton {...defaultProps} configKey="test-key"/>);
        expect(screen.queryByTestId("chart-more-button")).toBeTruthy();
    });
    it("should render button when not in published state", () => {
        const mockState = createMockState({
            state: "CONFIGURING",
            layout: {
                type: "dashboard",
                layout: "canvas",
                layouts: {},
                blocks: [],
                meta: {
                    title: { "sr-Latn": "", "sr-Cyrl": "", en: "" },
                    description: { "sr-Latn": "", "sr-Cyrl": "", en: "" },
                    label: { "sr-Latn": "", "sr-Cyrl": "", en: "" },
                },
                activeField: undefined,
            },
            chartConfigs: [createMockChartConfig({ chartType: "table" })],
        });
        mockUseConfiguratorState.mockReturnValue([mockState, vi.fn()]);
        render(<ChartMoreButton {...defaultProps}/>);
        expect(screen.queryByTestId("chart-more-button")).toBeTruthy();
    });
});
