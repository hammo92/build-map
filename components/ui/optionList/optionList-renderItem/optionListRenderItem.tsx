import { faTimes, faTimesCircle } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Option } from "@lib/responseSet/data/responseSet.model";
import { ActionIcon, CloseButton, MultiSelectValueProps } from "@mantine/core";
import React from "react";
import { OptionListOption } from "../optionList-option";

export const OptionListRenderItem = ({
    value,
    label,
    color,
    onRemove,
    classNames,
    ...others
}: MultiSelectValueProps & Option) => {
    return (
        <div {...others}>
            <OptionListOption
                pr={0}
                option={{ value, label, color }}
                rightSection={
                    <ActionIcon onClick={onRemove} ml="sm" variant="light">
                        <FontAwesomeIcon icon={faTimes} size="xs" />
                    </ActionIcon>
                }
            />
        </div>
    );
};
