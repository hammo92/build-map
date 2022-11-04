import { Field as FieldProps } from '@lib/field/data/field.model'
import React from 'react'
import { Stack } from '@mantine/core'
import { getFieldElement } from './utils/fieldElement'
import { CleanedCamel } from 'type-helpers'
import { AdditionalAssets } from '@components/field/field-additional/additional-assets'
import { AdditionalNote } from '@components/field/field-additional/additional-note'
import { AdditionalMenu } from '@components/field/field-additional/additional-menu'

export const Field = ({ field }: { field: CleanedCamel<FieldProps> }) => {
    return (
        <Stack
            p="sm"
            spacing="xs"
            sx={(theme) => ({
                background: theme.colors.dark[6],
                borderRadius: theme.radius.sm,
                position: 'relative',
            })}
        >
            {getFieldElement({
                field,
                rightContent: <AdditionalMenu field={field} />,
            })}
            <AdditionalNote field={field} />
            <AdditionalAssets field={field} />
        </Stack>
    )
}
