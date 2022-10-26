import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'
import {
    TitleBuilder,
    TitleBuilderProps,
} from '@components/ui/title/title-builder'
import { TextInput } from '@mantine/core'
import { TitleElementProps } from '@components/ui/title/title-builder/titleBuilder-element'

type SmartFormTimeProps = SmartFormInputBaseProps & TitleBuilderProps

export const SmartFormTitleBuilder = (props: SmartFormTimeProps) => {
    return (
        <SmartFormController {...props}>
            <TitleBuilder />
        </SmartFormController>
    )
}
