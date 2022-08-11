//* propertyItem model and indexes //

import { buildIndex, indexBy, Model, timekey } from "serverless-cloud-data-utils";

// To get a propertyItemTemplate by it's ID *//
//namespace propertyItem:${propertyItemId} */
export const PropertyItemId = buildIndex({ namespace: `propertyItem` });

// To get all propertyItem of propertyItemTemplate for a project *//
//namespace project_${projectId}:propertyItemTemplate_${propertyItemTemplateId}:${date} */
export const PropertyItemByTypeForProject = ({
    projectId,
    propertyItemTemplateId,
}: {
    projectId: string;
    propertyItemTemplateId: string;
}) =>
    buildIndex({
        namespace: `project_${projectId}:propertyItemTemplate_${propertyItemTemplateId}`,
        label: "label1",
        converter: timekey,
    });

//model: PropertyItem */
export class PropertyItem extends Model<PropertyItem> {
    id: string;
    propertyId: string;
    parentId: string;
    templateId: string;
    createdTime: string;
    createdBy: string;
    lastEditedTime: string;
    lastEditedBy: string;
    status: "draft" | "published";
    value: any;
    keys() {
        return [
            indexBy(PropertyItemId).exact(this.id),
            indexBy(
                PropertyItemByTypeForProject({
                    projectId: this.projectId,
                    propertyItemTemplateId: this.propertyItemTemplateId,
                })
            ).exact(this.date),
        ];
    }
}
