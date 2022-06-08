import { Organisation } from "../../organisation/data/organisation.model";
import { params } from "@serverless/cloud";
import { Oso } from "oso-cloud";
import { indexBy } from "serverless-cloud-data-utils";
import { ModelRequired } from "type-helpers";
import { v4 as uuidv4 } from "uuid";
import { User } from "../../user/data/user.model";
import { errorRequiredPropsUndefined, errorUndefined } from "../../utils";
import {
    FormTemplate,
    FormTemplateField,
    FormTemplateId,
    FormTemplateOrganisation,
} from "./formTemplate.model";

const oso = new Oso("https://cloud.osohq.com", params.OSO_API_KEY);

//* Create formTemplate */
export async function createFormTemplate({
    name,
    organisationId,
    userId,
}: {
    name: string;
    organisationId: string;
    userId: string;
}) {
    errorUndefined({ name, userId, organisationId });
    //fields.forEach(({ name, type }) => errorUndefined({ name, type }));
    /*if (!fields.length) {
        throw new Error("Form must have at least one field");
    }*/

    // Check user has permissions //
    /*if (
        !(await oso.authorize(
            new User({ id: userId }),
            "write",
            new Organisation({ id: organisationId })
        ))
    ) {
        throw new Error("Action not permitted for user");
    }*/

    // create formTemplate //
    const newFormTemplate = new FormTemplate();
    newFormTemplate.name = name;
    newFormTemplate.status = "draft";
    newFormTemplate.id = uuidv4();
    newFormTemplate.date = new Date().toISOString();
    newFormTemplate.organisationId = organisationId;
    newFormTemplate.fields = [];

    // add formTemplate fields //
    /*newFormTemplate.fields = fields.map((field) => {
        return { ...field, id: uuidv4(), active: true };
    });*/

    await newFormTemplate.save();
    return newFormTemplate;
}

//* Get formTemplate by id */
export async function getFormTemplateById(formTemplateId: string) {
    errorUndefined({ formTemplateId });
    const formTemplate = await indexBy(FormTemplateId)
        .exact(formTemplateId)
        .get(FormTemplate);
    return formTemplate;
}

//* Get Organisation's formTemplates */
export async function getOrganisationFormTemplates(organisationId: string) {
    errorUndefined({ organisationId });
    const formTemplates = await indexBy(
        FormTemplateOrganisation(organisationId)
    ).get(FormTemplate);
    return formTemplates;
}

//* Delete formTemplate by id */
export async function deleteFormTemplateById(formTemplateId: string) {
    errorUndefined({ formTemplateId });
    // get formTemplate
    const formTemplate = await indexBy(FormTemplateId)
        .exact(formTemplateId)
        .get(FormTemplate);

    errorUndefined({ formTemplate }, "notFound");

    await formTemplate!.delete();

    return formTemplate;
}

//* Update formTemplate */
export async function updateFormTemplate({
    formTemplateId,
    name,
    status,
}: {
    formTemplateId: string;
    name?: string;
    status?: "draft" | "published";
}) {
    errorUndefined({ formTemplateId });
    const formTemplate = await indexBy(FormTemplateId)
        .exact(formTemplateId)
        .get(FormTemplate);
    if (!formTemplate) throw new Error("No form template found");
    if (name) {
        formTemplate.name = name;
    }
    if (status) {
        formTemplate.status = status;
    }
    await formTemplate!.save();
    return formTemplate;
}

//* Create formTemplateField */
export async function createFormTemplateField(props: {
    formTemplateId: string;
    fieldDetails: ModelRequired<FormTemplateField, "name" | "type">;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["formTemplateId", "fieldDetails.name", "fieldDetails.type"],
    });

    const { formTemplateId, fieldDetails } = props;

    const formTemplate = await indexBy(FormTemplateId)
        .exact(formTemplateId)
        .get(FormTemplate);

    if (!formTemplate) throw new Error("No form template found");

    const newField = {
        ...fieldDetails,
        id: uuidv4(),
        active: true,
    };
    formTemplate.fields.push(newField);

    await formTemplate.save();
    return formTemplate;
}

//* Update formTemplateField */
export async function updateFormTemplateField(props: {
    formTemplateId: string;
    fieldDetails: ModelRequired<FormTemplateField, "id">;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["formTemplateId", "fieldDetails.id"],
    });

    const { formTemplateId, fieldDetails } = props;
    const formTemplate = await indexBy(FormTemplateId)
        .exact(formTemplateId)
        .get(FormTemplate);

    if (!formTemplate) throw new Error("No form template found");

    const fieldIndexToUpdate = formTemplate.fields.findIndex(
        ({ id }) => id === fieldDetails.id
    );

    // remove id as to not overwrite, and type as that cannot be changed once created
    const { id, type, ...rest } = fieldDetails;

    // update field on template
    formTemplate.fields[fieldIndexToUpdate] = {
        ...formTemplate.fields[fieldIndexToUpdate],
        ...rest,
    };

    await formTemplate.save();
    return formTemplate;
}

//* Reorder formTemplateFields */
export async function reorderFormTemplateFields(props: {
    formTemplateId: string;
    fromIndex: number;
    toIndex: number;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["formTemplateId", "fromIndex", "toIndex"],
    });

    const { formTemplateId, fromIndex, toIndex } = props;
    const formTemplate = await indexBy(FormTemplateId)
        .exact(formTemplateId)
        .get(FormTemplate);

    if (!formTemplate) throw new Error("No form template found");

    const clonedFields = [...formTemplate.fields];
    const field = formTemplate.fields[fromIndex];

    clonedFields.splice(fromIndex, 1);
    clonedFields.splice(toIndex, 0, field);

    // update field on template
    formTemplate.fields = clonedFields;

    await formTemplate.save();
    return formTemplate;
}

//* Delete formTemplate field */
export async function deleteFormTemplateField(props: {
    formTemplateId: string;
    fieldId: string;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["formTemplateId", "fieldId"],
    });

    const { formTemplateId, fieldId } = props;

    // get formTemplate
    const formTemplate = await indexBy(FormTemplateId)
        .exact(formTemplateId)
        .get(FormTemplate);

    if (!formTemplate) throw new Error("No form template found");

    const fields = formTemplate.fields.filter(({ id }) => id !== fieldId);

    formTemplate.fields = fields;

    //if no fields left set formTemplate status to draft
    if (!fields.length) {
        formTemplate.status = "draft";
    }

    await formTemplate.save();

    return formTemplate;
}
