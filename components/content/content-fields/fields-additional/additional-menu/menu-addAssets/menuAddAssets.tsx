import React from "react";
import { FIELD_SUFFIXES } from "@components/content/content";
import { SmartForm } from "@components/smartForm";
import { faFile, faFiles, faNote, faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentField } from "@lib/content/data/types";
import { Button, Group, Menu } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { useFormContext } from "react-hook-form";

export const MenuAddAssets = ({ field }: { field: ContentField }) => {
    const { setValue, getValues } = useFormContext();
    const formField = `${field.id}${FIELD_SUFFIXES.ASSETS}`;
    const value = getValues(formField);
    const hasValue = value !== null && value !== undefined;
    const onClick = () => {
        if (hasValue) {
            setValue(formField, null, {
                shouldDirty: true,
                shouldTouch: true,
            });
        } else {
            setValue(formField, [], {
                shouldDirty: true,
                shouldTouch: true,
            });
        }
    };

    return (
        <>
            <Menu.Item
                icon={<FontAwesomeIcon icon={hasValue ? faTrash : faFiles} />}
                onClick={onClick}
                color={hasValue ? "red" : "gray"}
            >
                {hasValue ? "Remove Assets" : "Add Assets"}
            </Menu.Item>
        </>
    );
};
