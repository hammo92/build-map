import { api } from '@serverless/cloud'
import {
    getCollectionDrawings,
    getDrawingById,
    getDrawingCollection,
    getDrawingCollectionByProject,
    getDrawingIdArray,
    getUserDrawings,
} from '../data'

type Upload = {
    id: string
    filename: string
    fileType: string
    ext: string
    userId: string
    size: number
}

export const drawing = () => {
    //* Get drawing by id */
    api.get('/drawings/:drawingId', async (req: any, res: any) => {
        const { drawingId } = req.params
        const { user } = req
        try {
            const drawing = await getDrawingById(drawingId)
            return res.status(200).send({
                drawing: drawing.clean(),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Get drawing with array of ids */
    api.get('/drawings', async (req: any, res: any) => {
        const drawingIds = req.query.ids.split(',')
        const { user } = req
        try {
            const drawings = await getDrawingIdArray(drawingIds)
            return res.status(200).send({
                drawings:
                    drawings && drawings.map((drawing) => drawing.clean()),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Get drawing collection */
    api.get('/drawingCollections/:collectionId', async (req: any, res: any) => {
        const { collectionId } = req.params
        const { user } = req
        try {
            const collection = await getDrawingCollection(collectionId)
            const drawings = await getCollectionDrawings(collectionId)

            return res.status(200).send({
                collection: collection && collection.clean(),
                drawings:
                    drawings && drawings.map((drawing) => drawing.clean()),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Get project drawing collection */
    api.get(
        '/projects/:projectId/drawingCollection',
        async (req: any, res: any) => {
            const { projectId } = req.params
            const { user } = req
            try {
                const collection = await getDrawingCollectionByProject(
                    projectId
                )
                const drawings = await getCollectionDrawings(collection.id)

                return res.status(200).send({
                    collection: collection && collection.clean(),
                    drawings:
                        drawings && drawings.map((drawing) => drawing.clean()),
                })
            } catch (error: any) {
                console.log(error)
                return res.status(403).send({
                    message: error.message,
                })
            }
        }
    )

    //* Get user drawings */
    api.get('/me/drawings', async (req: any, res: any) => {
        const { user } = req
        try {
            const drawings = await getUserDrawings(user.id)
            return res.status(200).send({
                drawings:
                    drawings && drawings.map((drawing) => drawing.clean()),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })
}
