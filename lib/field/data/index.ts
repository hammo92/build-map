import { CleanedCamel } from "type-helpers";
import {
    CheckboxField,
    DateField,
    EmailField,
    FieldDiscriminator,
    FieldTypes,
    ImageField,
    MultiSelectField,
    NumberField,
    RelationField,
    RichTextField,
    SelectField,
    TextField,
} from "./field.model";

export async function createField<T extends FieldTypes>({
    type,
    props,
    userId,
    shouldSave,
}: {
    type: T;
    props: CleanedCamel<FieldDiscriminator<T>>;
    userId: string;
    shouldSave?: boolean;
}) {
    let field;
    switch (type) {
        case "checkbox":
            field = new CheckboxField({ ...props, userId });
            break;
        case "date":
            field = new DateField({ ...props, userId });
            break;
        case "email":
            field = new EmailField({ ...props, userId });
            break;
        case "image":
            field = new ImageField({ ...props, userId });
            break;
        case "multiSelect":
            field = new MultiSelectField({ ...props, userId });
            break;
        case "number":
            field = new NumberField({ ...props, userId });
            break;
        case "richText":
            field = new RichTextField({ ...props, userId });
            break;
        case "select":
            field = new SelectField({ ...props, userId });
            break;
        case "text":
            field = new TextField({ ...props, userId });
            break;
        case "relation":
            field = new RelationField({ ...props, userId });
            break;
    }
    if (!field) throw new Error("Field couldn't be created");
    if (!shouldSave) return field as FieldDiscriminator<T>;
    await field.save();
    //Todo: find proper method
    return field as FieldDiscriminator<T>;
}
