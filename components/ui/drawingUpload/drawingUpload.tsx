import React from 'react'
import { FileUpload } from '../fileUpload'

export const DrawingUpload = () => {
    return <FileUpload multiple onUpload={console.log} type="drawing" />
}
