import { faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon } from "@mantine/core";
import { imageEditorState } from "@state/imageEditor";
import { useImmerAtom } from "jotai/immer";
import React from "react";

export const DeleteButton = () => {
    const [{ instance, activeObject }] = useImmerAtom(imageEditorState);
    return (
        <ActionIcon
            onClick={() => instance.removeActiveObject()}
            disabled={!activeObject}
            size="lg"
        >
            <FontAwesomeIcon icon={faTrash} />
        </ActionIcon>
    );
};
