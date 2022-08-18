import { useGetImageUrl } from "@data/asset/hooks";
import { Group, Image, Loader } from "@mantine/core";
import { useStyles } from "./styles";

interface AssetImageProps {
    assetId: string;
    height?: number;
}

export const AssetImage = ({ assetId, height = 150 }: AssetImageProps) => {
    const { data } = useGetImageUrl({ assetId, height });
    const { classes } = useStyles();
    return (
        <Group
            className={classes.imageWrapper}
            position="center"
            sx={{
                height,
            }}
        >
            {data?.url ? <Image src={data?.url} alt={assetId} height={height} /> : <Loader />}
        </Group>
    );
};
