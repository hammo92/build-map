import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(LocalizedFormat);

export function SortByDateIso(a: string, b: string, order: "new" | "old" = "new") {
    return a < b ? (order === "new" ? 1 : -1) : a > b ? (order === "new" ? -1 : 1) : 0;
}

export function formatDate(date: string, type: "date" | "dateTime" | "time") {
    const d = dayjs(date);
    if (!d.isValid) return date;
    const formats = {
        date: "L",
        dateTime: "L LT",
        time: "LT",
    };
    return d.format(formats[type]);
}
