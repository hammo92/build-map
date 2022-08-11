import { SmartForm } from "@components/smartForm";
import { Keys } from "@data/contentTemplate/constants";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { useFormContext } from "react-hook-form";
import { useQueryClient } from "react-query";
import { CleanedCamel } from "type-helpers";

export const BasicFieldsRelation = () => {
    const queryClient = useQueryClient();
    const { watch } = useFormContext();
    const data = queryClient.getQueryData<{
        contentTemplates: CleanedCamel<ContentTemplate>[];
    }>([Keys.GET_ORGANISATION_CONTENT_TYPES]);
    const isReciprocal = watch("isReciprocal");
    const relatedId = watch("relatedTo");
    const relatedName = data?.contentTemplates.find(({ id }) => id === relatedId)?.name;
    return (
        <>
            <SmartForm.FieldGroup cols={relatedId ? 2 : 1}>
                <SmartForm.Select
                    label="Related To"
                    name="relatedTo"
                    data={
                        data?.contentTemplates.map(({ name, id }) => ({
                            label: name,
                            value: id,
                        })) ?? []
                    }
                    required
                />
                {relatedId && (
                    <SmartForm.BooleanSegmentedControl
                        name="isReciprocal"
                        label={`Show on ${relatedName}`}
                        fullWidth
                    />
                )}
            </SmartForm.FieldGroup>
            {isReciprocal && (
                <SmartForm.TextInput
                    label={`Property Name On ${relatedName}`}
                    name="reciprocalPropertyName"
                    required
                />
            )}
        </>
    );
};
