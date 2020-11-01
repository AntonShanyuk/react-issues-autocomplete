import React, { useCallback, useEffect, useRef, useState } from "react";
import classnames from "classnames";
import { Label } from "../Label/Label";
import { Issue } from "../types/issues";
import "./Autocomplete.css";

type Props = {
    onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    items: Issue[] | undefined;
    loading: boolean;
    error: string | null;
};

export const effects = {
    keydownListener: (
        input: HTMLInputElement | null,
        issues: Issue[] | undefined,
        selectedIssue: Issue | null,
        setSelectedIssue: (issue: Issue) => void,
    ) => (e: KeyboardEvent) => {
        if (e.target !== input) {
            return;
        }
        const isDownKey = e.key === "ArrowDown";
        const isUpKey = e.key === "ArrowUp";
        const isEnter = e.key === "Enter";

        if (selectedIssue && isEnter) {
            window.open(selectedIssue.html_url, "_blank");
            return;
        }

        if (issues && issues.length && (isDownKey || isUpKey)) {
            let currentIndex = selectedIssue ? issues.indexOf(selectedIssue) : 0;
            
            if (isDownKey && (!selectedIssue || currentIndex === issues.length - 1)) {
                currentIndex = 0;
            } else if (isDownKey) {
                currentIndex++;
            } else if (isUpKey && (!selectedIssue || currentIndex === 0)) {
                currentIndex = issues.length - 1;
            } else if (isUpKey) {
                currentIndex --;
            }

            setSelectedIssue(issues[currentIndex]);
            e.preventDefault();
        }
    }
};

export const hooks = {
    useDropdownState() {
        const [visible, setVisible] = React.useState(false);
        const hide = useCallback(() => {
            setVisible(false);
        }, [setVisible]);
        const show = useCallback(() => {
            setVisible(true);
        }, [setVisible]);

        return { visible, show, hide };
    },
    useSelectedIssue(issues: Issue[] | undefined) {
        const inputRef = useRef<HTMLInputElement>(null);
        const [selectedIssue, setSelectedIssue] = useState(issues?.length ? issues[0] : null);
        useEffect(() => {
            const listener = effects.keydownListener(inputRef.current, issues, selectedIssue, setSelectedIssue);
            
            document.addEventListener("keydown", listener);

            return () => document.removeEventListener("keydown", listener);
        }, [issues, selectedIssue, setSelectedIssue, inputRef]);

        return { inputRef, selectedIssue };
    }
};

  

export const Autocomplete = (props: Props) => {
    const { onInput, items, loading, error } = props;

    const { visible, show, hide } = hooks.useDropdownState();
    const { selectedIssue, inputRef } = hooks.useSelectedIssue(items);

    return (
        <div className="autocomplete">
            <input
                type="text"
                onInput={onInput}
                onFocus={show}
                onBlur={hide}
                ref={inputRef}
                className="input"
                placeholder="Search issues"
            />
            {error && visible && (
                <div className="error">Error: <span>{error}</span></div>
            )}
            {loading && visible && (
                <div className="loading">Loading...</div>
            )}
            {items && !!items.length && !loading && !error && visible && (
                <div className="dropdown">
                    {items.map(item => (
                        <>
                            <div
                                key={item.id}
                                className={classnames("issue", {
                                    selected: item === selectedIssue
                                })}
                            >
                                <a
                                    className="issueTitle"
                                    href={item.html_url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {item.title}
                                </a>
                                {item.labels.map(label => (
                                    <span className="issueLabel" key={label.id}>
                                        <Label {...label} />
                                    </span>
                                ))}
                            </div>
                        </>
                    ))}
                </div>
            )}
        </div>
    );
};
