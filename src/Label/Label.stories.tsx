import React from "react";

import { Label } from "./Label";
export default {
    component: Label,
    title: "Label",
};

export const SimpleLabel = () => (
    <Label
        name="Sample Label"
        color="ffaaaa"
        id={1}
    />
);
