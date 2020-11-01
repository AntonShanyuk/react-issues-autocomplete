import { act, renderHook } from "@testing-library/react-hooks";

import { effects, hooks } from "./AutocompleteContainer";

const issuesResponse = {
    items: [],
    total_count: 0,
};

describe("effects", () => {
    describe("loadIssues", () => {
        let fetchStub: jest.SpyInstance;
        beforeEach(() => {
            fetchStub = jest.spyOn(window, "fetch").mockResolvedValue({
                json: jest.fn().mockResolvedValue(issuesResponse),
                ok: true,
            } as unknown as Response);
        });

        test("Should call fetch and return response", async () => {
            const issues = await effects.loadIssues("test");

            expect(issues).toBe(issuesResponse);
            expect(fetchStub).toHaveBeenCalledWith(
                "https://api.github.com/search/issues?q=%22test%22+repo:facebook/react&per_page=10"
            );
        });

        describe("if response.ok=false", () => {
            beforeEach(() => {
                fetchStub = jest.spyOn(window, "fetch").mockResolvedValue({
                    json: jest.fn().mockResolvedValue({
                        message: "Boom"
                    }),
                    ok: false,
                } as unknown as Response);
            });

            test("Should call fetch and throw", async () => {
                await expect(() => effects.loadIssues("test")).rejects.toEqual({
                    message: "Boom"
                });

                expect(fetchStub).toHaveBeenCalledWith(
                    "https://api.github.com/search/issues?q=%22test%22+repo:facebook/react&per_page=10"
                );
            });
        });
    });
});

describe("hooks", () => {
    describe("useLoadIssues", () => {
        let loadIssuesStub: jest.SpyInstance;
        beforeEach(() => {
            loadIssuesStub = jest.spyOn(effects, "loadIssues").mockResolvedValue(issuesResponse);
        });
        test("Should call loadIssues and return issues if query is not empty", async () => {
            const { result, waitForNextUpdate } = renderHook(() => hooks.useLoadIssues("test"));

            expect(result.current).toEqual({
                issues: null,
                loading: true,
                error: null,
            });

            await act(() => waitForNextUpdate());

            expect(loadIssuesStub).toBeCalledWith("test");
            expect(result.current).toEqual({
                issues: issuesResponse,
                loading: false,
                error: null,
            });
        });

        test("Should not call loadIssues and return null if query is null", async () => {
            const { result } = renderHook(() => hooks.useLoadIssues(null));

            expect(loadIssuesStub).not.toHaveBeenCalled();
            expect(result.current).toEqual({
                issues: null,
                loading: false,
                error: null,
            });
        });

        test("Should return error if loadIssues rejects", async () => {
            loadIssuesStub.mockRejectedValueOnce(new Error("Boom"));
            const { result, waitForNextUpdate } = renderHook(() => hooks.useLoadIssues("test"));

            expect(result.current).toEqual({
                issues: null,
                loading: true,
                error: null,
            });

            await act(() => waitForNextUpdate());

            expect(loadIssuesStub).toBeCalledWith("test");
            expect(result.current).toEqual({
                issues: null,
                loading: false,
                error: "Boom",
            });
        });
    });
});
