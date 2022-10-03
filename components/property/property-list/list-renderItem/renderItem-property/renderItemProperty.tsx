import { RenderItemParams } from "@atlaskit/tree";
import { PropertyItem } from "@components/property/property-item";
import { faGripVertical } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mantine/core";

export const RenderItemProperty = ({ item, provided }: RenderItemParams) => {
    return (
        <Box pb="xs">
            <PropertyItem
                property={item.data}
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
        </Box>
    );
};
