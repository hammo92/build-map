/* contentTemplate.model.ts */

import { buildIndex, indexBy, timekey } from "serverless-cloud-data-utils";
import { IconPickerIcon } from "../../../components/ui/iconPicker/types";
import { BaseModelId, ModelWithHistory } from "../../models";
import { Property } from "./types";

export interface ContentTemplateTitle {
    setType: "manual" | "auto";
    type: "contentInfo" | "contentProperty";
    value: string;
}

export interface PropertyGroup {
    type: "propertyGroup";
    id: string | number;
    children: (string | number)[];
    name: string;
    repeatable: boolean;
}

//* contentTemplate model and indexes //

// To get all contentTemplate by it's ID *//
//namespace contentTemplate:${contentTemplateId} */
export const ContentTemplateId = buildIndex({ namespace: `contentTemplate`, label: "label1" });

// To get all content templates for an organisation *//
//namespace organisation_${organisationId}:contentTemplates:${lastEditedTime} */
export const ContentTemplateOrganisation = (organisationId: string) =>
    buildIndex({
        namespace: `organisation_${organisationId}:contentTemplates`,
        label: "label2",
        converter: timekey,
    });

interface ContentTemplateProps {
    name: string;
    icon: IconPickerIcon;
    organisationId: string;
    status: "draft" | "archived" | "published";
    templateType: "collection" | "component";
    fields: Property[];
    propertyGroups: PropertyGroup[];
    title: ContentTemplateTitle;
}

//model: ContentTemplate */
export class ContentTemplate extends ModelWithHistory<ContentTemplate> {
    type = "ContentTemplate";
    name: string;
    icon: IconPickerIcon;
    organisationId: string;
    status: "draft" | "archived" | "published";
    templateType: "collection" | "component";
    fields: Property[];
    propertyGroups: PropertyGroup[];
    title: ContentTemplateTitle;

    modelKeys() {
        return [
            indexBy(ContentTemplateId).exact(this.id),
            indexBy(ContentTemplateOrganisation(this.organisationId)).exact(this.lastEditedTime),
        ];
    }
}
