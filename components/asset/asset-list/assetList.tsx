import { AssetCard } from "@components/asset/asset-card";
import { Asset } from "@lib/asset/data/asset.model";
import { MantineSize, SimpleGrid } from "@mantine/core";
import { CleanedCamel } from "type-helpers";

export interface CheckableAssetListPropsBase {
    assetIds: string[];
    size?: MantineSize;
    cols?: number;
}

interface CheckableAssetListProps extends CheckableAssetListPropsBase {
    selectable: true;
    selected: Set<string>;
    select: (...items: string[]) => void;
    deselect: (...items: string[]) => void;
}

interface NonCheckableAssetListProps extends CheckableAssetListPropsBase {
    selectable?: false;
    selected?: never;
    select?: never;
    deselect?: never;
}

export type AssetListProps = CheckableAssetListProps | NonCheckableAssetListProps;

export const AssetList = ({
    assetIds,
    selectable,
    selected,
    select,
    deselect,
    size,
    cols = 4,
    ...props
}: AssetListProps) => {
    if (assetIds?.length) {
        return (
            <SimpleGrid cols={cols} p="sm">
                {assetIds.map((id, i) => {
                    if (selectable) {
                        return (
                            <AssetCard
                                assetId={id}
                                key={id}
                                size={size}
                                checkable={selectable}
                                onCheck={(checked) => {
                                    if (checked) {
                                        select(id);
                                    } else {
                                        deselect(id);
                                    }
                                }}
                                checked={selected?.has(id)}
                            />
                        );
                    } else {
                        return <AssetCard assetId={id} key={id} size={size} />;
                    }
                })}
            </SimpleGrid>
        );
    }
    return null;
};
