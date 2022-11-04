import { SmartForm } from '@components/smartForm'
import React from 'react'
import { useWatch } from 'react-hook-form'

export const FieldsTitle = () => {
    const useTemplate = useWatch({ name: 'useTemplate' })
    console.log('👉 useTemplate >>', useTemplate)
    return (
        <>
            {useTemplate && (
                <SmartForm.TitleBuilder
                    name="stringTemplate"
                    label="Template"
                />
            )}
            <SmartForm.Checkbox
                name={'useTemplate'}
                label={'Generate from template'}
            />
        </>
    )
}
