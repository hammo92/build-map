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
}: {
    type: T;
    props: CleanedCamel<FieldDiscriminator<T>>;
}) {
    let field;
    switch (type) {
        case "checkbox":
            field = new CheckboxField({ props });
            break;
        case "date":
            field = new DateField({ props });
            break;
        case "email":
            field = new EmailField({ props });
            break;
        case "image":
            field = new ImageField({ props });
            break;
        case "multiSelect":
            field = new MultiSelectField({ props });
            break;
        case "number":
            field = new NumberField({ props });
            break;
        case "richText":
            field = new RichTextField({ props });
            break;
        case "select":
            field = new SelectField({ props });
            break;
        case "text":
            field = new TextField({ props });
            break;
        case "relation":
            field = new RelationField({ props });
            break;
    }
    if (!field) throw new Error("Field couldn't be created");
    await field.save();

    //Todo: find proper method
    return field as unknown as CleanedCamel<FieldDiscriminator<T>>;
}
