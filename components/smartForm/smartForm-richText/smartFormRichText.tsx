import { InputWrapper, InputWrapperProps } from "@mantine/core";
import { RichTextEditorProps } from "@mantine/rte";
import React, { forwardRef } from "react";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";
import RichTextEditor from "@components/ui/richText";

type SmartFormRichTextProps = SmartFormInputBaseProps &
    Partial<RichTextEditorProps> &
    Omit<InputWrapperProps, "children">;

const WrappedRichText = forwardRef(
    (props: RichTextEditorProps & Omit<InputWrapperProps, "children">, ref) => {
        const {
            label,
            error,
            required,
            description,
            descriptionProps,
            errorProps,
            id,
            labelElement,
            labelProps,
            ...rest
        } = props;
        return (
            <InputWrapper
                label={label}
                error={error}
                required={required}
                description={description}
                descriptionProps={descriptionProps}
                errorProps={errorProps}
                id={id}
                labelElement={labelElement}
                labelProps={labelProps}
                size={props.size}
                sx={{ display: "flex", flexDirection: "column" }}
            >
                <RichTextEditor {...rest} />
            </InputWrapper>
        );
    }
);

WrappedRichText.displayName = "WrappedRichText";

export const SmartFormRichText = (props: SmartFormRichTextProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <WrappedRichText value={props.value ?? ""} onChange={() => props.onChange} />
        </SmartFormDefaultController>
    );
};
