import { useGetFormTemplate } from "@data/formTemplate/hooks";
import { FormTemplate as FormTemplateProps } from "@lib/formTemplate/data/formTemplate.model";
import { Box, Container, Divider, Group, Title } from "@mantine/core";
import { formTemplateState } from "@state/formTemplate";
import React from "react";
import { CleanedCamel } from "type-helpers";
import { Required } from "utility-types";
import { useSnapshot } from "valtio";
import { FieldCreate } from "./formTemplate-field/field-create";
import { FieldList } from "./formTemplate-field/field-list";
import { FormTemplateHeader } from "./formTemplate-header/formTemplateHeader";
import Illustration from "../../public/images/tokyo/2.0-04.svg";
import Image from "next/image";

const NoTemplate = () => (
    <Container p="md" fluid>
        <Group direction="column" position="center" grow>
            <Container size="sm">
                <Image src={Illustration} alt="select a form" />
            </Container>
        </Group>
    </Container>
);

//check formTemplate id is defined before fetching
// has to be a seperate component to respect hooks order on rerender
const FormTemplateInner = () => {
    const { formTemplateId } = useSnapshot(formTemplateState);
    const { data } = useGetFormTemplate(formTemplateId);

    return (
        <Group direction="column" grow>
            <>
                <FormTemplateHeader />
                <FieldList />
                <FieldCreate />
            </>
        </Group>
    );
};

export const FormTemplate = () => {
    const { formTemplateId } = useSnapshot(formTemplateState);
    if (formTemplateId?.length > 1) return <FormTemplateInner />;
    return <NoTemplate />;
};
