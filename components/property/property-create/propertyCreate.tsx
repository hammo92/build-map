import { FieldType } from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { IconTitle } from "@components/ui/iconTitle/iconTitle";
import { FieldTypes } from "@lib/field/data/field.model";
import { Button, Modal, Text } from "@mantine/core";
import { closeAllModals, useModals } from "@mantine/modals";
import { ModalSettings } from "@mantine/modals/lib/context";
import { createProperty } from "@state/propertyManager";
import React, { useState } from "react";
import { splitCamel } from "utils/stringTransform";
import { proxy, useSnapshot } from "valtio";
import { PropertyConfiguration } from "../property-configuration";
import { TypeSelect } from "../property-type/type-select";
import { FIELD_TYPES } from "../property-type/type-select/options";
import { getFieldDefaults } from "./create-utils/getFieldDefaults";

interface PropertyCreatePropsBase {
    onCreate?: (values: any) => void;
    parentId: string;
}

interface PropertyCreateModalProps extends PropertyCreatePropsBase {
    isModal: true;
    buttonElement?: React.ReactElement;
}

interface PropertyCreateNonModal extends PropertyCreatePropsBase {
    isModal?: true;
    buttonElement?: never;
}

type PropertyCreateProps = PropertyCreateModalProps | PropertyCreateNonModal;

const typeState = proxy<{ type: FieldTypes | undefined }>({ type: undefined });

const PropertyCreateSteps = ({ onCreate }: { onCreate: (values: any) => void }) => {
    const { type } = useSnapshot(typeState);
    const [step, setStep] = useState(0);
    if (!type || step === 0) {
        return (
            <TypeSelect
                onSelect={(type) => {
                    typeState.type = type;
                    setStep(1);
                }}
            />
        );
    }
    if (type) {
        return (
            <PropertyConfiguration
                currentConfig={getFieldDefaults(type)}
                type={type}
                onSubmit={onCreate}
                onCancel={() => setStep(0)}
                view="create"
            />
        );
    }
    return null;
};

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

export const PropertyCreate = ({
    onCreate,
    isModal,
    buttonElement,
    parentId,
}: PropertyCreateProps) => {
    const modals = useModals();

    if (isModal) {
        const openModal = () => {
            modals.openModal({
                title: <Title />,
                size: "xl",
                closeOnClickOutside: false,
                children: (
                    <PropertyCreateSteps
                        onCreate={(values) => {
                            onCreate
                                ? onCreate({ ...values, parentId })
                                : createProperty({ ...values, parentId });
                            closeAllModals();
                        }}
                    />
                ),
            });
        };
        return (
            <>
                {buttonElement ? (
                    React.cloneElement(buttonElement, { onClick: () => openModal() })
                ) : (
                    <Button fullWidth variant="light" color="blue" onClick={() => openModal()}>
                        Add Property
                    </Button>
                )}
            </>
        );
    }
    return (
        <PropertyCreateSteps
            onCreate={(values) =>
                onCreate
                    ? onCreate({ ...values, parentId })
                    : createProperty({ ...values, parentId })
            }
        />
    );
};
