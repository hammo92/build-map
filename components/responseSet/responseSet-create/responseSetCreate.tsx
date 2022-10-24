// @flow
import * as React from 'react'
import { CleanedCamel } from '../../../type-helpers'
import { Option, ResponseSet } from '@lib/responseSet/data/responseSet.model'
import { closeAllModals, openModal } from '@mantine/modals'
import { Button, Group, Stack } from '@mantine/core'
import { SmartForm } from '@components/smartForm'
import { useCreateResponseSet } from '@data/responseSet/hooks'
import { useFormContext } from 'react-hook-form'

type ResponseSetCreateProps = {
    parentId?: string
    onCreate?: (responseSet: CleanedCamel<ResponseSet>) => void
    component?: React.ReactElement
}

type SubmitButtonProps = {
    disabled: boolean
}

const SubmitButton = ({ disabled }: SubmitButtonProps) => {
    const { watch } = useFormContext()
    const options = watch('data')
    return (
        <Button
            type={'submit'}
            disabled={disabled || !options?.length}
            sx={{ flex: 1 }}
        >
            Create
        </Button>
    )
}

const ResponseSetCreateForm = ({
    onCreate,
    parentId,
}: Omit<ResponseSetCreateProps, 'component'>) => {
    const { mutateAsync, isLoading } = useCreateResponseSet()
    return (
        <SmartForm
            formName="responseSetCreate"
            onSubmit={async (values: { name: string; data: Option[] }) => {
                const { responseSet } = await mutateAsync({
                    options: values.data,
                    parent: parentId,
                    name: values.name,
                })
                onCreate && onCreate(responseSet)
                closeAllModals()
            }}
        >
            <Stack>
                <SmartForm.TextInput label="Name" name="name" required />
                <SmartForm.OptionList
                    name="data"
                    required
                    description="You can add multiple by separating with a comma"
                    label="Options"
                    placeholder={'option 1, option 2, option 3'}
                />
            </Stack>
            <Group grow mt="md">
                <Button
                    variant="light"
                    color="gray"
                    onClick={() => closeAllModals()}
                >
                    Cancel
                </Button>
                <SubmitButton disabled={isLoading} />
            </Group>
        </SmartForm>
    )
}

export const ResponseSetCreate = ({
    onCreate,
    component,
    parentId,
}: ResponseSetCreateProps) => {
    const onClick = () => {
        openModal({
            title: 'Create New Response Set',
            closeOnClickOutside: false,
            children: (
                <ResponseSetCreateForm
                    onCreate={onCreate}
                    parentId={parentId}
                />
            ),
        })
    }
    return (
        <>
            {component ? (
                React.cloneElement(component, { onClick })
            ) : (
                <Button onClick={onClick}>Create Response Set</Button>
            )}
        </>
    )
}
