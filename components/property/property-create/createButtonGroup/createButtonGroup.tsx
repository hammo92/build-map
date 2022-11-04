import { PropertyCreate } from '@components/property/property-create'
import { Button } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCube, faFolderPlus } from '@fortawesome/pro-regular-svg-icons'
import { GroupCreate } from '@components/property/property-group/group-create'
import React from 'react'

export const CreateButtonGroup = ({ parentId }: { parentId: string }) => (
    <Button.Group sx={{ flex: '1' }}>
        <PropertyCreate
            parentId={`${parentId}`}
            isModal
            buttonElement={
                <Button
                    variant={'default'}
                    sx={{ flex: '1' }}
                    leftIcon={<FontAwesomeIcon icon={faCube} />}
                >
                    Add Property
                </Button>
            }
        />
        <GroupCreate
            parentId={`${parentId}`}
            component={
                <Button
                    variant={'default'}
                    sx={{ flex: '1' }}
                    leftIcon={<FontAwesomeIcon icon={faFolderPlus} />}
                >
                    Add Group
                </Button>
            }
        />
    </Button.Group>
)
