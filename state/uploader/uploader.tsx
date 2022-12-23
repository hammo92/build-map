import { apiClient } from '@data/config'
import axios from 'axios'
import { getPdfPages } from 'utils/file'
import { proxy, ref } from 'valtio'

type Upload = {
    file: File
    percentUploaded: number
    uploading: boolean
}

export type DrawingData = {
    title: string
    pageLength?: number
    pages?: Page[]
    groupId: string
    collectionId: string
}

type Page = {
    title: string
    active: boolean
}

type callback = (assetIds: string[]) => void
export interface UploadStateProps {
    uploads: Upload[]
    busy: boolean
    multiple: boolean
    errorMessage?: string
    type?: 'asset' | 'drawing'
    drawingData?: DrawingData[]
    uploadSingleFile: ({
        file,
        index,
        path,
        onUpload,
        drawingData,
    }: {
        file: File
        index: number
        path?: string
        onUpload?: callback
        drawingData?: DrawingData
    }) => void
    upload: ({ path, onUpload }: { path?: string; onUpload?: callback }) => void
    updateDrawingData: (data: DrawingData, index: number) => void
    updateDrawingPageData: (data: Page, index: number, page: number) => void
    addUploads: (files: File[], groupId?: string, collectionId?: string) => void
    removeUploads: (...indices: number[]) => void
    clearUploads: () => void
    uploaded: string[]
}

export const UploadState = proxy<UploadStateProps>({
    uploads: [],
    busy: false,
    multiple: false,
    uploaded: [],
    drawingData: [],
    uploadSingleFile: async ({ file, index, path, onUpload, drawingData }) => {
        UploadState.busy = true
        UploadState.uploads[index].uploading = true
        const { data } = await apiClient.post(
            '/api/proxy/upload',
            {
                filename: file.name,
                path,
                type: UploadState.type,
                drawingData,
            },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        )
        const { url, id } = data
        await axios.put(url, file, {
            headers: {
                'Content-Type': file.type,
            },
            onUploadProgress: (p) => {
                UploadState.uploads[index].percentUploaded = Math.floor(
                    (p.loaded / p.total) * 100
                )
            },
        })

        UploadState.uploads[index].uploading = false
        UploadState.uploaded = [...UploadState.uploaded, id]
        onUpload && onUpload(UploadState.uploaded)

        UploadState.busy =
            UploadState.uploads.filter(({ uploading }) => uploading).length > 0
    },

    upload: async ({ path, onUpload }) => {
        UploadState.uploads.forEach(
            ({ file, percentUploaded, uploading }, index) => {
                if (percentUploaded === 0 && !uploading) {
                    UploadState.uploadSingleFile({
                        file,
                        index,
                        path,
                        onUpload,
                        drawingData: UploadState?.drawingData?.[index],
                    })
                }
            }
        )
    },

    updateDrawingData: (data, index) => {
        if (UploadState?.drawingData?.[index]) {
            UploadState.drawingData[index] = data
        }
    },

    updateDrawingPageData: (data, index, page) => {
        if (UploadState?.drawingData?.[index]?.pages?.[page]) {
            UploadState!.drawingData![index]!.pages![page] = {
                ...UploadState!.drawingData![index]!.pages![page],
                ...data,
            }
        }
    },

    addUploads: async (files, groupId = '1', collectionId = '') => {
        if (!UploadState.multiple) UploadState.clearUploads()
        files.forEach(async (file) => {
            // set initial drawing info
            if (UploadState.type === 'drawing') {
                const nameArr = file.name.split('.')
                nameArr.pop()
                const fileName = nameArr.join(' ')

                const drawingInfo: DrawingData = {
                    title: fileName,
                    groupId,
                    collectionId,
                }

                if (file.type === 'application/pdf') {
                    const pageCount = await getPdfPages(file)

                    if (pageCount && pageCount > 1) {
                        drawingInfo.pageLength = pageCount
                        // set active page array to contain all pages eg. [1,2,3]
                        drawingInfo.pages = Array.from(
                            { length: pageCount },
                            (_, i) => ({
                                active: true,
                                title: `${fileName}(${i + 1})`,
                            })
                        )
                    }
                }
                UploadState.drawingData?.push(drawingInfo)
            }

            // add files
            UploadState.uploads.push({
                file: ref(file),
                percentUploaded: 0,
                uploading: false,
            })
        })
    },

    removeUploads: (...indices: number[]) => {
        indices.forEach((index) => {
            UploadState.uploads.splice(index, 1)
            UploadState?.drawingData?.splice(index, 1)
        })
    },

    clearUploads: () => {
        UploadState.uploads = []
        UploadState.uploaded = []
        UploadState.drawingData = []
    },
})

export default UploadState
