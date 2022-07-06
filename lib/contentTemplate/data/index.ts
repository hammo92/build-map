import { Organisation } from "../../organisation/data/organisation.model";
import { params } from "@serverless/cloud";
import { Oso } from "oso-cloud";
import { indexBy } from "serverless-cloud-data-utils";
import { ModelRequired } from "type-helpers";
import { v4 as uuidv4 } from "uuid";
import { User } from "../../user/data/user.model";
import { errorRequiredPropsUndefined, errorIfUndefined } from "../../utils";
import {
    ContentTemplate,
    ContentTemplateId,
    ContentTemplateOrganisation,
} from "./contentTemplate.model";
import { IconPickerIcon } from "@components/ui/iconPicker/types";
import { ContentTemplateField } from "./types";

const oso = new Oso("https://cloud.osohq.com", params.OSO_API_KEY);

//* Create contentTemplate */
export async function createContentTemplate({
    name,
    icon,
    organisationId,
    userId,
    type,
}: {
    name: string;
    icon: IconPickerIcon;
    organisationId: string;
    userId: string;
    type: ContentTemplate["type"];
}) {
    errorIfUndefined({ name, userId, organisationId, icon, type });
    //fields.forEach(({ name, type }) => errorIfUndefined({ name, type }));
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

    // create contentTemplate //
    const newContentTemplate = new ContentTemplate();
    newContentTemplate.name = name;
    newContentTemplate.icon = icon;
    newContentTemplate.status = "draft";
    newContentTemplate.type = type;
    newContentTemplate.id = uuidv4();
    newContentTemplate.date = new Date().toISOString();
    newContentTemplate.createdBy = userId;
    newContentTemplate.lastEditedTime = new Date().toISOString();
    newContentTemplate.lastEditedBy = userId;
    newContentTemplate.organisationId = organisationId;
    newContentTemplate.fields = [];
    console.log("type", type);
    // add contentTemplate fields //
    /*newContentTemplate.fields = fields.map((field) => {
        return { ...field, id: uuidv4(), active: true };
    });*/

    await newContentTemplate.save();
    return newContentTemplate;
}

//* Get contentTemplate by id */
export async function getContentTemplateById(contentTemplateId: string) {
    errorIfUndefined({ contentTemplateId });
    const contentTemplate = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);
    return contentTemplate;
}

//* Get Organisation's contentTemplates */
export async function getOrganisationContentTemplates(organisationId: string) {
    errorIfUndefined({ organisationId });
    const contentTemplates = await indexBy(ContentTemplateOrganisation(organisationId)).get(
        ContentTemplate
    );
    return contentTemplates;
}

//* Delete contentTemplate by id */
export async function deleteContentTemplateById(contentTemplateId: string) {
    errorIfUndefined({ contentTemplateId });
    // get contentTemplate
    const contentTemplate = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);

    errorIfUndefined({ contentTemplate }, "notFound");

    await contentTemplate!.delete();

    return contentTemplate;
}

//* Update contentTemplate */
export async function updateContentTemplate({
    contentTemplateId,
    name,
    status,
    icon,
    userId,
}: {
    contentTemplateId: string;
    name?: string;
    status?: "draft" | "published";
    icon?: IconPickerIcon;
    userId: string;
}) {
    errorIfUndefined({ contentTemplateId, userId });
    const contentTemplate = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);
    if (!contentTemplate) throw new Error("No content template found");
    if (name) {
        contentTemplate.name = name;
    }
    if (status) {
        contentTemplate.status = status;
    }
    if (icon) {
        contentTemplate.icon = icon;
    }
    contentTemplate.lastEditedTime = new Date().toISOString();
    contentTemplate.lastEditedBy = userId;
    await contentTemplate!.save();
    return contentTemplate;
}

//* Create contentTemplateField */
export async function createContentTemplateField(props: {
    contentTemplateId: string;
    fieldProperties: ModelRequired<ContentTemplateField, "name" | "type">;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["contentTemplateId", "fieldProperties.name", "fieldProperties.type"],
    });

    const { contentTemplateId, fieldProperties } = props;

    const contentTemplate = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);

    if (!contentTemplate) throw new Error("No content template found");

    const newField = {
        ...fieldProperties,
        id: uuidv4(),
        active: true,
    };
    contentTemplate.fields.push(newField);

    await contentTemplate.save();
    return contentTemplate;
}

//* Update contentTemplateField */
export async function updateContentTemplateField(props: {
    contentTemplateId: string;
    fieldProperties: ModelRequired<ContentTemplateField, "id">;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["contentTemplateId", "fieldProperties.id"],
    });

    const { contentTemplateId, fieldProperties } = props;
    const contentTemplate = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);

    if (!contentTemplate) throw new Error("No content template found");

    const fieldIndexToUpdate = contentTemplate.fields.findIndex(
        ({ id }) => id === fieldProperties.id
    );

    // remove id as to not overwrite, and type as that cannot be changed once created
    const { id, type, ...rest } = fieldProperties;

    // update field on content template
    contentTemplate.fields[fieldIndexToUpdate] = {
        ...contentTemplate.fields[fieldIndexToUpdate],
        ...rest,
    };

    await contentTemplate.save();
    return contentTemplate;
}

//* Reorder contentTemplateFields */
export async function reorderContentTemplateFields(props: {
    contentTemplateId: string;
    fromIndex: number;
    toIndex: number;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["contentTemplateId", "fromIndex", "toIndex"],
    });

    const { contentTemplateId, fromIndex, toIndex } = props;
    const contentTemplate = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);

    if (!contentTemplate) throw new Error("No content template found");

    const clonedFields = [...contentTemplate.fields];
    const field = contentTemplate.fields[fromIndex];

    clonedFields.splice(fromIndex, 1);
    clonedFields.splice(toIndex, 0, field);

    // update field on content template
    contentTemplate.fields = clonedFields;

    await contentTemplate.save();
    return contentTemplate;
}

//* Delete contentTemplate field */
export async function deleteContentTemplateField(props: {
    contentTemplateId: string;
    fieldId: string;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["contentTemplateId", "fieldId"],
    });

    const { contentTemplateId, fieldId } = props;

    // get contentTemplate
    const contentTemplate = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);

    if (!contentTemplate) throw new Error("No content template found");

    const fields = contentTemplate.fields.filter(({ id }) => id !== fieldId);

    contentTemplate.fields = fields;

    //if no fields left set contentTemplate status to draft
    if (!fields.length) {
        contentTemplate.status = "draft";
    }

    await contentTemplate.save();

    return contentTemplate;
}
