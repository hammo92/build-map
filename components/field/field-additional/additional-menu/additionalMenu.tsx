import {
    faEllipsis,
    faFile,
    faNote,
    faTasks,
    faTrash,
} from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ActionIcon, Menu, useMantineTheme } from '@mantine/core'
import { MenuAddAssets } from './menu-addAssets'
import { MenuAddNote } from './menu-addNote'
import { CleanedCamel } from '../../../../type-helpers'
import { Field } from '@lib/field/data/field.model'
import { useDeleteField } from '@data/field/hooks'

export const AdditionalMenu = ({ field }: { field: CleanedCamel<Field> }) => {
    const { mutateAsync } = useDeleteField()
    const theme = useMantineTheme()
    return (
        <Menu position={'left-start'} withinPortal>
            <Menu.Target>
                <ActionIcon
                    sx={{
                        position: 'absolute',
                        top: `${theme.spacing.sm}px`,
                        right: `${theme.spacing.sm}px`,
                    }}
                    size="sm"
                >
                    <FontAwesomeIcon icon={faEllipsis} />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Additional Info</Menu.Label>
                <MenuAddNote field={field} />
                <MenuAddAssets field={field} />
                <Menu.Divider />
                <Menu.Label>Linked</Menu.Label>
                <Menu.Item icon={<FontAwesomeIcon icon={faTasks} />}>
                    Task
                </Menu.Item>
                {!field.templatePropertyId && (
                    <>
                        <Menu.Divider />
                        <Menu.Label>Danger Zone</Menu.Label>
                        <Menu.Item
                            icon={<FontAwesomeIcon icon={faTrash} />}
                            color="red"
                            onClick={() => mutateAsync({ fieldId: field.id })}
                        >
                            Delete
                        </Menu.Item>
                    </>
                )}
            </Menu.Dropdown>
        </Menu>
    )
}
