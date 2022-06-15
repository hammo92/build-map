import { useGetContentTemplate } from "@data/contentTemplate/hooks";
import { ContentTemplate as ContentTemplateProps } from "@lib/contentTemplate/data/contentTemplate.model";
import { Box, Container, Divider, Group, Title } from "@mantine/core";
import { contentTemplateState } from "@state/contentTemplate";
import React from "react";
import { CleanedCamel } from "type-helpers";
import { Required } from "utility-types";
import { useSnapshot } from "valtio";
import { FieldCreate } from "./contentTemplate-field/field-create";
import { FieldList } from "./contentTemplate-field/field-list";
import { ContentTemplateHeader } from "./contentTemplate-header/contentTemplateHeader";
import Illustration from "../../public/images/tokyo/2.0-04.svg";
import Image from "next/image";

const NoContentTemplates = () => (
    <Container p="md" fluid>
        <Group direction="column" position="center" grow>
            <Container size="sm">
                <Image src={Illustration} alt="select a form" />
            </Container>
        </Group>
    </Container>
);

//check contentTemplate id is defined before fetching
// has to be a seperate component to respect hooks order on rerender
const ContentTemplateInner = () => {
    const { contentTemplateId } = useSnapshot(contentTemplateState);
    const { data } = useGetContentTemplate(contentTemplateId);

    return (
        <Group direction="column" grow>
            <>
                <ContentTemplateHeader />
                <FieldList />
                <FieldCreate />
            </>
        </Group>
    );
};

export const ContentTemplate = () => {
    const { contentTemplateId } = useSnapshot(contentTemplateState);
    if (contentTemplateId?.length > 1) return <ContentTemplateInner />;
    return <NoContentTemplates />;
};
