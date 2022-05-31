import { FormTemplate as FormTemplateProps } from "@lib/formTemplate/data/formTemplate.model";
import { Box, Divider, Grid, Group, TextInput } from "@mantine/core";
import { formTemplateState } from "@state/formTemplate";
import React, { FC } from "react";
import { CleanedCamel, CleanedSnake } from "type-helpers";
import { Required } from "utility-types";
import { FormTemplateFieldCard } from "./formTemplate-field/formTemplate-field-card";
import { FormTemplateFieldCreate } from "./formTemplate-field/formTemplate-field-create";

export const FormTemplate = ({
    formTemplate,
}: {
    formTemplate: Required<Partial<CleanedCamel<FormTemplateProps>>, "id">;
}) => {
    formTemplateState.formTemplateId = formTemplate.id;
    return (
        <Group direction="column" grow>
            <TextInput
                required
                placeholder="Form Name"
                size="xl"
                value={formTemplate.name}
                onChange={(event) =>
                    (formTemplate.name = event.currentTarget.value)
                }
            />
            <Box>
                <Group grow direction="column">
                    <Group direction="column" grow>
                        <Divider labelPosition="center" label="Form Fields" />
                        {formTemplate.fields
                            ? formTemplate.fields.map((field, index) => (
                                  <FormTemplateFieldCard
                                      index={index}
                                      field={field}
                                      key={`field-${index}`}
                                  />
                              ))
                            : "You've not added any fields yet"}
                        <FormTemplateFieldCreate />
                    </Group>
                </Group>
            </Box>
        </Group>
    );
};
