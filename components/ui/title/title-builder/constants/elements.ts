import { TitleElementProps } from '@components/ui/title/title-builder/titleBuilder-element'

export const ELEMENT_OPTIONS = [
    'entryNumber',
    'createdDate',
    'createdTime',
    //'updatedDate',
    //'updatedTime',
] as const

export const ELEMENTS: {
    title: string
    type: TitleElementProps['type']
    options: readonly TitleElementProps['variant'][]
}[] = [
    {
        type: 'input',
        title: 'User input',
        options: ['text', 'number'],
    },
    {
        type: 'variable',
        title: 'Generated value',
        options: ELEMENT_OPTIONS,
    },
]
