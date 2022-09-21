import { AssetListProps } from "@components/asset/asset-list";
import { AssetManager, AssetManagerProps } from "@components/asset/asset-manager";
import { Input, InputWrapperProps } from "@mantine/core";
import { forwardRef } from "react";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormAssetsProps = SmartFormInputBaseProps &
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
            hidden,
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
                hidden={props.hidden}
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

export const SmartFormAssets = (props: SmartFormAssetsProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <WrappedAssetManager />
        </SmartFormDefaultController>
    );
};
