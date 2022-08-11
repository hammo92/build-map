import { InputBaseProps } from "@mantine/core";
import React from "react";
import { RegisterOptions } from "react-hook-form";

export interface SmartFormInputBaseProps extends InputBaseProps {
    name: string;
    rules?: RegisterOptions;
    label?: React.ReactNode;
    description?: React.ReactNode;
    readOnly?: boolean;
}
