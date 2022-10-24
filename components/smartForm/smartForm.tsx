import { DevTool } from "@hookform/devtools";
import { FieldValues, FormProvider, SubmitHandler, useForm, UseFormProps } from "react-hook-form";
import { SmartFormBooleanSegmentedControl } from "./smartForm-booleanSegmentedControl";
import { SmartFormCheckbox } from "./smartForm-checkbox";
import { SmartFormChips } from "./smartForm-chips";
import { SmartFormColorInput } from "./smartForm-colorInput";
import { SmartFormColorPicker } from "./smartForm-colorPicker";
import { SmartFormProvider } from "./smartForm-context";
import { SmartFormDatePicker } from "./smartForm-datePicker";
import { SmartFormDateTime } from "./smartForm-dateTime";
import { SmartFormEditableList } from "./smartForm-editableList";
import { SmartFormFieldGroup } from "./smartForm-fieldGroup";
import { SmartFormIconPicker } from "./smartForm-iconPicker";
import { SmartFormAssets } from "./smartForm-assets";
import { SmartFormJsonInput } from "./smartForm-jsonInput";
import { SmartFormMultiSelect } from "./smartForm-multiSelect";
import { SmartFormNumberInput } from "./smartForm-numberInput";
import { SmartFormPasswordInput } from "./smartForm-passwordInput";
import { SmartFormRadioGroup } from "./smartForm-radioGroup";
import { SmartFormRichText } from "./smartForm-richText";
import { SmartFormSegmentedControl } from "./smartForm-segmentedControl";
import { SmartFormSelect } from "./smartForm-select";
import { SmartFormSlider } from "./smartForm-slider";
import { SmartFormTextarea } from "./smartForm-textarea";
import { SmartFormTextInput } from "./smartForm-textInput";
import { SmartFormTimeInput } from "./smartForm-timeInput";
import { SmartFormOptionList } from "./smartForm-optionList";

interface SmartFormProps<FormValues extends FieldValues> extends UseFormProps {
    formName: string;
    onSubmit: SubmitHandler<FormValues>;
    disableSubmit?: boolean;
    isSubmitting?: boolean;
    defaultValues?: any;
    children: JSX.Element[] | JSX.Element;
    submitMethod?: "manual" | "onChange";
    submitType?: "all" | "dirty";
    readOnly?: boolean;
}

function dirtyValues<FormValues>(
    dirtyFields: Record<keyof FormValues, FormValues[keyof FormValues]> | boolean,
    values: FormValues
): FormValues | void {
    if (dirtyFields === true) {
        return values;
    }
    if (dirtyFields === false) return;
    const dirtyKeys = Object.keys(dirtyFields) as (keyof FormValues)[];
    return Object.fromEntries(
        dirtyKeys.map((key) => [
            key,
            dirtyValues(dirtyFields[key], values[key as keyof FormValues]),
        ])
    ) as unknown as FormValues;
}

export const SmartForm = <FormValues extends FieldValues>({
    formName,
    defaultValues,
    children,
    onSubmit,
    disableSubmit,
    isSubmitting,
    submitMethod = "manual",
    submitType = "all",
    readOnly,
}: SmartFormProps<FormValues>) => {
    const methods = useForm({
        defaultValues,
    });
    const { control, handleSubmit, reset, formState } = methods;
    const submit = (values: any) => {
        if (submitType === "dirty") {
            onSubmit(dirtyValues(formState.dirtyFields, values));
        } else {
            onSubmit(values);
        }
        reset(values);
    };
    return (
        <FormProvider {...methods}>
            <SmartFormProvider onSubmit={submit} submitMethod={submitMethod} readOnly={readOnly}>
                <form onSubmit={handleSubmit(submit)}>
                    <input type="hidden" name="form-name" value={formName} />
                    {children}
                </form>
                <DevTool control={control} />
            </SmartFormProvider>
        </FormProvider>
    );
};

SmartForm.BooleanSegmentedControl = SmartFormBooleanSegmentedControl;
SmartForm.Checkbox = SmartFormCheckbox;
SmartForm.Chips = SmartFormChips;
SmartForm.ColorInput = SmartFormColorInput;
SmartForm.ColorPicker = SmartFormColorPicker;
SmartForm.DatePicker = SmartFormDatePicker;
SmartForm.DateTime = SmartFormDateTime;
SmartForm.EditableList = SmartFormEditableList;
SmartForm.Assets = SmartFormAssets;
SmartForm.JsonInput = SmartFormJsonInput;
SmartForm.MultiSelect = SmartFormMultiSelect;
SmartForm.NumberInput = SmartFormNumberInput;
SmartForm.OptionList = SmartFormOptionList;
SmartForm.PasswordInput = SmartFormPasswordInput;
SmartForm.RadioGroup = SmartFormRadioGroup;
SmartForm.RichText = SmartFormRichText;
SmartForm.SegmentedControl = SmartFormSegmentedControl;
SmartForm.Select = SmartFormSelect;
SmartForm.Slider = SmartFormSlider;
SmartForm.Textarea = SmartFormTextarea;
SmartForm.TextInput = SmartFormTextInput;
SmartForm.TimeInput = SmartFormTimeInput;
SmartForm.IconPicker = SmartFormIconPicker;
SmartForm.FieldGroup = SmartFormFieldGroup;
