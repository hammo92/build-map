import { faFillDrip, faSquare } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Group } from "@mantine/core";
import React from "react";
import { ShapeColor } from "./shape-color";
import { ShapeSelect } from "./shape-select";

export const ShapeInterface = () => {
    return (
        <Group
            sx={(theme) => ({
                flex: "1",
                padding: theme.spacing.sm,
            })}
            position="apart"
        >
            <Group>
                <ShapeSelect />
            </Group>
            <Group>
                <Group spacing="xs">
                    <FontAwesomeIcon icon={faFillDrip} />
                    <ShapeColor type="fill" />
                </Group>
                <Group spacing="xs">
                    <FontAwesomeIcon icon={faSquare} />
                    <ShapeColor type="stroke" />
                </Group>
                {/* <Group spacing="xs">
                    <Text size="sm">Stoke Width</Text>
                    <WidthSlider />
                </Group> */}
            </Group>
        </Group>
    );
};
