import { BaseModel } from "../../../lib/models";
import { buildIndex, indexBy, Model, timekey } from "serverless-cloud-data-utils";

// To get an asset by it's ID *//
//namespace asset:${assetId} */
export const AssetId = buildIndex({ namespace: `asset`, label: "label1" });

// To get all assets created by a user filterable by type //
//namespace user_${userId}:assets:type
export const UserAssetsWithTypeFilter = ({ userId }: { userId: string }) =>
    buildIndex({
        namespace: `user_${userId}:assets`,
        label: "label2",
    });

//model: Asset */
export class Asset extends BaseModel<Asset> {
    object = "Asset";
    type: string;
    filename: string;
    fileType: string;
    path: string;
    ext: string;
    size: string;
    width?: string;
    height?: string;
    modelKeys() {
        // only index uploaded files by user, exclude generated sizes
        if (this.id.includes("asset_")) {
            return [
                indexBy(AssetId).exact(this.id),
                indexBy(
                    UserAssetsWithTypeFilter({
                        userId: this.createdBy,
                    })
                ).exact(this.type),
            ];
        }
        return [indexBy(AssetId).exact(this.id)];
    }
}
