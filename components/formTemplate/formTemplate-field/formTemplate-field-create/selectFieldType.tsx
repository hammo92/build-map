import {
    FieldTypeProps,
    FIELD_OPTIONS,
} from "@components/formTemplate/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FieldType } from "@lib/formTemplate/data/formTemplate.model";
import { Card, SimpleGrid, Text, Title } from "@mantine/core";
import React, { FC } from "react";
import { useStyles } from "./styles";

interface SelectFieldTypeProps {
    setFieldType: (fieldType: FieldType) => void;
}

export const SelectFieldType: FC<SelectFieldTypeProps> = ({ setFieldType }) => {
    const { classes } = useStyles();
    return (
        <SimpleGrid cols={3}>
            {FIELD_OPTIONS.map((fieldOption) => {
                return (
                    <Card
                        key={fieldOption.label}
                        className={classes.clickableCard}
                        onClick={() => setFieldType(fieldOption.type)}
                    >
                        <Card.Section p="md">
                            <Title order={3}>{fieldOption.label}</Title>
                        </Card.Section>
                        <Card.Section p="md">
                            <FontAwesomeIcon
                                icon={fieldOption.icon}
                                size="2x"
                            />
                        </Card.Section>
                        <Card.Section p="md">
                            <Text>{fieldOption.description}</Text>
                        </Card.Section>
                    </Card>
                );
            })}
        </SimpleGrid>
    );
};
