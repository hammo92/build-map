import { UserList } from "@components/user/user-list";
import { useGetOrganisationUsers } from "@data/organisation/hooks";
import React from "react";

export const OrganisationUserList = ({ organisationId }) => {
    const { data } = useGetOrganisationUsers({ organisationId });
    if (data) {
        return <UserList users={data.users} />;
    }
    return <div></div>;
};
