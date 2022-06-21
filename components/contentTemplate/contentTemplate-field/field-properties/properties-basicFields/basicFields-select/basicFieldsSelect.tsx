import { SmartForm } from "@components/smartForm";

export const BasicFieldsSelect = () => {
    return (
        <SmartForm.Textarea
            name="data"
            label="Options"
            required
            description="Enter a list of options seperated by commas"
            placeholder="eg: first, second, third"
        />
    );
};
