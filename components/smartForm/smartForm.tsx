import { DevTool } from "@hookform/devtools";
import { Group } from "@mantine/core";
import { DeepPartial, FormProvider, SubmitHandler, UnpackNestedValue, useForm, UseFormProps } from "react-hook-form";
import { SmartFormCheckbox } from "./smartForm-checkbox";
import { SmartFormChips } from "./smartForm-chips";
import { SmartFormColorInput } from "./smartForm-colorInput";
import { SmartFormColorPicker } from "./smartForm-colorPicker";
import { SmartFormFieldGroup } from "./smartForm-fieldGroup";
import { SmartFormIconPicker } from "./smartForm-iconPicker";
import { SmartFormJsonInput } from "./smartForm-jsonInput";
import { SmartFormMultiSelect } from "./smartForm-multiSelect";
import { SmartFormNumberInput } from "./smartForm-numberInput";
import { SmartFormPasswordInput } from "./smartForm-passwordInput/smartFormPasswordInput";
import { SmartFormRadioGroup } from "./smartForm-radioGroup";
import { SmartFormSegmentedControl } from "./smartForm-segmentedControl/smartFormSegmentedControl";
import { SmartFormSelect } from "./smartForm-select";
import { SmartFormSlider } from "./smartForm-slider";
import { SmartFormTextarea } from "./smartForm-textarea";
import { SmartFormTextInput } from "./smartForm-textInput/smartFormTextInput";

interface SmartFormProps<FormValues> extends UseFormProps {
    formName: string;
    onSubmit: SubmitHandler<FormValues>;
    disableSubmit?: boolean;
    isSubmitting?: boolean;
    defaultValues?: any;
    children: JSX.Element[] | JSX.Element;
}

export const SmartForm = <FormValues,>({
    formName,
    defaultValues,
    children,
    onSubmit,
    disableSubmit,
    isSubmitting,
}: SmartFormProps<FormValues>) => {
    const methods = useForm({
        defaultValues,
    });
    const { control, handleSubmit } = methods;
    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" name="form-name" value={formName} />
                {children}
            </form>
            <DevTool control={control} />
        </FormProvider>
    );
};

SmartForm.Checkbox = SmartFormCheckbox;
SmartForm.Chips = SmartFormChips;
SmartForm.ColorInput = SmartFormColorInput;
SmartForm.ColorPicker = SmartFormColorPicker;
SmartForm.JsonInput = SmartFormJsonInput;
SmartForm.MultiSelect = SmartFormMultiSelect;
SmartForm.NumberInput = SmartFormNumberInput;
SmartForm.PasswordInput = SmartFormPasswordInput;
SmartForm.RadioGroup = SmartFormRadioGroup;
SmartForm.SegmentedControl = SmartFormSegmentedControl;
SmartForm.Select = SmartFormSelect;
SmartForm.Slider = SmartFormSlider;
SmartForm.Textarea = SmartFormTextarea;
SmartForm.TextInput = SmartFormTextInput;
SmartForm.IconPicker = SmartFormIconPicker;
SmartForm.FieldGroup = SmartFormFieldGroup;
