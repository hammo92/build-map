import { Organisation } from "../../organisation/data/organisation.model";
import { params } from "@serverless/cloud";
import { Oso } from "oso-cloud";
import { indexBy } from "serverless-cloud-data-utils";
import { ModelRequired } from "type-helpers";
import { v4 as uuidv4 } from "uuid";
import { User } from "../../user/data/user.model";
import { errorRequiredPropsUndefined, errorIfUndefined } from "../../utils";
import {
    ContentType,
    ContentTypeField,
    ContentTypeIcon,
    ContentTypeId,
    ContentTypeOrganisation,
} from "./contentType.model";

const oso = new Oso("https://cloud.osohq.com", params.OSO_API_KEY);

//* Create contentType */
export async function createContentType({
    name,
    icon,
    organisationId,
    userId,
}: {
    name: string;
    icon: ContentTypeIcon;
    organisationId: string;
    userId: string;
}) {
    errorIfUndefined({ name, userId, organisationId, icon });
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

    // create contentType //
    const newContentType = new ContentType();
    newContentType.name = name;
    newContentType.icon = icon;
    newContentType.status = "draft";
    newContentType.id = uuidv4();
    newContentType.date = new Date().toISOString();
    newContentType.organisationId = organisationId;
    newContentType.fields = [];

    // add contentType fields //
    /*newContentType.fields = fields.map((field) => {
        return { ...field, id: uuidv4(), active: true };
    });*/

    await newContentType.save();
    return newContentType;
}

//* Get contentType by id */
export async function getContentTypeById(contentTypeId: string) {
    errorIfUndefined({ contentTypeId });
    const contentType = await indexBy(ContentTypeId)
        .exact(contentTypeId)
        .get(ContentType);
    return contentType;
}

//* Get Organisation's contentTypes */
export async function getOrganisationContentTypes(organisationId: string) {
    errorIfUndefined({ organisationId });
    const contentTypes = await indexBy(
        ContentTypeOrganisation(organisationId)
    ).get(ContentType);
    return contentTypes;
}

//* Delete contentType by id */
export async function deleteContentTypeById(contentTypeId: string) {
    errorIfUndefined({ contentTypeId });
    // get contentType
    const contentType = await indexBy(ContentTypeId)
        .exact(contentTypeId)
        .get(ContentType);

    errorIfUndefined({ contentType }, "notFound");

    await contentType!.delete();

    return contentType;
}

//* Update contentType */
export async function updateContentType({
    contentTypeId,
    name,
    status,
    icon,
}: {
    contentTypeId: string;
    name?: string;
    status?: "draft" | "published";
    icon?: ContentTypeIcon;
}) {
    errorIfUndefined({ contentTypeId });
    const contentType = await indexBy(ContentTypeId)
        .exact(contentTypeId)
        .get(ContentType);
    if (!contentType) throw new Error("No content type found");
    if (name) {
        contentType.name = name;
    }
    if (status) {
        contentType.status = status;
    }
    if (icon) {
        contentType.icon = icon;
    }
    await contentType!.save();
    return contentType;
}

//* Create contentTypeField */
export async function createContentTypeField(props: {
    contentTypeId: string;
    fieldDetails: ModelRequired<ContentTypeField, "name" | "type">;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["contentTypeId", "fieldDetails.name", "fieldDetails.type"],
    });

    const { contentTypeId, fieldDetails } = props;

    const contentType = await indexBy(ContentTypeId)
        .exact(contentTypeId)
        .get(ContentType);

    if (!contentType) throw new Error("No content type found");

    const newField = {
        ...fieldDetails,
        id: uuidv4(),
        active: true,
    };
    contentType.fields.push(newField);

    await contentType.save();
    return contentType;
}

//* Update contentTypeField */
export async function updateContentTypeField(props: {
    contentTypeId: string;
    fieldDetails: ModelRequired<ContentTypeField, "id">;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["contentTypeId", "fieldDetails.id"],
    });

    const { contentTypeId, fieldDetails } = props;
    const contentType = await indexBy(ContentTypeId)
        .exact(contentTypeId)
        .get(ContentType);

    if (!contentType) throw new Error("No content type found");

    const fieldIndexToUpdate = contentType.fields.findIndex(
        ({ id }) => id === fieldDetails.id
    );

    // remove id as to not overwrite, and type as that cannot be changed once created
    const { id, type, ...rest } = fieldDetails;

    // update field on content type
    contentType.fields[fieldIndexToUpdate] = {
        ...contentType.fields[fieldIndexToUpdate],
        ...rest,
    };

    await contentType.save();
    return contentType;
}

//* Reorder contentTypeFields */
export async function reorderContentTypeFields(props: {
    contentTypeId: string;
    fromIndex: number;
    toIndex: number;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["contentTypeId", "fromIndex", "toIndex"],
    });

    const { contentTypeId, fromIndex, toIndex } = props;
    const contentType = await indexBy(ContentTypeId)
        .exact(contentTypeId)
        .get(ContentType);

    if (!contentType) throw new Error("No content type found");

    const clonedFields = [...contentType.fields];
    const field = contentType.fields[fromIndex];

    clonedFields.splice(fromIndex, 1);
    clonedFields.splice(toIndex, 0, field);

    // update field on content type
    contentType.fields = clonedFields;

    await contentType.save();
    return contentType;
}

//* Delete contentType field */
export async function deleteContentTypeField(props: {
    contentTypeId: string;
    fieldId: string;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["contentTypeId", "fieldId"],
    });

    const { contentTypeId, fieldId } = props;

    // get contentType
    const contentType = await indexBy(ContentTypeId)
        .exact(contentTypeId)
        .get(ContentType);

    if (!contentType) throw new Error("No content type found");

    const fields = contentType.fields.filter(({ id }) => id !== fieldId);

    contentType.fields = fields;

    //if no fields left set contentType status to draft
    if (!fields.length) {
        contentType.status = "draft";
    }

    await contentType.save();

    return contentType;
}
