import { ColorPopover } from "@components/ui";
import { imageEditorState } from "@state/imageEditor";
import { useImmerAtom } from "jotai/immer";
import React from "react";

export const BrushColor = () => {
    const [{ brushColor, instance, brushWidth }, setImageEditorState] =
        useImmerAtom(imageEditorState);
    const onChange = (color) => {
        instance.setBrush({ color, width: brushWidth });

        setImageEditorState((i) => {
            i.brushColor = color;
        });
    };
    return <ColorPopover value={brushColor} onChange={onChange} />;
};
