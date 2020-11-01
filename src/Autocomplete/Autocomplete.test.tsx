import { renderHook, act } from "@testing-library/react-hooks";
import { Issue } from "../types/issues";
import { effects, hooks } from "./Autocomplete";

const issues = [{
    id: 1,
    title: "Issue 1",
    html_url: "https://google.com?q=1",
    labels: [{
        id: 1,
        name: "Label 1",
        color: "fffde7"
    }, {
        id: 2,
        name: "Label 2",
        color: "ffaa88"
    }]
}, {
    id: 2,
    title: "Issue 2",
    html_url: "https://google.com?q=2",
    labels: [{
        id: 1,
        name: "Green label",
        color: "88ffaa"
    }]
}, {
    id: 3,
    title: "Issue 3",
    html_url: "https://google.com?q=3",
    labels: [{
        id: 1,
        name: "Blue label",
        color: "88aaff"
    }]
}]

describe("effects", () => {
    describe("keydownListener", () => {
        let listener: (e: KeyboardEvent) => void;
        let input: HTMLInputElement;
        let setSelectedIssueStub: jest.SpyInstance & ((x: Issue) => void);
        let windowOpenStub: jest.SpyInstance;
        let e: KeyboardEvent;
        beforeEach(() => {
            input = document.createElement("input");
            setSelectedIssueStub = jest.fn();
            windowOpenStub = jest.spyOn(window, "open").mockReturnValue(null);
            listener = effects.keydownListener(input, issues, issues[1], setSelectedIssueStub);
            e = { target: input, preventDefault: jest.fn() } as unknown as KeyboardEvent;
        });

        test("Should call window.open on enter", () => {
            listener({ ...e, key: "Enter" } as unknown as KeyboardEvent);
            expect(windowOpenStub).toHaveBeenCalledWith("https://google.com?q=2", "_blank");
        });


        test("Should not call window.open on enter if target is different", () => {
            listener({ ...e, key: "Enter", target: document.createElement("input") } as unknown as KeyboardEvent);
            expect(windowOpenStub).not.toHaveBeenCalled();
        });

        test("Should call setSelectedIssue with next item on down", () => {
            listener({ ...e, key: "ArrowDown" } as unknown as KeyboardEvent);
            expect(setSelectedIssueStub).toHaveBeenCalledWith(issues[2]);
            expect(e.preventDefault).toHaveBeenCalled();
        });
        test("Should call setSelectedIssue with prev item on up", () => {
            listener({ ...e, key: "ArrowUp" } as unknown as KeyboardEvent);
            expect(setSelectedIssueStub).toHaveBeenCalledWith(issues[0]);
            expect(e.preventDefault).toHaveBeenCalled();
        });

        describe("If the last item selected", () => {
            beforeEach(() => {
                listener = effects.keydownListener(input, issues, issues[2], setSelectedIssueStub);
            });

            test("Should call setSelectedIssue with first item on down", () => {
                listener({ ...e, key: "ArrowDown" } as unknown as KeyboardEvent);
                expect(setSelectedIssueStub).toHaveBeenCalledWith(issues[0]);
                expect(e.preventDefault).toHaveBeenCalled();
            });
        });

        describe("If the first item selected", () => {
            beforeEach(() => {
                listener = effects.keydownListener(input, issues, issues[0], setSelectedIssueStub);
            });

            test("Should call setSelectedIssue with last item on up", () => {
                listener({ ...e, key: "ArrowUp" } as unknown as KeyboardEvent);
                expect(setSelectedIssueStub).toHaveBeenCalledWith(issues[2]);
                expect(e.preventDefault).toHaveBeenCalled();
            });
        });
    });
});

describe("hooks", () => {
    describe("useDropdownState", () => {
        test("returns visible=false by default", () => {
            const hook = renderHook(() => hooks.useDropdownState());

            expect(hook.result.current.visible).toEqual(false);
        });

        test("changes visible value after show and hide correspondingly", () => {
            const hook = renderHook(() => hooks.useDropdownState());

            act(() => hook.result.current.show());
            expect(hook.result.current.visible).toEqual(true);

            act(() => hook.result.current.hide());
            expect(hook.result.current.visible).toEqual(false);
        });
    });

    describe("useSelectedIssue", () => {
        const keydownListener = () => {};
        let addEventListenerStub: jest.SpyInstance;
        let removeEventListenerStub: jest.SpyInstance;
        beforeEach(() => {
            jest.spyOn(effects, "keydownListener").mockReturnValue(keydownListener);
            addEventListenerStub = jest.spyOn(document, "addEventListener");
            removeEventListenerStub = jest.spyOn(document, "removeEventListener");
        });

        test("calls addEventListener on mount", () => {
            const hook = renderHook(() => hooks.useSelectedIssue([]));

            expect(addEventListenerStub).toHaveBeenCalledWith("keydown", keydownListener);
            expect(removeEventListenerStub).not.toHaveBeenCalled();
        });

        test("calls removeEventListener on unmount", () => {
            const hook = renderHook(() => hooks.useSelectedIssue([]));

            hook.unmount();

            expect(addEventListenerStub).toHaveBeenCalledWith("keydown", keydownListener);
            expect(removeEventListenerStub).toHaveBeenCalledWith("keydown", keydownListener);
        });
    });
});
