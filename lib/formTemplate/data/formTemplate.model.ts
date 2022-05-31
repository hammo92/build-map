/* formTemplate.model.ts */

import { FIELD_TYPES } from "../../../components/formTemplate/constants";
import {
    buildIndex,
    indexBy,
    Model,
    timekey,
} from "serverless-cloud-data-utils";

export type FieldType = typeof FIELD_TYPES[keyof typeof FIELD_TYPES]["type"];

export interface FormTemplateField {
    id: string;
    name: string;
    type: FieldType;
    active: boolean;
    defaultValue?: any;
    required?: boolean;
    description?: string;
    config?: {
        subtype?: string;
        [key: string]: any;
    };
}

//* formTemplate model and indexes //

// To get all an formTemplate by it's ID *//
//namespace formTemplate:${formTemplateId} */
export const FormTemplateId = buildIndex({ namespace: `formTemplate` });

// To get all form templates for an organisation *//
//namespace organisation_${organisationId}:formTemplates:${date} */
export const FormTemplateOrganisation = (organisationId: string) =>
    buildIndex({
        namespace: `organisation_${organisationId}:formTemplates`,
        label: "label1",
        converter: timekey,
    });

//model: FormTemplate */
export class FormTemplate extends Model<FormTemplate> {
    id: string;
    name: string;
    organisationId: string;
    date: string;
    status: "draft" | "published";
    fields: FormTemplateField[];
    keys() {
        return [
            indexBy(FormTemplateId).exact(this.id),
            indexBy(FormTemplateOrganisation(this.organisationId)).exact(
                this.date
            ),
        ];
    }
}
