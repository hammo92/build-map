export const isObject = (v: any) => v && typeof v === "object";

export type DifferenceEntry = Record<
    string,
    {
        from?: any;
        to?: any;
    }
>;

export function getDifference<T extends Record<string, any>>(
    a: Partial<T> | Record<any, any>,
    b: Partial<T> | Record<any, any>,
    path: string[] = []
) {
    const objectSet = new Set<keyof T>([...Object.keys(a), ...Object.keys(b)]);
    const objectArray: (DifferenceEntry | null)[] = Array.from(objectSet, (k) => {
        if (isObject(a[k]) || isObject(b[k])) {
            // always compare to an object, to get final value from nested objects.
            const objA = isObject(a[k]) ? a[k] : {};
            const objB = isObject(b[k]) ? b[k] : {};
            return getDifference(objA, objB, [...path, k as string]);
        } else if (a[k] !== b[k]) {
            return {
                [[...path, k].join("nbsp")]: {
                    ...(a[k] && { from: a[k] }),
                    ...(b[k] && { to: b[k] }),
                },
            };
        } else return null;
    });
    const filtered = objectArray.filter((a) => a && Object.keys(a).length) as DifferenceEntry[];
    return filtered.length ? Object.assign(...filtered) : {};
}
