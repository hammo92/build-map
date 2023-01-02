import { Extent } from 'ol/extent'
import IIIFInfo, { ImageInformationResponse } from 'ol/format/IIIFInfo'
import { Tile as LayerTile } from 'ol/layer'

import 'ol/ol.css'
import IIIF from 'ol/source/IIIF'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RContextType, RLayer, RLayerVector, RMap } from 'rlayers'
import { RLayerRasterProps } from 'rlayers/layer/RLayerRaster'

export interface RLayerIIIFProps extends RLayerRasterProps {
    iiif: IIIF
}

export interface IiifTIleProps {
    url: string
}

class RLayerIIIF extends RLayer<RLayerIIIFProps> {
    ol: LayerTile<IIIF>
    source: IIIF

    constructor(
        props: Readonly<RLayerIIIFProps>,
        context: React.Context<RContextType>
    ) {
        super(props, context)
        this.source = this.props.iiif
        this.ol = new LayerTile({
            source: this.source,
        })
        this.eventSources = [this.ol, this.source]
    }
}

export default function IiifTile({ url }: IiifTIleProps) {
    const [iiif, setIiif] = useState<IIIF>()
    const [error, setError] = useState<string>()
    useEffect(() => {
        fetch(url)
            .then((response) => response.json())
            .then((imageInfo) => {
                const options = new IIIFInfo(imageInfo).getTileSourceOptions()
                if (options === undefined || options.version === undefined) {
                    setError(
                        'Data seems to not be valid IIIF image information.'
                    )
                    return
                }
                setIiif(new IIIF({ ...options, zDirection: -1 }))
            })
    }, [url])

    if (error) return <p>error</p>

    if (iiif) {
        return (
            <RMap
                width={'100%'}
                height={'90vh'}
                initial={{
                    center: [0, 0],
                    zoom: 3,
                    resolution: 3,
                }}
                extent={iiif.getTileGrid()?.getExtent()}
            >
                <RLayerIIIF iiif={iiif} />
            </RMap>
        )
    }
    return <p>loading</p>
}
