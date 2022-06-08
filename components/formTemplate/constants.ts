import {
    fa1,
    faAt,
    faCalendar,
    faImage,
    faListDropdown,
    faParagraph,
    faSquareCheck,
    faText,
} from "@fortawesome/pro-regular-svg-icons";
import { FieldTypeProps } from "./formTemplateTypes";

// object key must match type
export const FIELD_TYPES: { [type: string]: FieldTypeProps } = {
    select: {
        type: "select",
        description: "Pick a single type, or multiple types from a list",
        label: "Select",
        icon: faListDropdown,
        config: {
            subtype: [
                {
                    type: "single",
                    description: "Pick a single value from a list of values",
                    label: "Single",
                },
                {
                    type: "multiple",
                    description: "Pick a multiple values from a list of values",
                    label: "Multiple",
                },
            ],
        },
    },
    boolean: {
        type: "boolean",
        description: "Yes or no",
        label: "Boolean",
        icon: faSquareCheck,
    },
    number: {
        type: "number",
        description: "Numbers (integers, float, decimal)",
        label: "Number",
        icon: fa1,
        config: {
            subtype: [
                {
                    type: "integer",
                    description: "Whole numbers (ex: 10)",
                    label: "Integer",
                },
                {
                    type: "decimal",
                    description: "With two decimals (ex:3.21)",
                    label: "Decimal",
                },
                {
                    type: "float",
                    description: "With multiple decimals (ex:3.333333333)",
                    label: "Float",
                },
            ],
        },
    },
    text: {
        type: "text",
        description: "Short or long text",
        label: "Text",
        icon: faText,
        config: {
            subtype: [
                {
                    type: "shortText",
                    description: "Good for titles, and names",
                    label: "Short Text",
                },
                {
                    type: "longText",
                    description: "Good for descriptions",
                    label: "Long Text",
                },
            ],
        },
    },
    richText: {
        type: "richText",
        description: "Text with formatting options",
        label: "Rich Text",
        icon: faParagraph,
    },
    image: {
        type: "image",
        description: "Single or multiple images",
        label: "Image",
        icon: faImage,
        config: {
            subtype: [
                {
                    type: "single",
                    description: "Add a single image",
                    label: "Single Image",
                },
                {
                    type: "multiple",
                    description: "Add multiple images",
                    label: "Multiple Images",
                },
            ],
        },
    },
    date: {
        type: "date",
        description: "Date and time",
        label: "Date",
        icon: faCalendar,
        config: {
            subtype: [
                {
                    type: "date",
                    description: "Day, month, and year",
                    label: "Date",
                },
                {
                    type: "dateTime",
                    description: "Day, month, year, hour and minute",
                    label: "Date and Time",
                },
                {
                    type: "time",
                    description: "Hour and minute",
                    label: "Time",
                },
            ],
        },
    },
    email: {
        type: "email",
        description: "An Email address",
        label: "Email",
        icon: faAt,
    },
};

export const FIELD_OPTIONS = Object.keys(FIELD_TYPES).map(
    (key) => FIELD_TYPES[key as keyof typeof FIELD_TYPES]
);
