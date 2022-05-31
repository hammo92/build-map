import { createInvitation } from "../data";

// demo invitation generator
export const createDemoInvitation = async ({
    email,
    organisationId,
    projectId,
    creatorId,
}: {
    email: string;
    organisationId: string;
    projectId?: string;
    creatorId: string;
}) => {
    const newInvitation = await createInvitation({
        creatorId,
        email,
        organisationId,
        projectId,
    });
    return newInvitation;
};
