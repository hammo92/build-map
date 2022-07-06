import { Asset } from "@lib/asset/data/asset.model";
import camelcaseKeys from "camelcase-keys";
import { apiClient } from "data/config";
import { CleanedSnake } from "type-helpers";

export async function getMyAssets() {
    const { data } = await apiClient.get<{ assets: CleanedSnake<Asset>[] }>(`/me/assets`);
    return camelcaseKeys(data, { deep: true });
}

export async function getAsset({ assetId }: { assetId: string }) {
    const { data } = await apiClient.get<{ asset: CleanedSnake<Asset> }>(`/assets/${assetId}`);
    return camelcaseKeys(data, { deep: true });
}

export async function getArrayOfAssets({ assetIds }: { assetIds: string[] }) {
    const { data } = await apiClient.get<{ assets: CleanedSnake<Asset>[] }>(
        `/assets?ids=${assetIds.join(",")}`
    );
    return camelcaseKeys(data, { deep: true });
}

export async function getImageUrl({
    assetId,
    width,
    height,
}: {
    assetId: string;
    width?: number;
    height?: number;
}) {
    const queryString = () => {
        if (!width && !height) return "";
        const queryElements = [];
        if (width) queryElements.push(`w=${width}`);
        if (height) queryElements.push(`h=${height}`);
        return `?${queryElements.join("&")}`;
    };
    const { data } = await apiClient.get<{ url: string }>(`/images/${assetId}${queryString()}`);
    return data;
}
