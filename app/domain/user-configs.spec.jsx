import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useUserConfig, useUserConfigs } from "@/domain/user-configs";
import { fetchChartConfig, fetchChartConfigs, fetchChartViewCount, } from "@/utils/chart-config/api";
// Mock the API functions
vi.mock("@/utils/chart-config/api", () => ({
    fetchChartConfigs: vi.fn(),
    fetchChartConfig: vi.fn(),
    fetchChartViewCount: vi.fn(),
}));
const mockFetchChartConfigs = fetchChartConfigs;
const mockFetchChartConfig = fetchChartConfig;
const mockFetchChartViewCount = fetchChartViewCount;
describe("Domain - User Configs", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe("useUserConfigs", () => {
        it("should fetch all user configs with view counts", async () => {
            const mockConfigs = [
                { key: "config1", title: "Chart 1", data: {} },
                { key: "config2", title: "Chart 2", data: {} },
            ];
            mockFetchChartConfigs.mockResolvedValue(mockConfigs);
            mockFetchChartViewCount
                .mockResolvedValueOnce(100)
                .mockResolvedValueOnce(200);
            const { result } = renderHook(() => useUserConfigs({ defaultData: [] }));
            await waitFor(() => {
                expect(result.current.status).toBe("success");
            });
            expect(result.current.data).toEqual([
                { key: "config1", title: "Chart 1", data: {}, viewCount: 100 },
                { key: "config2", title: "Chart 2", data: {}, viewCount: 200 },
            ]);
            expect(mockFetchChartConfigs).toHaveBeenCalledTimes(1);
            expect(mockFetchChartViewCount).toHaveBeenCalledTimes(2);
            expect(mockFetchChartViewCount).toHaveBeenCalledWith("config1");
            expect(mockFetchChartViewCount).toHaveBeenCalledWith("config2");
        });
        it("should handle empty config list", async () => {
            mockFetchChartConfigs.mockResolvedValue([]);
            const { result } = renderHook(() => useUserConfigs({ defaultData: [] }));
            await waitFor(() => {
                expect(result.current.status).toBe("success");
            });
            expect(result.current.data).toEqual([]);
            expect(mockFetchChartViewCount).not.toHaveBeenCalled();
        });
        it("should handle API errors gracefully", async () => {
            const error = new Error("Failed to fetch configs");
            mockFetchChartConfigs.mockRejectedValue(error);
            const { result } = renderHook(() => useUserConfigs({ defaultData: [] }));
            await waitFor(() => {
                expect(result.current.status).toBe("error");
            });
            expect(result.current.error).toBe(error);
            expect(result.current.data).toEqual([]);
        });
        it("should handle view count fetch failures", async () => {
            const mockConfigs = [
                { key: "config1", title: "Chart 1", data: {} },
            ];
            mockFetchChartConfigs.mockResolvedValue(mockConfigs);
            mockFetchChartViewCount.mockRejectedValue(new Error("View count unavailable"));
            const { result } = renderHook(() => useUserConfigs({ defaultData: [] }));
            await waitFor(() => {
                expect(result.current.status).toBe("error");
            });
            expect(result.current.error).toBeDefined();
        });
        it("should return default data while loading", () => {
            const defaultData = [{ key: "default", title: "Default", data: {}, viewCount: 0 }];
            mockFetchChartConfigs.mockImplementation(() => new Promise(() => { }) // Never resolves
            );
            const { result } = renderHook(() => useUserConfigs({ defaultData }));
            expect(result.current.data).toEqual(defaultData);
            expect(result.current.status).toBe("idle");
        });
        it("should fetch configs in parallel with view counts", async () => {
            const mockConfigs = [
                { key: "config1", title: "Chart 1", data: {} },
                { key: "config2", title: "Chart 2", data: {} },
                { key: "config3", title: "Chart 3", data: {} },
            ];
            let fetchConfigsResolved = false;
            mockFetchChartConfigs.mockImplementation(async () => {
                await new Promise((resolve) => setTimeout(resolve, 50));
                fetchConfigsResolved = true;
                return mockConfigs;
            });
            let viewCountCalls = 0;
            mockFetchChartViewCount.mockImplementation(async () => {
                viewCountCalls++;
                await new Promise((resolve) => setTimeout(resolve, 30));
                return viewCountCalls * 10;
            });
            const { result } = renderHook(() => useUserConfigs({ defaultData: [] }));
            await waitFor(() => {
                expect(result.current.status).toBe("success");
            });
            expect(fetchConfigsResolved).toBe(true);
            expect(viewCountCalls).toBe(3);
            expect(result.current.data).toHaveLength(3);
        });
        it("should support pause option", async () => {
            mockFetchChartConfigs.mockResolvedValue([]);
            const { result } = renderHook(() => useUserConfigs({ defaultData: [], pause: true }));
            await new Promise((resolve) => setTimeout(resolve, 100));
            expect(mockFetchChartConfigs).not.toHaveBeenCalled();
            expect(result.current.status).toBe("idle");
        });
    });
    describe("useUserConfig", () => {
        it("should fetch single config with view count", async () => {
            const mockConfig = { key: "config1", title: "Chart 1", data: {} };
            const mockViewCount = 42;
            mockFetchChartConfig.mockResolvedValue(mockConfig);
            mockFetchChartViewCount.mockResolvedValue(mockViewCount);
            const { result } = renderHook(() => useUserConfig("config1", { defaultData: null }));
            await waitFor(() => {
                expect(result.current.status).toBe("success");
            });
            expect(result.current.data).toEqual({
                ...mockConfig,
                viewCount: mockViewCount,
            });
            expect(mockFetchChartConfig).toHaveBeenCalledWith("config1");
            expect(mockFetchChartViewCount).toHaveBeenCalledWith("config1");
        });
        it("should handle config not found error", async () => {
            mockFetchChartConfig.mockResolvedValue(null);
            mockFetchChartViewCount.mockResolvedValue(0);
            const { result } = renderHook(() => useUserConfig("nonexistent", { defaultData: null }));
            await waitFor(() => {
                expect(result.current.status).toBe("error");
            });
            expect(result.current.error).toEqual(new Error("Config not found"));
        });
        it("should pause fetching when chartId is undefined", async () => {
            mockFetchChartConfig.mockResolvedValue({});
            const { result } = renderHook(() => useUserConfig(undefined, { defaultData: null }));
            await new Promise((resolve) => setTimeout(resolve, 100));
            expect(mockFetchChartConfig).not.toHaveBeenCalled();
            expect(result.current.status).toBe("idle");
        });
        it("should refetch when chartId changes", async () => {
            var _a;
            const config1 = { key: "config1", title: "Chart 1", data: {} };
            const config2 = { key: "config2", title: "Chart 2", data: {} };
            mockFetchChartConfig
                .mockResolvedValueOnce(config1)
                .mockResolvedValueOnce(config2);
            mockFetchChartViewCount
                .mockResolvedValueOnce(10)
                .mockResolvedValueOnce(20);
            const { result, rerender } = renderHook(({ chartId }) => useUserConfig(chartId, { defaultData: null }), { initialProps: { chartId: "config1" } });
            await waitFor(() => {
                expect(result.current.status).toBe("success");
            });
            expect((_a = result.current.data) === null || _a === void 0 ? void 0 : _a.key).toBe("config1");
            rerender({ chartId: "config2" });
            await waitFor(() => {
                var _a;
                expect((_a = result.current.data) === null || _a === void 0 ? void 0 : _a.key).toBe("config2");
            });
            expect(mockFetchChartConfig).toHaveBeenCalledTimes(2);
        });
        it("should fetch config and view count in parallel", async () => {
            const mockConfig = { key: "config1", title: "Chart 1", data: {} };
            let configFetchTime = 0;
            let viewCountFetchTime = 0;
            mockFetchChartConfig.mockImplementation(async () => {
                await new Promise((resolve) => setTimeout(resolve, 50));
                configFetchTime = Date.now();
                return mockConfig;
            });
            mockFetchChartViewCount.mockImplementation(async () => {
                await new Promise((resolve) => setTimeout(resolve, 50));
                viewCountFetchTime = Date.now();
                return 100;
            });
            const { result } = renderHook(() => useUserConfig("config1", { defaultData: null }));
            await waitFor(() => {
                expect(result.current.status).toBe("success");
            });
            // Both should complete around the same time (within 30ms)
            const timeDiff = Math.abs(configFetchTime - viewCountFetchTime);
            expect(timeDiff).toBeLessThan(30);
        });
        it("should handle API errors", async () => {
            const error = new Error("Network error");
            mockFetchChartConfig.mockRejectedValue(error);
            mockFetchChartViewCount.mockRejectedValue(error);
            const { result } = renderHook(() => useUserConfig("config1", { defaultData: null }));
            await waitFor(() => {
                expect(result.current.status).toBe("error");
            });
            expect(result.current.error).toBe(error);
        });
        it("should support invalidation and refetching", async () => {
            var _a;
            let fetchCount = 0;
            mockFetchChartConfig.mockImplementation(async () => {
                fetchCount++;
                return { key: "config1", title: `Chart ${fetchCount}`, data: {} };
            });
            mockFetchChartViewCount.mockResolvedValue(100);
            const { result } = renderHook(() => useUserConfig("config1", { defaultData: null }));
            await waitFor(() => {
                expect(result.current.status).toBe("success");
            });
            expect((_a = result.current.data) === null || _a === void 0 ? void 0 : _a.title).toBe("Chart 1");
            // Invalidate and refetch
            result.current.invalidate();
            await waitFor(() => {
                var _a;
                expect((_a = result.current.data) === null || _a === void 0 ? void 0 : _a.title).toBe("Chart 2");
            });
            expect(fetchCount).toBe(2);
        });
    });
    describe("error handling edge cases", () => {
        it("should handle partial failures in view count fetching", async () => {
            const mockConfigs = [
                { key: "config1", title: "Chart 1", data: {} },
                { key: "config2", title: "Chart 2", data: {} },
            ];
            mockFetchChartConfigs.mockResolvedValue(mockConfigs);
            mockFetchChartViewCount
                .mockResolvedValueOnce(100)
                .mockRejectedValueOnce(new Error("Failed to fetch view count"));
            const { result } = renderHook(() => useUserConfigs({ defaultData: [] }));
            await waitFor(() => {
                expect(result.current.status).toBe("error");
            });
            // Should fail if any view count fetch fails
            expect(result.current.error).toBeDefined();
        });
        it("should handle timeout errors", async () => {
            var _a;
            mockFetchChartConfig.mockImplementation(() => new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 100)));
            mockFetchChartViewCount.mockResolvedValue(0);
            const { result } = renderHook(() => useUserConfig("config1", { defaultData: null }));
            await waitFor(() => {
                expect(result.current.status).toBe("error");
            }, { timeout: 200 });
            expect((_a = result.current.error) === null || _a === void 0 ? void 0 : _a.message).toBe("Timeout");
        });
    });
    describe("performance considerations", () => {
        it("should not refetch configs unnecessarily", async () => {
            mockFetchChartConfigs.mockResolvedValue([]);
            const { result, rerender } = renderHook(() => useUserConfigs({ defaultData: [] }));
            await waitFor(() => {
                expect(result.current.status).toBe("success");
            });
            expect(mockFetchChartConfigs).toHaveBeenCalledTimes(1);
            // Rerender shouldn't trigger refetch
            rerender();
            rerender();
            rerender();
            expect(mockFetchChartConfigs).toHaveBeenCalledTimes(1);
        });
        it("should cache results across multiple hook instances", async () => {
            const mockConfig = { key: "config1", title: "Chart 1", data: {} };
            mockFetchChartConfig.mockResolvedValue(mockConfig);
            mockFetchChartViewCount.mockResolvedValue(100);
            const { result: result1 } = renderHook(() => useUserConfig("config1", { defaultData: null }));
            await waitFor(() => {
                expect(result1.current.status).toBe("success");
            });
            // Second instance should use cache
            const { result: result2 } = renderHook(() => useUserConfig("config1", { defaultData: null }));
            expect(result2.current.data).toEqual(result1.current.data);
            expect(mockFetchChartConfig).toHaveBeenCalledTimes(1);
        });
    });
});
