import { RenderItemParams } from "@atlaskit/tree";
import { FieldCard } from "@components/contentTemplate/contentTemplate-field/field-card";
import { faGripVertical } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const RenderItemField = ({ item, provided }: RenderItemParams) => {
    return (
        <FieldCard
            field={item.data}
            key={`field-${item.id}`}
            grow
            leftContent={
                <div
                    {...provided.dragHandleProps}
                    style={{ pointerEvents: item.id === "placeholder" && "none" }}
                >
                    <FontAwesomeIcon icon={faGripVertical} />
                </div>
            }
        />
    );
};
