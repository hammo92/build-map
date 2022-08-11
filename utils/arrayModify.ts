import { ValueOf } from "type-fest";
import { KeyPath } from "type-helpers";

export const reorderArray = (array: any[], from: number, to: number) => {
    const clone = [...array];
    const fromValue = clone[from];
    clone.splice(from, 1);
    clone.splice(to, 0, fromValue);
    return clone;
};

export const commaListToArray = (list: string | undefined) => {
    if (!list || !list.length) return [];
    const values = list.split(",");
    const trimmed = values.map((value) => value.trim());
    //const removeEmpty = trimmed.filter((value) => value.length !== 0);
    return trimmed;
};

export const arrayToCommaList = (array: string[]) => {
    if (array.length) {
        return array.map((value) => value).join(", ");
    }
};

export const moveInArray = (array: any[], from: number, to: number) => {
    const clonedArray = [...array];
    const toMove = clonedArray[from];
    clonedArray.splice(from, 1);
    clonedArray.splice(to, 0, toMove);
    return clonedArray;
};

export const chunkArray = (array: any[], chunkSize: number) => {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        chunkedArray.push(chunk);
    }
    return chunkedArray;
};

export const removeDuplicatesFromArray = (array: any[]) => [...new Set(array)];

//* Convert array to object with array items indexed by key */
export function objArrToKeyIndexedMap<T, X extends keyof T>(array: T[], key: X): Map<T[X], T> {
    const map = new Map();
    array.forEach((obj) => {
        map.set(obj[key], obj);
    });
    return map;
}

export function objArrayToHashmap<T, X extends keyof T>(array: T[], path: X): { [key: string]: T } {
    const hashmap = array.reduce((prev, currObj) => {
        const key = currObj[path];
        if (typeof key === "string") {
            return { ...prev, [key]: currObj };
        }
        return prev;
    }, {});
    return { ...hashmap };
}

export function arraySymmetricDiff<T>(arr1: T[], arr2: T[]): T[] {
    return arr1.filter((x) => !arr2.includes(x)).concat(arr2.filter((x) => !arr1.includes(x)));
}
