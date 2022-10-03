import { IconTitle } from "@components/ui/iconTitle/iconTitle";
import { faEdit } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Property } from "@lib/field/data/field.model";
import { ActionIcon, Box, Card, Divider, Group } from "@mantine/core";
import { propertyManager } from "@state/propertyManager";
import { splitCamel } from "utils/stringTransform";
import { useSnapshot } from "valtio";
import { PropertyDelete } from "../property-delete";
import { PropertyEdit } from "../property-edit";
import { FIELD_TYPES } from "../property-type/type-select/options";
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
        <Card sx={{ flex: grow ? 1 : "auto" }} py="sm">
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
                        grow
                        sx={(theme) => ({
                            alignSelf: "stretch",
                        })}
                    >
                        <PropertyEdit
                            property={property}
                            isModal
                            buttonElement={
                                <ActionIcon>
                                    <FontAwesomeIcon icon={faEdit} />
                                </ActionIcon>
                            }
                        />
                        <Divider variant="solid" orientation="vertical" />
                        <PropertyDelete property={property} />
                    </Group>
                )}
            </Group>
        </Card>
    );
};
