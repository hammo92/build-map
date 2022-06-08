export const reorderArray = (array: any[], from: number, to: number) => {
    const clone = [...array];
    const fromValue = clone[from];
    clone.splice(from, 1);
    clone.splice(to, 0, fromValue);
    return clone;
};

export const commaListToArray = (list: string) => {
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
