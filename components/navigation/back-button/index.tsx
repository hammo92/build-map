import { faArrowLeft } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Group, Text, UnstyledButton } from "@mantine/core";
import React from "react";
import { useRouter } from "next/router";
import { commonState } from "@state/common";
import { useSnapshot } from "valtio";

export const BackButton = () => {
    const { previousPage } = useSnapshot(commonState);
    const router = useRouter();
    console.log(`previousPage`, previousPage);
    if (previousPage.url) {
        return (
            <UnstyledButton onClick={() => router.push(previousPage.url)}>
                <Group sx={(theme) => ({ padding: theme.spacing.md })}>
                    <ActionIcon variant="transparent" size="lg">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </ActionIcon>
                    <Text>{previousPage.text ?? "Back"}</Text>
                </Group>
            </UnstyledButton>
        );
    }
    return null;
};
