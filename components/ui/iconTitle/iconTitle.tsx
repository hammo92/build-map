import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import {
    Group,
    Stack,
    Text,
    TextProps,
    ThemeIcon,
    ThemeIconProps,
    Title,
    TitleProps,
} from "@mantine/core";
import React, { FC } from "react";

interface IconTitleProps {
    icon: FontAwesomeIconProps["icon"];
    title: string;
    subtitle?: string;
    titleProps?: TitleProps;
    iconProps?: ThemeIconProps;
    textProps?: TextProps;
}

export const IconTitle: FC<IconTitleProps> = ({
    icon,
    title,
    subtitle,
    titleProps,
    iconProps,
    textProps,
}) => {
    return (
        <Group align="center" noWrap>
            <ThemeIcon size={subtitle ? "xl" : "md"} {...iconProps}>
                <FontAwesomeIcon icon={icon} />
            </ThemeIcon>
            <Stack
                sx={{ textTransform: "capitalize" }}
                spacing={0}
                justify="flex-start"
                align="flex-start"
            >
                <Title order={4} {...titleProps}>
                    {title}
                </Title>
                {subtitle && (
                    <Text size="sm" color="dimmed" {...textProps} align="left">
                        {subtitle}
                    </Text>
                )}
            </Stack>
        </Group>
    );
};
