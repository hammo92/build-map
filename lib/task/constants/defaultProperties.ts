import { Property } from '@lib/field/data/field.model'

export const defaultProperties = (templateId: string): Property[] => {
    const date = new Date().toISOString()
    return [
        {
            createdTime: date,
            parent: '1',
            type: 'text',
            createdBy: 'system',
            archived: false,
            variant: 'shortText',
            lastEditedTime: date,
            name: 'Title',
            templateId,
            id: 'title',
            lastEditedBy: 'system',
            object: 'Property',
        },
        {
            createdTime: date,
            parent: '1',
            data: [
                {
                    color: 'orange',
                    value: 'toDo',
                    label: 'To do',
                },
                {
                    color: 'grape',
                    value: 'inProgress',
                    label: 'In Progress',
                },
                {
                    color: 'teal',
                    value: 'complete',
                    label: 'Complete',
                },
                {
                    color: 'red',
                    value: 'stalled',
                    label: 'Stalled',
                },
            ],
            defaultValue: ['toDo'],
            type: 'select',
            createdBy: 'system',
            archived: false,
            lastEditedTime: date,
            name: 'Status',
            templateId,
            id: 'status',
            lastEditedBy: 'system',
            object: 'Property',
        },
        {
            createdTime: date,
            parent: '1',
            data: [
                {
                    color: 'teal',
                    value: 'low',
                    label: 'Low',
                },
                {
                    color: 'orange',
                    value: 'medium',
                    label: 'Medium',
                },
                {
                    color: 'red',
                    value: 'high',
                    label: 'High',
                },
            ],
            defaultValue: ['low'],
            type: 'select',
            createdBy: 'system',
            archived: false,
            lastEditedTime: date,
            name: 'Priority',
            templateId,
            id: 'priority',
            lastEditedBy: 'system',
            object: 'Property',
        },
        {
            createdTime: date,
            parent: '1',
            type: 'text',
            createdBy: 'system',
            archived: false,
            variant: 'longText',
            lastEditedTime: date,
            name: 'Description',
            templateId,
            id: 'description',
            lastEditedBy: 'system',
            object: 'Property',
        },
    ]
}
