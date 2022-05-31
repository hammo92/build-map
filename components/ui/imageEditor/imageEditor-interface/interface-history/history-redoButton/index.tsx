import { faRedo } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon } from "@mantine/core";
import { imageEditorState } from "@state/imageEditor";
import { useImmerAtom } from "jotai/immer";
import React from "react";

export const RedoButton = () => {
    const [{ instance }] = useImmerAtom(imageEditorState);
    const redoEmpty = instance && instance.isEmptyRedoStack();
    return (
        <ActionIcon
            onClick={() => instance.redo()}
            disabled={redoEmpty}
            size="lg"
        >
            <FontAwesomeIcon icon={faRedo} />
        </ActionIcon>
    );
};
