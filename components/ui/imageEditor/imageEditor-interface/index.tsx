import {
    faArrowPointer,
    faCrop,
    faPen,
    faRotate,
    faSave,
    faShapes,
    faText,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Box, Button, Center, Group, SegmentedControl } from "@mantine/core";
import { imageEditorState } from "@state/imageEditor";
import { useImmerAtom } from "jotai/immer";
import { FC, useState } from "react";
import { base64ToBlob } from "utils/blob";
import { ImageEditorProps } from "../imageEditor";
import { CropInterface } from "./interface-crop";
import { DrawInterface } from "./interface-draw";
import { HistoryInterface } from "./interface-history";
import { RotateInterface } from "./interface-rotate";
import { ShapeInterface } from "./interface-shape";
import { TextInterface } from "./interface-text";

export type ModeOptions = "TEXT" | "SHAPE" | "CROPPER" | "ROTATE" | "DRAW" | "POINTER";

const ModeOptions = ({ mode }: { mode: ModeOptions }) => {
    const [{ instance, brushMode, brushColor, brushWidth }] = useImmerAtom(imageEditorState);
    if (instance) {
        switch (mode) {
            case "TEXT":
                instance.startDrawingMode("TEXT");
                return <TextInterface />;
            case "SHAPE":
                instance.startDrawingMode("SHAPE");
                return <ShapeInterface />;
            case "CROPPER":
                instance.startDrawingMode("CROPPER");
                return <CropInterface />;
            case "ROTATE":
                instance.stopDrawingMode();
                return <RotateInterface />;
            case "DRAW":
                instance.startDrawingMode(brushMode, {
                    color: brushColor,
                    width: brushWidth,
                });
                return <DrawInterface />;
            case "POINTER":
                instance.stopDrawingMode();
                return null;
        }
    }
    return null;
};

export const ImageEditorInterface: FC<ImageEditorProps> = ({ children, onSave, file }) => {
    const [{ mode, instance, toBlob }, setImageEditorState] = useImmerAtom(imageEditorState);
    const [saving, setSaving] = useState(false);
    return (
        <Group
            spacing={0}
            sx={(theme) => ({
                background: theme.colors.dark[8],
                borderRadius: theme.radius.sm,
            })}
        >
            <SegmentedControl
                value={mode}
                orientation="vertical"
                size="md"
                data={[
                    { value: "POINTER", label: <FontAwesomeIcon icon={faArrowPointer} /> },
                    { value: "TEXT", label: <FontAwesomeIcon icon={faText} /> },
                    { value: "SHAPE", label: <FontAwesomeIcon icon={faShapes} /> },
                    { value: "CROPPER", label: <FontAwesomeIcon icon={faCrop} /> },
                    { value: "ROTATE", label: <FontAwesomeIcon icon={faRotate} /> },
                    { value: "DRAW", label: <FontAwesomeIcon icon={faPen} /> },
                ]}
                onChange={(value: ModeOptions) => {
                    instance.deactivateAll();
                    setImageEditorState((i) => {
                        i.mode = value;
                        i.activeObject = undefined;
                    });
                }}
            />
            <Group direction="column" grow sx={{ flex: "1" }} spacing={0}>
                <Group
                    position="right"
                    spacing={0}
                    sx={(theme) => ({
                        "> div": {
                            borderLeft: `1px solid ${theme.colors.dark[6]}`,
                        },
                    })}
                >
                    <ModeOptions mode={mode} />
                    <HistoryInterface />
                    <Box px="sm">
                        <Button
                            size="sm"
                            disabled={saving}
                            loading={saving}
                            onClick={async () => {
                                setSaving(true);
                                if (!onSave) return;
                                const dataUrl = instance.toDataURL({ format: "jpg", quality: 0.7 });
                                console.log("toBlob", toBlob);
                                //const blob = await fetch(dataUrl).then((res) => res.blob());
                                const blob = base64ToBlob(dataUrl);
                                const newFile = new File(
                                    [blob],
                                    `${file.name.replace(/\.[^/.]+$/, "")}.png`
                                );
                                setSaving(false);
                                onSave(newFile);
                            }}
                            color="blue"
                            variant="filled"
                        >
                            Save
                        </Button>
                    </Box>
                </Group>
                <Center sx={(theme) => ({ background: theme.colors.dark[9] })}>{children}</Center>
            </Group>
        </Group>
    );
};
