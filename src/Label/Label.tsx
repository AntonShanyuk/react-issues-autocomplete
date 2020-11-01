import React from "react";
import { IssueLabel } from "../types/issues";
import "./Label.css";

export const Label = (props: IssueLabel) => {
    const { name, color } = props;
    return (
        <span
            style={{backgroundColor: `#${color}`}}
            className="label"
        >
            {name}
        </span>
    );
};
