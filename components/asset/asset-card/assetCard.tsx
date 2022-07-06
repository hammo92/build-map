import { Asset } from "@lib/asset/data/asset.model";
import { Badge, Box, Card, Checkbox, Group, MantineSize, Text } from "@mantine/core";
import { CleanedCamel } from "type-helpers";
import { mimeCategory } from "utils/asset";
import { AssetPreview } from "../asset-preview";
import { useStyles } from "./styles";

interface AssetCardPropsBase {
    asset: CleanedCamel<Asset>;
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

export const AssetCard = ({ asset, size, checked = false, checkable, onCheck }: AssetCardProps) => {
    const { classes } = useStyles();
    return (
        <div className={classes.wrapper}>
            <Card>
                <Card.Section>
                    <Box sx={{ position: "relative" }}>
                        <AssetPreview asset={asset} height={previewHeight(size)} />
                    </Box>
                </Card.Section>
                <Card.Section p="sm">
                    <Group position="apart" align="flex-start" noWrap>
                        <Group direction="column" spacing={0}>
                            <Text size="md" lineClamp={1}>
                                {asset.filename}
                            </Text>
                            <Text color="dimmed" size="sm" sx={{ textTransform: "uppercase" }}>
                                {asset.ext}
                            </Text>
                        </Group>
                        <Badge my="xs" sx={{ flexShrink: 0 }}>
                            {mimeCategory(asset.ext)}
                        </Badge>
                    </Group>
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
