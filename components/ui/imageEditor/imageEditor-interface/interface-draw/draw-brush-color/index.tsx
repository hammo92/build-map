import { ColorPopover } from "@components/ui";
import { imageEditorState } from "@state/imageEditor";
import { useImmerAtom } from "jotai/immer";
import React from "react";

export const BrushColor = () => {
    const [{ brushColor, instance, brushWidth, activeObject }, setImageEditorState] =
        useImmerAtom(imageEditorState);
    const onChange = (color: string) => {
        instance.setBrush({ color, width: brushWidth });

        setImageEditorState((i) => {
            i.brushColor = color;
        });
        activeObject && instance.changeShape(activeObject, { stroke: color });
    };
    return <ColorPopover value={brushColor} onChange={onChange} />;
};
