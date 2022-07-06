import { TimeInput, TimeInputProps } from "@mantine/dates";
import dayjs from "dayjs";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormTimeProps = SmartFormInputBaseProps & TimeInputProps;

export const SmartFormTimeInput = (props: SmartFormTimeProps) => {
    return (
        <SmartFormDefaultController {...props} converter={(value) => dayjs(value).toDate()}>
            <TimeInput />
        </SmartFormDefaultController>
    );
};
