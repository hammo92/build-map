import { EditableList, EditableListProps } from "@components/ui/editableList";
import React from "react";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormEditableListProps<T> = SmartFormInputBaseProps & EditableListProps<T>;

export const SmartFormEditableList = <T extends unknown>(props: SmartFormEditableListProps<T>) => (
    <>
        <SmartFormDefaultController {...props}>
            <EditableList />
        </SmartFormDefaultController>
    </>
);
