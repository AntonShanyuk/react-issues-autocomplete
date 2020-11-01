import React from "react";
import { useDebouncedCallback } from "use-debounce";
import { Autocomplete } from "../Autocomplete/Autocomplete";
import { LoadIssuesResponse } from "../types/issues";

export const effects = {
    async loadIssues(query: string): Promise<LoadIssuesResponse> {
        const queryPararam = encodeURIComponent(`"${query}"`);
        const response = await fetch(
            `https://api.github.com/search/issues?q=${queryPararam}+repo:facebook/react&per_page=10`
        );

        const json = await response.json();
        if (!response.ok) {
            throw json;
        }

        return json;
    }
};

export const hooks = {
    useLoadIssues(query: string | null) {
        const [issues, setIssues] = React.useState<LoadIssuesResponse | null>(null);
        const [loading, setLoading] = React.useState(false);
        const [error, setError] = React.useState<string | null>(null);

        React.useEffect(() => {
            if (query !== null) {
                setLoading(true);
                setError(null);
                effects.loadIssues(query).then(issues => {
                    setIssues(issues);
                    setLoading(false);
                    setError(null);
                }).catch((e: Error) => {
                    setLoading(false);
                    setError(e.message);
                });
            }
        }, [query]);

        return { issues, loading, error };
    },
    useOnInput() {
        const [query, setQuery] = React.useState<string | null>(null);

        const onInput = useDebouncedCallback(
            React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                setQuery(e.target.value);
            }, []),
            300,
        );

        return { query, onInput };
    }
};

export function AutocompleteContainer() {
    const { query, onInput } = hooks.useOnInput();
    const { issues, loading, error } = hooks.useLoadIssues(query);

    return (
        <Autocomplete
            onInput={onInput.callback}
            items={issues?.items}
            loading={loading}
            error={error}
        />
    );
}
