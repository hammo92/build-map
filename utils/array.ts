export const arrayShallowCompare = (a: any[], b: any[]) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

export const arrayDifference = (a: any[], b: any[]) =>
    a.filter((x) => !b.includes(x)).concat(b.filter((x) => !a.includes(x)));
