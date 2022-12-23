import {
    InputBaseProps,
    InputStylesNames,
    InputWrapperBaseProps,
    InputWrapperStylesNames,
} from "@mantine/core";
import { ComponentPropsWithoutRef } from "react";

export type BaseOptionListStylesNames = InputStylesNames | InputWrapperStylesNames;

export type BaseOptionListProps = InputWrapperBaseProps &
    Omit<ComponentPropsWithoutRef<"input">, "value" | "onChange" | "size" | "defaultValue">;
