import { DatePicker, DatePickerProps } from "@mantine/dates";
import dayjs from "dayjs";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormDatePickerProps = SmartFormInputBaseProps & DatePickerProps;

export const SmartFormDatePicker = (props: SmartFormDatePickerProps) => {
    return (
        <SmartFormDefaultController {...props} converter={(value) => dayjs(value).toDate()}>
            <DatePicker />
        </SmartFormDefaultController>
    );
};
