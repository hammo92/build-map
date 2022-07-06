/* contentTemplate.model.ts */

import { IconPickerIcon } from "@components/ui/iconPicker/types";
import { buildIndex, indexBy, Model, timekey } from "serverless-cloud-data-utils";
import { FieldType } from "../../../components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { ContentTemplateField } from "./types";

//* contentTemplate model and indexes //

// To get all an contentTemplate by it's ID *//
//namespace contentTemplate:${contentTemplateId} */
export const ContentTemplateId = buildIndex({ namespace: `contentTemplate` });

// To get all content templates for an organisation *//
//namespace organisation_${organisationId}:contentTemplates:${date} */
export const ContentTemplateOrganisation = (organisationId: string) =>
    buildIndex({
        namespace: `organisation_${organisationId}:contentTemplates`,
        label: "label1",
        converter: timekey,
    });

//model: ContentTemplate */
export class ContentTemplate extends Model<ContentTemplate> {
    id: string;
    name: string;
    icon: IconPickerIcon;
    organisationId: string;
    date: string;
    status: "draft" | "published";
    type: "collection" | "component";
    fields: ContentTemplateField[];
    createdBy: string;
    lastEditedTime: string;
    lastEditedBy: string;
    keys() {
        return [
            indexBy(ContentTemplateId).exact(this.id),
            indexBy(ContentTemplateOrganisation(this.organisationId)).exact(this.date),
        ];
    }
}
