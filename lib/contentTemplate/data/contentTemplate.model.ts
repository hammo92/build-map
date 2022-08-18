/* contentTemplate.model.ts */

import { IconPickerIcon } from "@components/ui/iconPicker/types";
import { events } from "@serverless/cloud";
import { buildIndex, indexBy, Model, timekey } from "serverless-cloud-data-utils";
import { DifferenceEntry } from "utils/objects";
import { Property } from "./types";

type ContentTemplateHistoryActions = "updated" | "created" | "published" | "archived";

export type PropertyUpdate<T = "TemplateInfo" | "TemplateProperty"> = {
    fieldType: T;
    fieldId: string | null;
    fieldName: string;
    action: "deleted" | "updated" | "created";
    note?: string | null;
    /** Object with key of property and changed values */
    changes?: DifferenceEntry;
};

export interface ContentTemplateHistoryEntry {
    date: string;
    userId: string;
    action: ContentTemplateHistoryActions;
    updateNotes?: string[];
    /** Updates to content template properties */
    propertyUpdate?: PropertyUpdate;
}

export interface ContentTemplateTitle {
    setType: "manual" | "auto";
    type: "contentInfo" | "contentProperty";
    value: string;
}

//* contentTemplate model and indexes //

// To get all contentTemplate by it's ID *//
//namespace contentTemplate:${contentTemplateId} */
export const ContentTemplateId = buildIndex({ namespace: `contentTemplate` });

// To get all content templates for an organisation *//
//namespace organisation_${organisationId}:contentTemplates:${lastEditedTime} */
export const ContentTemplateOrganisation = (organisationId: string) =>
    buildIndex({
        namespace: `organisation_${organisationId}:contentTemplates`,
        label: "label1",
        converter: timekey,
    });

//model: ContentTemplate */
export class ContentTemplate extends Model<ContentTemplate> {
    id: string;
    type = "ContentTemplate";
    name: string;
    icon: IconPickerIcon;
    organisationId: string;
    createdTime: string;
    createdBy: string;
    lastEditedTime: string;
    lastEditedBy: string;
    status: "draft" | "archived" | "published";
    templateType: "collection" | "component";
    fields: Property[];
    history: ContentTemplateHistoryEntry[];
    title: ContentTemplateTitle;

    async saveWithHistory(props: Omit<ContentTemplateHistoryEntry, "date">) {
        const { userId } = props;
        const date = new Date().toISOString();
        const historyEntry: ContentTemplateHistoryEntry = {
            ...props,
            date,
        };
        this.lastEditedBy = userId;
        this.lastEditedTime = date;
        if (this.history) {
            this.history.unshift(historyEntry);
        } else {
            this.history = [historyEntry];
        }
        await super.save();
        await events.publish(
            "contentTemplate.updated",
            { after: "5 seconds" },
            {
                templateId: this.id,
                historyEntry,
            }
        );
    }

    keys() {
        return [
            indexBy(ContentTemplateId).exact(this.id),
            indexBy(ContentTemplateOrganisation(this.organisationId)).exact(this.lastEditedTime),
        ];
    }
}
