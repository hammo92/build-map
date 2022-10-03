import { HistoryEntry, Note } from "../historyEntry/data/historyEntry.model";
import { events } from "@serverless/cloud";
import { BaseModel } from "./baseModel";

export abstract class ModelWithHistory<T extends BaseModel<T>> extends BaseModel<T> {
    history: HistoryEntry[];

    constructor(obj?: any) {
        super({
            ...obj,
        });
    }

    async saveWithHistory(props: Omit<HistoryEntry, "id" | "createdTime">) {
        const date = new Date().toISOString();
        const historyEntry = new HistoryEntry(props);
        this.lastEditedBy = props.editedBy;
        this.lastEditedTime = date;
        if (!Array.isArray(this.history)) {
            this.history = [];
        }
        this.history.unshift(historyEntry);
        await super.save();
        await events.publish(`${this.object}.updated`, {
            templateId: this.id,
            historyEntry,
        });
    }
}
