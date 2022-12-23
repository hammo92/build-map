'use client'

import Div100vh from 'react-div-100vh'

type Props = {
    children: React.ReactNode
}

export const FullHeightWrapper = ({ children }: Props) => (
    <Div100vh>{children}</Div100vh>
)
