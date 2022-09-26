import { SnakeCase, CamelCase } from "type-fest";
import { Required } from "utility-types";

// strip properties from model that are not data keys
export type StripModel<T, K extends keyof any = ""> = Omit<
    T,
    | "clean"
    | "__snapshot"
    | "save"
    | "delete"
    | "keys"
    | "primary"
    | "shadowKeys"
    | "updateShadowSnapshots"
    | "resolveShadowKeys"
    | "UNSAFE_shadowKeysUnbounded"
    | "__shadowSnapshots"
    | "secondaries"
    | "saveWithHistory"
    | "modelKeys"
    | K
>;

// set all to partial except provided keys
export type ModelRequired<T, K extends keyof StripModel<T>> = StripModel<Required<Partial<T>, K>>;

// set all to partial except provided keys
export type ModelPick<
    T,
    K extends keyof StripModel<T>, // picked
    N extends keyof Pick<Partial<T>, K> // set picked to required
> = StripModel<Required<Pick<Partial<T>, K>, N>>;

/**
 *
 * Types for parsing key path strings
 *
 */

type Prev = [
    never,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    ...0[]
];

type Join<K, P> = K extends string | number
    ? P extends string | number
        ? `${K}${"" extends P ? "" : "."}${P}`
        : never
    : never;

export type KeyPath<T, D extends number = 10> = [D] extends [never]
    ? never
    : T extends object
    ? {
          [K in keyof T]-?: K extends string | number
              ? `${K}` | (KeyPath<T[K], Prev[D]> extends infer R ? Join<K, R> : never)
              : never;
      }[keyof T]
    : "";

export type ToSnake<M extends Record<string, any>> = {
    [K in keyof M as SnakeCase<K & string>]: M[K];
};

export type ToCamel<M extends Record<string, any>> = {
    [K in keyof M as CamelCase<K & string>]: M[K];
};

// data returned from serverless cloud is in snake case
// types need to be converted for use with data from server
export type CleanedSnake<T> = ToSnake<StripModel<T>>;

export type CleanedCamel<T> = ToCamel<StripModel<T>>;

export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

export type DistributiveClean<T extends any, K extends keyof any = ""> = T extends any
    ? Omit<
          T,
          | "clean"
          | "__snapshot"
          | "save"
          | "delete"
          | "keys"
          | "primary"
          | "shadowKeys"
          | "updateShadowSnapshots"
          | "resolveShadowKeys"
          | "UNSAFE_shadowKeysUnbounded"
          | "__shadowSnapshots"
          | "secondaries"
          | "saveWithHistory"
          | "modelKeys"
          | K
      >
    : never;
