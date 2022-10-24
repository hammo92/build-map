import { IconDefinition } from "@fortawesome/pro-regular-svg-icons";
import {
    InputBaseProps,
    InputStylesNames,
    InputWrapperBaseProps,
    InputWrapperStylesNames,
} from "@mantine/core";
import { ComponentPropsWithoutRef } from "react";

type ColorOptions =
    | "blue"
    | "red"
    | "pink"
    | "grape"
    | "violet"
    | "indigo"
    | "cyan"
    | "green"
    | "lime"
    | "yellow"
    | "orange"
    | "teal";

export interface Icon {
    icon: IconDefinition;
    color: ColorOptions;
}

export type BaseIconPickerStylesNames = InputStylesNames | InputWrapperStylesNames;

export type BaseIconPickerProps = InputWrapperBaseProps &
    Omit<ComponentPropsWithoutRef<"input">, "value" | "onChange" | "size" | "defaultValue">;
