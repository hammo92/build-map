import { HistoryEntry } from "../../lib/historyEntry/data/historyEntry.model";
import { events } from "@serverless/cloud";
import { BaseModel } from "./baseModel";

export abstract class ModelWithHistory<T extends BaseModel<T>> extends BaseModel<T> {
    history: HistoryEntry[];

    constructor(obj?: any) {
        super(obj);
    }

    async initialise({ createdBy }: { createdBy: string }) {
        super.initialise({ createdBy });
        this.history = [];
    }

    async saveWithHistory(props: Omit<HistoryEntry, "id" | "createdTime">) {
        const date = new Date().toISOString();
        const historyEntry = new HistoryEntry(props);
        this.lastEditedBy = props.editedBy;
        this.lastEditedTime = date;
        this.history.unshift(historyEntry);
        await super.save();
        await events.publish("contentTemplate.updated", {
            templateId: this.id,
            historyEntry,
        });
    }
}
