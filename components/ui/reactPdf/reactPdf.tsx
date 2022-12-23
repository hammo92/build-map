import React from 'react'

import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack'
//import workerSrc from '../../../pdf-worker'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export interface PdfViewerProps {
    file: File
    width?: number
    pageNumber: number
}

const PdfViewer = ({ file, width, pageNumber }: PdfViewerProps) => (
    <Document file={file} renderMode="svg">
        <Page
            pageNumber={pageNumber}
            width={width}
            renderAnnotationLayer={false}
            renderMode="svg"
            renderTextLayer={false}
        />
    </Document>
)

export default PdfViewer
