import { useRepeatGroup } from "@data/content/hooks";
import {
    faChevronCircleRight,
    faEllipsis,
    faFile,
    faNote,
    faTasks,
    faTrash,
} from "@fortawesome/pro-regular-svg-icons";
import { faChevronCircleDown } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Content, Content as ContentProps } from "@lib/content/data/content.model";
import { ContentField } from "@lib/content/data/types";

import { Field, PropertyGroup } from "@lib/field/data/field.model";
import {
    ActionIcon,
    Box,
    Button,
    Collapse,
    Group,
    Menu,
    Stack,
    Text,
    useMantineTheme,
} from "@mantine/core";
import { useState } from "react";
import { CleanedCamel } from "type-helpers";
import { objArrayToHashmap } from "utils/arrayModify";
import { getFieldElement } from "../contentFields";
import { AdditionalAssets } from "../fields-additional/additional-assets";
import { AdditionalMenu } from "../fields-additional/additional-menu";
import { AdditionalNote } from "../fields-additional/additional-note";
import { useStyles } from "./styles";

export interface FieldGroup extends Omit<PropertyGroup, "children"> {
    children: (CleanedCamel<Field> | FieldGroup)[];
}

export const groupFields = ({
    content,
    contentFields,
}: {
    content: CleanedCamel<Content>;
    contentFields: CleanedCamel<Field>[];
}): FieldGroup => {
    const groupMap = objArrayToHashmap(content.fieldGroups, "id");
    const fieldMap = objArrayToHashmap(contentFields, "id");
    const combined = { ...groupMap, ...fieldMap };

    // root group always exists with id "1"
    const root = groupMap["1"]!;

    const getChildren = (
        item: CleanedCamel<Field> | PropertyGroup,
        level = 0,
        path: string[] = []
    ): FieldGroup | CleanedCamel<Field> => {
        if (item?.type === "propertyGroup") {
            const children = item.children.map((id) => {
                const childItem = combined[id];
                return getChildren(childItem, level + 1, [...path, `${item.id}`]);
            });
            return {
                ...item,
                children,
            };
        }
        return fieldMap[item.id!];
    };

    // root group is always present so return will always be a Field Group
    const fieldGroup = getChildren(root) as FieldGroup;
    return fieldGroup;
};

export const FieldsGroup = ({
    fieldGroup,
    depth = 0,
    content,
    contentFields,
    removable,
}: {
    fieldGroup: FieldGroup;
    depth?: number;
    content: CleanedCamel<ContentProps>;
    contentFields: CleanedCamel<Field>[];
    removable?: boolean;
}) => {
    const [opened, setOpened] = useState(true);

    const theme = useMantineTheme();
    const { classes } = useStyles();
    const { mutateAsync } = useRepeatGroup();

    const contents = (
        <Stack spacing={opened ? "xs" : 0} style={{ flex: "1" }} pt="xs">
            {fieldGroup.children.map((child) => {
                if (child.type === "propertyGroup") {
                    return (
                        <FieldsGroup
                            key={child.id}
                            fieldGroup={child}
                            depth={depth + 1}
                            content={content}
                            contentFields={contentFields}
                            removable={fieldGroup.repeatable && fieldGroup.children.length > 1}
                        />
                    );
                }
                return (
                    <Stack
                        key={child.id}
                        p="sm"
                        spacing="xs"
                        sx={(theme) => ({
                            background: theme.colors.dark[6],
                            borderRadius: theme.radius.sm,
                            position: "relative",
                        })}
                    >
                        {getFieldElement(child)}
                        {/* <AdditionalNote field={child} />
                        <AdditionalAssets field={child} />
                        <AdditionalMenu field={child} /> */}
                    </Stack>
                );
            })}
        </Stack>
    );

    // Don't render title and indent for root group
    if (depth === 0) {
        return contents;
    }

    return (
        <Stack p={0}>
            <Stack spacing={0} className={classes.group}>
                <Group
                    spacing="sm"
                    p="xs"
                    sx={(theme) => ({
                        border: `1px solid ${theme.colors.dark[5]}`,
                        //background: theme.colors.dark[6],
                        borderRadius: `0 0 0 ${theme.radius.md}px`,
                    })}
                    position="apart"
                >
                    <Group spacing="xs">
                        <ActionIcon onClick={() => setOpened(!opened)}>
                            <FontAwesomeIcon
                                icon={opened ? faChevronCircleDown : faChevronCircleRight}
                            />
                        </ActionIcon>
                        <Text>{fieldGroup.name}</Text>
                    </Group>
                    <Group>
                        {fieldGroup.repeatable && (
                            <Button
                                size="xs"
                                variant="subtle"
                                onClick={async () =>
                                    mutateAsync({
                                        contentId: content.id,
                                        groupId: `${fieldGroup.id}`,
                                    })
                                }
                            >
                                Add entry
                            </Button>
                        )}
                        {removable && (
                            <ActionIcon color="red">
                                <FontAwesomeIcon icon={faTrash} />
                            </ActionIcon>
                        )}
                    </Group>
                </Group>
                <Collapse in={opened}>
                    <div className={classes.child}>
                        <div className={classes.indent} />
                        {contents}
                    </div>
                </Collapse>
            </Stack>
        </Stack>
    );
};
