import { Box, Slider } from "@mantine/core";
import { imageEditorState } from "@state/imageEditor";
import { useImmerAtom } from "jotai/immer";
import React from "react";

export const ShapeStroke = () => {
    const [{ strokeWidth }, setStrokeWidth] = useImmerAtom(imageEditorState);
    console.log("outside function :>> ", strokeWidth);
    const onChange = (value: number) => {
        setStrokeWidth((i) => {
            i.strokeWidth = value;
        });
        console.log("inside function :>> ", strokeWidth);
    };

    return (
        <Box sx={{ minWidth: "80px" }}>
            <Slider value={strokeWidth} onChange={onChange} />
        </Box>
    );
};
