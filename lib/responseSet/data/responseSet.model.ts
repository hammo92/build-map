import { BaseModel } from '../../../lib/models'
import { buildIndex, indexBy } from 'serverless-cloud-data-utils'
import { FieldCollection } from '@lib/field/data/field.model'

export type Option = {
    value: string
    label: string
    color: string
}

// To get responseSet by it's ID *//
//namespace responseSet:${responseSetId} */
export const ResponseSetId = buildIndex({
    namespace: `responseSet`,
    label: 'label1',
})

// To get ResponseSet collection *//
//namespace responseSetCollection_${parentId}:responseSets:${responseSetId}
export const ResponseSetCollection = (parentId: string) =>
    buildIndex({
        namespace: `responseSetCollection_${parentId}:responseSets`,
        label: 'label2',
    })

export class ResponseSet extends BaseModel<ResponseSet> {
    object = 'ResponseSet'
    options: Option[]
    modelKeys() {
        return [
            indexBy(ResponseSetId).exact(this.id),
            ...(this.parent
                ? [indexBy(ResponseSetCollection(this.parent)).exact(this.id)]
                : []),
        ]
    }
}
