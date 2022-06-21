import { far, IconDefinition } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    ActionIcon,
    Center,
    ColorSwatch,
    DefaultProps,
    extractSystemStyles,
    Group,
    InputWrapper,
    MantineSize,
    Pagination,
    SimpleGrid,
    Text,
    TextInput,
    Tooltip,
    useMantineDefaultProps,
} from "@mantine/core";
import { useUncontrolled, useUuid } from "@mantine/hooks";
import { forwardRef, useState } from "react";
import { chunkArray, removeDuplicatesFromArray } from "utils/arrayModify";
import { useStyles } from "./styles";
import { BaseIconPickerProps, BaseIconPickerStylesNames, IconPickerIcon } from "./types";

const colors = [
    "red",
    "pink",
    "grape",
    "violet",
    "indigo",
    "blue",
    "cyan",
    "green",
    "lime",
    "yellow",
    "orange",
    "teal",
];

export interface IconPickerProps extends BaseIconPickerProps, DefaultProps<BaseIconPickerStylesNames> {
    /** Icons to show per page */
    perPage?: number;

    /** Icon columns */
    cols?: number;

    /** Controlled input value */
    value?: IconPickerIcon;

    /** Uncontrolled input defaultValue */
    defaultValue?: IconPickerIcon;

    /** Controlled input onChange handler */
    onChange?(value: IconPickerIcon): void;

    /** Input size */
    size?: MantineSize;
}

const defaultProps: Partial<IconPickerProps> = {
    required: false,
    perPage: 40,
    cols: 8,
    size: "sm",
    disabled: false,
};

export const IconPicker = forwardRef<HTMLInputElement, IconPickerProps>((props: IconPickerProps, ref) => {
    const {
        perPage,
        cols,
        className,
        style,
        required,
        label,
        id,
        error,
        description,
        size,
        value,
        defaultValue,
        onChange,
        onBlur,
        onFocus,
        wrapperProps,
        classNames,
        styles,
        disabled,
        sx,
        name,
        errorProps,
        descriptionProps,
        labelProps,
        placeholder,
        form,
        ...others
    } = useMantineDefaultProps("IconPicker", defaultProps, props);

    const { classes, cx, theme } = useStyles();
    const { systemStyles, rest } = extractSystemStyles(others);
    const [page, setPage] = useState(1);
    const [searchString, setSearchString] = useState("");
    const uuid = useUuid(id);

    const [_value, handleChange, inputMode] = useUncontrolled({
        value,
        defaultValue,
        finalValue: {
            icon: far[0],
            color: "red",
        },
        onChange: onChange!,
        rule: (val) => typeof val === "object",
    });

    const onIconClick = (icon: IconDefinition) => {
        handleChange({ color: _value?.color ?? "red", icon });
    };

    //* Create paged icon list //
    /** convert icons object into array of icons */
    const iconsArray = Object.keys(far).map((key) => far[key as keyof typeof far]);
    const duplicatesRemoved = removeDuplicatesFromArray(iconsArray) as IconDefinition[];
    const filteredList = duplicatesRemoved.filter(({ iconName }) => iconName.includes(searchString));
    const pagedIcons = chunkArray(filteredList, perPage!);
    //* //

    const swatches = colors.map((color) => (
        <ColorSwatch
            className={`${classes.clickable} ${color === _value?.color && classes.activeSwatch}`}
            key={color}
            color={theme.colors[color][7]}
            onClick={() => handleChange({ icon: _value?.icon ?? far[0], color })}
        />
    ));
    //* */
    return (
        <InputWrapper
            required={required}
            id={uuid}
            label={label}
            error={error}
            description={description}
            size={size}
            className={className}
            style={style}
            classNames={classNames}
            styles={styles}
            __staticSelector="Select"
            sx={sx}
            errorProps={errorProps}
            descriptionProps={descriptionProps}
            labelProps={labelProps}
            {...systemStyles}
            {...wrapperProps}
        >
            <Group
                direction="column"
                grow
                style={{
                    border: `1px solid ${theme.colors.dark[6]}`,
                    borderRadius: theme.radius.md,
                }}
                p={size}
            >
                <Group grow>{swatches}</Group>
                <TextInput
                    onChange={(event) => setSearchString(event.currentTarget.value)}
                    size={size}
                    value={searchString}
                    placeholder="Type to search icons"
                />

                {pagedIcons[page - 1] ? (
                    <SimpleGrid cols={cols}>
                        {pagedIcons[page - 1].map((icon, index) => (
                            <Tooltip label={icon.iconName} withArrow key={`${icon.iconName}${index}`}>
                                <Center>
                                    <ActionIcon
                                        size={size}
                                        className={classes.clickable}
                                        onClick={() => onIconClick(icon)}
                                        color={icon.iconName === _value?.icon?.iconName ? _value?.color : "gray"}
                                        variant={icon.iconName === _value?.icon?.iconName ? "filled" : "hover"}
                                    >
                                        <FontAwesomeIcon
                                            icon={icon}
                                            size={size === "md" ? "1x" : size === "xl" ? "2x" : size}
                                        />
                                    </ActionIcon>
                                </Center>
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
                        size={size}
                        grow
                        onChange={setPage}
                        total={Math.floor(filteredList.length / perPage!)}
                    />
                )}
            </Group>
        </InputWrapper>
    );
});

IconPicker.displayName = "IconPicker";
