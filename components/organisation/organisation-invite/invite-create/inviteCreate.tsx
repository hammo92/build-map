import { SmartForm } from "@components/smartForm";
import { useCreateInvite } from "@data/invitation/hooks";
import { Button, Space } from "@mantine/core";

export const InviteCreate = ({ organisationId }: { organisationId: string }) => {
    const { mutateAsync } = useCreateInvite();
    const onSubmit = async (values: any) => {
        mutateAsync({
            email: values.email,
            organisationId,
        });
    };
    return (
        <>
            <SmartForm onSubmit={onSubmit} formName="organisationInvite">
                <SmartForm.TextInput required label="Email" name="email" />
                <Space h="sm" />
                <Space h="lg" />
                <Button type="submit">Invite</Button>
            </SmartForm>
        </>
    );
};
