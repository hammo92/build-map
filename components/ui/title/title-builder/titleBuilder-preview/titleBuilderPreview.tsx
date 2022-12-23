import React from 'react'
import { useStyles } from './styles'
import {
    Card,
    Group,
    NumberInput,
    Skeleton,
    Text,
    TextInput,
} from '@mantine/core'
import { TitleElementProps } from '@components/ui/title/title-builder/titleBuilder-element'

export const PREVIEWS: Record<string, JSX.Element> = {
    text: <TextInput placeholder={'text'} size={'xs'} />,
    number: <NumberInput placeholder={'10'} size={'xs'} />,
    entryNumber: <Text size={'xs'}>123</Text>,
    createdDate: <Text size={'xs'}>12/04/2023</Text>,
    createdTime: <Text size={'xs'}>12:00:00</Text>,
    updatedDate: <Text size={'xs'}>12/04/2023</Text>,
    updatedTime: <Text size={'xs'}>12:00:00</Text>,
}

export const TitleBuilderPreview = ({
    fields,
}: {
    fields: TitleElementProps[]
}) => {
    const { classes } = useStyles()
    return (
        <Card
            p={'sm'}
            sx={(theme) => ({
                background: theme.colors.dark[8],
                borderRadius: `0 0 ${
                    theme.radius[theme.defaultRadius as 'sm']
                }px ${theme.radius[theme.defaultRadius as 'sm']}px `,
            })}
        >
            <Group spacing={0}>
                {fields.map((field) => {
                    console.log('👉 field.value >>', field.value)
                    if (field.type === 'string') {
                        return (
                            <Text
                                size={'xs'}
                                style={{ whiteSpace: 'pre-wrap' }}
                            >
                                {field.value}
                            </Text>
                        )
                    }
                    return <>{PREVIEWS[field.variant!]}</>
                })}
            </Group>
        </Card>
    )
}
