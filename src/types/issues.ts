export type IssueLabel = {
    id: number;
    name: string;
    color: string;
};

export type Issue = {
    id: number;
    title: string;
    html_url: string;
    labels: IssueLabel[];
};

export type LoadIssuesResponse = {
    total_count: number;
    items: Issue[];
};