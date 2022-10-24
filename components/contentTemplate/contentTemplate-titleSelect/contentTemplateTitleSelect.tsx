import { SmartForm } from '@components/smartForm'
import { useUpdateContentTemplate } from '@data/contentTemplate/hooks'
import { ContentTemplate } from '@lib/contentTemplate/data/contentTemplate.model'
import React from 'react'
import { CleanedCamel } from 'type-helpers'
import { capitalise } from 'utils/stringTransform'
import { Property } from '@lib/field/data/field.model'
import { objectify } from 'radash'
import { parentIsRepeatable } from '@lib/contentTemplate/data/functions/group'

interface ContentTemplateTitleSelectProps {
    contentTemplate: CleanedCamel<ContentTemplate>
}

export const ContentTemplateTitleSelect = ({
    contentTemplate,
}: ContentTemplateTitleSelectProps) => {
    const { mutateAsync } = useUpdateContentTemplate()
    const onSubmit = async ({ title }: { title: string }) => {
        const [type, value] = title.split('-')
        await mutateAsync({
            contentTemplateId: contentTemplate.id,
            title: {
                setType: 'manual',
                type: type as 'contentInfo' | 'contentProperty',
                value,
            },
        })
    }
    const groupMap = objectify(contentTemplate.propertyGroups, (f) => f.id)

    // restrict possible title properties
    const validProperties = contentTemplate.properties.filter(
        (property) =>
            ['date', 'email', 'number', 'text'].includes(property.type) &&
            !parentIsRepeatable({ parentGroupId: property.parent, groupMap })
    )

    const titlePropertyOptions = validProperties.map(({ id, name }) => ({
        label: capitalise(name),
        value: `contentProperty-${id}`,
        group: 'Property Value',
    }))

    return (
        <SmartForm
            formName="Title select"
            onSubmit={onSubmit}
            submitMethod="onChange"
            defaultValues={{
                title: `${contentTemplate.title.type}-${contentTemplate.title.value}`,
            }}
            key={contentTemplate.id}
        >
            <SmartForm.Select
                name="title"
                withinPortal={true}
                label="Title Property"
                description="For content created with this template"
                data={[
                    {
                        label: 'Id',
                        value: 'contentInfo-id',
                        group: 'Content Info',
                    },
                    {
                        label: 'Created At',
                        value: 'contentInfo-createdTime',
                        group: 'Content Info',
                    },
                    {
                        label: 'Edited At',
                        value: 'contentInfo-lastEditedTime',
                        group: 'Content Info',
                    },
                    ...titlePropertyOptions,
                ]}
            />
        </SmartForm>
    )
}
