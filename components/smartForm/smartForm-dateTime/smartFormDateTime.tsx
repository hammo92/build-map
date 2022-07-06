import { DateTime, DateTimeProps } from "@components/ui/dateTime";
import dayjs from "dayjs";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormDateTimeProps = SmartFormInputBaseProps & DateTimeProps;

export const SmartFormDateTime = (props: SmartFormDateTimeProps) => {
    return (
        <SmartFormDefaultController {...props} converter={(value) => dayjs(value).toDate()}>
            <DateTime />
        </SmartFormDefaultController>
    );
};
