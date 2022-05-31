import { Box, Slider } from "@mantine/core";
import { imageEditorState } from "@state/imageEditor";
import { useImmerAtom } from "jotai/immer";
import React from "react";

export const BrushWidth = () => {
    const [{ brushWidth, brushColor, instance }, setimageEditorState] =
        useImmerAtom(imageEditorState);
    const onChange = (width: number) => {
        instance.setBrush({ color: brushColor, width });
        setimageEditorState((i) => {
            i.brushWidth = width;
        });
    };

    return (
        <Box sx={{ minWidth: "80px" }}>
            <Slider value={brushWidth} onChange={onChange} />
        </Box>
    );
};
