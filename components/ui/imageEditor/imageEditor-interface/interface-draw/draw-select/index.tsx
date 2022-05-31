import {
    faCircle,
    faRectangle,
    faWaveSine,
    faHorizontalRule,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SegmentedControl } from "@mantine/core";
import { imageEditorState } from "@state";
import { useImmerAtom } from "jotai/immer";
import React from "react";

export const BrushSelect = () => {
    const [
        { brushWidth, brushColor, instance, brushMode },
        setImageEditorState,
    ] = useImmerAtom(imageEditorState);

    const onChange = (newBrushMode) => {
        setImageEditorState((i) => {
            i.brushMode = newBrushMode;
        });
        instance.startDrawingMode(newBrushMode, {
            color: brushColor,
            width: brushWidth,
        });
    };

    return (
        <SegmentedControl
            value={brushMode}
            onChange={onChange}
            data={[
                {
                    label: <FontAwesomeIcon icon={faWaveSine} />,
                    value: "FREE_DRAWING",
                },
                {
                    label: <FontAwesomeIcon icon={faHorizontalRule} />,
                    value: "LINE_DRAWING",
                },
            ]}
        />
    );
};
