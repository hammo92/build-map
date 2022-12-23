import { BaseModel } from '../../../lib/models'
import {
    buildIndex,
    indexBy,
    Model,
    SecondaryExact,
    timekey,
} from 'serverless-cloud-data-utils'

// To get an drawing by it's ID *//
//namespace drawing:${drawingId} */
export const DrawingId = buildIndex({ namespace: `drawing`, label: 'label1' })

// To get all drawings created by a user filterable by type //
//namespace user_${userId}:drawings:type
export const UserDrawingsWithTypeFilter = ({ userId }: { userId: string }) =>
    buildIndex({
        namespace: `user_${userId}:drawings`,
        label: 'label2',
    })

// To get all drawings in a collection //
//namespace drawingCollection_${collectionId}:drawings:${drawingId}
export const CollectionDrawings = (collectionId: string) =>
    buildIndex({
        namespace: `drawingCollection_${collectionId}:drawings`,
        label: 'label3',
    })

//model: Drawing */
export class Drawing extends BaseModel<Drawing> {
    object = 'Drawing'
    collectionId: string
    filename: string
    fileType: string
    filePath: string
    tiledPath: string
    ext: string
    size: number
    modelKeys() {
        return [
            indexBy(DrawingId).exact(this.id),
            indexBy(CollectionDrawings(this.collectionId)).exact(this.id),
            // only index uploaded files by user, exclude generated sizes
            ...(this.id.includes('drawing_')
                ? [
                      indexBy(
                          UserDrawingsWithTypeFilter({
                              userId: this.createdBy,
                          })
                      ).exact(this.fileType),
                  ]
                : []),
        ]
    }
}

export interface DrawingGroup {
    type: 'drawingGroup'
    id: string | number
    children: (string | number)[]
    name: string
    parent?: string
    disabled?: boolean
}

// To get an drawingCollection by it's ID *//
//namespace drawingCollection:${drawingCollectionId} */
export const DrawingCollectionId = buildIndex({
    namespace: `drawingCollection`,
    label: 'label1',
})

// To get an drawingCollection by parent's ID *//
//namespace drawingCollectionParent:${drawingCollectionParentId} */
export const DrawingCollectionParent = buildIndex({
    namespace: `drawingCollectionParent`,
    label: 'label2',
})

export class DrawingCollection extends BaseModel<DrawingCollection> {
    object = 'DrawingCollection'
    groups: DrawingGroup[]
    modelKeys() {
        return [
            indexBy(DrawingId).exact(this.id),
            ...(this.parent
                ? [indexBy(DrawingCollectionParent).exact(this.parent)]
                : []),
        ]
    }
}
