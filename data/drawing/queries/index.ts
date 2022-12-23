import { Drawing, DrawingCollection } from '@lib/drawing/data/drawing.model'
import camelcaseKeys from 'camelcase-keys'
import { apiClient } from 'data/config'
import { CleanedSnake } from 'type-helpers'

// export async function getMyDrawings() {
//     const { data } = await apiClient.get<{ drawings: CleanedSnake<Drawing>[] }>(
//         `/api/proxy/me/drawings`
//     )
//     return camelcaseKeys(data, { deep: true })
// }

export async function getDrawing({ drawingId }: { drawingId: string }) {
    const { data } = await apiClient.get<{ drawing: CleanedSnake<Drawing> }>(
        `/api/proxy/drawings/${drawingId}`
    )
    return camelcaseKeys(data, { deep: true })
}

export async function getDrawingCollection({
    collectionId,
}: {
    collectionId: string
}) {
    const { data } = await apiClient.get<{
        drawings: CleanedSnake<Drawing>[]
        collection: CleanedSnake<DrawingCollection>
    }>(`/api/proxy/drawingCollections/${collectionId}`)
    return camelcaseKeys(data, { deep: true })
}

export async function getDrawingCollectionByProject({
    projectId,
}: {
    projectId: string
}) {
    const { data } = await apiClient.get<{
        drawings: CleanedSnake<Drawing>[]
        collection: CleanedSnake<DrawingCollection>
    }>(`/api/proxy/projects/${projectId}/drawingCollection`)
    return camelcaseKeys(data, { deep: true })
}
