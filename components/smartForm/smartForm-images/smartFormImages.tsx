import { AssetListProps } from "@components/asset/asset-list";
import { AssetManager, AssetManagerProps } from "@components/asset/asset-manager";
import { Input, InputWrapperProps } from "@mantine/core";
import { forwardRef } from "react";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormImagesProps = SmartFormInputBaseProps &
    Omit<AssetManagerProps, "assetIds"> &
    Omit<InputWrapperProps, "children">;

const WrappedAssetManager = forwardRef(
    (
        props: Omit<AssetListProps, "assetIds"> &
            Omit<InputWrapperProps, "children" | "onChange"> & {
                onChange?: (ids: string[]) => void;
                defaultValue?: string[];
                value?: string[];
                readOnly?: boolean;
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
            readOnly,
            ...rest
        } = props;
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
                <AssetManager
                    onChange={onChange}
                    defaultValue={defaultValue}
                    editable={!readOnly}
                    assetIds={value ?? []}
                    {...rest}
                />
            </Input.Wrapper>
        );
    }
);

WrappedAssetManager.displayName = "WrappedAssetManager";

export const SmartFormImages = (props: SmartFormImagesProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <WrappedAssetManager />
        </SmartFormDefaultController>
    );
};
