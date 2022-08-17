import { ContentTitle } from "@components/content/content-title";
import {
    ContentUpdateProperty,
    ContentUpdates,
    ContentUpdateValue,
} from "@lib/content/data/content.model";
import { ContentField } from "@lib/content/data/types";
import { Code, Group, Stack, Text } from "@mantine/core";
import { useId } from "@mantine/hooks";
import { isBoolean, printBool } from "utils/boolean";
import { formatDate } from "utils/date";

const valueDisplay = ({ field, value }: { field: ContentField; value: string }) => {
    switch (field?.type) {
        case "date":
            return <>{formatDate(value, field.subtype)}</>;
        case "relation":
            return <ContentTitle contentId={value} valueOnly />;
        default:
            return <>{value}</>;
    }
};

const EntryValue = ({
    contentUpdate,
    variant,
    field,
}: {
    field: ContentField;
    contentUpdate: ContentUpdateValue;
    variant: "full" | "compact";
}) => {
    return (
        <Stack>
            {variant !== "full" && <Text size="sm">{contentUpdate.fieldName} updated</Text>}
            {variant === "full" && contentUpdate.change && (
                <Group spacing="xs" style={{ display: "inline-flex" }}>
                    <Code>{contentUpdate.fieldName}</Code>
                    {contentUpdate.change.from && (
                        <>
                            {` : `}
                            <Code color="red">
                                {isBoolean(contentUpdate.change.from)
                                    ? printBool(contentUpdate.change.from)
                                    : valueDisplay({ field, value: contentUpdate.change.from })}
                            </Code>
                        </>
                    )}
                    {contentUpdate.change.to && (
                        <>
                            {` -> `}
                            <Code color="green">
                                {isBoolean(contentUpdate.change.to)
                                    ? printBool(contentUpdate.change.to)
                                    : valueDisplay({ field, value: contentUpdate.change.to })}
                            </Code>
                        </>
                    )}
                </Group>
            )}
        </Stack>
    );
};

const EntryProperty = ({
    contentUpdate,
    variant,
}: {
    contentUpdate: ContentUpdateProperty;
    variant: "full" | "compact";
}) => {
    return (
        <Stack spacing={"sm"}>
            <Text size="sm">
                {contentUpdate.fieldName} {contentUpdate.action}
            </Text>
            {variant === "full" &&
                contentUpdate.changes &&
                Object.keys(contentUpdate.changes).map((key) => {
                    const change = contentUpdate?.changes?.[key];
                    if (change) {
                        return (
                            <Group spacing="xs" style={{ display: "inline-flex" }}>
                                <Code>{key.split("nbsp").join(":")}</Code>
                                {change.from && (
                                    <>
                                        {` : `}
                                        <Code color="red">
                                            {isBoolean(change.from)
                                                ? printBool(change.from)
                                                : change.from}
                                        </Code>
                                    </>
                                )}
                                {change.to && (
                                    <>
                                        {` -> `}
                                        <Code color="green">
                                            {isBoolean(change.to)
                                                ? printBool(change.to)
                                                : change.to}
                                        </Code>
                                    </>
                                )}
                            </Group>
                        );
                    }
                })}
        </Stack>
    );
};

export const HistoryEntry = ({
    contentUpdates,
    variant,
    fieldMap,
}: {
    contentUpdates: ContentUpdates;
    variant: "full" | "compact";
    fieldMap: { [fieldId: string]: ContentField };
}) => {
    const uuid = useId();
    return (
        <>
            {contentUpdates?.map((contentUpdate, index) => {
                if (contentUpdate.type === "value") {
                    return (
                        <EntryValue
                            field={fieldMap[contentUpdate.fieldId]}
                            contentUpdate={contentUpdate}
                            variant={variant}
                            key={`${uuid}${index}`}
                        />
                    );
                }
                return (
                    <EntryProperty
                        contentUpdate={contentUpdate}
                        variant={variant}
                        key={`${uuid}${index}`}
                    />
                );
            })}
        </>
    );
};
