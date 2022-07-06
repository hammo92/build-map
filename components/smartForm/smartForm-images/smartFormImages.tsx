import { AssetListProps } from "@components/asset/asset-list";
import { AssetManager, AssetManagerProps } from "@components/asset/asset-manager";
import { InputWrapper, InputWrapperProps } from "@mantine/core";
import { forwardRef } from "react";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormImagesProps = SmartFormInputBaseProps &
    AssetManagerProps &
    Omit<InputWrapperProps, "children">;

const WrappedAssetManager = forwardRef(
    (
        props: AssetListProps &
            Omit<InputWrapperProps, "children" | "onChange"> & {
                onChange?: (ids: string[]) => void;
                defaultValue?: string[];
                value?: string[];
            },
        ref
    ) => {
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
            value,
            defaultValue,
            onChange,
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
                <AssetManager
                    onChange={onChange}
                    defaultValue={defaultValue}
                    assetIds={value}
                    {...rest}
                />
            </InputWrapper>
        );
    }
);

WrappedAssetManager.displayName = "WrappedAssetManager";

export const SmartFormImages = (props: SmartFormImagesProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <WrappedAssetManager {...props} />
        </SmartFormDefaultController>
    );
};
