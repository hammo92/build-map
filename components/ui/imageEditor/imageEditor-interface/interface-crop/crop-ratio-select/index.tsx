import { SegmentedControl } from "@mantine/core";
import { imageEditorState } from "@state";
import { useImmerAtom } from "jotai/immer";
import React from "react";

export const CropRatioSelect = () => {
    const [{ cropRatio, instance, activeObject }, setImageEditorState] =
        useImmerAtom(imageEditorState);
    const onChange = (ratio) => {
        setImageEditorState((i) => {
            i.cropRatio = ratio;
        });
        instance.setCropzoneRect(ratio);
    };

    return (
        <SegmentedControl
            value={cropRatio}
            onChange={onChange}
            data={[
                {
                    label: "Free",
                    value: "free",
                },
                {
                    label: "1 : 1",
                    value: 1 / 1,
                },
                {
                    label: "3 : 2",
                    value: 3 / 2,
                },
                {
                    label: "4 : 3",
                    value: 4 / 3,
                },
                {
                    label: "5 : 4",
                    value: 5 / 4,
                },
                {
                    label: "7 : 5",
                    value: 7 / 5,
                },
                {
                    label: "16 : 9",
                    value: 16 / 9,
                },
            ]}
        />
    );
};
