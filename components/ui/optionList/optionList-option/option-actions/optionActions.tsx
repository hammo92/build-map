import { faCheck, faEllipsis, faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Option } from "@lib/responseSet/data/responseSet.model";
import {
    ActionIcon,
    ColorSwatch,
    Group,
    MantineColor,
    Menu,
    Text,
    TextInput,
    useMantineTheme,
} from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { useState } from "react";

import { useStyles } from "./styles";

export const OptionActions = ({
    option,
    onChange,
    onDelete,
}: {
    option: Option;
    onChange: (color: MantineColor, label: string) => void;
    onDelete: () => void;
}) => {
    const { classes } = useStyles();
    const [opened, setOpened] = useState(false);
    const [label, setLabel] = useState<string>(option.label);
    const theme = useMantineTheme();
    const { dark, ...colors } = theme.colors;

    const swatches = Object.keys(colors).map((color) => (
        <Menu.Item key={color} onClick={() => onChange(color, label)}>
            <Group position="apart">
                <Group>
                    <ColorSwatch color={theme.colors[color][6]} size={20} />
                    <Text transform="capitalize">{color}</Text>
                </Group>
                {color === option.color && <FontAwesomeIcon icon={faCheck} />}
            </Group>
        </Menu.Item>
    ));

    const handleSubmit = () => {
        label?.length && onChange(option.color, label);
        setOpened(false);
    };
    return (
        <Menu opened={opened} onChange={setOpened} withinPortal>
            <Menu.Target>
                <ActionIcon>
                    <FontAwesomeIcon icon={faEllipsis} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <TextInput
                    name="option"
                    onChange={(event) => setLabel(event.target.value)}
                    onKeyDown={getHotkeyHandler([["Enter", handleSubmit]])}
                    value={label}
                    p="sm"
                />

                <Menu.Divider />
                <Menu.Label>Colours</Menu.Label>
                {swatches}
                <Menu.Divider />
                <Menu.Item
                    color="red"
                    icon={<FontAwesomeIcon icon={faTrash} />}
                    onClick={() => onDelete()}
                >
                    Delete
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};
