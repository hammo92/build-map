import { UserId } from "@lib/user/data/user.model";
import { buildIndex, Exact, indexBy, Model, SecondaryExact } from "serverless-cloud-data-utils";
import { ulid } from "ulid";

// To get all a BaseModel by it's ID *//
//namespace baseModel:${baseModelId} */
export const BaseModelId = (type: string) => buildIndex({ namespace: `baseModel` });

export abstract class BaseModel<T extends Model<T>> extends Model<T> {
    id: string;
    name: string;
    createdTime: string;
    createdBy: string;
    lastEditedTime: string;
    lastEditedBy: string;
    object: string;
    parent?: string;
    collection?: string;
    archived?: boolean;

    //Todo update data-utils to allow editing of constructor obj
    constructor(obj?: any) {
        const date = new Date().toISOString();
        super({
            id: obj?.id ?? ulid(),
            createdTime: date,
            lastEditedTime: date,
            createdBy: obj?.userId ? obj?.userId : "system",
            lastEditedBy: obj?.userId ? obj?.userId : "system",
            ...obj,
        });
    }

    abstract modelKeys(): SecondaryExact[];

    keys() {
        const keyArray = [indexBy(buildIndex()).exact(this.id), ...this.modelKeys()];
        if (this.modelKeys.length > 5) throw new Error("Maximum of 4 keys allowed");
        return keyArray;
    }
}
