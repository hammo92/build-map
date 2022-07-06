import { Asset } from "@lib/asset/data/asset.model";
import { CleanedCamel } from "type-helpers";
import { mimeCategory } from "utils/asset";
import { AssetIcon } from "../asset-icon";
import { AssetImage } from "../asset-image";

interface AssetPreview {
    asset: CleanedCamel<Asset>;
    height?: number;
}

export const AssetPreview = ({ asset, height }: AssetPreview) => {
    const category = mimeCategory(asset.ext);
    if (category === "image") return <AssetImage asset={asset} height={height} />;
    return <AssetIcon category={category} height={height} />;
};
