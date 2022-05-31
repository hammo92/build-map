import React, { useEffect, useRef, useState } from "react";
import {
    faArrowPointer,
    faCrop,
    faPen,
    faRotate,
    faShapes,
    faText,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Center, Group } from "@mantine/core";
import { TextInterface } from "./interface-text";
import { useImmerAtom } from "jotai/immer";
import { imageEditorState } from "@state/imageEditor";
import { ShapeInterface } from "./interface-shape";
import { RotateInterface } from "./interface-rotate";
import { CropInterface } from "./interface-crop";
import { DrawInterface } from "./interface-draw";
import { HistoryInterface } from "./interface-history";

interface ModeOptionsProps {
    mode: "TEXT" | "SHAPE" | "CROPPER" | "ROTATE" | "DRAW" | "POINTER";
}

const ModeOptions = ({ mode }) => {
    const [{ instance, brushMode, brushColor, brushWidth }] =
        useImmerAtom(imageEditorState);
    if (instance) {
        instance.startDrawingMode("TEXT");
        switch (mode) {
            case "TEXT":
                instance.startDrawingMode("TEXT");
                return <TextInterface />;
            case "SHAPE":
                instance.startDrawingMode("SHAPE");
                return <ShapeInterface />;
            case "CROPPER":
                instance.startDrawingMode("SHAPE");
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

export const ImageEditorInterface = ({ children }) => {
    const [mode, setMode] = useState("TEXT");
    return (
        <Group
            spacing={0}
            sx={(theme) => ({
                background: theme.colors.dark[8],
                borderRadius: theme.radius.sm,
            })}
        >
            <Group
                direction="column"
                sx={(theme) => ({
                    padding: theme.spacing.sm,
                })}
            >
                <ActionIcon onClick={() => setMode("POINTER")}>
                    <FontAwesomeIcon icon={faArrowPointer} />
                </ActionIcon>
                <ActionIcon onClick={() => setMode("TEXT")}>
                    <FontAwesomeIcon icon={faText} />
                </ActionIcon>
                <ActionIcon onClick={() => setMode("SHAPE")}>
                    <FontAwesomeIcon icon={faShapes} />
                </ActionIcon>
                <ActionIcon onClick={() => setMode("CROPPER")}>
                    <FontAwesomeIcon icon={faCrop} />
                </ActionIcon>
                <ActionIcon onClick={() => setMode("ROTATE")}>
                    <FontAwesomeIcon icon={faRotate} />
                </ActionIcon>
                <ActionIcon onClick={() => setMode("DRAW")}>
                    <FontAwesomeIcon icon={faPen} />
                </ActionIcon>
            </Group>
            <Group direction="column" grow sx={{ flex: "1" }} spacing={0}>
                <Group
                    position="right"
                    sx={(theme) => ({
                        "> div": {
                            borderLeft: `1px solid ${theme.colors.dark[6]}`,
                        },
                    })}
                >
                    <ModeOptions mode={mode} />
                    <HistoryInterface />
                </Group>
                <Center sx={(theme) => ({ background: theme.colors.dark[9] })}>
                    {children}
                </Center>
            </Group>
        </Group>
    );
};
