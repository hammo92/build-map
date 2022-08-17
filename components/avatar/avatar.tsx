import { useGetImageUrl } from "@data/asset/hooks";
import { useGetMe } from "@data/user/hooks";
import { faEdit, faThermometerEmpty } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Avatar as MantineAvatar,
    Box,
    Button,
    MantineSize,
    MantineTheme,
    useMantineTheme,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, MIME_TYPES } from "@mantine/dropzone";
import { useHover } from "@mantine/hooks";
import { userAgent } from "next/server";
import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { hexToRgb, hexToRgba } from "utils/colors";

interface AvatarProps {
    size: number;
    radius?: MantineSize | "round";
    editable?: boolean;
    currentUrl?: string;
}

export const Avatar = ({ size = 50, radius = "xl", editable = true, currentUrl }: AvatarProps) => {
    const theme = useMantineTheme();
    const [url, setUrl] = useState(currentUrl);
    const openRef = useRef<() => void>(null);
    const { hovered, ref } = useHover();
    const { data } = useGetMe();
    const { data: imageData } = useGetImageUrl({
        assetId: data?.user.picture ?? "",
        height: 200,
    });
    const onDrop = (files: File[]) => {
        setUrl(URL.createObjectURL(files[0]));
    };

    return (
        <Box
            ref={ref}
            sx={(theme) => ({
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: radius === "round" ? size / 2 : theme.radius[radius],
                overflow: "hidden",
                position: "relative",
            })}
        >
            <Dropzone
                openRef={openRef}
                disabled={!editable}
                accept={IMAGE_MIME_TYPE}
                onDrop={() => {}}
                radius="md"
                maxSize={30 * 1024 ** 2}
                styles={{ root: { padding: "0px", border: "none" }, inner: { height: "100%" } }}
                sx={{ width: "100%", height: "100%" }}
            >
                <MantineAvatar src={url} size={size} />
            </Dropzone>
            {hovered && editable && (
                <Box
                    sx={(theme) => ({
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: theme.colors.dark[7],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                        opacity: 0.8,
                    })}
                >
                    <FontAwesomeIcon icon={faEdit} />
                </Box>
            )}
        </Box>
    );
};
