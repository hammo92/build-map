import { TreeData } from "@atlaskit/tree";
import { SetStateAction } from "react";
import { ulid } from "ulid";

export const onAdd = ({
    tree,
    setTree,
    type,
}: {
    tree: TreeData;
    setTree: (value: SetStateAction<TreeData>) => void;
    type: "property" | "group";
}) => {
    const clone = structuredClone(tree);
    const id = ulid();
    const placeholderId = ulid();
    const placeholder = {
        id: placeholderId,
        children: [],
        hasChildren: false,
        isChildrenLoading: false,
        data: {
            title: "placeholder",
            isPlaceholder: true,
        },
    };
    const newItem = {
        id,
        children: type === "property" ? [] : [placeholderId],
        hasChildren: type === "property" ? false : true,
        isExpanded: type === "property" ? false : true,
        isChildrenLoading: false,
        data: {
            title: id,
        },
    };

    clone.items[id] = newItem;

    if (type === "group") {
        clone.items[placeholderId] = placeholder;
    }

    clone.items["1"].children.push(id);

    setTree(clone);
};
