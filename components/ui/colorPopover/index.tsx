import { ColorPicker, ColorSwatch, Popover } from "@mantine/core";
import React, { useState } from "react";
import { useUncontrolled } from "@mantine/hooks";

export const ColorPopover = ({ value, defaultValue = "#ffffff", onChange }) => {
    const [opened, setOpened] = useState(false);
    const [_value, handleChange] = useUncontrolled({
        value,
        defaultValue,
        finalValue: "#000000",
        rule: (val) => typeof val === "string",
        onChange,
    });

    return (
        <Popover
            opened={opened}
            position="bottom"
            onClose={() => setOpened(false)}
            target={
                <ColorSwatch
                    key={_value}
                    color={_value}
                    onClick={() => setOpened((o) => !o)}
                    sx={{ cursor: "pointer" }}
                />
            }
        >
            <ColorPicker format="rgba" value={_value} onChange={handleChange} />
        </Popover>
    );
};
