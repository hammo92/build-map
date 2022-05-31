import {
    faCircle,
    faRectangle,
    faTriangle,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SegmentedControl } from "@mantine/core";
import { imageEditorState } from "@state";
import { useImmerAtom } from "jotai/immer";
import React from "react";

export const ShapeSelect = () => {
    const [
        { instance, shape, fill, stroke, strokeWidth },
        setImageEditorState,
    ] = useImmerAtom(imageEditorState);

    const onChange = (newShape) => {
        setImageEditorState((i) => {
            i.shape = newShape;
        });
        instance.setDrawingShape(newShape, {
            fill,
            stroke,
            strokeWidth,
        });
    };

    return (
        <SegmentedControl
            value={shape}
            onChange={onChange}
            data={[
                {
                    label: <FontAwesomeIcon icon={faRectangle} />,
                    value: "rect",
                },
                {
                    label: <FontAwesomeIcon icon={faCircle} />,
                    value: "circle",
                },
                {
                    label: <FontAwesomeIcon icon={faTriangle} />,
                    value: "triangle",
                },
            ]}
        />
    );
};
