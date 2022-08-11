import { ContentStatus } from "@lib/content/data/content.model";
import { Badge, BadgeProps } from "@mantine/core";
import React from "react";

type ContentStatusBadgeProps = BadgeProps<"div"> & {
    status: ContentStatus;
};

export const ContentStatusBadge = ({ status, ...rest }: ContentStatusBadgeProps) => {
    const badgeProps = (
        status: ContentStatus
    ): { color: BadgeProps<"div">["color"]; variant: BadgeProps<"div">["variant"] } => {
        switch (status) {
            case "draft":
                return { color: "dark", variant: "outline" };
            case "published":
                return { color: "violet", variant: "filled" };
            case "archived":
                return { color: "pink", variant: "filled" };
        }
    };
    return (
        <Badge sx={{ flexShrink: 0 }} {...rest} {...badgeProps(status)}>
            {status}
        </Badge>
    );
};
