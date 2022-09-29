import { IconTitle } from "@components/ui/iconTitle/iconTitle";
import { FieldTypes, Property } from "@lib/field/data/field.model";
import { Button, Text } from "@mantine/core";
import { closeAllModals, useModals } from "@mantine/modals";
import { updatePropertyDetails } from "@state/propertyManager";
import React from "react";
import { splitCamel } from "utils/stringTransform";
import { proxy, useSnapshot } from "valtio";
import { PropertyConfiguration } from "../property-configuration";
import { FIELD_TYPES } from "../property-type/type-select/options";

interface PropertyEditPropsBase {
    onSubmit?: (values: any) => void;
    parentId?: string;
    property: Property;
}

interface PropertyEditModalProps extends PropertyEditPropsBase {
    isModal: true;
    buttonElement?: React.ReactElement;
}

interface PropertyEditNonModal extends PropertyEditPropsBase {
    isModal?: true;
    buttonElement?: never;
}

type PropertyEditProps = PropertyEditModalProps | PropertyEditNonModal;

const typeState = proxy<{ type: FieldTypes | undefined }>({ type: undefined });

const Title = () => {
    const { type } = useSnapshot(typeState);
    console.log("type :>> ", type);
    if (type) {
        return (
            <IconTitle
                icon={FIELD_TYPES[type]["icon"]}
                title={`New ${splitCamel(type)} Property`}
                subtitle="Configure field options"
            />
        );
    }
    return <Text>Select Property Type</Text>;
};

export const PropertyEdit = ({ property, onSubmit, isModal, buttonElement }: PropertyEditProps) => {
    const modals = useModals();
    const content = (
        <PropertyConfiguration
            currentConfig={property}
            type={property.type}
            onSubmit={(values) => {
                onSubmit
                    ? onSubmit(values)
                    : updatePropertyDetails({
                          propertyId: property.id,
                          property: { ...property, ...values },
                      });
                closeAllModals();
            }}
            onCancel={() => closeAllModals()}
            view="edit"
        />
    );
    if (isModal) {
        const openModal = () => {
            modals.openModal({
                title: (
                    <IconTitle
                        icon={FIELD_TYPES[property.type]["icon"]}
                        title={`New ${splitCamel(property.type)} Property`}
                        subtitle="Configure field options"
                    />
                ),
                size: "xl",
                closeOnClickOutside: false,
                children: content,
            });
        };
        return (
            <>
                {buttonElement ? (
                    React.cloneElement(buttonElement, { onClick: () => openModal() })
                ) : (
                    <Button fullWidth variant="light" color="blue" onClick={() => openModal()}>
                        Edit Property
                    </Button>
                )}
            </>
        );
    }
    return content;
};
