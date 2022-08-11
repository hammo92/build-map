const input = { input: { "&:disabled": { color: "white" } } };

const inputs = [
    "TextInput",
    "Textarea",
    "AutoComplete",
    "NumberInput",
    "Checkbox",
    "Input",
    "PasswordInput",
    "DatePicker",
    "TimeInput",
];

let inputStyles = {};

inputs.forEach((title) => {
    inputStyles = {
        ...inputStyles,
        [title]: input,
    };
});

export const styles = {
    ...inputStyles,
};
