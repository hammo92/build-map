import { api, data, storage } from '@serverless/cloud'
import {
    generateUploadLink,
    getAssetById,
    getAssetIdArray,
    getImageUrl,
    getUserAssets,
    PREFIX,
} from '../data'
import { Asset } from '../data/asset.model'
import { Content } from '../../../lib/content/data/content.model'

type Upload = {
    id: string
    filename: string
    fileType: string
    ext: string
    userId: string
    size: number
}

export const asset = () => {
    //* Generate upload link */
    api.post('/api/upload', async (req: any, res: any) => {
        const { filename, path } = req.body
        const { user } = req
        try {
            const data = await generateUploadLink({
                filename,
                path,
                userId: user.id,
            })
            return res.status(200).send({
                ...data,
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Get asset by id */
    api.get('/assets/:assetId', async (req: any, res: any) => {
        const { assetId } = req.params
        const { user } = req
        try {
            const asset = await getAssetById(assetId)
            return res.status(200).send({
                asset: asset.clean(),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Get asset with array of ids */
    api.get('/assets', async (req: any, res: any) => {
        const assetIds = req.query.ids.split(',')
        const { user } = req
        try {
            const assets = await getAssetIdArray(assetIds)
            return res.status(200).send({
                assets: assets && assets.map((asset) => asset.clean()),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Get user assets */
    api.get('/me/assets', async (req: any, res: any) => {
        const { user } = req
        try {
            const assets = await getUserAssets(user.id)
            return res.status(200).send({
                assets: assets && assets.map((asset) => asset.clean()),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Get Image Url */
    api.get('/images/:imageId', async (req: any, res: any) => {
        const imageId = req.params.imageId
        const width = parseInt(req.query.w) || undefined
        const height = parseInt(req.query.h) || undefined
        const { user } = req
        try {
            const url = await getImageUrl({
                imageId,
                width,
                height,
                userId: user.id,
            })
            return res.status(200).send({
                url,
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    // After a file is uploaded, create a file item
    storage.on('write:files/**', async ({ path, size }) => {
        const id = path.split('/').pop()

        // Get the associated upload item
        const upload = (await data.get<Upload>(`upload_${id}`)) as Upload
        console.log('👉 upload >>', upload)

        if (upload) {
            const { filename, fileType, ext, userId } = upload
            const asset = new Asset({
                id,
                filename,
                fileType,
                path,
                ext,
                size,
                userId,
            })
            console.log('👉 file >>', asset)
            await asset.save()
        }
    })

    // After the file item is created we can remove the associated upload item
    data.on(`created:object_Asset:${PREFIX}*`, async ({ item }) => {
        console.log('created', item)
        await data.remove(`upload_${item.value.id}`)
    })
}
