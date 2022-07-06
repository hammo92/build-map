import { BasicSlider } from "@components/ui/basicSlider";
import { Box, Slider } from "@mantine/core";
import { imageEditorState } from "@state/imageEditor";
import { useImmerAtom } from "jotai/immer";
import React from "react";

export const BrushWidth = () => {
    const [{ brushWidth, brushColor, instance, activeObject }, setimageEditorState] =
        useImmerAtom(imageEditorState);
    const onChange = (width: number) => {
        instance.setBrush({ color: brushColor, width });
        setimageEditorState((i) => {
            i.brushWidth = width;
        });
        activeObject && instance.changeShape(activeObject, { strokeWidth: width });
    };

    return (
        <Box sx={{ width: "80px" }}>
            <BasicSlider value={brushWidth} onChange={onChange} />
        </Box>
    );
};
