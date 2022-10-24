import { ResponseSet as ResponseSetModel } from '@lib/responseSet/data/responseSet.model'
import * as React from 'react'
import { useCreateResponseSet } from '@data/responseSet/hooks'
import { Button } from '@mantine/core'
import { CleanedCamel } from '../../../type-helpers'

interface ResponseSetDuplicateProps {
    responseSet: CleanedCamel<ResponseSetModel>
    component?: React.ReactElement
}

export const ResponseSetDuplicate = ({
    responseSet,
    component,
}: ResponseSetDuplicateProps) => {
    const { mutateAsync } = useCreateResponseSet()
    const onClick = async () => {
        await mutateAsync({
            options: responseSet.options,
            parent: responseSet.parent,
            name: `${responseSet.name} (copy)`,
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
