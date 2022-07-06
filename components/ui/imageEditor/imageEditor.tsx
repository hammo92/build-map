import { Box } from "@mantine/core";
import { imageEditorState } from "@state";
import { useImmerAtom } from "jotai/immer";
import React, { useEffect, useRef } from "react";
import TuiImageEditor from "tui-image-editor";
import { ImageEditorInterface } from "./imageEditor-interface";

const DEFAULT_FONT_STYLES = {
    fill: "#ffffff",
    fontFamily: "relative-book-pro",
    fontSize: 30,
};

const DEFAULT_OPTIONS = {
    selectionStyle: {
        cornerSize: 20,
        rotatingPointOffset: 70,
    },
    usageStatistics: false,
};

const ImageEditorInner = ({ file }: { file: File }) => {
    const rootEl = useRef();
    const [{ width, height }, setImageEditorState] = useImmerAtom(imageEditorState);
    useEffect(() => {
        const editor = new TuiImageEditor(rootEl.current, DEFAULT_OPTIONS);
        const { style } = editor._graphics._canvas.wrapperEl;

        console.log("editor", editor);
        setImageEditorState((i) => {
            i.toBlob = editor._graphics.toBlob;
        });

        //set active object when new shape is added
        editor.on("objectAdded", (shape) => {
            setImageEditorState((i) => {
                i.activeObject = shape.id;
            });
        });

        editor.on("objectActivated", (shape) => {
            console.log("shape", shape);
            //update imageEditorState whien a shape is clicked
            if (["rect", "circle", "triangle"].includes(shape.type)) {
                const {
                    id,
                    type,
                    fill: { color: fill },
                    stroke,
                    strokeWidth,
                } = shape;
                setImageEditorState((i) => {
                    i.activeObject = id;
                    i.mode = "SHAPE";
                    i.shape = type;
                    i.fill = fill;
                    i.stroke = stroke;
                    i.strokeWidth = strokeWidth;
                });
            }

            //set active object when text is clicked
            if (["i-text", "text"].includes(shape.type)) {
                setImageEditorState((i) => {
                    i.activeObject = shape.id;
                    i.mode = "TEXT";
                    i.textColor = shape.fill;
                });
            }
            //set active object when text is clicked
            if (["path", "line"].includes(shape.type)) {
                const { id, stroke, strokeWidth } = shape;

                setImageEditorState((i) => {
                    i.activeObject = id;
                    i.mode = "DRAW";
                    i.brushColor = stroke;
                    i.brushWidth = strokeWidth;
                });
            }
        });

        // add a default text element when user clicks in text mode
        editor.on("addText", (pos) => {
            editor.addText("Edit me", {
                styles: DEFAULT_FONT_STYLES,
                position: pos.originPosition,
            });
        });

        // on undo
        editor.on("undoStackChanged", (length) => {
            setImageEditorState((i) => {
                i.width = style.maxWidth;
                i.height = style.maxHeight;
                i.undoDisabled = !length;
            });
        });

        // on redo
        editor.on("redoStackChanged", (length) => {
            setImageEditorState((i) => {
                i.width = style.maxWidth;
                i.height = style.maxHeight;
                i.redoDisabled = !length;
            });
        });

        //update the editor instance in state
        setImageEditorState((i) => {
            i.instance = editor;
            i.width = style.maxWidth;
            i.height = style.maxHeight;
        });

        (async () => {
            await editor.loadImageFromFile(file);
        })();

        //clean up state, editorListeners, and editor
        return () => {
            setImageEditorState((i) => {
                i.activeObject = undefined;
                i.instance = undefined;
            });
            editor.off("objectAdded");
            editor.off("objectActivated");
            editor.off("addText");
            editor.destroy();
        };
    }, [setImageEditorState, file]);

    return <Box sx={{ width: width, height: height }} ref={rootEl} />;
};

export interface ImageEditorProps {
    file: File;
    onSave: (file: File) => void;
}

const ImageEditor = ({ file, onSave }: ImageEditorProps) => (
    <Box sx={{ width: "100%", height: "100%" }}>
        {file && (
            <ImageEditorInterface onSave={onSave} file={file}>
                <ImageEditorInner file={file} />
            </ImageEditorInterface>
        )}
    </Box>
);

export default React.memo(ImageEditor);
