import { FIELD_TYPES } from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { IconTitle } from "@components/ui/iconTitle/iconTitle";
import { Property } from "@lib/field/data/field.model";
import { Card, Group } from "@mantine/core";
import { propertyManager } from "@state/propertyManager";
import { splitCamel } from "utils/stringTransform";
import { useSnapshot } from "valtio";
import { PropertyDelete } from "../property-delete";
import { useStyles } from "./styles";

interface PropetyItemProps {
    property: Property;
    hideActions?: boolean;
    leftContent?: React.ReactNode;
    grow?: boolean;
}

const fieldSubtitle = (property: Property) => {
    const typeString = splitCamel(property.type);
    switch (property.type) {
        case "number":
            return `${typeString} - ${splitCamel(property?.variant)}`;
        case "text":
            return `${typeString} - ${splitCamel(property?.variant)}`;
        default:
            return typeString;
    }
};

export const PropertyItem = ({ property, hideActions, leftContent, grow }: PropetyItemProps) => {
    const { classes } = useStyles();
    const { editing } = useSnapshot(propertyManager);
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
                {editing && !hideActions && (
                    <Group
                        p="md"
                        grow
                        sx={(theme) => ({
                            alignSelf: "stretch",
                        })}
                    >
                        {/* <FieldEdit field={field} />
                        <Divider variant="solid" orientation="vertical" /> */}
                        <PropertyDelete property={property} />
                    </Group>
                )}
            </Group>
        </Card>
    );
};
