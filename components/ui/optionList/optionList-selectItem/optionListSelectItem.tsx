import { Option } from "@lib/responseSet/data/responseSet.model";
import React, { forwardRef } from "react";
import { OptionListOption } from "../optionList-option";

export const OptionListSelectItem = forwardRef<HTMLDivElement, Option>(
    ({ color, label, value, ...others }: Option, ref) => (
        <div ref={ref} {...others}>
            <OptionListOption option={{ color, label, value }} />
        </div>
    )
);

OptionListSelectItem.displayName = "OptionListDisplayItem";
