import { AssetCard } from "@components/asset/asset-card";
import { Asset } from "@lib/asset/data/asset.model";
import { MantineSize, SimpleGrid } from "@mantine/core";
import { CleanedCamel } from "type-helpers";

export interface CheckableAssetListPropsBase {
    assets?: CleanedCamel<Asset>[];
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
    selectable?: never;
    selected?: never;
    select?: never;
    deselect?: never;
}

export type AssetListProps = CheckableAssetListProps | NonCheckableAssetListProps;

export const AssetList = ({
    assets,
    selectable,
    selected,
    select,
    deselect,
    size,
    cols = 4,
    ...props
}: AssetListProps) => {
    if (assets?.length) {
        return (
            <SimpleGrid cols={cols}>
                {assets.map((asset, i) => {
                    if (selectable) {
                        return (
                            <AssetCard
                                asset={asset}
                                key={asset.id}
                                size={size}
                                checkable={selectable}
                                onCheck={(checked) => {
                                    if (checked) {
                                        select(asset.id);
                                    } else {
                                        deselect(asset.id);
                                    }
                                }}
                                checked={selected?.has(asset.id)}
                            />
                        );
                    } else {
                        return <AssetCard asset={asset} key={asset.id} size={size} />;
                    }
                })}
            </SimpleGrid>
        );
    }
    return null;
};
