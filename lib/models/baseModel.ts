import { UserId } from "@lib/user/data/user.model";
import { buildIndex, Exact, indexBy, Model } from "serverless-cloud-data-utils";
import { ulid } from "ulid";

// To get all a BaseModel by it's ID *//
//namespace baseModel:${baseModelId} */
export const BaseModelId = buildIndex({ namespace: `baseModel`, label: "label5" });

export abstract class BaseModel<T extends Model<T>> extends Model<T> {
    id: string;
    createdTime: string;
    createdBy: string;
    lastEditedTime: string;
    lastEditedBy: string;
    type: string;

    //Todo update data-utils to allow editing of constructor obj
    constructor(obj?: any) {
        const date = new Date().toISOString();
        super({
            id: ulid(),
            createdTime: date,
            lastEditedTime: date,
            createdBy: obj?.userId ? obj?.userId : "system",
            lastEditedBy: obj?.userId ? obj?.userId : "system",
            ...obj,
        });
    }
}
