import { SmartForm } from '@components/smartForm'
import { useGetProjectContentOfType } from '@data/content/hooks'
import { useRouter } from 'next/router'
import { FieldProps } from '../../types'

/** Links to another content instance, value is content instance id */
export const FieldTypeRelation = ({
    field,
    ...rest
}: FieldProps<'relation'>) => {
    const { query } = useRouter()
    const { projectId } = query
    const { data, isLoading } = useGetProjectContentOfType({
        contentTemplateId: field.relatedTo!,
        projectId: projectId as string,
    })
    return (
        <SmartForm.EditableList
            name={field.id}
            label={field.name}
            editable
            draggable
            placeholder={`Select ${data?.contentTemplate.name}`}
            loading={isLoading}
            data={
                data?.content.map((content) => ({
                    label: content.title,
                    value: content.id,
                    ...content,
                })) ?? []
            }
            defaultValue={field.defaultValue}
            value={field.value}
            {...rest}
        />
    )
}

//data={data?.content.map(({name, id}) => ({value:id, label:name}))}
