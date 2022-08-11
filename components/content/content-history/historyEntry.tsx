import { ContentHistory, PropertyUpdate } from "@lib/content/data/content.model";
import { ContentField } from "@lib/content/data/types";
import { Code, Group, Text } from "@mantine/core";
import { formatDate } from "utils/date";
import { ContentTitle } from "../content-title";

const PropertyValueDisplay = ({
    field,
    value,
}: {
    field: ContentField;
    value: PropertyUpdate["value"];
}) => {
    switch (field.type) {
        case "date":
            return <>{formatDate(value, field.subtype)}</>;
        case "relation":
            return <ContentTitle contentId={value} valueOnly />;
        default:
            return <>{value}</>;
    }
};

const PropertyValue = ({
    field,
    value,
    type,
}: {
    field: ContentField;
    value: PropertyUpdate["value"];
    type: "prev" | "new";
}) => {
    const color = type === "prev" ? "red" : "green";
    if (value) {
        if (Array.isArray(value)) {
            const values = value.map((val, index) => (
                <Code color={color} key={`${val}${index}`}>
                    <PropertyValueDisplay field={field} value={val} />
                </Code>
            ));
            return <>{values}</>;
        } else
            return (
                <Code color={color}>
                    <PropertyValueDisplay field={field} value={value} />
                </Code>
            );
    } else return null;
};

export const UpdatedProperty = ({
    field,
    updatedProperty,
}: {
    field: ContentField;
    updatedProperty: PropertyUpdate;
}) => {
    const parseValues = {};

    return (
        <Group spacing="xs" style={{ display: "inline-flex" }}>
            <Code>{field?.name ?? "Deleted field"}</Code>

            {updatedProperty.previousValue && (
                <>
                    {` : `}
                    <PropertyValue
                        field={field}
                        value={updatedProperty.previousValue}
                        type="prev"
                    />
                </>
            )}

            {updatedProperty.value && (
                <>
                    {` -> `}
                    <PropertyValue field={field} value={updatedProperty.value} type="new" />
                </>
            )}

            {/*updatedProperty.previousValue ? (
                <>
                    {` : `}
                    <Code color="red">{updatedProperty.previousValue}</Code>
                    {updatedProperty.value.length ? (
                        <>
                            {` -> `}
                            <Code color="green">{updatedProperty.value}</Code>
                        </>
                    ) : null}
                </>
            ) : (
                <>
                    {` : `}
                    <Code color="green">{updatedProperty.value}</Code>
                </>
            )*/}
        </Group>
    );
};
