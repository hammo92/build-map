import { data, storage } from '@serverless/cloud'
import mime from 'mime-types'
import path from 'path'
import { indexBy } from 'serverless-cloud-data-utils'
import sharp from 'sharp'
import { ulid } from 'ulid'
import { errorIfUndefined } from '../../utils'
import { Asset, AssetId, UserAssetsWithTypeFilter } from './asset.model'
import invariant from 'tiny-invariant'
import { DrawingData } from '@state/uploader'

//* Get asset by id */
export async function getAssetById(assetId: string) {
    errorIfUndefined({ assetId })
    const [asset] = await indexBy(AssetId).exact(assetId).get(Asset)
    if (!asset) {
        throw new Error('No asset found with that Id')
    }
    return asset
}

//* Get assets array ids */
export async function getAssetIdArray(assetIds: string[]) {
    if (!assetIds.length) {
        throw new Error('at least one id is required')
    }
    const assets = await Promise.all(assetIds.map(getAssetById))
    if (!assets) {
        throw new Error('No assets found')
    }
    return assets
}

//* Get user assets */
export async function getUserAssets(userId: string) {
    errorIfUndefined({ userId })
    return await indexBy(UserAssetsWithTypeFilter({ userId })).get(Asset)
}

export const PREFIX = 'asset_'

export async function generateUploadLink({
    filename,
    path,
    userId,
    type = 'asset',
    drawingData,
}: {
    filename: string
    path: string
    userId: string
    type?: 'asset' | 'drawing'
    drawingData: DrawingData
}) {
    errorIfUndefined({ filename, userId })
    const fileType = mime.lookup(filename)
    if (!fileType) {
        throw new Error('Invalid file type')
    }
    const ext = mime.extension(fileType)

    // Create a sortable unique ID for the file
    const uid = ulid().toLowerCase()
    const id = `${PREFIX}${uid}.${ext}`

    // Create an upload item in data
    await data.set(
        `upload_${id}`,
        {
            id,
            uid,
            filename,
            fileType,
            ext,
            userId,
            type,
            drawingData,
        },
        {
            // Remove the item after an hour if the upload doesn't succeed
            ttl: 3600,
        }
    )

    // Return a temporary upload URL
    const uploadUrl = await storage.getUploadUrl(
        path ? `files/${path}/${uid}/${id}` : `files/${uid}/${id}`
    )
    return { id, filename, fileType, ext, userId, url: uploadUrl }
}

export async function getImageUrl({
    imageId,
    width,
    height,
    userId,
}: {
    imageId: string
    width?: number
    height?: number
    userId: string
}) {
    const { name, ext } = path.parse(imageId)

    // prefix used to remove upload entry in data
    // not needed for serverside uploads
    const nameNoPrefix = name.replace(PREFIX, '')

    // generate id from query and get potential storedFile item
    const resizedImageId = `${nameNoPrefix}${width ? `-w${width}` : ''}${
        height ? `-h${height}` : ''
    }${ext}`

    // check if queried image exists if true return link
    const [requestedImage] = await indexBy(AssetId)
        .exact(resizedImageId)
        .get(Asset)
    if (requestedImage) {
        return await storage.getDownloadUrl(requestedImage.path)
    }

    // get asset data for root image
    const asset = await getAssetById(imageId)

    // get parent directory of file
    const filePath = `${asset.path.replace(imageId, '')}`

    // get file buffer
    const file = await storage.readBuffer(asset.path)
    invariant(file, 'file not found')

    // process with sharp
    const sharpImage = sharp(file)
    if (!sharpImage.stats()) {
        throw new Error('File is not an image')
    }
    const resized = await sharpImage
        .resize({ height, width })
        .withMetadata()
        .toBuffer()

    // upload image
    const resizedFilePath = `${filePath}${resizedImageId}`
    await storage.write(resizedFilePath, resized)

    // create file item in data
    // Create a file item in data
    const newFile = new Asset({
        userId,
        id: resizedImageId,
        filename: resizedImageId,
        fileType: asset.type,
        path: resizedFilePath,
        ext: asset.ext,
    })
    await newFile.save()

    return await storage.getDownloadUrl(resizedFilePath)
}
