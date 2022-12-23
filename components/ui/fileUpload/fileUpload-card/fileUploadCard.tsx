import {
    faCheck,
    faCheckCircle,
    faLeft,
    faTrash,
} from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    ActionIcon,
    Badge,
    Box,
    Card,
    Group,
    MantineSize,
    Progress,
    Text,
    Center,
    ThemeIcon,
    Stack,
    TextInput,
    Checkbox,
} from '@mantine/core'
import { DrawingData, UploadState } from '@state/uploader'
import { mimeCategory } from 'utils/asset'
import { useSnapshot } from 'valtio'
import { FileUploadPreview } from '../fileUpload-preview'
import { useStyles } from './styles'
import PdfViewer from '@components/ui/reactPdf'
import { useCallback } from 'react'
import { PdfViewerProps } from '@components/ui/reactPdf/reactPdf'
import { CardDrawingDetails } from './card-drawingDetails'

interface FileUploadCardProps {
    file: File
    index: number
    size?: MantineSize
    remove: () => void
    uploading: boolean
    percentageUploaded: number
    drawingData?: DrawingData
}

const previewHeight = (size: MantineSize | undefined) => {
    switch (size) {
        case 'xs':
            return 50
        case 'sm':
            return 75
        case 'md':
            return 100
        case 'lg':
            return 150
        case 'xl':
            return 200
        default:
            return 100
    }
}

const UploadingOverlay = ({
    uploading,
    percentageUploaded,
}: {
    uploading: boolean
    percentageUploaded: number
}) => {
    const { classes } = useStyles()
    const uploaded = percentageUploaded === 100
    if (uploading || uploaded)
        return (
            <div className={classes.uploadOverlay}>
                <div className={classes.uploadProgressContainer}>
                    <div className={classes.uploadingText}>
                        {!uploaded ? (
                            <Text>{`${percentageUploaded}%`}</Text>
                        ) : (
                            <ThemeIcon
                                color="green"
                                variant="outline"
                                radius="lg"
                            >
                                <FontAwesomeIcon icon={faCheck} />
                            </ThemeIcon>
                        )}
                    </div>

                    <Progress
                        value={percentageUploaded}
                        radius={0}
                        animate={!uploaded}
                        color={uploaded ? 'green' : 'blue'}
                    />
                </div>
            </div>
        )
    return null
}

export const FileUploadCard = ({
    file,
    index,
    size,
    remove,
    uploading,
    percentageUploaded,
    drawingData,
}: FileUploadCardProps) => {
    const ext = file.name.split('.').pop() ?? ''
    const { classes } = useStyles()

    return (
        <div className={classes.wrapper}>
            <Card>
                <Card.Section>
                    <Box className={classes.wrapper}>
                        <FileUploadPreview
                            file={file}
                            height={previewHeight(size)}
                        />
                        <UploadingOverlay
                            uploading={uploading}
                            percentageUploaded={percentageUploaded}
                        />
                    </Box>
                </Card.Section>
                <Card.Section p="sm">
                    <Group position="apart" align="flex-start" noWrap>
                        <Stack spacing={0}>
                            <Text size="md" lineClamp={1}>
                                {file.name}
                            </Text>
                            <Text
                                color="dimmed"
                                size="sm"
                                sx={{ textTransform: 'uppercase' }}
                            >
                                {ext}
                            </Text>
                        </Stack>
                        <Badge my="xs" sx={{ flexShrink: 0 }}>
                            {mimeCategory(ext)}
                        </Badge>
                    </Group>
                </Card.Section>
                {drawingData && (
                    <Card.Section p="sm" withBorder>
                        <CardDrawingDetails
                            drawingData={drawingData}
                            file={file}
                            index={index}
                        />
                    </Card.Section>
                )}
            </Card>
            {!uploading && percentageUploaded === 0 && (
                <ActionIcon
                    onClick={() => remove()}
                    className={classes.delete}
                    variant="light"
                    color="red"
                >
                    <FontAwesomeIcon icon={faTrash} />
                </ActionIcon>
            )}
        </div>
    )
}
