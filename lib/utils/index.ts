import { Model } from "serverless-cloud-data-utils";
import { KeyPath, StripModel } from "type-helpers";

/** throw an error with the property name/names which are missing */
export function errorIfUndefined(
    props: { [key: string]: any },
    errorType: "notProvided" | "notFound" = "notProvided"
) {
    const missingList: string[] = [];
    let errorString;
    switch (errorType) {
        case "notProvided":
            errorString = "Please provide required argument";
            break;
        case "notFound":
            errorString = "Could not find resource";
            break;
        default:
            errorString = "error with value";
    }
    Object.keys(props).forEach((key) => {
        if (!props[key]) {
            missingList.push(key);
        }
    });
    if (missingList.length) {
        throw new Error(
            `${errorString}${missingList.length > 1 ? "s" : ""} "${missingList.join(", ")}"`
        );
    }
}

export function errorRequiredPropsUndefined<U extends { [key: string]: any }>({
    props,
    propPaths,
}: {
    props: U;
    propPaths: KeyPath<U>[];
}) {
    const missingList: string[] = [];
    propPaths.forEach((key) => {
        const path = key.split(".");
        const value = path.reduce((acc, step) => acc[step], props);
        if (value === undefined) {
            missingList.push(key);
        }
    });
    if (missingList.length) {
        throw new Error(
            `Please provide required argument${
                missingList.length > 1 ? "s" : ""
            } "${missingList.join(", ")}"`
        );
    }
}

export function updateModelWithObject<T extends Model<T>>(
    model: Model<T>,
    props: Partial<StripModel<Model<T>>>
) {
    Object(props).keys.map((key: string) => {
        model[key as keyof typeof model] = props[key as keyof typeof props];
    });
}
