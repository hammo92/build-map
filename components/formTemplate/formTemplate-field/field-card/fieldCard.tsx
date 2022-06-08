import { FIELD_TYPES } from "@components/formTemplate/constants";
import { IconTitle } from "@components/ui/iconTitle/iconTitle";
import { faGripVertical } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormTemplateField } from "@lib/formTemplate/data/formTemplate.model";
import {
    Card,
    Center,
    Group,
    Switch,
    Text,
    ThemeIcon,
    Title,
} from "@mantine/core";
import React, { FC } from "react";
import { splitCamel } from "utils/stringTransform";
import { FieldDelete } from "../field-delete";
import { FieldEdit } from "../field-edit";

interface FieldCardProps {
    field: FormTemplateField;
    index?: number;
    withDrag?: boolean;
    withActions?: boolean;
}

export const FieldCard: FC<FieldCardProps> = ({
    field,
    index,
    withDrag = true,
    withActions = true,
}) => {
    return (
        <Card
            sx={(theme) => ({
                borderRadius: theme.radius.md,
            })}
            //onClick={() => (fieldTemplateState.activeIndex = index)}
        >
            <Card.Section
                p="md"
                sx={(theme) => ({
                    background: theme.colors.dark[6],
                })}
            >
                <Group position="apart">
                    {withDrag ? (
                        <Center>
                            <FontAwesomeIcon icon={faGripVertical} />
                        </Center>
                    ) : (
                        ""
                    )}
                    <Group
                        sx={{
                            flex: "1",
                            alignSelf: "stretch",
                        }}
                    >
                        <IconTitle
                            title={field.name}
                            subtitle={`${splitCamel(field.type)}${
                                field.config?.subtype
                                    ? ` - ${splitCamel(field.config.subtype)}`
                                    : ""
                            } `}
                            icon={FIELD_TYPES[field.type].icon}
                        />
                    </Group>
                    {withActions ? (
                        <Group>
                            {/* <Group>
                                <Text>Required</Text>
                                <Switch
                                /*onChange={(event) =>
                                    updateField(index, {
                                        required: event.currentTarget.checked,
                                    })
                                }
                                />
                            </Group> */}
                            <FieldEdit field={field} />
                            <FieldDelete field={field} />
                        </Group>
                    ) : (
                        ""
                    )}
                </Group>
            </Card.Section>
        </Card>
    );
};
