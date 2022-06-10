/* contentType.model.ts */

import {
    FieldType,
    FIELD_TYPES,
} from "../../../components/contentType/constants";
import {
    buildIndex,
    indexBy,
    Model,
    timekey,
} from "serverless-cloud-data-utils";
import { IconDefinition } from "@fortawesome/pro-regular-svg-icons";
import { MantineColor } from "@mantine/core";

export interface ContentTypeIcon {
    icon: IconDefinition;
    color: MantineColor;
}

export interface ContentTypeField {
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

//* contentType model and indexes //

// To get all an contentType by it's ID *//
//namespace contentType:${contentTypeId} */
export const ContentTypeId = buildIndex({ namespace: `contentType` });

// To get all content types for an organisation *//
//namespace organisation_${organisationId}:contentTypes:${date} */
export const ContentTypeOrganisation = (organisationId: string) =>
    buildIndex({
        namespace: `organisation_${organisationId}:contentTypes`,
        label: "label1",
        converter: timekey,
    });

//model: ContentType */
export class ContentType extends Model<ContentType> {
    id: string;
    name: string;
    icon: ContentTypeIcon;
    organisationId: string;
    date: string;
    status: "draft" | "published";
    fields: ContentTypeField[];
    keys() {
        return [
            indexBy(ContentTypeId).exact(this.id),
            indexBy(ContentTypeOrganisation(this.organisationId)).exact(
                this.date
            ),
        ];
    }
}
