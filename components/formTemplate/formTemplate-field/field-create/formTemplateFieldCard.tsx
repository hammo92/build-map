import { FIELD_TYPES } from "@components/formTemplate/constants";
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
import { FieldDelete } from "../field-delete";
import { FieldEdit } from "../field-edit";

interface FormTemplateCreateBaseFieldProps {
    field: FormTemplateField;
    index?: number;
    withDrag?: boolean;
    withActions?: boolean;
}

export const FormTemplateFieldCard: FC<FormTemplateCreateBaseFieldProps> = ({
    field,
    index,
    withDrag = true,
    withActions = true,
}) => {
    return (
        <Card
            sx={(theme) => ({
                border: `1px solid ${theme.colors.dark[4]}`,
                borderRadius: theme.radius.md,
            })}
            //onClick={() => (fieldTemplateState.activeIndex = index)}
        >
            <Card.Section
                p="md"
                sx={(theme) => ({
                    background: theme.colors.dark[7],
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
                        <ThemeIcon size="xl">
                            <FontAwesomeIcon
                                icon={FIELD_TYPES[field.type].icon}
                            />
                        </ThemeIcon>
                        <Group direction="column" spacing={0}>
                            <Title
                                order={4}
                                sx={{ textTransform: "capitalize" }}
                            >
                                {field.name}
                            </Title>
                            <Text color="dimmed" size="sm">
                                {`${field.type}${
                                    field.config?.subtype
                                        ? ` - ${field.config.subtype}`
                                        : ""
                                } `}
                            </Text>
                        </Group>
                    </Group>
                    {withActions ? (
                        <Group>
                            <Group>
                                <Text>Required</Text>
                                <Switch
                                /*onChange={(event) =>
                                    updateField(index, {
                                        required: event.currentTarget.checked,
                                    })
                                }*/
                                />
                            </Group>
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
