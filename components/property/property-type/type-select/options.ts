import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { FieldType } from '@lib/field/data/field.model'
import { alphabetical } from 'radash'
import {
    fa1,
    faListCheck,
    faListDropdown,
    faSquareCheck,
    faText,
    faParagraph,
    faImage,
    faCalendar,
    faAt,
    faTableCellsLarge,
    faAlarmClock,
    faLink,
    faSpinner,
    faUser,
    faPenLine,
} from '@fortawesome/pro-solid-svg-icons'

interface variant {
    type: string
    description: string
    label: string
}

export interface FieldTypeProps {
    type: FieldType
    description: string
    label: string
    icon: FontAwesomeIconProps['icon']
    variants?: variant[]
    /** whether there can be multiple instances of a field */
    unique?: boolean
    disabled?: boolean
}

export const UNIQUE_FIELDS: readonly FieldType[] = [
    'title',
    'deadline',
    'assignee',
    'status',
] as const

// object key must match type
export const FIELD_TYPES: { [key in FieldType]: FieldTypeProps } = {
    select: {
        type: 'select',
        description: 'Pick a unique option from a list',
        label: 'Select',
        icon: faListDropdown,
    },
    multiSelect: {
        type: 'multiSelect',
        description: 'Pick multiple options from a list',
        label: 'Multi Select',
        icon: faListCheck,
    },
    checkbox: {
        type: 'checkbox',
        description: 'Yes or no',
        label: 'Checkbox',
        icon: faSquareCheck,
    },
    number: {
        type: 'number',
        description: 'Numbers (integers, float, decimal)',
        label: 'Number',
        icon: fa1,
        variants: [
            {
                type: 'integer',
                description: 'Whole numbers (ex: 10)',
                label: 'Integer',
            },
            {
                type: 'decimal',
                description: 'With two decimals (ex:3.21)',
                label: 'Decimal',
            },
            {
                type: 'float',
                description: 'With multiple decimals (ex:3.333333333)',
                label: 'Float',
            },
        ],
    },
    text: {
        type: 'text',
        description: 'Short or long text',
        label: 'Text',
        icon: faText,
        variants: [
            {
                type: 'shortText',
                description: 'Good for titles, and names',
                label: 'Short Text',
            },
            {
                type: 'longText',
                description: 'Good for descriptions',
                label: 'Long Text',
            },
        ],
    },
    richText: {
        type: 'richText',
        description: 'Text with formatting options',
        label: 'Rich Text',
        icon: faParagraph,
    },
    image: {
        type: 'image',
        description: 'Single or multiple images',
        label: 'Image',
        icon: faImage,
        variants: [
            {
                type: 'single',
                description: 'Add a single image',
                label: 'Single Image',
            },
            {
                type: 'multiple',
                description: 'Add multiple images',
                label: 'Multiple Images',
            },
        ],
    },
    date: {
        type: 'date',
        description: 'Date and time',
        label: 'Date',
        icon: faCalendar,
        variants: [
            {
                type: 'date',
                description: 'Day, month, and year',
                label: 'Date',
            },
            {
                type: 'dateTime',
                description: 'Day, month, year, hour and minute',
                label: 'Date and Time',
            },
            {
                type: 'time',
                description: 'Hour and minute',
                label: 'Time',
            },
        ],
    },
    email: {
        type: 'email',
        description: 'An Email address',
        label: 'Email',
        icon: faAt,
    },
    component: {
        type: 'component',
        description: 'A custom component',
        label: 'Component',
        icon: faTableCellsLarge,
    },
    relation: {
        type: 'relation',
        description: 'Link content entries together',
        label: 'Relation',
        icon: faLink,
    },
    deadline: {
        type: 'deadline',
        description: 'Set a due date',
        label: 'Deadline',
        icon: faAlarmClock,
        unique: true,
    },
    title: {
        type: 'title',
        description: 'Content title',
        label: 'Title',
        icon: faPenLine,
        unique: true,
    },
    assignee: {
        type: 'assignee',
        description: 'Assign to a user',
        label: 'Assignee',
        icon: faUser,
        unique: true,
    },

    status: {
        type: 'status',
        description: 'Set options for content progress',
        label: 'status',
        icon: faSpinner,
        unique: true,
    },
    people: {
        type: 'people',
        description: 'refer to users',
        label: 'People',
        icon: faUser,
    },
}

export const FIELD_OPTIONS = alphabetical(
    Object.keys(FIELD_TYPES).map(
        (key) => FIELD_TYPES[key as keyof typeof FIELD_TYPES]
    ),
    (f) => f.label
)
