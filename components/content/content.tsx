import { SmartForm } from "@components/smartForm";
import { useGetContent, useUpdateContentValues } from "@data/content/hooks";
import { Content as ContentProps } from "@lib/content/data/content.model";
import { ContentField } from "@lib/content/data/types";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import {
    Box,
    Button,
    Card,
    Divider,
    Grid,
    Group,
    SimpleGrid,
    Stack,
    Tabs,
    Text,
    Title,
} from "@mantine/core";
import { useId } from "@mantine/hooks";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CleanedCamel } from "type-helpers";
import { Required } from "utility-types";
import { AdditionalFieldCreate } from "./content-additionalField/additionalField-create";
import { ContentFieldManager } from "./content-fieldManager";
import { ContentFields } from "./content-fields";
import { ContentHeader } from "./content-header";
import { ContentHistory } from "./content-history";
import { ContentOutdated } from "./content-outdated";
import { ContentStatusBadge } from "./content-status/status-badge";
dayjs.extend(relativeTime);

function convertContentDataForSmartForm(fields: Required<Partial<ContentField>, "id">[]) {
    return fields.reduce((ac, a) => ({ ...ac, [a.id]: a.value ?? null }), {});
}

//check contentTemplate id is defined before fetching
// has to be a seperate component to respect hooks order on rerender
export const Content = ({
    content,
    contentTemplate,
}: {
    content: CleanedCamel<ContentProps>;
    contentTemplate: CleanedCamel<ContentTemplate>;
}) => {
    const { data, isLoading } = useGetContent(content.id, { content });
    const { mutateAsync, isLoading: mutateLoading } = useUpdateContentValues();
    const uuid = useId();

    if (isLoading) return <p>loading</p>;

    if (data?.content?.fields && data.content) {
        const defaultValues = convertContentDataForSmartForm(data?.content?.fields);

        // split into categories
        const { active, hidden, additional } = data?.content.fields.reduce<{
            active: ContentField[];
            hidden: ContentField[];
            additional: ContentField[];
        }>(
            (acc, curr) => {
                if (curr.active && curr.category === "template") {
                    acc.active.push(curr);
                } else if (!curr.active && curr.category === "template") {
                    acc.hidden.push(curr);
                } else if (curr.category === "additional") {
                    acc.additional.push(curr);
                }
                return acc;
            },
            { active: [], hidden: [], additional: [] }
        );
        const onSubmit = async (values: any) => {
            await mutateAsync({
                contentId: content.id,
                values,
            });
        };
        return (
            <SmartForm
                defaultValues={defaultValues}
                formName={content.id}
                onSubmit={onSubmit}
                key={content.id}
                readOnly={data.content.status === "archived"}
                submitType="dirty"
            >
                <Stack align="stretch">
                    <ContentHeader
                        content={data.content}
                        contentTemplate={contentTemplate}
                        loading={mutateLoading}
                    />
                    <Grid>
                        <Grid.Col span={9}>
                            <Box
                                //p="md"
                                sx={(theme) => ({
                                    background: theme.colors.dark[7],
                                    borderRadius: theme.radius[theme.defaultRadius as "sm"],
                                })}
                            >
                                <Tabs defaultValue="templateFields">
                                    <Tabs.List grow mb="sm">
                                        <Tabs.Tab value="templateFields" p="md">
                                            {contentTemplate.name} Template Fields
                                        </Tabs.Tab>
                                        <Tabs.Tab value="additionalContent" p="md">
                                            Additional Fields
                                        </Tabs.Tab>
                                    </Tabs.List>

                                    <Tabs.Panel value="templateFields">
                                        <Stack p="md" pt={0} spacing="sm">
                                            {hidden && hidden?.length > 0 && (
                                                <>
                                                    <Group position="apart">
                                                        <Text size="sm" color="dimmed">
                                                            {hidden?.length}{" "}
                                                            {hidden?.length === 1
                                                                ? "tempate field is"
                                                                : "tempate fields are"}{" "}
                                                            hidden
                                                        </Text>
                                                        <ContentFieldManager content={content} />
                                                    </Group>
                                                    <Divider />
                                                </>
                                            )}
                                            {active && (
                                                <ContentFields
                                                    fields={active}
                                                    contentId={content.id}
                                                />
                                            )}
                                        </Stack>
                                    </Tabs.Panel>
                                    <Tabs.Panel value="additionalContent">
                                        <Stack p="md" pt={0} spacing="sm">
                                            {additional && (
                                                <ContentFields
                                                    fields={additional}
                                                    contentId={content.id}
                                                    removable
                                                    editable
                                                />
                                            )}
                                            <AdditionalFieldCreate
                                                content={content}
                                                variant="button"
                                            />
                                        </Stack>
                                    </Tabs.Panel>
                                </Tabs>
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Stack>
                                <Card>
                                    <Card.Section
                                        p="sm"
                                        sx={(theme) => ({ background: theme.colors.dark[7] })}
                                    >
                                        <Title order={4}>Information</Title>
                                    </Card.Section>
                                    <Card.Section p="sm">
                                        <SimpleGrid cols={2} spacing="sm">
                                            <Text>Status</Text>
                                            <ContentStatusBadge
                                                status={data.content.status}
                                                size="lg"
                                            />
                                            <Text>Created at:</Text>
                                            <Text>
                                                {dayjs(data.content.createdTime).format(
                                                    "D/MM/YY HH:mm:ss"
                                                )}
                                            </Text>
                                            <Text>Last Edited:</Text>
                                            <Text>
                                                {dayjs(data.content.lastEditedTime).format(
                                                    "D/MM/YY HH:mm:ss"
                                                )}
                                            </Text>
                                        </SimpleGrid>
                                    </Card.Section>
                                    {data.content.history && (
                                        <Card.Section p="sm" withBorder>
                                            <ContentHistory
                                                content={data.content}
                                                contentTemplate={contentTemplate}
                                            />
                                        </Card.Section>
                                    )}
                                    {/* {data.content.outdated && data.content.status !== "archived" && (
                                        <Card.Section p="sm">
                                            <ContentOutdated
                                                content={data.content}
                                                contentTemplate={contentTemplate}
                                            />
                                        </Card.Section>
                                    )} */}
                                </Card>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Stack>
            </SmartForm>
        );
    }
    return null;
};
