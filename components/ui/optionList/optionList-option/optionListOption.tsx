import { Option } from "@lib/responseSet/data/responseSet.model";
import { Badge, BadgeProps, Group } from "@mantine/core";
import React from "react";

import { useStyles } from "./styles";

type OptionListOptionProps = BadgeProps & {
    option: Option;
};

export const OptionListOption = ({ option, ...rest }: OptionListOptionProps) => {
    const { classes } = useStyles();
    return (
        <Group position="apart">
            <Badge
                color={option.color}
                size="lg"
                radius="sm"
                sx={{ textTransform: "none" }}
                {...rest}
            >
                {option.label}
            </Badge>
        </Group>
    );
};
