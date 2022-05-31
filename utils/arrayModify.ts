export const reorderArray = (array: any[], from: number, to: number) => {
    const clone = [...array];
    const fromValue = clone[from];
    clone.splice(from, 1);
    clone.splice(to, 0, fromValue);
    return clone;
};
