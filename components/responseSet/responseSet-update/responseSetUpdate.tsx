// @flow
import * as React from 'react'
import { CleanedCamel } from '../../../type-helpers'
import { Option, ResponseSet } from '@lib/responseSet/data/responseSet.model'
import { closeAllModals, openModal } from '@mantine/modals'
import { Button, Group, Stack } from '@mantine/core'
import { SmartForm } from '@components/smartForm'
import {
    useCreateResponseSet,
    useUpdateResponseSet,
} from '@data/responseSet/hooks'
import { useFormContext } from 'react-hook-form'

type ResponseSetCreateProps = {
    responseSet: CleanedCamel<ResponseSet>
    onUpdate?: (responseSet: CleanedCamel<ResponseSet>) => void
    component?: React.ReactElement
}

type SubmitButtonProps = {
    disabled: boolean
}

const SubmitButton = ({ disabled }: SubmitButtonProps) => {
    const { watch, formState } = useFormContext()
    const options = watch('data')
    return (
        <Button
            type={'submit'}
            disabled={disabled || !options?.length || !formState.isDirty}
            sx={{ flex: 1 }}
        >
            Update
        </Button>
    )
}

const ResponseSetUpdateForm = ({
    onUpdate,
    responseSet,
}: Omit<ResponseSetCreateProps, 'component'>) => {
    const { mutateAsync, isLoading } = useUpdateResponseSet()
    return (
        <SmartForm
            formName="responseSetUpdate"
            onSubmit={async (values: { name: string; data: Option[] }) => {
                console.log('👉 values >>', values)
                const { responseSet: updatedResponseSet } = await mutateAsync({
                    responseSetId: responseSet.id,
                    options: values.data,
                    name: values.name,
                })
                onUpdate && onUpdate(updatedResponseSet)
                closeAllModals()
            }}
            defaultValues={{
                name: responseSet.name,
                data: responseSet.options,
            }}
        >
            <Stack>
                <SmartForm.TextInput label="Name" name="name" />
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

export const ResponseSetUpdate = ({
    responseSet,
    onUpdate,
    component,
}: ResponseSetCreateProps) => {
    const onClick = () => {
        openModal({
            title: 'Create New Response Set',
            closeOnClickOutside: false,
            children: (
                <ResponseSetUpdateForm
                    onUpdate={onUpdate}
                    responseSet={responseSet}
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
