import React from 'react'
import { Property } from '@lib/field/data/field.model'
import { useGetContentTemplate } from '@data/contentTemplate/hooks'
import { Button } from '@mantine/core'
import { groupFromComponent } from '@state/propertyManager'
import { CleanedCamel } from '../../../../type-helpers'
import { ContentTemplate } from '@lib/contentTemplate/data/contentTemplate.model'

type ConvertComponentProps = {
    property: Property<'component'>
    buttonElement?: React.ReactElement
}

export const ConvertComponent = ({
    property,
    buttonElement,
}: ConvertComponentProps) => {
    const { data, isLoading } = useGetContentTemplate(property.componentId!)
    const onClick = (contentTemplate: CleanedCamel<ContentTemplate>) =>
        groupFromComponent(property, contentTemplate)
    return (
        <>
            {buttonElement ? (
                React.cloneElement(buttonElement, {
                    disabled: !data?.contentTemplate,
                    onClick: () =>
                        data?.contentTemplate && onClick(data.contentTemplate),
                })
            ) : (
                <Button
                    fullWidth
                    variant="light"
                    color="blue"
                    disabled={!data?.contentTemplate}
                    loading={isLoading}
                    onClick={() =>
                        data?.contentTemplate && onClick(data.contentTemplate)
                    }
                >
                    Convert to Group
                </Button>
            )}
        </>
    )
}
