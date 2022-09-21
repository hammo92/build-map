import { SmartForm } from "@components/smartForm";
import { useGetContent, useUpdateContentValues } from "@data/content/hooks";
import { Content as ContentProps } from "@lib/content/data/content.model";
import { ContentField } from "@lib/content/data/types";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import {
    Box,
    Card,
    createStyles,
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
import { FieldsGroup, groupFields } from "./content-fields/fields-group";
import { ContentHeader } from "./content-header";
import { ContentHistory } from "./content-history";
import { ContentStatusBadge } from "./content-status/status-badge";
dayjs.extend(relativeTime);

export const FIELD_SUFFIXES = {
    NOTE: "-note",
    ASSETS: "-assets",
};

function convertContentDataForSmartForm(fields: Required<Partial<ContentField>, "id">[]) {
    console.log("fields :>> ", fields);
    return fields.reduce((acc, field) => {
        return {
            ...acc,
            [field.id]: field.value ?? null,
            [`${field.id}${FIELD_SUFFIXES.NOTE}`]: field.note ?? null,
            [`${field.id}${FIELD_SUFFIXES.ASSETS}`]: field.assets ?? null,
        };
    }, {});
}

const convertFormData = (values: Record<string, any>) => {
    return Object.entries(values).reduce<Record<string, any>>((acc, [key, value]) => {
        const [id, property = "value"] = key.split("-");
        if (!acc[id]) {
            acc[id] = {};
        }
        acc[id][property] = value;
        return acc;
    }, {});
};

const useStyles = createStyles((theme, _params, getRef) => ({
    group: {
        //backgroundColor: theme.colors.dark[7],
        //paddingBottom: `${theme.spacing.sm}px`,
    },
    child: {
        ref: getRef("child"),
        display: "flex",
        //padding: `0 ${theme.spacing.sm}px`,
    },
    indent: {
        backgroundColor: theme.colors.dark[5],

        width: "2px",
        margin: `0 ${theme.spacing.sm}px`,
        alignSelf: "stretch",
    },
}));

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
            console.log("convertFormData(values), :>> ", convertFormData(values));
            await mutateAsync({
                contentId: content.id,
                values: convertFormData(values),
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
                    <Grid px="md">
                        <Grid.Col span={9}>
                            <Box
                                sx={(theme) => ({
                                    background: theme.colors.dark[7],
                                    borderRadius: theme.radius[theme.defaultRadius as "sm"],
                                })}
                            >
                                <Tabs defaultValue="templateFields">
                                    <Tabs.List>
                                        <Tabs.Tab value="templateFields" p="md">
                                            {contentTemplate.name} Template Fields
                                        </Tabs.Tab>
                                        <Tabs.Tab value="additionalContent" p="md">
                                            Additional Fields
                                        </Tabs.Tab>
                                    </Tabs.List>

                                    <Tabs.Panel value="templateFields">
                                        <Stack pt={0} spacing="sm" p="xs">
                                            <>
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
                                                            <ContentFieldManager
                                                                content={content}
                                                            />
                                                        </Group>
                                                        <Divider />
                                                    </>
                                                )}

                                                {active && (
                                                    <FieldsGroup
                                                        fieldGroup={groupFields({ content })}
                                                        content={content}
                                                    />
                                                )}
                                            </>
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
