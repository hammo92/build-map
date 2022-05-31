import React, { FC } from "react";
import { useStyles } from "./styles";
import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserProfile } from "@auth0/nextjs-auth0";
import { faChevronRight } from "@fortawesome/pro-regular-svg-icons";

interface UserButtonProps {
    user: UserProfile;
}

export const UserButton: FC<UserButtonProps> = ({ user }) => {
    const { classes } = useStyles();
    return (
        <UnstyledButton className={classes.user}>
            <Group>
                <Avatar src={user.picture} radius="xl" />

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
    );
};
