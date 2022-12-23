import { api, data, storage, WriteResponse, params } from '@serverless/cloud'
import {
    generateUploadLink,
    getAssetById,
    getAssetIdArray,
    getImageUrl,
    getUserAssets,
    PREFIX,
} from '../data'
import { Asset } from '../data/asset.model'
import sharp from 'sharp'
import fs, { read } from 'fs'
import nodePath from 'path'
import { Readable, PassThrough } from 'stream'
import {
    S3Client,
    PutObjectCommand,
    PutObjectCommandOutput,
} from '@aws-sdk/client-s3'

import invariant from 'tiny-invariant'
import { DrawingData } from '../../../state/uploader'
import { Drawing } from '../../../lib/drawing/data/drawing.model'

console.log('process.env.AWS_SECRET_ACCESS_KEY!', params.AWS_SECRET_ACCESS_KEY!)
const client = new S3Client({
    credentials: {
        accessKeyId: params.AWS_ACCESS_KEY_ID!,
        secretAccessKey: params.AWS_SECRET_ACCESS_KEY!,
    },
    region: process.env.AWS_DEFAULT_REGION,
})

async function recursivelyListDir(
    dir: string,
    callback?: (path: string) => void
) {
    await fs.readdir(dir, async (err, files) => {
        for (const file of files) {
            const filePath = nodePath.join(dir, file)
            let isDirectory = fs.statSync(filePath).isDirectory()
            if (isDirectory) {
                await recursivelyListDir(filePath, callback)
            } else {
                callback && callback(filePath)
            }
        }
    })
}

// async function uploadStream(readableStream: Readable, fileName?: string) {
//     console.log('readableStream :>> ', readableStream)
//     const Key = fileName ?? 'filename.pdf'
//     const Bucket = 'build-map-tiled'
//     const passThroughStream = new PassThrough()

//     let res

//     try {
//         const parallelUploads3 = new AwsUpload({
//             client,
//             params: {
//                 Bucket,
//                 Key,
//                 Body: passThroughStream,
//                 ACL: 'public-read',
//             },
//             queueSize: 4,
//             partSize: 1024 * 1024 * 5,
//             leavePartsOnError: false,
//         })

//         readableStream.pipe(passThroughStream)
//         res = await parallelUploads3.done()
//     } catch (e) {
//         console.log(e)
//     }

//     return res
// }

type Upload = {
    id: string
    uid: string
    filename: string
    fileType: string
    ext: string
    userId: string
    type: 'asset' | 'drawing'
    drawingData: DrawingData
    size: number
}

export const asset = () => {
    //* Generate upload link */
    api.post('/upload', async (req: any, res: any) => {
        const { filename, path, drawingData, type } = req.body
        const { user } = req
        try {
            const data = await generateUploadLink({
                filename,
                path,
                userId: user.id,
                type,
                drawingData,
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

    // //* Get Tiled Image Tile */
    // api.get(
    //     '/images/:imageId/tiled/:region/:size/:rotation/:quality.:format',
    //     async (req: any, res: any) => {
    //         const { imageId, region, size, rotation, quality, format } =
    //             req.params
    //         const { user } = req
    //         try {
    //             const url = await storage.getDownloadUrl(
    //                 `files/${imageId}/tiled/${region}/${size}/${rotation}/${quality}.${format}`
    //             )
    //             return res.status(200).send({
    //                 url,
    //             })
    //         } catch (error: any) {
    //             console.log(error)
    //             return res.status(403).send({
    //                 message: error.message,
    //             })
    //         }
    //     }
    // )
    //
    // //* Get Tiled Image Tile */
    // api.get('/images/:imageId/tiled/info.json', async (req: any, res: any) => {
    //     const { imageId } = req.params
    //     const { user } = req
    //     console.log('👉 imageId >>', imageId)
    //     try {
    //         const url = await storage.getDownloadUrl(
    //             `files/${imageId}/tiled/info.json`
    //         )
    //         return res.status(200).send({
    //             url,
    //         })
    //     } catch (error: any) {
    //         console.log(error)
    //         return res.status(403).send({
    //             message: error.message,
    //         })
    //     }
    // })

    const createDirectory = (path: string) => {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true })
        }
    }

    const removeDirectory = async (path: string) => {
        await fs.rm(path, { recursive: true }, (err) => {
            if (err) {
                // File deletion failed
                console.error(err.message)
                return
            }
        })
    }

    const uploadDirectory = async (
        dir: string,
        promiseArray: Promise<WriteResponse>[] = []
    ) => {
        fs.readdir(dir, (err, files) => {
            for (const file of files) {
                const elementPath = nodePath.join(dir, file)
                let isDirectory = fs.statSync(elementPath).isDirectory()
                if (isDirectory) {
                    uploadDirectory(elementPath, promiseArray)
                } else {
                    fs.readFile(elementPath, (err, data) => {
                        if (err) throw err

                        // convert image file to base64-encoded string
                        /*const base64Image =
                            Buffer.from(data).toString('base64')*/

                        promiseArray.push(
                            storage.write(elementPath.slice(5), data)
                        )
                    })
                }
            }
        })

        await Promise.all(promiseArray).catch((error) => console.log(error))
    }

    // After a file is uploaded, create a file item
    storage.on('write:files/**', async ({ path, size }) => {
        const id = path.split('/').pop()

        // Get the associated upload item
        const upload = (await data.get<Upload>(`upload_${id}`)) as Upload

        if (upload) {
            const { filename, fileType, ext, userId, uid, type, drawingData } =
                upload
            console.log('upload', upload)
            if (type === 'drawing') {
                let buffer = await storage.readBuffer(path)

                invariant(buffer, 'no file found')

                const createDrawing = (title: string) => {
                    const newDrawing = new Drawing()
                    newDrawing.filename = filename
                    newDrawing.fileType = fileType
                    newDrawing.ext = ext
                    newDrawing.size = size
                    newDrawing.filePath = path
                    newDrawing.name = title
                    newDrawing.parent = drawingData.groupId
                    newDrawing.collectionId = drawingData.collectionId ?? '0'
                    newDrawing.tiledPath = `https://tf43qhrirlalypcf3vrp65iwzm0zmnmy.lambda-url.eu-west-2.on.aws/iiif/2/${newDrawing.id}/info.json`
                    return newDrawing
                }

                if (ext === 'pdf') {
                    // if pdf has a single page
                    if (!drawingData.pages) {
                        const drawing = createDrawing(drawingData.title)
                        const upload = client.send(
                            new PutObjectCommand({
                                Bucket: 'serverless-pdf-source-bucket',
                                Key: `uploads/${drawing.id}.pdf`,
                                Body: buffer,
                            })
                        )
                        await Promise.all([drawing.save(), upload])
                    } else {
                        //if pdf has multiple pages create a drawing from all active pages
                        const [uploadPromises, drawingPromises] =
                            drawingData.pages!.reduce(
                                (acc, page, i) => {
                                    if (page.active) {
                                        const drawing = createDrawing(
                                            page.title
                                        )
                                        const Key = `uploads/${drawing.id}__${
                                            i //page number
                                        }.pdf`
                                        const upload = client.send(
                                            new PutObjectCommand({
                                                Bucket: 'serverless-pdf-source-bucket',
                                                Key,
                                                Body: buffer,
                                            })
                                        )
                                        acc[0].push(upload)
                                        acc[1].push(drawing.save())
                                    }
                                    return acc
                                },
                                [[], []] as [
                                    Promise<PutObjectCommandOutput>[],
                                    Promise<void>[]
                                ]
                            )
                        await Promise.all([
                            ...uploadPromises,
                            ...drawingPromises,
                        ])
                    }
                } else {
                    const drawing = createDrawing(drawingData.title)

                    const tiffBuffer = await sharp(buffer)
                        .tiff({
                            tile: true,
                            pyramid: true,
                        })
                        .toBuffer()

                    const data = await client.send(
                        new PutObjectCommand({
                            Bucket: 'iiif-tile-source',
                            Key: `${drawing.id}.tif`,
                            Body: tiffBuffer,
                        })
                    )
                    await drawing.save()
                }
            }

            const asset = new Asset({
                id,
                filename,
                fileType,
                path,
                ext,
                size,
                userId,
            })
            await asset.save()
        }
    })

    // After the file item is created we can remove the associated upload item
    data.on(`created:object_Asset:${PREFIX}*`, async ({ item }) => {
        await data.remove(`upload_${item.value.id}`)
    })
}
