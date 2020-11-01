import React from "react";
import { action } from '@storybook/addon-actions';

import { Autocomplete } from "./Autocomplete";

export default {
    title: 'Autocomplete',
    component: Autocomplete,
};

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
}];

export const Empty = () => (
    <Autocomplete
        onInput={action("onInput")}
        loading={false}
        error={null}
        items={[]}
    />
);

export const WithIssues = () => (
    <Autocomplete
        onInput={action("onInput")}
        loading={false}
        error={null}
        items={issues}
    />
);

export const WithError = () => (
    <Autocomplete
        onInput={action("onInput")}
        loading={false}
        error="Boom"
        items={issues}
    />
);

export const WithLoading = () => (
    <Autocomplete
        onInput={action("onInput")}
        loading={true}
        error={null}
        items={issues}
    />
);