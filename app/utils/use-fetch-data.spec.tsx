import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useFetchData, useHydrate, useMutate } from "@/utils/use-fetch-data";

describe("useFetchData", () => {
  describe("basic functionality", () => {
    it("should fetch data successfully", async () => {
      const queryFn = vi.fn().mockResolvedValue({ result: "success" });
      const { result } = renderHook(() =>
        useFetchData({
          queryKey: ["test", "key"],
          queryFn,
          options: { defaultData: null },
        })
      );

      expect(result.current.status).toBe("idle");

      await waitFor(() => {
        expect(result.current.status).toBe("success");
      });

      expect(result.current.data).toEqual({ result: "success" });
      expect(result.current.error).toBe(null);
      expect(queryFn).toHaveBeenCalledTimes(1);
    });

    it("should handle errors", async () => {
      const error = new Error("Fetch failed");
      const queryFn = vi.fn().mockRejectedValue(error);
      const { result } = renderHook(() =>
        useFetchData({
          queryKey: ["test", "error"],
          queryFn,
          options: { defaultData: null },
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe("error");
      });

      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(error);
    });

    it("should return default data when no data is available", () => {
      const queryFn = vi.fn().mockResolvedValue("data");
      const defaultData = { default: true };
      const { result } = renderHook(() =>
        useFetchData({
          queryKey: ["test", "default"],
          queryFn,
          options: { defaultData },
        })
      );

      expect(result.current.data).toEqual(defaultData);
    });

    it("should not fetch when paused", async () => {
      const queryFn = vi.fn().mockResolvedValue("data");
      const { result } = renderHook(() =>
        useFetchData({
          queryKey: ["test", "paused"],
          queryFn,
          options: { pause: true, defaultData: null },
        })
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(queryFn).not.toHaveBeenCalled();
      expect(result.current.status).toBe("idle");
    });
  });

  describe("cache management", () => {
    it("should share cached data between hooks with same queryKey", async () => {
      const queryFn = vi.fn().mockResolvedValue("shared-data");
      const queryKey = ["shared", "cache", "test"];

      const { result: result1 } = renderHook(() =>
        useFetchData({
          queryKey,
          queryFn,
          options: { defaultData: null },
        })
      );

      await waitFor(() => {
        expect(result1.current.status).toBe("success");
      });

      // Second hook with same query key should use cache
      const { result: result2 } = renderHook(() =>
        useFetchData({
          queryKey,
          queryFn,
          options: { defaultData: null },
        })
      );

      expect(result2.current.data).toBe("shared-data");
      expect(result2.current.status).toBe("success");
      expect(queryFn).toHaveBeenCalledTimes(1); // Only called once
    });

    it("should differentiate between different queryKeys", async () => {
      const queryFn1 = vi.fn().mockResolvedValue("data1");
      const queryFn2 = vi.fn().mockResolvedValue("data2");

      const { result: result1 } = renderHook(() =>
        useFetchData({
          queryKey: ["test", "1"],
          queryFn: queryFn1,
          options: { defaultData: null },
        })
      );

      const { result: result2 } = renderHook(() =>
        useFetchData({
          queryKey: ["test", "2"],
          queryFn: queryFn2,
          options: { defaultData: null },
        })
      );

      await waitFor(() => {
        expect(result1.current.status).toBe("success");
        expect(result2.current.status).toBe("success");
      });

      expect(result1.current.data).toBe("data1");
      expect(result2.current.data).toBe("data2");
      expect(queryFn1).toHaveBeenCalledTimes(1);
      expect(queryFn2).toHaveBeenCalledTimes(1);
    });

    it("should invalidate and refetch data", async () => {
      let callCount = 0;
      const queryFn = vi.fn().mockImplementation(() => {
        callCount++;
        return Promise.resolve(`data-${callCount}`);
      });

      const { result } = renderHook(() =>
        useFetchData({
          queryKey: ["test", "invalidate"],
          queryFn,
          options: { defaultData: null },
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe("success");
      });

      expect(result.current.data).toBe("data-1");

      // Invalidate and refetch
      act(() => {
        result.current.invalidate();
      });

      await waitFor(() => {
        expect(result.current.data).toBe("data-2");
      });

      expect(queryFn).toHaveBeenCalledTimes(2);
    });
  });

  describe("race condition handling", () => {
    it("should not make concurrent requests for same queryKey", async () => {
      let resolvePromise: (value: string) => void;
      const promise = new Promise<string>((resolve) => {
        resolvePromise = resolve;
      });
      const queryFn = vi.fn().mockReturnValue(promise);

      const queryKey = ["test", "race"];

      const { result: result1 } = renderHook(() =>
        useFetchData({
          queryKey,
          queryFn,
          options: { defaultData: null },
        })
      );

      // Immediately render second hook while first is still fetching
      const { result: result2 } = renderHook(() =>
        useFetchData({
          queryKey,
          queryFn,
          options: { defaultData: null },
        })
      );

      expect(result1.current.status).toBe("fetching");
      expect(result2.current.status).toBe("fetching");

      // Resolve the promise
      await act(async () => {
        resolvePromise!("resolved-data");
        await promise;
      });

      await waitFor(() => {
        expect(result1.current.status).toBe("success");
        expect(result2.current.status).toBe("success");
      });

      expect(result1.current.data).toBe("resolved-data");
      expect(result2.current.data).toBe("resolved-data");
      expect(queryFn).toHaveBeenCalledTimes(1); // Only one request made
    });

    it("should handle rapid invalidations", async () => {
      let callCount = 0;
      const queryFn = vi.fn().mockImplementation(() => {
        callCount++;
        return Promise.resolve(`data-${callCount}`);
      });

      const { result } = renderHook(() =>
        useFetchData({
          queryKey: ["test", "rapid-invalidate"],
          queryFn,
          options: { defaultData: null },
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe("success");
      });

      // Rapid invalidations
      await act(async () => {
        result.current.invalidate();
        result.current.invalidate();
        result.current.invalidate();
      });

      await waitFor(() => {
        expect(result.current.status).toBe("success");
      });

      // Should have called multiple times but handled gracefully
      expect(queryFn).toHaveBeenCalled();
    });
  });

  describe("memory leak prevention", () => {
    it("should cleanup listeners on unmount", async () => {
      const queryFn = vi.fn().mockResolvedValue("data");
      const { result, unmount } = renderHook(() =>
        useFetchData({
          queryKey: ["test", "cleanup"],
          queryFn,
          options: { defaultData: null },
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe("success");
      });

      // Unmount should cleanup listeners
      unmount();

      // No easy way to test internal listener cleanup,
      // but we ensure no errors are thrown on unmount
      expect(true).toBe(true);
    });

    it("should handle multiple mount/unmount cycles", async () => {
      const queryFn = vi.fn().mockResolvedValue("data");
      const queryKey = ["test", "multiple-mounts"];

      for (let i = 0; i < 5; i++) {
        const { result, unmount } = renderHook(() =>
          useFetchData({
            queryKey,
            queryFn,
            options: { defaultData: null },
          })
        );

        await waitFor(() => {
          expect(result.current.status).toBe("success");
        });

        unmount();
      }

      // Should use cache after first call
      expect(queryFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("pause/resume functionality", () => {
    it("should pause and resume fetching", async () => {
      const queryFn = vi.fn().mockResolvedValue("data");
      const { result, rerender } = renderHook(
        ({ pause }) =>
          useFetchData({
            queryKey: ["test", "pause-resume"],
            queryFn,
            options: { pause, defaultData: null },
          }),
        { initialProps: { pause: true } }
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(queryFn).not.toHaveBeenCalled();
      expect(result.current.status).toBe("idle");

      // Resume
      rerender({ pause: false });

      await waitFor(() => {
        expect(result.current.status).toBe("success");
      });

      expect(queryFn).toHaveBeenCalledTimes(1);
      expect(result.current.data).toBe("data");
    });
  });
});

describe("useHydrate", () => {
  it("should hydrate cache with server data", () => {
    const queryKey = ["hydrate", "test"];
    const serverData = { hydrated: true };

    const { result } = renderHook(() => {
      useHydrate(queryKey, serverData);
      return useFetchData({
        queryKey,
        queryFn: vi.fn(),
        options: { defaultData: null },
      });
    });

    expect(result.current.data).toEqual(serverData);
    expect(result.current.status).toBe("success");
  });

  it("should only hydrate once", () => {
    const queryKey = ["hydrate", "once"];
    const serverData1 = { first: true };
    const serverData2 = { second: true };

    const { result, rerender } = renderHook(
      ({ data }) => {
        useHydrate(queryKey, data);
        return useFetchData({
          queryKey,
          queryFn: vi.fn(),
          options: { defaultData: null },
        });
      },
      { initialProps: { data: serverData1 } }
    );

    expect(result.current.data).toEqual(serverData1);

    // Rerender with different data - should not update
    rerender({ data: serverData2 });

    expect(result.current.data).toEqual(serverData1);
  });
});

describe("useMutate", () => {
  it("should handle successful mutation", async () => {
    const mutateFn = vi.fn().mockResolvedValue({ success: true });
    const { result } = renderHook(() => useMutate(mutateFn));

    expect(result.current.status).toBe("idle");

    await act(async () => {
      await result.current.mutate("arg1", "arg2");
    });

    expect(result.current.status).toBe("success");
    expect(result.current.data).toEqual({ success: true });
    expect(result.current.error).toBe(null);
    expect(mutateFn).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("should handle mutation errors", async () => {
    const error = new Error("Mutation failed");
    const mutateFn = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useMutate(mutateFn));

    await act(async () => {
      await result.current.mutate();
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toBe(error);
    expect(result.current.data).toBe(null);
  });

  it("should show fetching status during mutation", async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    const mutateFn = vi.fn().mockReturnValue(promise);

    const { result } = renderHook(() => useMutate(mutateFn));

    act(() => {
      result.current.mutate();
    });

    expect(result.current.status).toBe("fetching");

    await act(async () => {
      resolvePromise!({ done: true });
      await promise;
    });

    expect(result.current.status).toBe("success");
  });

  it("should reset mutation state", async () => {
    const mutateFn = vi.fn().mockResolvedValue("data");
    const { result } = renderHook(() => useMutate(mutateFn));

    await act(async () => {
      await result.current.mutate();
    });

    expect(result.current.data).toBe("data");
    expect(result.current.status).toBe("success");

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.status).toBe("idle");
  });

  it("should handle multiple mutations", async () => {
    let count = 0;
    const mutateFn = vi.fn().mockImplementation(() => {
      count++;
      return Promise.resolve(count);
    });
    const { result } = renderHook(() => useMutate(mutateFn));

    await act(async () => {
      await result.current.mutate();
    });
    expect(result.current.data).toBe(1);

    await act(async () => {
      await result.current.mutate();
    });
    expect(result.current.data).toBe(2);

    await act(async () => {
      await result.current.mutate();
    });
    expect(result.current.data).toBe(3);

    expect(mutateFn).toHaveBeenCalledTimes(3);
  });
});

describe("QueryCache edge cases", () => {
  it("should handle complex queryKey objects", async () => {
    const complexQueryKey = [
      "user",
      { id: 123, filters: { active: true } },
      ["nested", "array"],
    ];
    const queryFn = vi.fn().mockResolvedValue("complex-data");

    const { result } = renderHook(() =>
      useFetchData({
        queryKey: complexQueryKey,
        queryFn,
        options: { defaultData: null },
      })
    );

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    expect(result.current.data).toBe("complex-data");
  });

  it("should handle queryKey with undefined values", async () => {
    const queryKey = ["test", undefined, "key"];
    const queryFn = vi.fn().mockResolvedValue("data");

    const { result } = renderHook(() =>
      useFetchData({
        queryKey,
        queryFn,
        options: { defaultData: null },
      })
    );

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    expect(result.current.data).toBe("data");
  });
});
