/* Field.model.ts */

import { BaseModel } from '../../models'
import { buildIndex, indexBy } from 'serverless-cloud-data-utils'
import { DistributiveClean, StripModel } from 'type-helpers'
import { Option } from '../../../lib/responseSet/data/responseSet.model'
import { TitleElementProps } from '@components/ui/title/title-builder/titleBuilder-element'

export interface FieldTitle {
    setType: 'manual' | 'auto'
    type: 'contentInfo' | 'contentProperty'
    value: string
}

export interface PropertyGroup {
    type: 'propertyGroup'
    id: string | number
    children: (string | number)[]
    name: string
    repeatable: boolean
    parent?: string
    disabled?: boolean
}

//* Field model and indexes //

// To get Field by it's ID *//
//namespace field:${fieldId} */
export const FieldId = buildIndex({ namespace: `field`, label: 'label1' })

// To get all Field by parent *//
//namespace fieldCollection_${parentId}:fields:${fieldId} */
export const FieldCollection = (parentId?: string) =>
    buildIndex({ namespace: `content_${parentId}:fields`, label: 'label2' })

// To get all Fields by template property *//
//namespace fieldTemplate_${parentId}:fields:${fieldId} */
export const FieldTemplate = (propertyId?: string) =>
    buildIndex({
        namespace: `fieldTemplate_${propertyId}:fields`,
        label: 'label3',
    })

export class Field<T extends FieldType = FieldType> extends BaseModel<
    Field<T>
> {
    readonly object: 'Field' | 'Property' = 'Field'
    readonly type: T extends FieldType ? T : FieldType
    templateId?: string
    templatePropertyId?: string
    required?: boolean
    active?: boolean
    description?: string
    note?: string
    disableNote?: boolean
    assets?: string[]
    disableAssets?: boolean
    value?: Value<T>
    defaultValue?: Value<T>
    variant?: Variant<T>

    /** number field options */
    maximumValue?: T extends 'number'
        ? number
        : T extends FieldType
        ? never
        : any
    minimumValue?: T extends 'number'
        ? number
        : T extends FieldType
        ? never
        : any

    /** select field options */
    data?: T extends 'select' | 'multiSelect'
        ? Option[]
        : T extends FieldType
        ? never
        : any

    /** relation field options */
    relatedTo?: T extends 'relation'
        ? string
        : T extends FieldType
        ? never
        : any
    isReciprocal?: T extends 'relation'
        ? boolean
        : T extends FieldType
        ? never
        : any
    reciprocalPropertyId?: T extends 'relation'
        ? string
        : T extends FieldType
        ? never
        : any
    reciprocalPropertyName?: T extends 'relation'
        ? string
        : T extends FieldType
        ? never
        : any

    /* title field options */
    stringTemplate?: T extends 'title'
        ? TitleElementProps[]
        : T extends FieldType
        ? never
        : any
    useTemplate?: T extends 'title'
        ? boolean
        : T extends FieldType
        ? never
        : any

    modelKeys() {
        return [
            indexBy(FieldId).exact(this.id),
            ...(this.parent
                ? [indexBy(FieldCollection(this.parent)).exact(this.id)]
                : []),
            ...(this.templatePropertyId
                ? [
                      indexBy(FieldTemplate(this.templatePropertyId)).exact(
                          this.id
                      ),
                  ]
                : []),
        ]
    }
}

/*type Options<T extends FieldType> = T extends "number"
    ? {
          maximumValue?: "number";
          minimumValue?: "number";
      }
    : T extends "select" | "multiSelect"
    ? {
          data: string[];
      }
    : T extends "relation"
    ? {
          relatedTo: string;
          isReciprocal?: T extends "relation" ? boolean : T extends FieldType ? never : any;
          reciprocalPropertyId?: T extends "relation" ? string : T extends FieldType ? never : any;
          reciprocalPropertyName?: T extends "relation"
              ? string
              : T extends FieldType
              ? never
              : any;
      }
    : null;
*/

export type FieldType =
    | 'checkbox'
    | 'date'
    | 'email'
    | 'image'
    | 'multiSelect'
    | 'number'
    | 'richText'
    | 'select'
    | 'text'
    | 'relation'
    | 'deadline'
    | 'status'
    | 'people'
    | 'component'
    | 'title'
    | 'assignee'

type BooleanValue = 'checkbox'
type StringValue = 'date' | 'email' | 'richText' | 'text' | 'deadline' | 'title'
type StringArrayValue = 'image' | 'relation'
type OptionValue = 'multiSelect' | 'select'
type NumberValue = 'number'

type Value<T extends FieldType | undefined> = T extends BooleanValue
    ? boolean
    : T extends NumberValue
    ? number
    : T extends StringArrayValue
    ? string[]
    : T extends StringValue
    ? string
    : T extends OptionValue
    ? Option[]
    : any

type Variant<T extends FieldType | undefined> = T extends 'date'
    ? 'dateTime' | 'date' | 'time'
    : T extends 'image'
    ? 'single' | 'multiple'
    : T extends 'number'
    ? 'integer' | 'decimal' | 'float'
    : T extends 'text'
    ? 'shortText' | 'longText'
    : T extends FieldType
    ? never
    : any

type FieldOmitted = 'value' | 'note' | 'assets' | 'templatePropertyId'

//export type Property<T extends FieldType | undefined = undefined> = T extends FieldType
//   ? StripModel<FieldDiscriminator<T>, FieldOmitted>
//   : DistributiveClean<Field, FieldOmitted>;

export type Property<T extends FieldType = FieldType> = StripModel<
    Field<T>,
    FieldOmitted
>
