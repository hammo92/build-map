import React from 'react'
import { copyGroup, replaceGroupWithComponent } from '@state/propertyManager'
import { useRouter } from 'next/router'
import { ContentTemplateCreate } from '@components/contentTemplate/contentTemplate-create'
import { CleanedCamel } from '../../../../type-helpers'
import { ContentTemplate } from '@lib/contentTemplate/data/contentTemplate.model'
import { TreeItem } from '@atlaskit/tree'

type ConvertComponentProps = {
    group: TreeItem
    buttonElement?: React.ReactElement
}

export const ConvertGroup = ({
    group,
    buttonElement,
}: ConvertComponentProps) => {
    const { query } = useRouter()
    const { orgId } = query

    const { propertyGroups, properties } = copyGroup({
        groupId: group.id,
        rebase: true,
    })

    const onCreate = (template: CleanedCamel<ContentTemplate>) => {
        replaceGroupWithComponent({
            groupId: `${group.id}`,
            componentId: template.id,
        })
    }

    return (
        <ContentTemplateCreate
            templateType={'component'}
            organisationId={orgId as string}
            properties={properties}
            propertyGroups={propertyGroups}
            buttonElement={buttonElement}
            title={'Convert to component'}
            onCreate={onCreate}
            status={'published'}
        />
    )
}
