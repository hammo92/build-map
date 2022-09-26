import { IconTitle } from "@components/ui/iconTitle/iconTitle";
import { FieldTypes } from "@lib/field/data/field.model";
import { Card, SimpleGrid } from "@mantine/core";
import React from "react";
import { FIELD_OPTIONS } from "./options";
import { useStyles } from "./styles";

interface typeSelectProps {
    onSelect: (type: FieldTypes) => void;
}

export const TypeSelect = ({ onSelect }: typeSelectProps) => {
    const { classes } = useStyles();
    return (
        <SimpleGrid cols={2}>
            {FIELD_OPTIONS.map((fieldOption) => {
                return (
                    <Card
                        key={fieldOption.label}
                        className={classes.clickableCard}
                        onClick={() => onSelect(fieldOption.type)}
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
