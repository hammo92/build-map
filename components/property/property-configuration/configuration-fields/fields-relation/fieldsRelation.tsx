import { SmartForm } from '@components/smartForm'
import { useGetOrganisationContentTemplates } from '@data/contentTemplate/hooks'
import { ContentTemplate } from '@lib/contentTemplate/data/contentTemplate.model'
import { useRouter } from 'next/router'
import pluralize from 'pluralize'
import { useFormContext } from 'react-hook-form'
import { CleanedCamel } from 'type-helpers'

export interface FieldsRelationOptions {
    disableReciprocal?: boolean
    disableChangeRelated?: boolean
    disableChangeReciprocal?: boolean
}

export type BasicFieldsRelationProps = {
    contentTemplate?: CleanedCamel<ContentTemplate>
} & FieldsRelationOptions

export const FieldsRelation = ({
    contentTemplate,
    disableChangeRelated,
    disableChangeReciprocal,
    disableReciprocal,
}: BasicFieldsRelationProps) => {
    const { query } = useRouter()
    const { watch } = useFormContext()
    const { data } = useGetOrganisationContentTemplates(query.orgId as string)
    const isReciprocal = watch('isReciprocal')
    const relatedId = watch('relatedTo')
    const relatedName = data?.contentTemplates.find(
        ({ id }) => id === relatedId
    )?.name
    return (
        <>
            <SmartForm.FieldGroup cols={relatedId ? 2 : 1}>
                <SmartForm.Select
                    label="Related To"
                    name="relatedTo"
                    disabled={disableChangeRelated}
                    data={
                        data?.contentTemplates.map(({ name, id }) => ({
                            label: name,
                            value: id!,
                        })) ?? []
                    }
                    required
                />
                {relatedId && (
                    <SmartForm.BooleanSegmentedControl
                        name="isReciprocal"
                        label={`Show on ${relatedName}`}
                        description={
                            disableChangeReciprocal
                                ? `Cannot be changed once set`
                                : disableReciprocal
                                ? `Not valid on Components or Additional Content`
                                : `Show this property on ${relatedName} as well`
                        }
                        fullWidth
                        disabled={
                            !relatedId ||
                            disableChangeReciprocal ||
                            disableReciprocal
                        }
                    />
                )}
            </SmartForm.FieldGroup>
            {isReciprocal && (
                <SmartForm.TextInput
                    label={`Property Name On ${relatedName}`}
                    name="reciprocalPropertyName"
                    required
                    placeholder={
                        contentTemplate && pluralize(contentTemplate.name)
                    }
                />
            )}
        </>
    )
}
