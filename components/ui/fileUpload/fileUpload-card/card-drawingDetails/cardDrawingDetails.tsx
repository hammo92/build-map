import PdfViewer from '@components/ui/reactPdf'
import { Checkbox, Group, Stack, Text, TextInput } from '@mantine/core'
import { DrawingData, UploadState } from '@state/uploader'
import { useSnapshot } from 'valtio'

export const CardDrawingDetails = ({
    drawingData,
    index,
    file,
}: {
    drawingData: DrawingData
    index: number
    file: File
}) => {
    const { updateDrawingData, updateDrawingPageData } =
        useSnapshot(UploadState)
    return (
        <Stack>
            {!drawingData.pageLength ? (
                <TextInput
                    label="Drawing title"
                    value={drawingData.title}
                    variant="filled"
                    onChange={(e) =>
                        updateDrawingData(
                            {
                                ...drawingData,
                                title: e.currentTarget.value,
                            },
                            index
                        )
                    }
                />
            ) : (
                <Stack>
                    <Text>Create Drawings From Pages:</Text>

                    {drawingData?.pages?.map((page, i) => {
                        return (
                            <Group key={i}>
                                <PdfViewer
                                    pageNumber={i + 1}
                                    file={file}
                                    width={50}
                                />

                                <TextInput
                                    value={page.title}
                                    variant="filled"
                                    sx={{ flex: 1 }}
                                    disabled={!page.active}
                                    onChange={(e) => {
                                        updateDrawingPageData(
                                            {
                                                ...page,
                                                title: e.currentTarget.value,
                                            },
                                            index,
                                            i
                                        )
                                    }}
                                />
                                <Checkbox
                                    checked={page.active}
                                    radius="lg"
                                    onClick={() => {
                                        updateDrawingPageData(
                                            {
                                                ...page,
                                                active: !page.active,
                                            },
                                            index,
                                            i
                                        )
                                    }}
                                />
                            </Group>
                        )
                    })}
                </Stack>
            )}
        </Stack>
    )
}
