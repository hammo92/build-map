import { api, data } from '@serverless/cloud'
import camelcaseKeys from 'camelcase-keys'
import {
    deleteRelation,
    updateRelation,
} from '../../../lib/content/data/functions/relation'
import {
    createField,
    deleteField,
    deleteFieldCollection,
    getField,
    getFieldCollection,
    updateField,
} from '../data'

export const field = () => {
    //* Create field */
    api.post('/fields', async function (req: any, res: any) {
        const { config } = req.body
        try {
            const { user } = req
            const newField = await createField({
                userId: user.id,
                config,
            })
            return res.status(200).send({
                field: newField && newField.clean(),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Get field by id*/
    api.get(`/fields/:fieldId`, async function (req: any, res: any) {
        const { fieldId } = req.params
        const { user } = req
        try {
            const field = await getField({ fieldId, userId: user.id })
            return res.status(200).send({
                field: field && field.clean(),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Get field collection*/
    api.get(
        `/fields/collections/:collectionId`,
        async function (req: any, res: any) {
            const { collectionId } = req.params
            const { user } = req
            try {
                const fields = await getFieldCollection({
                    collectionId,
                    userId: user.id,
                })
                return res.status(200).send({
                    fields: fields && fields.map((field) => field.clean()),
                })
            } catch (error: any) {
                console.log(error)
                return res.status(403).send({
                    message: error.message,
                })
            }
        }
    )

    //* Delete field by id*/
    api.delete(`/fields/:fieldId`, async function (req: any, res: any) {
        const { fieldId } = req.params
        const { user } = req
        try {
            const field = await deleteField({ fieldId, userId: user.id })
            return res.status(200).send({
                field: field && field.clean(),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Update field status*/
    api.patch(`/fields/:fieldId/status`, async function (req: any, res: any) {
        const { fieldId } = req.params
        const { config } = req.body
        const { user } = req
        try {
            const field = await updateField({
                fieldId,
                userId: user.id,
                config,
            })
            return res.status(200).send({
                field: field && field.clean(),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    /** Remove all fields when content is deleted */
    data.on('deleted:object_Content:*', async (event) => {
        await deleteFieldCollection(event.item.value.id)
    })

    /** Remove all fields when content is deleted */
    data.on('deleted:object_Field:*', async (event) => {
        //await deleteFieldCollection(event.item.value.id);
    })

    /** Handle updated for fields with relations */
    data.on('updated:object_Field:*', async (event) => {
        const { item, previous } = event
        if (item.value.type === 'relation') {
            await updateRelation({
                field: camelcaseKeys(item.value, { deep: true }),
                prevField: camelcaseKeys(previous.value, { deep: true }),
            })
        }
    })

    /** Handle updated for fields with relations */
    data.on('deleted:object_Field:*', async (event) => {
        const { item } = event
        if (item.value.type === 'relation') {
            await deleteRelation({
                field: camelcaseKeys(item.value, { deep: true }),
            })
        }
    })
}
