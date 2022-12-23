import { indexBy } from 'serverless-cloud-data-utils'
import { errorIfUndefined } from '../../utils'
import {
    CollectionDrawings,
    Drawing,
    DrawingCollection,
    DrawingCollectionId,
    DrawingCollectionParent,
    DrawingId,
    UserDrawingsWithTypeFilter,
} from './drawing.model'

//* Get drawing by id */
export async function getDrawingById(drawingId: string) {
    errorIfUndefined({ drawingId })
    const [drawing] = await indexBy(DrawingId).exact(drawingId).get(Drawing)
    if (!drawing) {
        throw new Error('No drawing found with that Id')
    }
    return drawing
}

//* Get drawingCollection by id */
export async function getDrawingCollection(collectionId: string) {
    errorIfUndefined({ collectionId })
    const [drawingCollection] = await indexBy(DrawingCollectionId)
        .exact(collectionId)
        .get(DrawingCollection)
    if (!drawingCollection) {
        throw new Error('No drawing collection found with that Id')
    }
    return drawingCollection
}

//* Get drawingCollection by parent Id */
export async function getDrawingCollectionByProject(parentId: string) {
    errorIfUndefined({ parentId })
    const [drawingCollection] = await indexBy(DrawingCollectionParent)
        .exact(parentId)
        .get(DrawingCollection)
    if (!drawingCollection) {
        throw new Error('No drawing collection found with that Id')
    }
    return drawingCollection
}

//* Get drawings in collection */
export async function getCollectionDrawings(collectionId: string) {
    errorIfUndefined({ collectionId })
    const drawings = await indexBy(CollectionDrawings(collectionId)).get(
        Drawing
    )
    if (!drawings) {
        throw new Error('No drawing collection found with that Id')
    }
    return drawings
}

//* Get drawings array ids */
export async function getDrawingIdArray(drawingIds: string[]) {
    if (!drawingIds.length) {
        throw new Error('at least one id is required')
    }
    const drawings = await Promise.all(drawingIds.map(getDrawingById))
    if (!drawings) {
        throw new Error('No drawings found')
    }
    return drawings
}

//* Get user drawings */
export async function getUserDrawings(userId: string) {
    errorIfUndefined({ userId })
    return await indexBy(UserDrawingsWithTypeFilter({ userId })).get(Drawing)
}
