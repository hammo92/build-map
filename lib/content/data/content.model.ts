//* content model and indexes //

import {
    ContentTemplateHistoryEntry,
    PropertyUpdate,
} from "@lib/contentTemplate/data/contentTemplate.model";
import { events } from "@serverless/cloud";
import { buildIndex, indexBy, Model, timekey } from "serverless-cloud-data-utils";
import { ContentField } from "./types";

type ContentHistoryActions = "updated" | "created" | "published" | "archived";

export interface PropertyValueUpdate {
    fieldId: string;
    value: string;
    previousValue: ContentField["value"] | null;
    note: string | null;
}

export interface ContentHistory {
    date: string;
    userId: string;
    action: ContentHistoryActions;
    notes: string[] | null;
    propertyValuesUpdates?: PropertyValueUpdate[] | null;
    propertyUpdates?: PropertyUpdate<ContentField["category"]>[] | null;
}

export type ContentStatus = "draft" | "published" | "archived";

// To get content by it's ID *//
//namespace content:${contentId} */
export const ContentId = buildIndex({ namespace: `content` });

// To get a content by templateId, filter by project  *//
//namespace content:template_${templateId}:${projectId} */
export const ContentTemplate = ({ templateId }: { templateId: string }) =>
    buildIndex({
        namespace: `content:template_${templateId}`,
        label: "label1",
    });

// To get a content by outdated status  *//
//namespace content:outdated_${outdated}:template_${templateId}:${contentId} */
export const ContentOutdated = ({
    outdated,
    templateId,
}: {
    outdated: boolean;
    templateId: string;
}) =>
    buildIndex({
        namespace: `content:outdated_${outdated}:templateId_${templateId}`,
        label: "label2",
    });

//model: Content */
export class Content extends Model<Content> {
    id: string;
    contentTemplateId: string;
    projectId: string;
    createdTime: string;
    createdBy: string;
    lastEditedTime: string;
    lastEditedBy: string;
    publishTime: string;
    status: "draft" | "published" | "archived";
    fields: ContentField[];
    contentTemplateVersion: string;
    history: ContentHistory[];
    title: string;

    async saveWithHistory({
        userId,
        action,
        propertyValuesUpdates,
        propertyUpdates,
        notes,
    }: {
        userId: string;
        action: ContentHistoryActions;
        propertyValuesUpdates?: ContentHistory["propertyValuesUpdates"];
        propertyUpdates?: ContentHistory["propertyUpdates"];
        notes?: string[];
    }) {
        const date = new Date().toISOString();

        const historyEntry = {
            date,
            userId,
            action,
            notes: notes ?? null,
            propertyValuesUpdates: propertyValuesUpdates ?? null,
            propertyUpdates: propertyUpdates ?? null,
        };
        this.lastEditedBy = userId;
        this.lastEditedTime = date;
        this.history = [historyEntry, ...this.history];
        await super.save();
        await events.publish("content.updated", {
            historyEntry,
        });
    }

    // keep track of any changes to the contentTemplate
    outdated: boolean;
    templateUpdates: ContentTemplateHistoryEntry[];
    keys() {
        return [
            indexBy(ContentId).exact(this.id),
            indexBy(ContentTemplate({ templateId: this.contentTemplateId })).exact(this.projectId),
            indexBy(
                ContentOutdated({ outdated: this.outdated, templateId: this.contentTemplateId })
            ).exact(this.id),
        ];
    }
}
