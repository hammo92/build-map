import { History } from '@components/history'
import { PropertyManager } from '@components/property/property-manager'

import { useGetContentTemplate } from '@data/contentTemplate/hooks'
import { ContentTemplate as ContentTemplateProps } from '@lib/contentTemplate/data/contentTemplate.model'
import {
    Card,
    Container,
    Grid,
    SimpleGrid,
    Stack,
    Text,
    Title,
} from '@mantine/core'
import { contentTemplateState } from '@state/contentTemplate'
import dayjs from 'dayjs'
import Image from 'next/image'
import { CleanedCamel } from 'type-helpers'
import Illustration from '../../public/images/tokyo/2.0-04.svg'
import { ContentTemplateHeader } from './contentTemplate-header/contentTemplateHeader'

const NoContentTemplates = () => (
    <Container p="md" fluid>
        <Stack>
            <Container size="sm">
                <Image src={Illustration} alt="select a form" />
            </Container>
        </Stack>
    </Container>
)

export const ContentTemplate = ({
    contentTemplate,
}: {
    contentTemplate: CleanedCamel<ContentTemplateProps>
}) => {
    contentTemplateState.contentTemplateId = contentTemplate.id
    contentTemplateState.templateType = contentTemplate.templateType
    const { data } = useGetContentTemplate(contentTemplate.id, {
        contentTemplate,
    })

    if (data?.contentTemplate) {
        return (
            <Stack>
                <>
                    <ContentTemplateHeader
                        contentTemplate={data?.contentTemplate}
                    />
                    <Grid>
                        <Grid.Col span={9}>
                            <PropertyManager
                                properties={data?.contentTemplate.properties}
                                propertyGroups={
                                    data?.contentTemplate.propertyGroups
                                }
                            />
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Card>
                                <Card.Section
                                    p="sm"
                                    sx={(theme) => ({
                                        background: theme.colors.dark[7],
                                    })}
                                >
                                    <Title order={4}>Info</Title>
                                </Card.Section>
                                <Card.Section p="sm">
                                    <SimpleGrid cols={2} spacing="sm">
                                        <Text>Created at:</Text>
                                        <Text>
                                            {dayjs(
                                                data.contentTemplate.createdTime
                                            ).format('D/MM/YY HH:mm:ss')}
                                        </Text>
                                        <Text>Last Edited:</Text>
                                        <Text>
                                            {dayjs(
                                                data.contentTemplate
                                                    .lastEditedTime
                                            ).format('D/MM/YY HH:mm:ss')}
                                        </Text>
                                    </SimpleGrid>
                                </Card.Section>
                            </Card>
                        </Grid.Col>
                    </Grid>
                </>
            </Stack>
        )
    }
    return null
}

ContentTemplate.NullState = NoContentTemplates
