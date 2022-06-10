import {
    far,
    faPickleball,
    IconDefinition,
} from "@fortawesome/pro-regular-svg-icons";
import {
    FontAwesomeIcon,
    FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import {
    ActionIcon,
    Box,
    Button,
    Center,
    ColorInput,
    ColorSwatch,
    Group,
    MantineColor,
    Modal,
    Pagination,
    Popover,
    ScrollArea,
    SimpleGrid,
    Text,
    TextInput,
    ThemeIcon,
    Tooltip,
    useMantineTheme,
} from "@mantine/core";
import React, { FC, useState } from "react";
import { chunkArray, removeDuplicatesFromArray } from "utils/arrayModify";
import tinyColor from "tinycolor2";
import { useStyles } from "./styles";
import { ContentTypeIcon } from "@lib/contentType/data/contentType.model";
import { useUncontrolled } from "@mantine/hooks";

interface IconPickerProps {
    perPage?: number;
    cols?: number;
    defaultValue?: Partial<ContentTypeIcon>;
    value?: Partial<ContentTypeIcon>;
    onChange: ({ icon, color }: ContentTypeIcon) => void;
}

export const IconPicker: FC<IconPickerProps> = ({
    perPage = 40,
    cols = 8,
    onChange,
    defaultValue,
    value,
}) => {
    const [_value, handleChange] = useUncontrolled({
        value,
        defaultValue,
        rule: (val) => val !== undefined,
        finalValue: {
            color: "blue",
        },
        onChange,
    });

    const { classes } = useStyles();
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [page, setPage] = useState(1);
    const [searchString, setSearchString] = useState("");
    //convert icons object into array of icons
    const iconsArray = Object.keys(far).map(
        (key) => far[key as keyof typeof far]
    );
    const duplicatesRemoved = removeDuplicatesFromArray(
        iconsArray
    ) as IconDefinition[];
    const filteredList = duplicatesRemoved.filter(({ iconName }) =>
        iconName.includes(searchString)
    );
    const pagedIcons = chunkArray(filteredList, perPage);

    const onClick = (icon: IconDefinition) => {
        handleChange({ ..._value, icon });
    };

    // remove grey and black, return swatches for colours
    const swatches = Object.keys(theme.colors)
        .slice(2, theme.colors.length as unknown as number)
        .map((color) => (
            <ColorSwatch
                className={`${classes.clickable} ${
                    color === _value?.color && classes.activeSwatch
                }`}
                key={color}
                color={theme.colors[color][7]}
                onClick={() => handleChange({ ..._value, color })}
            />
        ));

    // displays chosen icon and colour
    const previewIcon = (
        <ThemeIcon
            color={_value?.color}
            variant="filled"
            size={36}
            className={classes.transition}
        >
            {_value?.icon ? (
                <FontAwesomeIcon icon={_value?.icon} size="lg" />
            ) : (
                ""
            )}
        </ThemeIcon>
    );

    return (
        <Group direction="column" grow>
            <Group grow>{swatches}</Group>
            <TextInput
                onChange={(event) => setSearchString(event.currentTarget.value)}
                value={searchString}
                placeholder="Type to search icons"
            />

            {pagedIcons[page - 1] ? (
                <SimpleGrid cols={cols}>
                    {pagedIcons[page - 1].map((icon, index) => (
                        <Tooltip
                            label={icon.iconName}
                            withArrow
                            key={`${icon.iconName}${index}`}
                        >
                            <ActionIcon
                                size="lg"
                                className={classes.clickable}
                                onClick={() => onClick(icon)}
                                color={
                                    icon.iconName === _value?.icon?.iconName
                                        ? _value?.color
                                        : "gray"
                                }
                                variant={
                                    icon.iconName === _value?.icon?.iconName
                                        ? "filled"
                                        : "hover"
                                }
                            >
                                <FontAwesomeIcon icon={icon} size="lg" />
                            </ActionIcon>
                        </Tooltip>
                    ))}
                </SimpleGrid>
            ) : (
                <Center>
                    <Text>No icons found</Text>
                </Center>
            )}
            {pagedIcons.length > 1 && (
                <Pagination
                    page={page}
                    grow
                    onChange={setPage}
                    total={Math.floor(filteredList.length / perPage)}
                />
            )}
        </Group>
    );
};
