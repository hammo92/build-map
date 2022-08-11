import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Group, Skeleton, Text, Title } from "@mantine/core";
import { CleanedCamel } from "type-helpers";
import { TitleEdit } from "./title-edit";

export const ContentTemplateTitle = ({
    contentTemplate,
    editable,
}: {
    contentTemplate: CleanedCamel<ContentTemplate>;
    editable?: boolean;
}) => {
    return (
        <Group noWrap>
            {contentTemplate?.name ? (
                <>
                    <Text lineClamp={1}>
                        <Title order={1}>{contentTemplate.name}</Title>{" "}
                    </Text>
                    {editable && <TitleEdit />}
                </>
            ) : (
                <Skeleton height={44} width={300} />
            )}
        </Group>
    );
};
