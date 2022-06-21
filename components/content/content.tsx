import { FieldType } from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { SmartForm } from "@components/smartForm";
import { useGetContent } from "@data/content/hooks";
import { ContentField } from "@lib/content/data/types";
import { Container, Group } from "@mantine/core";
import { FormErrors } from "@mantine/form";
import { contentState } from "@state/content";
import Image from "next/image";
import React from "react";
import { useSnapshot } from "valtio";
import Illustration from "../../public/images/tokyo/3.0-03.svg";

const NoContent = () => (
    <Container p="md" fluid>
        <Group direction="column" position="center" grow>
            <Container size="sm">
                <Image src={Illustration} alt="select a form" />
            </Container>
        </Group>
    </Container>
);

// types with created ui components
const allowTypes = ["text", "select", "boolean", "email"];

const fieldSwitch = (field: ContentField) => {
    switch (field.type) {
        case "text":
            return <SmartForm.TextInput name={field.id} label={field.name} />;
        case "select":
            return (
                <SmartForm.Select
                    data={field?.data}
                    name={field.id}
                    label={field.name}
                />
            );
        case "boolean":
            return <SmartForm.Checkbox name={field.id} label={field.name} />;
        case "email":
            return (
                <SmartForm.TextInput
                    type="email"
                    name={field.id}
                    label={field.name}
                />
            );
        default:
            return null;
    }
};

//check contentTemplate id is defined before fetching
// has to be a seperate component to respect hooks order on rerender
const ContentInner = () => {
    const { contentId } = useSnapshot(contentState);
    // fetch data into cache
    const { data, isLoading } = useGetContent(contentId);
    if (isLoading) return <p>loading</p>;
    const fields =
        data &&
        data.content.fields
            .filter((field) => allowTypes.includes(field.type))
            .map((field) => fieldSwitch(field));

    console.log("fields :>> ", fields);
    if (fields)
        return (
            <SmartForm
                formName="content"
                onSubmit={(values) => {
                    console.log("values", values);
                }}
            >
                {fields}
                <input type="submit" />
            </SmartForm>
        );
    return null;
};

export const Content = () => {
    const { contentId } = useSnapshot(contentState);
    if (contentId?.length > 1) return <ContentInner />;
    return <NoContent />;
};
