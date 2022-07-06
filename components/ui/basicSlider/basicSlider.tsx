import { Center } from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";
import { useStyles } from "./styles";

interface BasicSliderProps {
    value?: number;
    defaultValue?: number;
    onChange: (number: number) => void;
    width?: number | string;
}

export const BasicSlider = ({
    value,
    defaultValue,
    onChange,
    width = "100%",
}: BasicSliderProps) => {
    const { classes } = useStyles();
    const [_value, handleChange, inputMode] = useUncontrolled({
        value,
        defaultValue,
        finalValue: 0,
        onChange,
        rule: (val) => typeof val === "object",
    });

    return (
        <Center sx={{ width: width }}>
            {/* <Slider value={imageEditor.strokeWidth} onChange={(value) => onChange(value)} /> */}
            <input
                type="range"
                min="1"
                max="100"
                className={classes.slider}
                value={_value!}
                onChange={(event) => handleChange(parseInt(event.target.value))}
            />
        </Center>
    );
};
