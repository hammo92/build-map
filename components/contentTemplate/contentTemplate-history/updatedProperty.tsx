import { PropertyUpdate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Code, Group, Stack, Text, Title } from "@mantine/core";
import { isBoolean, printBool } from "utils/boolean";

export const UpdatedProperty = ({
    updatedProperty,
    variant,
}: {
    updatedProperty: PropertyUpdate;
    variant: "full" | "compact";
}) => {
    return (
        <Stack spacing={"sm"}>
            <Text size="sm">
                {updatedProperty.fieldName} {updatedProperty.action}
            </Text>
            {variant === "full" &&
                updatedProperty.changes &&
                Object.keys(updatedProperty.changes).map((key) => {
                    const change = updatedProperty?.changes?.[key];
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
