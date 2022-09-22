/* Block.model.ts */

import { BaseModel } from "@lib/models";
import { buildIndex, indexBy, SecondaryExact, timekey } from "serverless-cloud-data-utils";
import { Icon } from "../../../components/ui/iconPicker/types";

export interface BlockTitle {
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

//* Block model and indexes //

// To get all Block by it's ID *//
//namespace Block:${BlockId} */
export const BlockId = buildIndex({ namespace: `Block`, label: "label1" });

// To get all content templates for an organisation *//
//namespace organisation_${organisationId}:Blocks:${lastEditedTime} */
export const BlockOrganisation = (organisationId: string) =>
    buildIndex({
        namespace: `organisation_${organisationId}:Blocks`,
        label: "label2",
        converter: timekey,
    });

class BaseBlock<T extends string> extends BaseModel<BaseBlock<T>> {
    object = "block";
    type?: T;
    archived = false;
    required?: boolean;
    modelKeys() {
        return [indexBy(BlockId).exact(this.id)];
    }
}

export class TemplateBlock extends BaseBlock<"template"> {
    children: BaseBlock<any>[];
}

export class ParagraphBlock extends BaseBlock<"paragraph"> {
    defaultValue?: string;
    value?: string;
}

export class HeadingBlock extends BaseBlock<"heading"> {
    defaultValue?: string;
    value?: string;
    order: "1" | "2" | "3" | "4" | "5";
}

export type Blocks = TemplateBlock | ParagraphBlock | HeadingBlock;

export type BlockTypes = Blocks["type"];

export type BlockDiscriminator<T extends BlockTypes> = Extract<Blocks, { type: T }>;
