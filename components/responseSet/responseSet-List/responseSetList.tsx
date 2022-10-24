// @flow
import * as React from 'react'
import { ResponseSet as ResponseSetModel } from '@lib/responseSet/data/responseSet.model'
import { CleanedCamel } from '../../../type-helpers'
import { ResponseSet } from '@components/responseSet'
import { Stack } from '@mantine/core'

type ResponseSetListProps = {
    responseSets?: CleanedCamel<ResponseSetModel>[]
}

export const ResponseSetList = ({ responseSets }: ResponseSetListProps) => {
    if (responseSets?.length) {
        return (
            <Stack spacing={'sm'}>
                {responseSets.map((responseSet) => (
                    <ResponseSet
                        responseSet={responseSet}
                        key={responseSet.id}
                    />
                ))}
            </Stack>
        )
    }
    return null
}
