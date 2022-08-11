import {
    fa1,
    faAt,
    faCalendar,
    faImage,
    faLink,
    faListCheck,
    faListDropdown,
    faParagraph,
    faSquareCheck,
    faTableCellsLarge,
    faText,
    faUser,
} from "@fortawesome/pro-regular-svg-icons";
import { FieldTypeProps } from "./contentTemplateTypes";

export type FieldType =
    | "checkbox"
    | "component"
    | "date"
    | "email"
    | "image"
    | "multiSelect"
    | "number"
    | "richText"
    | "select"
    | "text"
    | "relation"
    | "person";

// object key must match type
export const FIELD_TYPES: { [type: string]: FieldTypeProps } = {
    select: {
        type: "select",
        description: "Pick a single option from a list",
        label: "Select",
        icon: faListDropdown,
    },
    multiSelect: {
        type: "multiSelect",
        description: "Pick multiple options from a list",
        label: "Multi Select",
        icon: faListCheck,
    },
    checkbox: {
        type: "checkbox",
        description: "Yes or no",
        label: "Checkbox",
        icon: faSquareCheck,
    },
    number: {
        type: "number",
        description: "Numbers (integers, float, decimal)",
        label: "Number",
        icon: fa1,
        subtypes: [
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
    text: {
        type: "text",
        description: "Short or long text",
        label: "Text",
        icon: faText,
        subtypes: [
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
        subtypes: [
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
    date: {
        type: "date",
        description: "Date and time",
        label: "Date",
        icon: faCalendar,
        subtypes: [
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
    email: {
        type: "email",
        description: "An Email address",
        label: "Email",
        icon: faAt,
    },
    component: {
        type: "component",
        description: "A custom component",
        label: "Component",
        icon: faTableCellsLarge,
    },
    relation: {
        type: "relation",
        description: "refer to another content entry",
        label: "Relation",
        icon: faLink,
        //subtypes: [
        // {
        //     type: "oneWaySingle",
        //     description: "Refer to another content entry",
        //     label: "One way single",
        // },
        // {
        //     type: "oneWayMultiple",
        //     description: "Refer to multiple content entries",
        //     label: "One way multiple",
        // },
        // {
        //     type: "oneToOne",
        //     description: "Refer to and be referenced by a content entry",
        //     label: "One to one",
        // },
        // {
        //     type: "oneToMany",
        //     description: "Refer to many entries each referencing back",
        //     label: "One to many",
        // },
        // {
        //     type: "manyToOne",
        //     description: "Referenced by many entries",
        //     label: "Many to one",
        // },
        // {
        //     type: "manyToMany",
        //     description: "Refer to and referenced by multiple entries",
        //     label: "Many to many",
        // },
        // ],
    },
    person: {
        type: "person",
        description: "refer to a person",
        label: "Person",
        icon: faUser,
    },
};

export const FIELD_OPTIONS = Object.keys(FIELD_TYPES).map(
    (key) => FIELD_TYPES[key as keyof typeof FIELD_TYPES]
);
