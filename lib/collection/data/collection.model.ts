/* Collection.model.ts */

import { buildIndex, indexBy, timekey } from "serverless-cloud-data-utils";
import { Icon } from "../../../components/ui/iconPicker/types";
import { ModelWithHistory } from "../../models";
import { Property } from "./types";

export interface CollectionTitle {
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

//* Collection model and indexes //

// To get all Collection by it's ID *//
//namespace Collection:${CollectionId} */
export const CollectionId = buildIndex({ namespace: `Collection`, label: "label1" });

// To get all content templates for an organisation *//
//namespace organisation_${organisationId}:Collections:${lastEditedTime} */
export const CollectionOrganisation = (organisationId: string) =>
    buildIndex({
        namespace: `organisation_${organisationId}:Collections`,
        label: "label2",
        converter: timekey,
    });

//model: Collection */
export class Collection extends ModelWithHistory<Collection> {
    object = "Collection";
    icon: Icon;
    organisationId: string;
    status: "draft" | "archived" | "published";
    properties: Property[];
    title: CollectionTitle;

    modelKeys() {
        return [
            indexBy(CollectionId).exact(this.id),
            indexBy(CollectionOrganisation(this.organisationId)).exact(this.lastEditedTime),
        ];
    }
}
