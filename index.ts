import { users } from './lib/user/endpoints'
import { organisations } from './lib/organisation/endpoints'
import { projects } from './lib/project/endpoints'
import { invitations } from './lib/invitation/endpoints'
import { contentTemplates } from './lib/contentTemplate/endpoints'
import { content } from './lib/content/endpoints'
import { schedule, api, storage, params } from '@serverless/cloud'
import { asset } from './lib/asset/endpoints'
import { field } from './lib/field/endpoints'
import { responses } from './lib/responseSet/endpoints'
import { drawing } from './lib/drawing/endpoints'
import fs from 'fs'
import cors from 'cors'
import ReadableStream = NodeJS.ReadableStream
import invariant from 'tiny-invariant'

schedule.every('60 minutes', async () => {
    console.log('Hello from Serverless Cloud')
})

api.use(cors())

// //* Get Tiled Image Tile */
// api.get(
//     '/images/:imageId/tiled/:region/:size/:rotation/:quality.:format',
//     async (req: any, res: any) => {
//         const { imageId, region, size, rotation, quality, format } = req.params
//         try {
//             const readableStream = (await storage.read(
//                 `files/${imageId}/tiled/${region}/${size}/${rotation}/${quality}.${format}`
//             )) as unknown as ReadableStream

//             readableStream.pipe(res)

//             readableStream.on('error', (err) => {
//                 throw new Error('Error reading file')
//             })
//         } catch (error: any) {
//             console.log(error)
//             return res.status(403).send({
//                 message: error.message,
//             })
//         }
//     }
// )

//x/y/z format
api.get('/drawings/:drawingId/:z/:x/:y', async (req: any, res: any) => {
    const { drawingId, z, x, y } = req.params
    console.log('z,x,y', z, x, y)
    try {
        const readableStream = (await storage.read(
            `files/${drawingId}/tiled/${z}-${x}-${y}.jpg`
        )) as unknown as ReadableStream

        if (readableStream) {
            readableStream.pipe(res)
            readableStream.on('error', (err) => {
                throw new Error('Error reading file')
            })
        } else {
            return res.status(403).send({
                message: 'No image found',
            })
        }
    } catch (error: any) {
        console.log(error)
        return res.status(403).send({
            message: error.message,
        })
    }
})

//* Get Tiled Image Tile */
api.get('/images/:imageId/tiled/info.json', async (req: any, res: any) => {
    const { imageId } = req.params
    try {
        const fileBuffer = await storage.readBuffer(
            `files/${imageId}/tiled/info.json`
        )
        invariant(fileBuffer, 'File not found')
        const json = JSON.parse(fileBuffer.toString())

        //* id requires full url, need to add dynamically, as this changes per instance
        json.id = `${params.CLOUD_URL}/images/${imageId}/tiled`

        return res.status(200).send(json)
    } catch (error: any) {
        console.log(error)
        return res.status(403).send({
            message: error.message,
        })
    }
})

users()
organisations()
invitations()
projects()
contentTemplates()
content()
asset()
field()
responses()
drawing()
