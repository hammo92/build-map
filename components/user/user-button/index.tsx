import React, { FC, useState } from "react";
import { useStyles } from "./styles";
import { Avatar, Drawer, Group, Text, UnstyledButton } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/pro-regular-svg-icons";
import { UserSettings } from "../user-settings";
import { CleanedCamel } from "type-helpers";
import { User } from "@lib/user/data/user.model";
import { useGetImageUrl } from "@data/asset/hooks";
import { StrippedUser } from "@lib/user/data";
import { UserAvatar } from "../user-avatar";

interface UserButtonProps {
    user: CleanedCamel<StrippedUser>;
}

export const UserButton: FC<UserButtonProps> = ({ user }) => {
    const { classes } = useStyles();
    const [opened, setOpened] = useState(false);
    return (
        <>
            <UnstyledButton className={classes.user} onClick={() => setOpened(true)}>
                <Group>
                    <UserAvatar user={user} radius="xl" />

                    <div style={{ flex: 1 }}>
                        <Text size="sm" weight={500}>
                            {user.name}
                        </Text>

                        <Text color="dimmed" size="xs">
                            {user.email}
                        </Text>
                    </div>

                    <FontAwesomeIcon icon={faChevronRight} />
                </Group>
            </UnstyledButton>
            <Drawer
                opened={opened}
                onClose={() => setOpened(false)}
                title="Your Details"
                padding="xl"
                size="xl"
                position="right"
            >
                <UserSettings />
            </Drawer>
        </>
    );
};
