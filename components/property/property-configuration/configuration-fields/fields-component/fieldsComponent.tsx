import { SmartForm } from '@components/smartForm'
import { contentTemplateState } from '@state/contentTemplate'
import { useSnapshot } from 'valtio'
import { useGetOrganisationContentTemplates } from '@data/contentTemplate/hooks'
import { useRouter } from 'next/router'
//import { ComponentSelectItem } from "./componentSelectItem";

export const FieldsComponent = () => {
    const { query } = useRouter()
    const { orgId } = query
    const { data } = useGetOrganisationContentTemplates(orgId as string)

    const { contentTemplateId } = useSnapshot(contentTemplateState)

    const components = data?.contentTemplates.reduce<
        { label: string; value: string; disabled: boolean }[]
    >((acc, template) => {
        const isInTemplate = template.properties.some(
            (property) =>
                property.type === 'component' &&
                property.componentId === contentTemplateId
        )
        const nonPublished = template.status !== 'published'
        if (
            template.templateType === 'component' &&
            template.id !== contentTemplateId
        ) {
            acc.push({
                label: `${template.name}${
                    isInTemplate
                        ? ' - disabled(components cannot reference each other)'
                        : nonPublished
                        ? ` - disabled(publish to use)`
                        : ''
                }`,
                value: template.id,
                disabled: isInTemplate || nonPublished,
            })
        }
        return acc
    }, [])

    return (
        <>
            <SmartForm.Select
                name="componentId"
                label="Select Component"
                required
                //itemComponent={ComponentSelectItem}
                data={components ?? []}
            />
            <SmartForm.Checkbox
                name="repeatable"
                label="Repeatable"
                description={''}
            />
        </>
    )
}
