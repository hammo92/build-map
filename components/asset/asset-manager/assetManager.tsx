import {
    AssetList,
    CheckableAssetListPropsBase,
} from '@components/asset/asset-list'
import { FileUpload, ImageUploadProps } from '@components/ui/fileUpload'
import { faTrash } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSetState } from '@hooks/useSetState/useSetState'
import { ActionIcon, Card, Group, Stack, Text } from '@mantine/core'
import { useUncontrolled } from '@mantine/hooks'
import { useStyles } from './styles'

export type AssetManagerProps = CheckableAssetListPropsBase &
    Omit<ImageUploadProps, 'onUpload' | 'onChange'> & {
        /** Array of asset ids, used for initial data */
        assetIds?: string[] | string

        /** Sets if user is allowed to edit */
        editable?: boolean

        /** Called when assets are changed */
        onChange?: (ids: string[]) => void

        /** Default value */
        defaultValue?: string[]
    }

export const AssetManager = ({
    assetIds,
    editable = true,
    onChange,
    defaultValue = [],
    multiple,
    size = 'sm',
    ...rest
}: AssetManagerProps) => {
    const [_value, handleChange] = useUncontrolled({
        // convert string to array or accept array, remove empty strings
        value: ([] as string[]).concat(assetIds).filter((e) => e),
        defaultValue,
        finalValue: [],
        onChange: onChange!,
    })
    const [selected, { add: select, remove: deselect, setState }] =
        useSetState<string>()
    const { classes } = useStyles()

    const assetSelectableProps = editable
        ? { selectable: true as const, select, deselect, selected }
        : { selectable: false as const }

    const cols = {
        xs: 7,
        sm: 5,
        md: 3,
        lg: 3,
        xl: 2,
    }

    return (
        <Card p={0} withBorder>
            <Stack spacing={0}>
                <Group position="apart" p="sm" className={classes.actionBar}>
                    <Text color="dimmed" size={size}>{`${_value!.length} Asset${
                        _value!.length !== 1 ? 's' : ''
                    }`}</Text>
                    {editable && (
                        <Group>
                            <FileUpload
                                {...rest}
                                onUpload={(assetIds) => {
                                    // fileupload returns array of uploaded files, returned on each file upload
                                    // convert to set to remove duplicates
                                    const ids = new Set([
                                        ..._value!,
                                        ...assetIds,
                                    ])
                                    multiple
                                        ? handleChange(Array.from(ids))
                                        : handleChange(assetIds)
                                }}
                                multiple={multiple}
                                value={_value}
                            />
                            {[...selected].length && (
                                <ActionIcon
                                    onClick={() => {
                                        handleChange(
                                            _value!.filter(
                                                (id) => !selected.has(id)
                                            )
                                        )
                                        setState(new Set())
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </ActionIcon>
                            )}
                        </Group>
                    )}
                </Group>

                {assetIds && (
                    <AssetList
                        cols={multiple ? cols[size] : 1}
                        assetIds={_value}
                        size={size}
                        {...assetSelectableProps}
                    />
                )}
            </Stack>
        </Card>
    )
}
