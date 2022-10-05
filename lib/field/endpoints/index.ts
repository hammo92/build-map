import { Content } from "../../../lib/content/data/content.model";
import { api, data, events, params } from "@serverless/cloud";
import { CleanedCamel } from "type-helpers";
import { Field } from "../data/field.model";
import { deleteRelation, updateRelation } from "../../../lib/content/data/functions/relation";
import { deleteFieldCollection } from "../data";
import { arrayDifference, arrayShallowCompare } from "utils/array";
import camelcaseKeys from "camelcase-keys";

export const field = () => {
    /** Remove all fields when content is deleted */
    data.on("deleted:object_Content:*", async (event) => {
        await deleteFieldCollection(event.item.value.id);
    });

    /** Remove all fields when content is deleted */
    data.on("deleted:object_Field:*", async (event) => {
        //await deleteFieldCollection(event.item.value.id);
    });

    /** Handle updated for fields with relations */
    data.on("updated:object_Field:*", async (event) => {
        const { item, previous } = event;
        if (item.value.type === "relation") {
            await updateRelation({
                field: camelcaseKeys(item.value, { deep: true }),
                prevField: camelcaseKeys(previous.value, { deep: true }),
            });
        }
    });

    /** Handle updated for fields with relations */
    data.on("deleted:object_Field:*", async (event) => {
        const { item } = event;
        if (item.value.type === "relation") {
            await deleteRelation({
                field: camelcaseKeys(item.value, { deep: true }),
            });
        }
    });
};
