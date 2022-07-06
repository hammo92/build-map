import { ColorPopover } from "@components/ui";
import { imageEditorState, shapeParamsAtom } from "@state/imageEditor";
import { useAtom } from "jotai";
import { useImmerAtom } from "jotai/immer";
import React from "react";

interface ColorSelectProps {
    type: "fill" | "stroke";
}

export const ShapeColor: React.FC<ColorSelectProps> = ({ type }) => {
    const [imageEditor, setImageEditorState] = useImmerAtom(imageEditorState);
    const { shape, instance, activeObject } = imageEditor;
    const [shapeParams] = useAtom(shapeParamsAtom);
    const onChange = (newColor: string) => {
        shapeParams[type] = newColor;
        instance.setDrawingShape(shape, shapeParams);
        activeObject && instance.changeShape(activeObject, { [type]: newColor });
        setImageEditorState((i) => {
            i[type] = newColor;
        });
    };
    return <ColorPopover value={imageEditor[type]} onChange={onChange} />;
};
