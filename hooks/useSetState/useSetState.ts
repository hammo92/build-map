import React, { useState } from "react";

export interface UseSetStateHandlers<T> {
    setState: React.Dispatch<React.SetStateAction<Set<T>>>;
    add: (...items: T[]) => void;
    remove: (...indices: T[]) => void;
}

export type UseSetState<T> = [Set<T>, UseSetStateHandlers<T>];

export function useSetState<T>(initialValue: T[] = []): UseSetState<T> {
    const [state, setState] = useState(new Set([...initialValue]));

    const add = (...items: T[]) => setState((current) => new Set([...current, ...items]));

    const remove = (...indices: T[]) =>
        setState((current) => new Set([...current].filter((key) => !indices.includes(key))));

    return [
        state,
        {
            add,
            remove,
            setState,
        },
    ];
}
