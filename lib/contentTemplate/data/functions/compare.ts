import { ContentTemplate } from '@lib/contentTemplate/data/contentTemplate.model'
import { Note } from '@lib/historyEntry/data/historyEntry.model'
import {
    arrayDifferenceAsymmetric,
    arrayIntersection,
} from '../../../../utils/array'

export function compareTemplates(
    template1: ContentTemplate,
    template2: ContentTemplate
) {
    const deletedProperties: ContentTemplate['properties'] =
        arrayDifferenceAsymmetric(template1.properties, template2.properties)
    const addedProperties: ContentTemplate['properties'] =
        arrayDifferenceAsymmetric(template2.properties, template1.properties)

    const deletedGroups: ContentTemplate['propertyGroups'] =
        arrayDifferenceAsymmetric(
            template1.propertyGroups,
            template2.propertyGroups
        )
    const addedGroups: ContentTemplate['propertyGroups'] =
        arrayDifferenceAsymmetric(
            template2.propertyGroups,
            template1.propertyGroups
        )

    const changes = arrayIntersection(
        template1.properties,
        template2.properties
    )
}
