import { Button, Modal } from "@mantine/core";
import React, { useState, FC } from "react";
import { ProjectCreateForm } from "..";

interface ProjectCreateButtonProps {
    organisationId: string;
}

export const ProjectCreateButton: FC<ProjectCreateButtonProps> = ({ organisationId }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>Add Project</Button>
            <Modal opened={open} onClose={() => setOpen(false)} title="Create Project">
                <ProjectCreateForm
                    organisationId={organisationId}
                    onCreate={() => {
                        setOpen(false);
                    }}
                />
            </Modal>
        </>
    );
};
