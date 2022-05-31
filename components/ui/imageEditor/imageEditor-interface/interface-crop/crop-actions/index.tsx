import { Button, Group } from "@mantine/core";
import { imageEditorState } from "@state";
import { useImmerAtom } from "jotai/immer";
import React from "react";

const CropButton = () => {
    const [{ instance }, setImageEditorState] = useImmerAtom(imageEditorState);
    const crop = async () => {
        await instance.crop(instance.getCropzoneRect());
        const { style } = instance._graphics._canvas.wrapperEl;

        //update canvas size after crop
        setImageEditorState((i) => {
            i.width = style.maxWidth;
            i.height = style.maxHeight;
        });
    };
    return (
        <Button color="teal" onClick={() => crop()}>
            Crop
        </Button>
    );
};

export const CropActions = () => {
    return (
        <Group>
            <CropButton />
        </Group>
    );
};
