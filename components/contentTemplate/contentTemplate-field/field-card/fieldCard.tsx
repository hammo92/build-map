import { FIELD_TYPES } from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { IconTitle } from "@components/ui/iconTitle/iconTitle";
import { faGripVertical } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentTemplateField } from "@lib/contentTemplate/data/types";
import { Card, Center, Group } from "@mantine/core";
import { FC } from "react";
import { splitCamel } from "utils/stringTransform";
import { FieldDelete } from "../field-delete";
import { FieldEdit } from "../field-edit";

interface FieldCardProps {
    field: ContentTemplateField;
    index?: number;
    withDrag?: boolean;
    withActions?: boolean;
}

const fieldSubtitle = (field: ContentTemplateField) => {
    const typeString = splitCamel(field.type);
    switch (field.type) {
        case "number":
            return `${typeString} - ${splitCamel(field.subtype)}`;
        case "text":
            return `${typeString} - ${splitCamel(field.subtype)}`;
        default:
            return typeString;
    }
};

export const FieldCard: FC<FieldCardProps> = ({ field, index, withDrag = true, withActions = true }) => {
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
                            subtitle={fieldSubtitle(field)}
                            icon={FIELD_TYPES[field.type].icon}
                        />
                    </Group>
                    {withActions ? (
                        <Group>
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
