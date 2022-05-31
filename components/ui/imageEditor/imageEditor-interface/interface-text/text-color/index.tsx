import { ColorPopover } from "@components/ui";
import { imageEditorState } from "@state/imageEditor";
import { useImmerAtom } from "jotai/immer";
import React, { useState } from "react";

export const TextColor = () => {
    const [color, setColor] = useState("#ffffff");
    /*const [{ textColor, instance, activeObject }, setImageEditorState] =
        useImmerAtom(imageEditorState);
    const onChange = (color) => {
        activeObject &&
            instance.changeTextStyle(activeObject, {
                fill: color,
            });

        setImageEditorState((i) => {
            i.textColor = color;
        });
    };*/
    return <ColorPopover value={color} onChange={setColor} />;
};
