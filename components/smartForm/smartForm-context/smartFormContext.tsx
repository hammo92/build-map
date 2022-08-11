import * as React from "react";
import { SubmitHandler } from "react-hook-form";

interface SmartFormContextProps {
    onSubmit: SubmitHandler<any>;
    submitMethod?: "manual" | "onChange";
    readOnly?: boolean;
}

interface SmartFormProviderProps extends SmartFormContextProps {
    children: React.ReactNode;
}

const SmartFormContext = React.createContext<SmartFormContextProps | undefined>(undefined);

const SmartFormProvider = ({
    children,
    onSubmit,
    submitMethod = "manual",
    readOnly = false,
}: SmartFormProviderProps) => {
    return (
        <SmartFormContext.Provider value={{ onSubmit, submitMethod, readOnly }}>
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
