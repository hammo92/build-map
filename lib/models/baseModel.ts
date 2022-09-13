import { Model } from "serverless-cloud-data-utils";
import { ulid } from "ulid";

export abstract class BaseModel<T extends Model<T>> extends Model<T> {
    id: string;
    createdTime: string;
    createdBy: string;
    lastEditedTime: string;
    lastEditedBy: string;

    constructor(obj?: any) {
        super(obj);
    }

    async initialise({ createdBy }: { createdBy: string }) {
        const date = new Date().toISOString();
        this.id = ulid();
        this.createdTime = date;
        this.createdBy = createdBy;
        this.lastEditedTime = date;
        this.lastEditedBy = createdBy;
    }
}
