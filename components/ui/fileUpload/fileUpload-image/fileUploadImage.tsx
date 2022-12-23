import { Group, Image } from '@mantine/core'
import { useStyles } from './styles'

interface FileUploadImageProps {
    file: File
    height?: number
}

export const FileUploadImage = ({
    file,
    height = 150,
}: FileUploadImageProps) => {
    const { classes } = useStyles()
    return (
        <Group
            className={classes.imageWrapper}
            position="center"
            sx={{
                height,
            }}
        >
            <Image
                src={URL.createObjectURL(file)}
                height={height}
                alt={file.name}
                fit="contain"
            />
        </Group>
    )
}
