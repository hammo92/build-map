import { AssetManager } from "@components/assetManager";
import { SmartForm } from "@components/smartForm";
import { FileUpload } from "@components/ui/fileUpload";
import { ImageUpload } from "@components/ui/imageUpload";
import { useGetContent, useUpdateContentFields } from "@data/content/hooks";
import { ContentField } from "@lib/content/data/types";
import { Container, Group } from "@mantine/core";
import { contentState } from "@state/content";
import Image from "next/image";
import { useMemo } from "react";
import { Required } from "utility-types";
import { objArrToKeyIndexedMap } from "utils/arrayModify";
import { useSnapshot } from "valtio";
import Illustration from "../../public/images/tokyo/3.0-03.svg";
import { ContentFields } from "./content-fields";

const NoContent = () => (
    <Container p="md" fluid>
        <Group direction="column" position="center" grow>
            <Container size="sm">
                <Image src={Illustration} alt="select a form" />
            </Container>
        </Group>
    </Container>
);

function convertContentDataForSmartForm(fields: Required<Partial<ContentField>, "id">[]) {
    return fields.reduce((ac, a) => ({ ...ac, [a.id]: a.value }), {});
}
function processSmartFormValues(
    values: { [id: string]: any },
    fields: Required<Partial<ContentField>, "id">[]
) {
    const fieldIdMap = objArrToKeyIndexedMap(fields, "id");
    const updatedFields = Object.keys(values).map((key) => {
        const fieldDetails = fieldIdMap.get(key);
        const value = values[key];
        const updatedField = { ...fieldDetails, value };
        return updatedField;
    });
    return updatedFields;
}

//check contentTemplate id is defined before fetching
// has to be a seperate component to respect hooks order on rerender
const ContentInner = () => {
    const { contentId } = useSnapshot(contentState);
    // fetch data into cache
    const { data, isLoading } = useGetContent(contentId);
    const { mutateAsync } = useUpdateContentFields();
    if (isLoading) return <p>loading</p>;
    if (data?.content?.fields) {
        const defaultValues = convertContentDataForSmartForm(data?.content?.fields);
        const onSubmit = async (values: any) => {
            const fields = processSmartFormValues(values, data?.content?.fields);
            await mutateAsync({
                contentId,
                fields,
            });
        };
        return (
            <>
                <SmartForm
                    defaultValues={defaultValues}
                    formName={contentId}
                    onSubmit={onSubmit}
                    key={contentId}
                >
                    <Group direction="column" spacing="sm" grow>
                        <ContentFields fields={data?.content.fields} />
                    </Group>

                    <input type="submit" />
                </SmartForm>
            </>
        );
    }
    return null;
};

export const Content = () => {
    const { contentId } = useSnapshot(contentState);
    if (contentId?.length > 1) return <ContentInner />;
    return <NoContent />;
};
