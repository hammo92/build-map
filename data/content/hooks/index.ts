import { Keys } from "../constants";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNotifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { createContent, getContent, getProjectContentOfType } from "../queries";
import { CleanedCamel } from "type-helpers";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Content } from "@lib/content/data/content.model";

export function useCreateContentTemplate() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(createContent, {
        mutationKey: Keys.CREATE_CONTENT,
        onSuccess: ({ newContent }) => {
            queryClient.invalidateQueries(Keys.GET_PROJECT_CONTENT_OF_TYPE);
            notifications.showNotification({
                title: `Success`,
                message: `Created new content successfully`,
                color: "green",
            });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(`error`, error?.response?.data);
            notifications.showNotification({
                title: "Error",
                message: error?.response?.data.message,
                color: "red",
            });
        },
    });
}

export function useGetContentTemplate(contentId: string) {
    return useQuery([Keys.GET_CONTENT, contentId], () => getContent(contentId));
}

export function useGetProjectContentOfType(
    projectId: string,
    contentTemplateId: string,
    initialData?: { content: CleanedCamel<Content>[] }
) {
    return useQuery(
        Keys.GET_PROJECT_CONTENT_OF_TYPE,
        () => getProjectContentOfType({ projectId, contentTemplateId }),
        { initialData }
    );
}
