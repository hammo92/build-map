import { BasicSlider } from "@components/ui/basicSlider";
import { Box } from "@mantine/core";
import { imageEditorState, shapeParamsAtom } from "@state/imageEditor";
import { useAtom } from "jotai";
import { useImmerAtom } from "jotai/immer";

export const ShapeStroke = () => {
    const [imageEditor, setImageEditorState] = useImmerAtom(imageEditorState);
    const { shape, instance, activeObject } = imageEditor;
    const [shapeParams] = useAtom(shapeParamsAtom);
    const onChange = (value: number) => {
        setImageEditorState((i) => {
            i.strokeWidth = value;
        });
        instance.setDrawingShape(shape, shapeParams);
        activeObject && instance.changeShape(activeObject, { strokeWidth: value });
    };

    return (
        <Box sx={{ width: "80px" }}>
            <BasicSlider value={imageEditor.strokeWidth} onChange={onChange} />
        </Box>
    );
};
