import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'
import { TitleBuilderProps } from '@components/ui/title/title-builder'
import { TitleInput } from '@components/ui/title/title-input/titleInput'

type SmartFormTimeProps = SmartFormInputBaseProps & TitleBuilderProps

export const SmartFormTitleInput = (props: SmartFormTimeProps) => {
    return (
        <SmartFormController {...props}>
            <TitleInput />
        </SmartFormController>
    )
}
