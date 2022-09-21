import camelcase from "camelcase-keys";
import { ulid } from "ulid";
import { Change, isObject } from "../../../utils/objects";

type ChangedItemType = "text" | "image" | "icon";

type ChangedItem = Change & {
    type?: ChangedItemType;
};

export type Changes = ChangedItem[];

export class HistoryEntry {
    id: string;
    title: string;
    subtitle?: string;
    notes?: string[];
    changes?: Changes;
    editedTime?: string;
    editedBy: string;

    constructor({
        editedBy,
        title,
        ...rest
    }: {
        editedBy: string;
        title: string;
        subtitle?: string;
        notes?: string[];
        changes?: Changes;
    }) {
        const date = new Date().toISOString();
        this.id = ulid();
        this.title = title;
        this.editedTime = date;
        this.editedBy = editedBy;

        // add optional props if defined
        Object.assign(this, camelcase(rest, { deep: true }));
    }
}
