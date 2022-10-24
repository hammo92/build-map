import { IconTitle } from '@components/ui/iconTitle/iconTitle'
import { FieldType } from '@lib/field/data/field.model'
import { Card, SimpleGrid, Stack, Title } from '@mantine/core'
import React from 'react'
import { FIELD_OPTIONS, FieldTypeProps } from './options'
import { useStyles } from './styles'
import { propertyManager } from '@state/propertyManager'
import { fork, listify, mapValues } from 'radash'

interface typeSelectProps {
    onSelect: (type: FieldType) => void
}

const TypeCard = ({
    fieldOption,
    onSelect,
}: typeSelectProps & { fieldOption: FieldTypeProps }) => {
    const { classes } = useStyles({ disabled: fieldOption.disabled ?? false })
    return (
        <Card
            key={fieldOption.label}
            className={classes.clickableCard}
            onClick={() =>
                fieldOption.disabled ? null : onSelect(fieldOption.type)
            }
        >
            <IconTitle
                icon={fieldOption.icon}
                title={fieldOption.label}
                subtitle={fieldOption.description}
            />
        </Card>
    )
}

export const TypeSelect = ({ onSelect }: typeSelectProps) => {
    const { propertyMap } = propertyManager
    const usedTypes = [
        ...new Set(listify(propertyMap, (key, value) => value.type)),
    ]

    const { single, multiple } = Object.values(FIELD_OPTIONS).reduce<{
        single: JSX.Element[]
        multiple: JSX.Element[]
    }>(
        (acc, option) => {
            if (option.single) {
                acc.single.push(
                    TypeCard({
                        fieldOption: {
                            ...option,
                            disabled: usedTypes.includes(option.type),
                        },
                        onSelect,
                    })
                )
                return acc
            }
            acc.multiple.push(
                TypeCard({
                    fieldOption: {
                        ...option,
                    },
                    onSelect,
                })
            )
            return acc
        },
        {
            single: [],
            multiple: [],
        }
    )

    return (
        <Stack spacing={'sm'}>
            <Title order={5}>Unique Properties</Title>
            <SimpleGrid cols={2}>{single}</SimpleGrid>
            <Title order={5}>Repeatable Properties</Title>
            <SimpleGrid cols={2}>{multiple}</SimpleGrid>
        </Stack>
    )
}
