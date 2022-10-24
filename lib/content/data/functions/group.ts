import { duplicateField } from "../../../../lib/field/data";
import { Field, PropertyGroup } from "../../../../lib/field/data/field.model";
import pluralize from "pluralize";
import { objectify } from "radash";
import { ulid } from "ulid";
import { objArrayToHashmap } from "../../../../utils/arrayModify";
import { Content, FieldGroup } from "../content.model";
import { ContentField } from "../types";

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

export async function duplicateGroup({
    content,
    fields,
    groupId,
    userId,
    keepValues,
}: {
    content: Content;
    fields: Field[];
    groupId: string;
    userId: string;
    keepValues?: boolean;
}) {
    const groupMap = objectify(content.fieldGroups, (c) => c.id);
    const fieldMap = objectify(fields, (f) => f.id);

    // repeatable groups have an added parent, find this parent group
    const parentGroup = groupMap[`${groupId}`];
    if (!parentGroup) throw new Error("no group found");
    if (!parentGroup.repeatable) throw new Error("Group not repeatable");

    const nestedFields: string[] = [];
    const nestedGroups: FieldGroup[] = [];

    // get first child, used as structure for new group
    const groupTemplate = groupMap[parentGroup.children[0]];

    const clone = async (group: FieldGroup) => {
        const copy: FieldGroup = { ...group, id: ulid(), children: [] };
        const processChild = async (id: string | number) => {
            if (fieldMap[id]) {
                const duplicate = await duplicateField({
                    fieldId: `${id}`,
                    userId,
                    keepValue: keepValues,
                    shouldSave: true,
                });
                nestedFields.push(duplicate.id);
                copy.children.push(duplicate.id);
            }
            if (groupMap[id]) {
                const groupCopy = await clone(groupMap[id]);
                nestedGroups.push(groupCopy);
                copy.children.push(groupCopy.id);
            }
        };
        // if repeatable copy only the first child instance
        if (group.repeatable) await processChild(group.children[0]);
        else {
            await Promise.all(group.children.map(processChild));
        }

        return copy;
    };

    const newGroup = await clone(groupTemplate);
    return { newGroup, nestedFields, nestedGroups };
}
