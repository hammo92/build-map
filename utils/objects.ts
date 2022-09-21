import { KeyPath } from "type-helpers";
import { splitCamel } from "./stringTransform";

export const isObject = (v: any) => v && typeof v === "object";

export type Change = {
    path: string[];
    from?: any;
    to?: any;
};

export function getObjectChanges<T extends Record<string, any>>(
    a: Partial<T> | Record<any, any>,
    b: Partial<T> | Record<any, any>,
    path: string[] = []
) {
    const objectSet = new Set<keyof T>([...Object.keys(a), ...Object.keys(b)]);
    const objectArray = Array.from(objectSet, (k) => {
        if (isObject(a[k]) || isObject(b[k])) {
            // always compare to an object, to get final value from nested objects.
            const objA = isObject(a[k]) ? a[k] : {};
            const objB = isObject(b[k]) ? b[k] : {};
            return getObjectChanges(objA, objB, [...path, splitCamel(k as string)]);
        } else if (a[k] !== b[k]) {
            return {
                path: [...path, k],
                ...(a[k] && { from: splitCamel(a[k]) }),
                ...(b[k] && { to: splitCamel(b[k]) }),
            };
        } else return null;
    });
    const filtered = objectArray.filter((a) => a && Object.keys(a).length) as Change[];
    return filtered.flat();
}

export function propertyByPath<T>(target: T, key: KeyPath<T>): any {
    const path = key.split(".");
    const last = path.pop();

    console.log("path", path);
    console.log("target", target);

    const cursor = path.reduce((acc, step) => acc[step], target as any);
    return cursor[last!];
}
