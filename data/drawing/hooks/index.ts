import { Drawing, DrawingCollection } from '@lib/drawing/data/drawing.model'
import { useQuery, QueryOptions, useQueries } from 'react-query'
import { CleanedCamel } from 'type-helpers'
import { Keys } from '../constants'
import {
    getDrawing,
    getDrawingCollection,
    getDrawingCollectionByProject,
} from '../queries'

// export function useGetMyDrawings() {
//     return useQuery(Keys.GET_MY_ASSETS, () => getMyDrawings(), {
//         //refetchInterval: 1000,
//     });
// }

export function useGetDrawing({
    drawingId,
    initialData,
}: {
    drawingId: string
    initialData?: CleanedCamel<Drawing>
}) {
    return useQuery(
        [Keys.GET_DRAWING, drawingId],
        () => getDrawing({ drawingId }),
        {
            //refetchInterval: 1000,
            initialData: {
                drawing: initialData,
            },
        }
    )
}

export function useGetDrawingCollection({
    collectionId,
    initialData,
    enabled,
}: {
    collectionId: string
    initialData?: {
        collection: CleanedCamel<DrawingCollection>
        drawings: CleanedCamel<Drawing>[]
    }
    enabled?: boolean
}) {
    return useQuery(
        [Keys.GET_DRAWING_COLLECTION, collectionId],
        () => getDrawingCollection({ collectionId }),
        {
            //refetchInterval: 1000,
            initialData,
            enabled,
        }
    )
}

export function useGetDrawingCollectionByProject({
    projectId,
    initialData,
    enabled,
}: {
    projectId: string
    initialData?: {
        collection: CleanedCamel<DrawingCollection>
        drawings: CleanedCamel<Drawing>[]
    }
    enabled?: boolean
}) {
    return useQuery(
        [Keys.GET_DRAWING_COLLECTION_BY_PARENT, projectId],
        () => getDrawingCollectionByProject({ projectId }),
        {
            //refetchInterval: 1000,
            initialData,
            enabled,
        }
    )
}

getDrawingCollectionByProject
