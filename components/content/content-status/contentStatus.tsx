import { useUpdateContentStatus } from "@data/content/hooks";
import { Content, ContentStatus as ContentStatusValues } from "@lib/content/data/content.model";
import { Button, Select } from "@mantine/core";
import { CleanedCamel } from "type-helpers";

export const ContentStatus = ({ content }: { content: CleanedCamel<Content> }) => {
    const { mutateAsync, isLoading } = useUpdateContentStatus();
    const onChange = async (value: ContentStatusValues) => {
        await mutateAsync({
            contentId: content.id,
            status: value,
        });
    };
    if (["draft", "archived"].includes(content.status)) {
        return (
            <Button
                onClick={() => onChange("published")}
                color={"violet"}
                loading={isLoading}
                disabled={isLoading}
            >
                {content.status === "draft" ? "Publish" : "Republish"}
            </Button>
        );
    }
    if (content.status === "published") {
        return (
            <Button
                onClick={() => onChange("archived")}
                color={"pink"}
                loading={isLoading}
                disabled={isLoading}
            >
                Archive
            </Button>
        );
    }
    return null;
};
