import { Input, InputWrapperProps } from "@mantine/core";
import { Editor, RichTextEditorProps } from "@mantine/rte";
import React, { forwardRef, useRef } from "react";
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
        const editorRef = useRef<Editor>();
        return (
            <Input.Wrapper
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
                <RichTextEditor
                    {...rest}
                    controls={[
                        ["bold", "italic", "underline", "strike", "clean"],
                        ["h1", "h2", "h3", "h4"],
                        ["unorderedList", "orderedList"],
                        ["link", "video", "blockquote", "code"],
                        ["alignLeft", "alignCenter", "alignRight"],
                        ["sup", "sub"],
                    ]}
                    onImageUpload={(file: File) =>
                        new Promise((resolve, reject) => {
                            console.log(file);
                            resolve("not allowed");
                        })
                    }
                />
            </Input.Wrapper>
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
