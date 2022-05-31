import { faFillDrip } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Group } from "@mantine/core";
import { imageEditorState } from "@state/imageEditor";
import { useImmerAtom } from "jotai/immer";
import React from "react";
import { TextColor } from "./text-color";
import { TextStyle } from "./text-style";

export const TextInterface = () => (
    <Group
        sx={(theme) => ({
            flex: "1",
            padding: theme.spacing.sm,
        })}
        position="apart"
    >
        <Group>
            <TextStyle />
        </Group>
        <Group>
            <Group spacing="xs">
                <FontAwesomeIcon icon={faFillDrip} />
                <TextColor />
            </Group>
        </Group>
    </Group>
);
