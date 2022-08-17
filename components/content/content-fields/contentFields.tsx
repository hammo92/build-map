import { ContentField } from "@lib/content/data/types";
import { Property } from "@lib/contentTemplate/data/types";
import { Group } from "@mantine/core";
import { AdditionalFieldActions } from "../content-additionalField/additionalField-actions";
import { FieldsDate } from "./fields-date";
import { FieldsEmail } from "./fields-email";
import { FieldsImage } from "./fields-image";
import { FieldsMultiSelect } from "./fields-multiSelect";
import { FieldsNumber } from "./fields-number";
import { FieldsRelation } from "./fields-relation";
import { FieldsRichText } from "./fields-richText";
import { FieldsSelect } from "./fields-select";
import { FieldsText } from "./fields-text";

const getFieldElement = (field: ContentField | Property) => {
    switch (field.type) {
        case "email":
            return <FieldsEmail field={field} key={field.id} />;
        case "date":
            return <FieldsDate field={field} key={field.id} />;
        case "multiSelect":
            return <FieldsMultiSelect field={field} key={field.id} />;
        case "number":
            return <FieldsNumber field={field} key={field.id} />;
        case "richText":
            return <FieldsRichText field={field} key={field.id} />;
        case "select":
            return <FieldsSelect field={field} key={field.id} />;
        case "text":
            return <FieldsText field={field} key={field.id} />;
        case "image":
            return <FieldsImage field={field} key={field.id} />;
        case "relation":
            return <FieldsRelation field={field} key={field.id} />;
    }
};

export const ContentFields = ({
    fields,
    removable,
    editable,
    contentId,
}: {
    fields: ContentField[];
    removable?: boolean;
    editable?: boolean;
    contentId: string;
}) => {
    const fieldList = fields
        .map((field) => {
            const element = getFieldElement(field);
            if (removable || editable) {
                return (
                    <Group spacing="sm">
                        <div style={{ flex: 1 }}>{element}</div>
                        <AdditionalFieldActions
                            field={field}
                            contentId={contentId}
                            editable={editable}
                            removable={removable}
                        />
                    </Group>
                );
            } else {
                return element;
            }
        })
        .filter((field) => field !== undefined);
    return <>{fieldList}</>;
};

/*Draggable Content Fields
import { SmartFormImages } from "@components/smartForm/smartForm-images";
import { ContentField } from "@lib/content/data/types";
import { Property } from "@lib/contentTemplate/data/types";
import { useListState } from "@mantine/hooks";
import { FieldsDate } from "./fields-date";
import { FieldsEmail } from "./fields-email";
import { FieldsImage } from "./fields-image";
import { FieldsMultiSelect } from "./fields-multiSelect";
import { FieldsNumber } from "./fields-number";
import { FieldsRichText } from "./fields-richText";
import { FieldsSelect } from "./fields-select";
import { FieldsText } from "./fields-text";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Box } from "@mantine/core";

const FieldSwitch = ({ field }: { field: ContentField | Property }) => {
    switch (field.type) {
        case "email":
            return <FieldsEmail field={field} key={field.id} />;
        case "date":
            return <FieldsDate field={field} key={field.id} />;
        case "multiSelect":
            return <FieldsMultiSelect field={field} key={field.id} />;
        case "number":
            return <FieldsNumber field={field} key={field.id} />;
        case "richText":
            return <FieldsRichText field={field} key={field.id} />;
        case "select":
            return <FieldsSelect field={field} key={field.id} />;
        case "text":
            return <FieldsText field={field} key={field.id} />;
        case "image":
            return <FieldsImage field={field} key={field.id} />;
        default:
            return null;
    }
};

export const ContentFields = ({ fields }: { fields: ContentField[] | Property[] }) => {
    const [state, { setState, reorder }] = useListState(fields);
    const fieldList = state.map((field, index) => (
        <Draggable key={field.name} index={index} draggableId={field.name}>
            {(provided, snapshot) => (
                <Box
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    mb="sm"
                >
                    <FieldSwitch field={field} />
                </Box>
            )}
        </Draggable>
    ));
    console.log("fieldList :>> ", fieldList);
    return (
        <DragDropContext
            onDragEnd={async ({ destination, source }) => {
                const fromIndex = source.index;
                const toIndex = destination?.index ?? source.index;
                reorder({
                    from: fromIndex,
                    to: toIndex,
                });
            }}
        >
            <Droppable droppableId="dnd-list" direction="vertical">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {fieldList}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};
*/
