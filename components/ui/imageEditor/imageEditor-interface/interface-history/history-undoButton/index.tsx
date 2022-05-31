import { faUndo } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon } from "@mantine/core";
import { imageEditorState } from "@state/imageEditor";
import { useImmerAtom } from "jotai/immer";
import React, { useEffect } from "react";

export const UndoButton = () => {
    const [{ instance }] = useImmerAtom(imageEditorState);
    const undoEmpty = instance && instance.isEmptyUndoStack();
    return (
        <ActionIcon
            onClick={() => instance.undo()}
            disabled={undoEmpty}
            size="lg"
        >
            <FontAwesomeIcon icon={faUndo} />
        </ActionIcon>
    );
};
