import { useDeleteContentTemplate } from '@data/contentTemplate/hooks'
import { faTrash } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ContentTemplate } from '@lib/contentTemplate/data/contentTemplate.model'
import { ActionIcon, Text } from '@mantine/core'
import { openConfirmModal, useModals } from '@mantine/modals'
import { contentTemplateState } from '@state/contentTemplate'
import { CleanedCamel } from 'type-helpers'

export const ContentTemplateDelete = ({
    contentTemplate,
}: {
    contentTemplate: CleanedCamel<ContentTemplate>
}) => {
    const modals = useModals()
    const { mutateAsync } = useDeleteContentTemplate()
    const openDeleteModal = () =>
        openConfirmModal({
            title: 'Confirm Delete Content Template',
            children: (
                <>
                    <Text>
                        {`Are you sure you want to delete the ${contentTemplate.name} content template? This action cannot be undone.`}
                    </Text>
                </>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: async () => {
                await mutateAsync(contentTemplate.id)
                contentTemplateState.contentTemplateId = ''
                modals.closeAll()
            },
        })
    return (
        <ActionIcon
            variant="light"
            color="red"
            size="lg"
            onClick={() => {
                openDeleteModal()
            }}
        >
            <FontAwesomeIcon icon={faTrash} />
        </ActionIcon>
    )
}
