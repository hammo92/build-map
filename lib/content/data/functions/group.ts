import { ulid } from "ulid";
import { objArrayToHashmap } from "../../../../utils/arrayModify";
import { Content, FieldGroup } from "../content.model";
import { ContentField } from "../types";
import { duplicateField, fieldFromTemplateProperty } from "./field";
import pluralize from "pluralize";
import { groupFields } from "@components/content/content-fields/fields-group";
import { Field, PropertyGroup } from "@lib/field/data/field.model";

// restructure repeatable group to nest inside a parent
export function processGroup(group: PropertyGroup): FieldGroup[] {
    if (group.repeatable) {
        const fieldGroup = {
            ...group,
            repeatable: false,
            name: `${group.name}`,
            id: ulid(),
        } as FieldGroup;
        const parentGroup = {
            ...group,
            children: [fieldGroup.id],
            name: pluralize(group.name),
        } as FieldGroup;
        return [parentGroup, fieldGroup];
    }
    return [group as FieldGroup];
}

export const generateFieldGroups = ({
    fields,
    propertyGroups,
}: {
    fields: Field[];
    propertyGroups: PropertyGroup[];
}): FieldGroup[] => {
    const fieldMap = objArrayToHashmap(fields, "templatePropertyId");
    const fieldGroups = propertyGroups.map((propertyGroup) => {
        // replace templateFieldId with field id
        const children = propertyGroup.children.map((id) => {
            // if field exists return id of created field
            if (fieldMap[id]) {
                return fieldMap[id].id;
            }
            // id is for group so return id
            return id;
        });
        propertyGroup.children = children;

        return processGroup(propertyGroup);
    });
    return fieldGroups.flat();
};

export function duplicateGroup({
    content,
    groupId,
    userId,
    keepValues,
}: {
    content: Content;
    groupId: string;
    userId: string;
    keepValues?: boolean;
}) {
    const groupMap = objArrayToHashmap(content.fieldGroups, "id");
    const fieldMap = objArrayToHashmap(content.fields, "id");

    // repeatable groups have an added parent
    const parentGroup = groupMap[`${groupId}`];
    if (!parentGroup) throw new Error("no group found");
    if (!parentGroup.repeatable) throw new Error("Group not repeatable");

    const nestedFields: ContentField[] = [];
    const nestedGroups: FieldGroup[] = [];
    // get first child, used as structure for new group
    const firstGroupInstance = groupMap[parentGroup.children[0]];

    const clone = (group: FieldGroup) => {
        const copy: FieldGroup = { ...group, id: ulid(), children: [] };
        const processChild = (id: string | number) => {
            if (fieldMap[id]) {
                const duplicate = duplicateField({
                    field: fieldMap[id],
                    userId,
                    keepValue: keepValues,
                });
                nestedFields.push(duplicate);
                copy.children.push(duplicate.id);
            }
            if (groupMap[id]) {
                const groupCopy = clone(groupMap[id]);
                nestedGroups.push(groupCopy);
                copy.children.push(groupCopy.id);
            }
        };
        // if repeatable copy only the first child instance
        if (group.repeatable) processChild(group.children[0]);
        else {
            group.children.forEach(processChild);
        }

        return copy;
    };

    const newGroup = clone(firstGroupInstance);
    return { newGroup, nestedFields, nestedGroups };
}
