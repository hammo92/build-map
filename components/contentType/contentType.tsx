import { useGetContentType } from "@data/contentType/hooks";
import { ContentType as ContentTypeProps } from "@lib/contentType/data/contentType.model";
import { Box, Container, Divider, Group, Title } from "@mantine/core";
import { contentTypeState } from "@state/contentType";
import React from "react";
import { CleanedCamel } from "type-helpers";
import { Required } from "utility-types";
import { useSnapshot } from "valtio";
import { FieldCreate } from "./contentType-field/field-create";
import { FieldList } from "./contentType-field/field-list";
import { ContentTypeHeader } from "./contentType-header/contentTypeHeader";
import Illustration from "../../public/images/tokyo/2.0-04.svg";
import Image from "next/image";

const NoContentTypes = () => (
    <Container p="md" fluid>
        <Group direction="column" position="center" grow>
            <Container size="sm">
                <Image src={Illustration} alt="select a form" />
            </Container>
        </Group>
    </Container>
);

//check contentType id is defined before fetching
// has to be a seperate component to respect hooks order on rerender
const ContentTypeInner = () => {
    const { contentTypeId } = useSnapshot(contentTypeState);
    const { data } = useGetContentType(contentTypeId);

    return (
        <Group direction="column" grow>
            <>
                <ContentTypeHeader />
                <FieldList />
                <FieldCreate />
            </>
        </Group>
    );
};

export const ContentType = () => {
    const { contentTypeId } = useSnapshot(contentTypeState);
    if (contentTypeId?.length > 1) return <ContentTypeInner />;
    return <NoContentTypes />;
};
