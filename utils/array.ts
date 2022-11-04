export const arrayShallowCompare = (a: any[], b: any[]) =>
    a.length === b.length && a.every((v, i) => v === b[i])

export const arrayDifference = (a: any[], b: any[]) =>
    a.filter((x) => !b.includes(x)).concat(b.filter((x) => !a.includes(x)))

/** Returns items in A that are not in B */
export const arrayDifferenceAsymmetric = (a: any[], b: any[]) =>
    a.filter((x) => !b.includes(x))

/** Returns items in both A and B arrays */
export const arrayIntersection = (a: any[], b: any[]) =>
    a.filter((x) => b.includes(x))
