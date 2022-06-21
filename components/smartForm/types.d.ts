import { InputBaseProps } from "@mantine/core";
import { RegisterOptions } from "react-hook-form";

export interface SmartFormInputBaseProps extends InputBaseProps {
    name: string;
    rules?: RegisterOptions;
}
