import { SmartForm } from "@components/smartForm";
import { Keys } from "@data/contentTemplate/constants";
import {
    useGetOrganisationContentTemplates,
    useGetProjectContentTemplates,
} from "@data/contentTemplate/hooks";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { useRouter } from "next/router";
import { useFormContext } from "react-hook-form";
import { useQueryClient } from "react-query";
import { CleanedCamel } from "type-helpers";

export interface BasicFieldsRelationProps {
    /** Don't allow reciprocal option */
    oneWayOnly?: boolean;

    /** disable related to select option */
    relationLocked?: boolean;
}

export const BasicFieldsRelation = ({ oneWayOnly, relationLocked }: BasicFieldsRelationProps) => {
    const { query } = useRouter();
    console.log("query :>> ", query);
    const { watch } = useFormContext();
    const { data } = useGetOrganisationContentTemplates(query.orgId as string);
    const isReciprocal = watch("isReciprocal");
    const relatedId = watch("relatedTo");
    const relatedName = data?.contentTemplates.find(({ id }) => id === relatedId)?.name;
    return (
        <>
            <SmartForm.FieldGroup cols={relatedId && !oneWayOnly ? 2 : 1}>
                <SmartForm.Select
                    label="Related To"
                    name="relatedTo"
                    disabled={relationLocked}
                    data={
                        data?.contentTemplates.map(({ name, id }) => ({
                            label: name,
                            value: id,
                        })) ?? []
                    }
                    required
                />
                {relatedId && !oneWayOnly && (
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
