import { Asset } from "@lib/asset/data/asset.model";
import { CleanedCamel } from "type-helpers";
import { mimeCategory } from "utils/asset";
import { AssetIcon } from "../asset-icon";
import { AssetImage } from "../asset-image";

interface AssetPreview {
    assetId: string;
    height?: number;
    ext?: string;
}

export const AssetPreview = ({ assetId, height, ext }: AssetPreview) => {
    const category = ext ? mimeCategory(ext) : "file";
    if (category === "image") return <AssetImage assetId={assetId} height={height} />;
    return <AssetIcon category={category} height={height} />;
};
