import { proxy } from 'valtio'
import { ContentTemplate } from '@lib/contentTemplate/data/contentTemplate.model'

export interface ContentTemplateStateProps {
    hasEditPermission: boolean
    contentTemplateId: string
    deletingGroup: string | number
    templateType?: ContentTemplate['templateType']
    processingItems: (string | number)[]
    editing: boolean
}

export const contentTemplateState = proxy<ContentTemplateStateProps>({
    hasEditPermission: true,
    contentTemplateId: '',
    templateType: undefined,
    deletingGroup: '',
    processingItems: [],
    editing: false,
})
