import { Button, Group } from '@mantine/core'
import { DropzoneProps } from '@mantine/dropzone'
import { useModals } from '@mantine/modals'
import Uploader, { UploadState } from '@state/uploader/uploader'
import { useSnapshot } from 'valtio'
import { DRAWING_MIME_TYPES } from '../drawingUpload/mimeTypes'
import { FileUploadDropzone } from './fileUpload-Dropzone'
import { FileUploadList } from './fileUpload-list'

type TypeValue = 'asset' | 'drawing'

export type ImageUploadProps<T extends 'asset' | 'drawing' = 'asset'> = Omit<
    DropzoneProps,
    'children' | 'onDrop' | 'accept'
> & {
    path?: string
    onUpload: (fileIds: string[]) => void
    onCancel?: () => void
    value?: string[]
    type?: T
    accept?: T extends 'drawing' ? never : DropzoneProps['accept']
    collectionId?: T extends 'drawing' ? string : never
    groupId?: T extends 'drawing' ? string : never
}

const UploadManager = <T extends TypeValue>({
    maxSize,
    disabled,
    multiple,
    onUpload,
    onCancel,
    path,
    type,
    accept,
    groupId,
    collectionId,
    ...others
}: Omit<ImageUploadProps<T>, 'onDrop'>) => {
    UploadState.type = type
    UploadState.multiple = multiple ?? false
    const {
        uploads,
        addUploads,
        busy,
        upload,
        drawingData,
        type: sType,
        ...rest
    } = useSnapshot(Uploader)
    const handleDrop = (files: File[]) => {
        addUploads(files, groupId, collectionId)
    }
    const notUploaded = uploads.filter(
        ({ percentUploaded, uploading }) => percentUploaded === 0 && !uploading
    )

    return (
        <div>
            <FileUploadDropzone
                onDrop={handleDrop}
                multiple={multiple}
                maxSize={maxSize}
                accept={type === 'drawing' ? DRAWING_MIME_TYPES : accept}
                {...others}
            />
            {uploads.length ? (
                <>
                    <FileUploadList />
                    <Group position="apart">
                        <Button color="gray" disabled={busy} onClick={onCancel}>
                            Back
                        </Button>
                        <Button
                            disabled={busy || notUploaded.length === 0}
                            loading={busy}
                            onClick={() =>
                                upload({ onUpload, ...(path && { path }) })
                            }
                        >
                            Upload
                        </Button>
                    </Group>
                </>
            ) : null}
        </div>
    )
}

export const FileUpload = <T extends TypeValue>({
    multiple,
    maxSize,
    onUpload,
    value,
    type,
    ...others
}: ImageUploadProps<T>) => {
    const modals = useModals()
    const openUploadManagerModal = () => {
        modals.openModal({
            size: 'xl',
            title:
                type === 'asset'
                    ? `Add new asset${multiple ? 's' : ''}`
                    : `Add new drawings`,
            //id: "assetManagerModal",
            closeOnClickOutside: false,
            onClose: () => {
                Uploader.clearUploads()
            },
            zIndex: 999999999999,
            children: (
                <UploadManager
                    onUpload={onUpload}
                    multiple={multiple}
                    maxSize={maxSize}
                    onCancel={() => modals.closeModal('assetManagerModal')}
                    type={type}
                    {...others}
                />
            ),
        })
    }

    return (
        <Button
            size="xs"
            variant="subtle"
            onClick={() => openUploadManagerModal()}
        >
            {`${value?.length && !multiple ? 'Change' : 'Add'} Asset${
                multiple ? 's' : ''
            }`}
        </Button>
    )
}
