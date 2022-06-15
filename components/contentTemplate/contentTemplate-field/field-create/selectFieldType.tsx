import {
    FieldType,
    FIELD_OPTIONS,
} from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { IconTitle } from "@components/ui/iconTitle/iconTitle";
import { Card, SimpleGrid } from "@mantine/core";
import { FC } from "react";
import { useStyles } from "./styles";

interface SelectFieldTypeProps {
    setFieldType: (fieldType: FieldType) => void;
}

export const SelectFieldType: FC<SelectFieldTypeProps> = ({ setFieldType }) => {
    const { classes } = useStyles();
    return (
        <SimpleGrid cols={2}>
            {FIELD_OPTIONS.map((fieldOption) => {
                return (
                    <Card
                        key={fieldOption.label}
                        className={classes.clickableCard}
                        onClick={() => setFieldType(fieldOption.type)}
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        <IconTitle
                            icon={fieldOption.icon}
                            title={fieldOption.label}
                            subtitle={fieldOption.description}
                        />
                    </Card>
                );
            })}
        </SimpleGrid>
    );
};
