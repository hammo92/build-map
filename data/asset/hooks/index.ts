import { Asset } from "@lib/asset/data/asset.model";
import { useQuery, QueryOptions, useQueries } from "react-query";
import { CleanedCamel } from "type-helpers";
import { Keys } from "../constants";
import { getArrayOfAssets, getAsset, getImageUrl, getMyAssets } from "../queries";

export function useGetMyAssets() {
    return useQuery(Keys.GET_MY_ASSETS, () => getMyAssets(), {
        //refetchInterval: 1000,
    });
}

export function useGetAsset({
    assetId,
    initialData,
}: {
    assetId: string;
    initialData?: CleanedCamel<Asset>;
}) {
    return useQuery([Keys.GET_ASSET, assetId], () => getAsset({ assetId }), {
        //refetchInterval: 1000,
        initialData: {
            asset: initialData,
        },
    });
}

export function useGetArrayOfAssets({
    assetIds,
    initialData,
    enabled,
}: {
    assetIds: string[];
    initialData?: CleanedCamel<Asset>[];
    enabled?: boolean;
}) {
    return useQuery([Keys.GET_ASSET, assetIds.join(",")], () => getArrayOfAssets({ assetIds }), {
        //refetchInterval: 1000,
        initialData: {
            assets: initialData,
        },
        enabled,
    });
}

export function useGetAssetsDynamic({
    assetIds,
    initialData,
}: {
    assetIds: string[];
    initialData?: CleanedCamel<Asset>[];
}) {
    const assetQueries = useQueries(
        assetIds.map((assetId) => ({
            queryKey: [Keys.GET_ASSET, assetId],
            queryFn: () => getAsset({ assetId }),
            //initialData: initialData?.find((asset) => asset.id === assetId),
        }))
    );
    const data = assetQueries.reduce<CleanedCamel<Asset>[]>((prev, curr) => {
        return [...prev, ...(curr?.data?.asset ? [curr?.data?.asset] : [])];
    }, []);
    return data;
}

export function useGetImageUrl({
    assetId,
    width,
    height,
}: {
    assetId: string;
    width?: number;
    height?: number;
}) {
    return useQuery([Keys.GET_IMAGE_URL, assetId], () => getImageUrl({ assetId, width, height }), {
        //refetchInterval: 1000,
    });
}
