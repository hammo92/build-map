import { AssetList, CheckableAssetListPropsBase } from "@components/asset/asset-list";
import { FileUpload, ImageUploadProps } from "@components/ui/fileUpload";
import { useGetAssetsDynamic } from "@data/asset/hooks";
import { faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSetState } from "@hooks/useSetState/useSetState";
import { ActionIcon, Box, Group, Text } from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";
import { useStyles } from "./styles";

export type AssetManagerProps = CheckableAssetListPropsBase &
    Omit<ImageUploadProps, "onUpload"> & {
        /** Array of asset ids, used for initial data */
        assetIds?: string[];

        /** Sets if user is allowed to edit */
        editable?: boolean;

        /** Called when assets are changed */
        onChange?: (ids: string[]) => void;

        /** Default value */
        defaultValue?: string[];
    };

export const AssetManager = ({
    assetIds,
    size,
    editable = true,
    onChange,
    defaultValue = [],
    multiple,
    ...rest
}: AssetManagerProps) => {
    const [_value, handleChange] = useUncontrolled({
        value: assetIds,
        defaultValue,
        finalValue: [],
        rule: (val) => Array.isArray(val),
        onChange: onChange!,
    });
    const [selected, { add: select, remove: deselect, setState }] = useSetState<string>();

    const { classes } = useStyles();
    const data = useGetAssetsDynamic({
        assetIds: _value ?? [],
    });

    return (
        <Group direction="column" spacing="sm" grow>
            <Group direction="column" grow className={classes.container} spacing={0}>
                <Group position="apart" p="sm" className={classes.actionBar}>
                    <Text color="dimmed" size="sm">{`${_value!.length} Asset${
                        _value!.length > 1 ? "s" : ""
                    }`}</Text>
                    <Group>
                        <FileUpload
                            {...rest}
                            onUpload={(assetIds) => {
                                multiple
                                    ? handleChange([..._value!, ...assetIds])
                                    : handleChange(assetIds);
                            }}
                            multiple={multiple}
                        />
                        {[...selected].length && (
                            <ActionIcon
                                onClick={() => {
                                    handleChange(_value!.filter((id) => !selected.has(id)));
                                    setState(new Set());
                                }}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </ActionIcon>
                        )}
                    </Group>
                </Group>
                <Box p="sm">
                    <AssetList
                        size={size}
                        cols={multiple ? 4 : 1}
                        assets={data}
                        selectable={true}
                        select={select}
                        deselect={deselect}
                        selected={selected}
                    />
                </Box>
            </Group>
        </Group>
    );
};
