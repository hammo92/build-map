import { useGetContentTemplate } from "@data/contentTemplate/hooks";
import { ContentTemplate as ContentTemplateProps } from "@lib/contentTemplate/data/contentTemplate.model";
import { Container, Group } from "@mantine/core";
import { contentTemplateState } from "@state/contentTemplate";
import Image from "next/image";
import { CleanedCamel } from "type-helpers";
import { Required } from "utility-types";
import Illustration from "../../public/images/tokyo/2.0-04.svg";
import { FieldCreate } from "./contentTemplate-field/field-create";
import { FieldList } from "./contentTemplate-field/field-list";
import { ContentTemplateHeader } from "./contentTemplate-header/contentTemplateHeader";

const NoContentTemplates = () => (
    <Container p="md" fluid>
        <Group direction="column" position="center" grow>
            <Container size="sm">
                <Image src={Illustration} alt="select a form" />
            </Container>
        </Group>
    </Container>
);

export const ContentTemplate = ({
    contentTemplate,
}: {
    contentTemplate: Required<CleanedCamel<ContentTemplateProps>, "id">;
}) => {
    contentTemplateState.contentTemplateId = contentTemplate.id;
    const { data } = useGetContentTemplate(contentTemplate.id, { contentTemplate });
    return (
        <Group direction="column" grow>
            <>
                <ContentTemplateHeader contentTemplate={data?.contentTemplate ?? contentTemplate} />
                <FieldList contentTemplate={data?.contentTemplate ?? contentTemplate} />
                <FieldCreate contentTemplate={data?.contentTemplate ?? contentTemplate} variant={"button"} />
            </>
        </Group>
    );
};

ContentTemplate.NullState = NoContentTemplates;
