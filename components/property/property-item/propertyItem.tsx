import { FIELD_TYPES } from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { IconTitle } from "@components/ui/iconTitle/iconTitle";
import { Property } from "@lib/field/data/field.model";
import { Card, Group } from "@mantine/core";
import { splitCamel } from "utils/stringTransform";
import { useStyles } from "./styles";

interface PropetyItemProps {
    property: Property;
    actions?: React.ReactNode;
    leftContent?: React.ReactNode;
    grow?: boolean;
}

const fieldSubtitle = (field: Property) => {
    const typeString = splitCamel(field.type);
    switch (field.type) {
        case "number":
            return `${typeString} - ${splitCamel(field.variant)}`;
        case "text":
            return `${typeString} - ${splitCamel(field.variant)}`;
        default:
            return typeString;
    }
};

export const PropertyItem = ({ property, actions, leftContent, grow }: PropetyItemProps) => {
    const { classes } = useStyles();
    return (
        <Card radius={0} withBorder sx={{ flex: grow ? 1 : "auto" }}>
            <Group position="apart">
                <Group>
                    {!!leftContent && leftContent}
                    <div className={classes.propertyTitle}>
                        <IconTitle
                            title={property.name}
                            subtitle={fieldSubtitle(property)}
                            icon={FIELD_TYPES[property.type].icon}
                        />
                    </div>
                </Group>
                {actions && actions}
            </Group>
        </Card>
    );
};
