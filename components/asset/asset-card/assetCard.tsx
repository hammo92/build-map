import { useGetAsset } from "@data/asset/hooks";
import { Asset } from "@lib/asset/data/asset.model";
import {
    Badge,
    Box,
    Card,
    Checkbox,
    Group,
    MantineSize,
    Skeleton,
    Stack,
    Text,
} from "@mantine/core";
import { CleanedCamel } from "type-helpers";
import { mimeCategory } from "utils/asset";
import { AssetPreview } from "../asset-preview";
import { useStyles } from "./styles";

interface AssetCardPropsBase {
    assetId: string;
    size?: MantineSize;
}

interface CheckableAssetCard extends AssetCardPropsBase {
    checked: boolean;
    checkable: true;
    onCheck: (checked: boolean) => void;
}

interface NonCheckableAssetCard extends AssetCardPropsBase {
    checked?: never;
    checkable?: false;
    onCheck?: never;
}

export type AssetCardProps = CheckableAssetCard | NonCheckableAssetCard;

const previewHeight = (size: MantineSize | undefined) => {
    switch (size) {
        case "xs":
            return 50;
        case "sm":
            return 75;
        case "md":
            return 100;
        case "lg":
            return 150;
        case "xl":
            return 200;
        default:
            return 100;
    }
};

const AssetDetails = ({ filename, ext }: Partial<CleanedCamel<Asset>>) => {
    return (
        <Group position="apart" align="flex-start" noWrap>
            <Stack spacing={0}>
                <Text size="sm" lineClamp={1}>
                    <Skeleton visible={!filename}>{filename ?? "file.ext"}</Skeleton>
                </Text>
                <Text color="dimmed" size="xs" sx={{ textTransform: "uppercase" }}>
                    <Skeleton visible={!ext}>{ext ?? "ext"}</Skeleton>
                </Text>
            </Stack>
            {/* <Badge my="xs" sx={{ flexShrink: 0 }}>
                {mimeCategory(ext)}
            </Badge> */}
        </Group>
    );
};

export const AssetCard = ({
    assetId,
    size,
    checked = false,
    checkable,
    onCheck,
}: AssetCardProps) => {
    const { classes } = useStyles();
    const { data } = useGetAsset({ assetId });
    return (
        <div className={classes.wrapper}>
            <Card className={classes.card}>
                <Card.Section>
                    <Box sx={{ position: "relative" }}>
                        <AssetPreview
                            assetId={assetId}
                            height={previewHeight(size)}
                            ext={data?.asset?.ext}
                        />
                    </Box>
                </Card.Section>
                <Card.Section p="sm">
                    <AssetDetails {...data?.asset} />
                </Card.Section>
            </Card>
            {checkable && (
                <Checkbox
                    checked={checked}
                    onChange={(event) => onCheck(event.currentTarget.checked)}
                    className={classes.checkbox}
                />
            )}
        </div>
    );
};
