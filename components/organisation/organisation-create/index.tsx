import { useCreateOrganisation } from "@data/organisation/hooks";
import { organisations } from "@lib/organisation/endpoints";
import { Button, Space, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
export const CreateOrganisation = ({ onCreate }: { onCreate?: () => void }) => {
    const form = useForm({
        initialValues: {
            name: "",
        },
    });
    const { mutateAsync, isLoading } = useCreateOrganisation();
    return (
        <form
            onSubmit={form.onSubmit(async ({ name }) => {
                const organisation = await mutateAsync({
                    name,
                });
                organisation && onCreate && onCreate();
            })}
        >
            <TextInput required label="Organisation Name" {...form.getInputProps("name")} />
            <Space h="sm" />
            <Button type="submit" fullWidth loading={isLoading} disabled={isLoading}>
                Create
            </Button>
        </form>
    );
};
