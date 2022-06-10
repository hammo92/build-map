export interface TextFieldProps {
    name: string;
    type: "text";
    value?: string;
    config: {
        subtype: "shortText" | "longText";
    };
}
