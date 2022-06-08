import { FormTemplate } from "@lib/formTemplate/data/formTemplate.model";
import { Badge, Card, Group, Paper, Text, Title } from "@mantine/core";
import { formTemplateState } from "@state/formTemplate";
import React, { FC } from "react";
import { CleanedCamel } from "type-helpers";
import { useSnapshot } from "valtio";

interface FormTemplateCardProps {
    formTemplate: CleanedCamel<FormTemplate>;
}

export const FormTemplateCard: FC<FormTemplateCardProps> = ({
    formTemplate,
}) => {
    const { formTemplateId } = useSnapshot(formTemplateState);
    return (
        <Card
            sx={{ cursor: "pointer" }}
            onClick={() => (formTemplateState.formTemplateId = formTemplate.id)}
        >
            <Card.Section p="md">
                <Group position="apart" noWrap align="start">
                    <Title order={4}>{formTemplate.name}</Title>
                    <Badge
                        sx={{ flexShrink: 0 }}
                        color={
                            formTemplate.status === "published"
                                ? "violet"
                                : "blue"
                        }
                        variant={
                            formTemplate.status === "published"
                                ? "filled"
                                : "outline"
                        }
                    >
                        {formTemplate.status}
                    </Badge>
                </Group>
                <Text>{`${formTemplate.fields.length} fields`}</Text>
            </Card.Section>
        </Card>
    );
};
