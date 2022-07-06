import * as React from "react";
import { SubmitHandler } from "react-hook-form";

interface SmartFormContextProps {
    onSubmit: SubmitHandler<any>;
    submitMethod?: "manual" | "onChange";
}

const SmartFormContext = React.createContext<SmartFormContextProps | undefined>(undefined);

const SmartFormProvider: React.FC<SmartFormContextProps> = ({
    children,
    onSubmit,
    submitMethod = "manual",
}) => {
    return (
        <SmartFormContext.Provider value={{ onSubmit, submitMethod }}>
            {children}
        </SmartFormContext.Provider>
    );
};

function useSmartFormContext() {
    const context = React.useContext(SmartFormContext);
    if (context === undefined) {
        throw new Error("useSmartForm must be used within a count provider");
    }
    return context;
}

export { SmartFormProvider, useSmartFormContext };
