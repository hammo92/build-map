import { FieldTypes } from "@lib/field/data/field.model";
import { Button, Modal } from "@mantine/core";
import React, { useState } from "react";
import { PropertyConfiguration } from "../property-configuration";
import { TypeSelect } from "../property-type/type-select";
import { getFieldDefaults } from "./create-utils/getFieldDefaults";

interface PropertyCreatePropsBase {
    onCreate: () => void;
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

const PropertyCreateSteps = ({ onCreate }: { onCreate: (values: any) => void }) => {
    const [type, setType] = useState<FieldTypes | undefined>();
    const [step, setStep] = useState(0);
    if (!type || step === 0) {
        return (
            <TypeSelect
                onSelect={(type) => {
                    setType(type);
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
                onSubmit={(values) => onCreate(values)}
                onCancel={() => setStep(0)}
                view="create"
            />
        );
    }
    return null;
};

export const PropertyCreate = ({ onCreate, isModal, buttonElement }: PropertyCreateProps) => {
    const [opened, setOpened] = useState(false);
    const contents = () => {};
    if (isModal) {
        return (
            <>
                <Modal
                    opened={opened}
                    onClose={() => {
                        setOpened(false);
                    }}
                    size="xl"
                    title="Create Property"
                >
                    <PropertyCreateSteps onCreate={onCreate} />
                </Modal>
                {buttonElement ? (
                    React.cloneElement(buttonElement, { onClick: () => setOpened(true) })
                ) : (
                    <Button
                        fullWidth
                        variant="light"
                        color="blue"
                        onClick={() => {
                            setOpened(true);
                        }}
                    >
                        Add Property
                    </Button>
                )}
            </>
        );
    }
    return contents();
};
