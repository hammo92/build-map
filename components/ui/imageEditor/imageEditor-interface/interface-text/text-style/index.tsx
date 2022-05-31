import {
    faBold,
    faItalic,
    faUnderline,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Group } from "@mantine/core";
import { imageEditorState } from "@state";
import { useImmerAtom } from "jotai/immer";
import React, { useEffect } from "react";

export const TextStyle = () => {
    const [
        {
            instance,
            activeObject,
            bold,
            italic,
            underline,
            textColor,
            fontSize,
            fontFamily,
        },
        setImageEditorState,
    ] = useImmerAtom(imageEditorState);

    const onClick = (key) => {
        setImageEditorState((i) => {
            i[key] = !i[key];
        });
        if (activeObject) {
            switch (key) {
                case "bold":
                    instance.changeTextStyle(activeObject, {
                        fontWeight: "bold",
                    });
                    break;
                case "italic":
                    instance.changeTextStyle(activeObject, {
                        fontStyle: "italic",
                    });
                    break;
                case "underline":
                    instance.changeTextStyle(activeObject, {
                        underline: "true",
                    });
                    break;
            }
        }
    };

    useEffect(() => {
        if (instance) {
            instance.off("addText");
            instance.on("addText", (pos) => {
                instance
                    .addText("Edit me Now", {
                        styles: {
                            fill: textColor,
                            textDecoration: underline ? "underline" : "none",
                            fontWeight: bold ? "bold" : "normal",
                            fontStyle: italic ? "italic" : "normal",
                            fontSize,
                            fontFamily,
                        },
                        position: pos.originPosition,
                    })
                    .then(function (objectProps) {
                        console.log(objectProps);
                    });
            });
        }
    }, [bold, italic, underline, fontSize, instance, textColor, fontFamily]);

    return (
        <Group spacing="xs">
            <ActionIcon
                variant={bold ? "filled" : "hover"}
                onClick={() => onClick("bold")}
                size="lg"
            >
                <FontAwesomeIcon icon={faBold} />
            </ActionIcon>
            <ActionIcon
                variant={italic ? "filled" : "hover"}
                onClick={() => onClick("italic")}
                size="lg"
            >
                <FontAwesomeIcon icon={faItalic} />
            </ActionIcon>
            <ActionIcon
                variant={underline ? "filled" : "hover"}
                onClick={() => onClick("underline")}
                size="lg"
            >
                <FontAwesomeIcon icon={faUnderline} />
            </ActionIcon>
        </Group>
    );
};
