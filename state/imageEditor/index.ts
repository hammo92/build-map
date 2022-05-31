import { atom } from "jotai";
import { atomWithImmer } from "jotai/immer";
import TuiImageEditor from "tui-image-editor";

export const imageEditorState = atomWithImmer({
    instance: undefined as unknown as TuiImageEditor,
    activeObject: undefined,
    activeTab: 0,
    stroke: "#000000",
    fill: "#ffffff",
    strokeWidth: 12,
    shape: "rect" as "rect" | "circle" | "triangle",
    cropRatio: "free" as number | "free",
    bold: false,
    italic: false,
    underline: false,
    brushMode: "FREE_DRAWING" as "FREE_DRAWING" | "LINE_DRAWING",
    brushWidth: 12,
    brushColor: "#ffffff",
    fontSize: 30,
    textColor: "#ffffff",
    fontFamily: "relative-book-pro",
    width: 0,
    height: 0,
    undoDisabled: true,
    redoDisabled: true,
});

export const shapeParamsAtom = atom((get) => {
    const { fill, stroke, strokeWidth } = get(imageEditorState);
    return {
        fill,
        stroke,
        strokeWidth,
    };
});
