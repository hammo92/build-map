import { ContentTemplate } from '../../../lib/contentTemplate/data/contentTemplate.model'
import { defaultProperties } from '../../../lib/task/constants/defaultProperties'

export const generateTaskTemplate = async (organisationId: string) => {
    // create template
    const taskTemplate = new ContentTemplate({
        id: `taskTemplate${organisationId}`,
    })
    const properties = defaultProperties(taskTemplate.id)

    //set default values
    taskTemplate.name = 'Task'
    taskTemplate.icon = {
        icon: {
            icon: [
                384,
                512,
                [],
                'f737',
                'M320 64h-49.61C262.1 27.48 230.7 0 192 0S121 27.48 113.6 64H64C28.65 64 0 92.66 0 128v320c0 35.34 28.65 64 64 64h256c35.35 0 64-28.66 64-64V128C384 92.66 355.3 64 320 64zM192 48c13.23 0 24 10.77 24 24S205.2 96 192 96S168 85.23 168 72S178.8 48 192 48zM336 448c0 8.82-7.178 16-16 16H64c-8.822 0-16-7.18-16-16V128c0-8.82 7.178-16 16-16h18.26C80.93 117.1 80 122.4 80 128v16C80 152.8 87.16 160 96 160h192c8.836 0 16-7.164 16-16V128c0-5.559-.9316-10.86-2.264-16H320c8.822 0 16 7.18 16 16V448zM288 256H176C167.2 256 160 263.2 160 272S167.2 288 176 288H288c8.844 0 16-7.156 16-16S296.8 256 288 256zM288 352H176C167.2 352 160 359.2 160 368S167.2 384 176 384H288c8.844 0 16-7.156 16-16S296.8 352 288 352zM104 344c-13.25 0-24 10.75-24 24s10.75 24 24 24C117.3 392 128 381.3 128 368S117.3 344 104 344zM108 288c4.094 0 8.188-1.562 11.31-4.688l48-48c6.25-6.25 6.25-16.38 0-22.62s-16.38-6.25-22.62 0L108 249.4L95.31 236.7c-6.25-6.25-16.38-6.25-22.62 0s-6.25 16.38 0 22.62l24 24C99.81 286.4 103.9 288 108 288z',
            ],
            iconName: 'clipboard-list-check',
            prefix: 'far',
        },
        color: 'teal',
    }
    taskTemplate.status = 'published'
    taskTemplate.templateType = 'task'
    taskTemplate.organisationId = organisationId
    taskTemplate.properties = properties
    taskTemplate.propertyGroups = [
        {
            name: 'root',
            id: '1',
            type: 'propertyGroup',
            children: properties.map(({ id }) => id),
            repeatable: false,
        },
    ]
    taskTemplate.title = {
        setType: 'manual',
        type: 'contentProperty',
        value: 'title',
    }

    await taskTemplate.save()
}
