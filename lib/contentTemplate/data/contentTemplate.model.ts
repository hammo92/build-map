/* contentTemplate.model.ts */

import {
    FieldType,
    FIELD_TYPES,
} from "../../../components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import {
    buildIndex,
    indexBy,
    Model,
    timekey,
} from "serverless-cloud-data-utils";
import { IconDefinition } from "@fortawesome/pro-regular-svg-icons";
import { MantineColor } from "@mantine/core";

export interface ContentTemplateIcon {
    icon: IconDefinition;
    color: MantineColor;
}

export interface ContentTemplateField {
    id: string;
    name: string;
    type: FieldType;
    active: boolean;
    required?: boolean;
    description?: string;
    config?: {
        subtype?: string;
        editableBy?: "all" | "issuer" | "recipient";
        visibleTo?: "all" | "issuer" | "recipient";
        [key: string]: any;
    };
}

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
    icon: ContentTemplateIcon;
    organisationId: string;
    date: string;
    status: "draft" | "published";
    type: "collection" | "component";
    fields: ContentTemplateField[];
    keys() {
        return [
            indexBy(ContentTemplateId).exact(this.id),
            indexBy(ContentTemplateOrganisation(this.organisationId)).exact(
                this.date
            ),
        ];
    }
}
