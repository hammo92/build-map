import { DevTool } from "@hookform/devtools";
import { FormProvider, SubmitHandler, useForm, UseFormProps } from "react-hook-form";
import { SmartFormCheckbox } from "./smartForm-checkbox";
import { SmartFormChips } from "./smartForm-chips";
import { SmartFormColorInput } from "./smartForm-colorInput";
import { SmartFormColorPicker } from "./smartForm-colorPicker";
import { SmartFormProvider } from "./smartForm-context";
import { SmartFormDatePicker } from "./smartForm-datePicker";
import { SmartFormDateTime } from "./smartForm-dateTime";
import { SmartFormFieldGroup } from "./smartForm-fieldGroup";
import { SmartFormIconPicker } from "./smartForm-iconPicker";
import { SmartFormImages } from "./smartForm-images";
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

interface SmartFormProps<FormValues> extends UseFormProps {
    formName: string;
    onSubmit: SubmitHandler<FormValues>;
    disableSubmit?: boolean;
    isSubmitting?: boolean;
    defaultValues?: any;
    children: JSX.Element[] | JSX.Element;
    submitMethod?: "manual" | "onChange";
}

export const SmartForm = <FormValues,>({
    formName,
    defaultValues,
    children,
    onSubmit,
    disableSubmit,
    isSubmitting,
    submitMethod,
}: SmartFormProps<FormValues>) => {
    const methods = useForm({
        defaultValues,
    });
    const { control, handleSubmit, reset } = methods;

    return (
        <FormProvider {...methods}>
            <SmartFormProvider onSubmit={onSubmit} submitMethod={submitMethod}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" name="form-name" value={formName} />
                    {children}
                </form>
                <DevTool control={control} />
            </SmartFormProvider>
        </FormProvider>
    );
};

SmartForm.Checkbox = SmartFormCheckbox;
SmartForm.Chips = SmartFormChips;
SmartForm.ColorInput = SmartFormColorInput;
SmartForm.ColorPicker = SmartFormColorPicker;
SmartForm.DatePicker = SmartFormDatePicker;
SmartForm.DateTime = SmartFormDateTime;
SmartForm.Images = SmartFormImages;
SmartForm.JsonInput = SmartFormJsonInput;
SmartForm.MultiSelect = SmartFormMultiSelect;
SmartForm.NumberInput = SmartFormNumberInput;
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
