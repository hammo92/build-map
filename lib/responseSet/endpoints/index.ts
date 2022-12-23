import { api } from '@serverless/cloud'
import {
    createResponseSet,
    deleteResponseSet,
    getResponseSet,
    getResponseSetCollection,
    updateResponseSet,
} from '../../../lib/responseSet/data'

export const responses = () => {
    //* Create ResponseSet */
    api.post('/responseSets', async function (req: any, res: any) {
        try {
            const { user } = req
            const responseSet = await createResponseSet({
                ...req.body,
                userId: user.id,
            })
            return res.status(200).send({
                responseSet: responseSet && responseSet.clean(),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Get ResponseSet */
    api.get(
        '/responseSets/:responseSetId',
        async function (req: any, res: any) {
            try {
                const { user } = req
                const { responseSetId } = req.params
                const responseSet = await getResponseSet({
                    responseSetId,
                    userId: user.id,
                })
                return res.status(200).send({
                    responseSet: responseSet && responseSet.clean(),
                })
            } catch (error: any) {
                console.log(error)
                return res.status(403).send({
                    message: error.message,
                })
            }
        }
    )

    //* Get ResponseSet Collection*/
    api.get(
        '/responseSets/collections/:collectionId',
        async function (req: any, res: any) {
            try {
                const { user } = req
                const { collectionId } = req.params
                const responseSets = await getResponseSetCollection({
                    collectionId,
                    userId: user.id,
                })
                return res.status(200).send({
                    responseSets:
                        responseSets &&
                        responseSets.map((responseSet) => responseSet.clean()),
                })
            } catch (error: any) {
                console.log(error)
                return res.status(403).send({
                    message: error.message,
                })
            }
        }
    )

    //* Update ResponseSet */
    api.patch(
        '/responseSets/:responseSetId',
        async function (req: any, res: any) {
            try {
                const { user } = req
                const { responseSetId } = req.params
                const responseSet = await updateResponseSet({
                    responseSetId,
                    userId: user.id,
                    ...req.body,
                })
                return res.status(200).send({
                    responseSet: responseSet && responseSet.clean(),
                })
            } catch (error: any) {
                console.log(error)
                return res.status(403).send({
                    message: error.message,
                })
            }
        }
    )

    //* Delete ResponseSet */
    api.delete(
        '/responseSets/:responseSetId',
        async function (req: any, res: any) {
            try {
                const { user } = req
                const { responseSetId } = req.params
                const responseSet = await deleteResponseSet({
                    responseSetId,
                    userId: user.id,
                })
                return res.status(200).send({
                    responseSet: responseSet && responseSet.clean(),
                })
            } catch (error: any) {
                console.log(error)
                return res.status(403).send({
                    message: error.message,
                })
            }
        }
    )
}
