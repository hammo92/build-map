import camelcase from "camelcase-keys";
import { ulid } from "ulid";
import { isObject } from "../../../utils/objects";

type ChangedItemType = "text" | "image" | "icon";

export type Change = { from: any; to: any; type?: ChangedItemType };

export type Changes = { [key: string]: Change | Changes };

//export type Changes<T extends Record<any, any>> = T extends Change ? Change : {[P in keyof T] : T[P] extends Change ? Change : Changes<T[P]>};

export function getChanges<T extends Record<string, any>>(
    a: Partial<T> | Record<any, any>,
    b: Partial<T> | Record<any, any>,
    path: string[] = [],
    differenceObj: Changes = {}
): Changes {
    const objectSet = new Set([...Object.keys(a), ...Object.keys(b)]);
    objectSet.forEach((k) => {
        if (isObject(a[k]) || isObject(b[k])) {
            // always compare to an object, to get final value from nested objects.
            const objA = isObject(a[k]) ? a[k] : {};
            const objB = isObject(b[k]) ? b[k] : {};
            if (!differenceObj[k]) {
                differenceObj[k] = {};
            }
            return getChanges(objA, objB, [...path, k], differenceObj[k]);
        } else if (a[k] !== b[k]) {
            differenceObj[k] = {
                ...(a[k] && { from: a[k] }),
                ...(b[k] && { to: b[k] }),
            };
        } else {
            delete differenceObj[k];
        }
    });
    return differenceObj;
}

export class HistoryEntry {
    id: string;
    title: string;
    subtitle?: string;
    notes?: string[];
    changes?: Change | Changes;
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
        changes?: Change | Changes;
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
