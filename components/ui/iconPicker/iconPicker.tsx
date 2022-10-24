import { far, IconDefinition } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    ActionIcon,
    Card,
    Center,
    ColorSwatch,
    DefaultProps,
    extractSystemStyles,
    Group,
    Input,
    InputProps,
    InputWrapperProps,
    MantineSize,
    Pagination,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    Tooltip,
    useInputProps,
} from "@mantine/core";
import { useUncontrolled, useId } from "@mantine/hooks";
import { forwardRef, useEffect, useState } from "react";
import { chunkArray, removeDuplicatesFromArray } from "utils/arrayModify";
import { useStyles } from "./styles";
import { BaseIconPickerProps, BaseIconPickerStylesNames, Icon } from "./types";

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

export type IconPickerProps = BaseIconPickerProps &
    DefaultProps<BaseIconPickerStylesNames> & {
        /** Icons to show per page */
        perPage?: number;

        /** Icon columns */
        cols?: number;

        /** Controlled input value */
        value?: Icon;

        /** Uncontrolled input defaultValue */
        defaultValue?: Icon;

        /** Controlled input onChange handler */
        onChange?(value: Icon): void;

        /** Input size */
        size?: MantineSize;

        wrapperProps?: InputWrapperProps;
    };

const defaultProps: Partial<IconPickerProps> = {
    required: false,
    perPage: 40,
    cols: 8,
    size: "sm",
    disabled: false,
};

export const IconPicker = forwardRef<HTMLInputElement, IconPickerProps>(
    (props: IconPickerProps, ref) => {
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
        } = { ...props, ...defaultProps };

        const { classes, cx, theme } = useStyles();
        const { systemStyles, rest } = extractSystemStyles(others);
        const [page, setPage] = useState(1);
        const [searchString, setSearchString] = useState("");
        const [searchPage, setSearchPage] = useState(1);
        const uuid = useId(id);

        const [_value, handleChange, inputMode] = useUncontrolled({
            value,
            defaultValue,
            finalValue: {
                icon: far[0],
                color: "red",
            },
            onChange: onChange!,
        });

        const onIconClick = (icon: IconDefinition) => {
            handleChange({ color: _value?.color ?? "red", icon });
        };

        //* Create paged icon list //
        /** convert icons object into array of icons */
        const iconsArray = Object.keys(far).map((key) => far[key as keyof typeof far]);
        const duplicatesRemoved = removeDuplicatesFromArray(iconsArray) as IconDefinition[];

        const filteredList = duplicatesRemoved.filter(({ iconName }) =>
            iconName.includes(searchString)
        );

        const pagedIcons = chunkArray(filteredList, perPage!);

        const onPageChange = (newPageIndex: number) => {
            searchString.length ? setSearchPage(newPageIndex) : setPage(newPageIndex);
        };

        const onSearch = (string: string) => {
            !searchString.length && setSearchPage(1);
            setSearchString(string);
        };

        const activePage = searchString ? searchPage : page;

        const swatches = colors.map((color) => (
            <ColorSwatch
                className={`${classes.clickable} ${
                    color === _value?.color && classes.activeSwatch
                }`}
                key={color}
                color={theme.colors[color][7]}
                onClick={() => handleChange({ icon: _value?.icon ?? far[0], color })}
            />
        ));

        return (
            <Input.Wrapper {...systemStyles} {...wrapperProps}>
                <Card p="sm">
                    <Stack>
                        <Group grow>{swatches}</Group>
                        <TextInput
                            onChange={(event) => onSearch(event.currentTarget.value)}
                            size={size}
                            value={searchString}
                            placeholder="Type to search icons"
                        />

                        {pagedIcons[activePage - 1] ? (
                            <SimpleGrid cols={cols}>
                                {pagedIcons[activePage - 1].map((icon, index) => (
                                    <Tooltip
                                        label={icon.iconName}
                                        withArrow
                                        key={`${icon.iconName}${index}`}
                                    >
                                        <Center>
                                            <ActionIcon
                                                size={size}
                                                className={classes.clickable}
                                                onClick={() => onIconClick(icon)}
                                                color={
                                                    icon.iconName === _value?.icon?.iconName
                                                        ? _value?.color
                                                        : "gray"
                                                }
                                                variant={
                                                    icon.iconName === _value?.icon?.iconName
                                                        ? "filled"
                                                        : "subtle"
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={icon}
                                                    size={
                                                        size === "md"
                                                            ? "1x"
                                                            : size === "xl"
                                                            ? "2x"
                                                            : size
                                                    }
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
                                page={activePage}
                                size={size}
                                grow
                                onChange={onPageChange}
                                total={Math.ceil(filteredList.length / perPage!)}
                            />
                        )}
                    </Stack>
                </Card>
            </Input.Wrapper>
        );
    }
);

IconPicker.displayName = "IconPicker";
