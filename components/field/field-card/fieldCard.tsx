import { FIELD_TYPES } from "@components/property/property-type/type-select/options";
import { IconTitle } from "@components/ui/iconTitle/iconTitle";
import { faGripVertical } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field } from "@lib/field/data/field.model";

import { Card, Center, Divider, Group } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { FC } from "react";
import { splitCamel } from "utils/stringTransform";

interface FieldCardProps {
    field: Field;
    index?: number;
    withActions?: boolean;
    leftContent?: React.ReactNode;
    grow?: boolean;
}

const fieldSubtitle = (field: Field) => {
    const typeString = splitCamel(field.type);
    switch (field.type) {
        case "number":
            return `${typeString} - ${splitCamel(field?.variant ?? "")}`;
        case "text":
            return `${typeString} - ${splitCamel(field?.variant ?? "")}`;
        default:
            return typeString;
    }
};

export const FieldCard: FC<FieldCardProps> = ({
    field,
    index,
    withActions = true,
    leftContent,
    grow,
}) => {
    return (
        <Card radius={0} withBorder sx={{ flex: grow ? 1 : "auto" }}>
            <Group position="apart">
                <Group>
                    {leftContent !== undefined && leftContent}
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
                </Group>
                {/*withActions && (
                    <Group
                        p="md"
                        grow
                        sx={(theme) => ({
                            alignSelf: "stretch",
                        })}
                    >
                        <FieldEdit field={field} />
                        <Divider variant="solid" orientation="vertical" />
                        <FieldDelete field={field} />
                    </Group>
                    )*/}
            </Group>
        </Card>
    );
};
