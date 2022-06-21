import { IconDefinition } from "@fortawesome/pro-regular-svg-icons";
import { InputBaseProps, InputWrapperBaseProps } from "@mantine/core";
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

export interface IconPickerIcon {
    icon: IconDefinition;
    color: ColorOptions;
}

export type BaseIconPickerStylesNames = InputStylesNames | InputWrapperStylesNames;

export type BaseIconPickerProps = InputWrapperBaseProps &
    InputBaseProps &
    Omit<ComponentPropsWithoutRef<"input">, "value" | "onChange" | "size" | "defaultValue">;
