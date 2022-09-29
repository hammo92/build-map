import { params } from "@serverless/cloud";
import { PartialProperty } from "@state/propertyManager";
import { Oso } from "oso-cloud";
import { indexBy } from "serverless-cloud-data-utils";
import { ulid } from "ulid";
import { Icon } from "../../../components/ui/iconPicker/types";
import { FieldTypes, Property, PropertyGroup } from "../../../lib/field/data/field.model";
import { HistoryEntry } from "../../../lib/historyEntry/data/historyEntry.model";
import { splitCamel } from "../../../utils/stringTransform";
import { errorIfUndefined } from "../../utils";
import {
    ContentTemplate,
    ContentTemplateId,
    ContentTemplateOrganisation,
    ContentTemplateTitle,
} from "./contentTemplate.model";

const oso = new Oso("https://cloud.osohq.com", params.OSO_API_KEY);

//* Create contentTemplate */
export async function createContentTemplate({
    name,
    icon,
    organisationId,
    userId,
    templateType,
}: {
    name: string;
    icon: Icon;
    organisationId: string;
    userId: string;
    templateType: ContentTemplate["templateType"];
}) {
    errorIfUndefined({ name, userId, organisationId, icon, templateType });

    // create contentTemplate //
    const newContentTemplate = new ContentTemplate({ userId });

    // set Content Template details
    newContentTemplate.name = name;
    newContentTemplate.icon = icon;
    newContentTemplate.status = "draft";
    newContentTemplate.templateType = templateType;
    newContentTemplate.organisationId = organisationId;
    newContentTemplate.properties = [];
    newContentTemplate.propertyGroups = [
        { id: "1", children: [], name: "root", repeatable: false, type: "propertyGroup" },
    ];
    newContentTemplate.title = {
        setType: "auto",
        type: "contentInfo",
        value: "id",
    };

    await newContentTemplate.saveWithHistory({
        editedBy: userId,
        title: `${name} content template created`,
    });
    return newContentTemplate;
}

//* Get contentTemplate by id */
export async function getContentTemplateById(contentTemplateId: string) {
    errorIfUndefined({ contentTemplateId });
    const [contentTemplate] = await indexBy(ContentTemplateId)
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
    const [contentTemplate] = await indexBy(ContentTemplateId)
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
    title,
    userId,
}: {
    contentTemplateId: string;
    name?: string;
    status?: "archived" | "published";
    icon?: Icon;
    title?: ContentTemplateTitle;
    userId: string;
}) {
    errorIfUndefined({ contentTemplateId, userId });
    const [contentTemplate] = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);
    if (!contentTemplate) throw new Error("No content template found");
    let updateNotes: string[] = ["Template details updated"];

    // only one field updated on a single request

    const historyEntry = new HistoryEntry({
        title: "",
        editedBy: userId,
    });

    if (status) {
        historyEntry.title = `${contentTemplate.name} ${status}`;
        historyEntry.subtitle = `${contentTemplate.status} to ${status}`;
        contentTemplate.status = status;
    }

    if (name) {
        historyEntry.title = `Name Updated`;
        historyEntry.subtitle = `${contentTemplate.name} to ${name}`;
        contentTemplate.name = name;
    }

    if (icon) {
        historyEntry.title = `Icon Changed`;
        historyEntry.changes = [
            {
                path: ["Icon"],
                from: contentTemplate.icon,
                to: icon,
                type: "icon",
            },
        ];
        contentTemplate.icon = icon;
    }

    if (title) {
        historyEntry.title = `Title Property Updated`;
        const getName = (title: ContentTemplate["title"]) => {
            if (title.type === "contentInfo") return splitCamel(title.value);
            return contentTemplate.properties.find(({ id }) => id === title.value)?.name;
        };
        historyEntry.subtitle = `${getName(contentTemplate.title)} to ${getName(title)}`;
        contentTemplate.title = title;
    }

    await contentTemplate.saveWithHistory({
        ...historyEntry,
    });

    return contentTemplate;
}

export const createProperty = <T extends FieldTypes>({
    type,
    name,
    userId,
    propertyDetails,
}: {
    type: T;
    name: string;
    userId?: string;
    propertyDetails: Partial<Omit<Property<T>, "name" | "type">>;
}): Property<T> => {
    const date = new Date().toISOString();
    const property = {
        object: "Property",
        type,
        name,
        id: ulid(),
        createdTime: date,
        createdBy: userId ?? "system",
        lastEditedTime: date,
        lastEditedBy: userId ?? "system",
        archived: false,
        ...propertyDetails,
    };
    return property as Property<T>;
};

export interface UpdatePropertiesProps {
    createdProperties?: Record<string, PartialProperty>;
    updatedProperties?: Record<string, PartialProperty>;
    deletedProperties?: Record<string, PartialProperty>;
    contentTemplateId: string;
    createdGroups?: Record<string, PropertyGroup>;
    updatedGroups?: Record<string, PropertyGroup>;
    deletedGroups?: Record<string, PropertyGroup>;
}

export async function updateProperties({
    contentTemplateId,
    createdGroups = {},
    createdProperties = {},
    deletedGroups = {},
    deletedProperties = {},
    updatedGroups = {},
    updatedProperties = {},
    userId,
}: UpdatePropertiesProps & {
    userId: string;
}) {
    errorIfUndefined({ userId, contentTemplateId });

    const [contentTemplate] = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);

    if (!contentTemplate) throw new Error("No content template found");

    const newProperties: Property[] = Object.values(createdProperties).map(
        ({ name, type, ...rest }) => {
            return createProperty({ name, propertyDetails: rest, type, userId });
        }
    );

    const properties = contentTemplate.properties.reduce<Property[]>(
        (acc, property) => {
            //remove deleted properties
            if (deletedProperties[property.id]) return acc;
            // update properties
            if (updatedProperties[property.id]) {
                acc.push({
                    ...(updatedProperties[property.id] as Property),
                    lastEditedBy: userId,
                    lastEditedTime: new Date().toISOString(),
                });
                return acc;
            }
            // return unchanged properties
            acc.push(property);
            return acc;
        },
        [...newProperties]
    );

    const propertyGroups = contentTemplate.propertyGroups.reduce<PropertyGroup[]>(
        (acc, group) => {
            if (deletedGroups[group.id]) return acc;
            if (updatedGroups[group.id]) {
                acc.push(updatedGroups[group.id]);
                return acc;
            }
            acc.push(group);
            return acc;
        },
        [...Object.values(createdGroups)]
    );

    contentTemplate.properties = properties;
    contentTemplate.propertyGroups = propertyGroups;
    await contentTemplate.save();
    return contentTemplate;
}
