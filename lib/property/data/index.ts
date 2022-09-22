import { Icon } from "@fortawesome/fontawesome-svg-core";
import { errorIfUndefined } from "@lib/utils";
import { CleanedCamel } from "type-helpers";
import {
    BlockDiscriminator,
    Blocks,
    BlockTypes,
    HeadingBlock,
    ParagraphBlock,
    TemplateBlock,
} from "./property.model";

export async function createBlock<T extends BlockTypes>({
    type,
    props,
}: {
    type: T;
    props: CleanedCamel<BlockDiscriminator<T>>;
}) {
    let block;
    switch (type) {
        case "heading":
            block = new HeadingBlock({ props });
            break;
        case "paragraph":
            block = new ParagraphBlock({ props });
            break;
        case "template":
            block = new TemplateBlock({ props });
            break;
    }
    if (!block) throw new Error("Block couldn't be created");
    //Todo: find proper method
    await block.save();
    return block as unknown as CleanedCamel<BlockDiscriminator<T>>;
}
