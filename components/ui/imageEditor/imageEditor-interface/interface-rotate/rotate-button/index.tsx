import {
    faRotateLeft,
    faRotateRight,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Group } from "@mantine/core";
import { imageEditorState } from "@state/imageEditor";
import { useImmerAtom } from "jotai/immer";
import React from "react";

export const RotateButton: React.FC<{ angle: number }> = ({ angle }) => {
    const [{ instance }] = useImmerAtom(imageEditorState);
    return (
        <Button
            variant="default"
            leftIcon={
                <FontAwesomeIcon
                    icon={angle > 0 ? faRotateRight : faRotateLeft}
                />
            }
            onClick={() => instance.rotate(angle > 0 ? 90 : -90)}
            disabled={!instance}
        >
            {`Rotate ${angle > 0 ? "Clockwise" : "Anticlockwise"}`}
        </Button>
    );
};
