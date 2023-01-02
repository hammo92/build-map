import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useUser } from '@auth0/nextjs-auth0'
import { Drawing } from '@lib/drawing/data/drawing.model'
import { params } from '@serverless/cloud'

const TiledDrawing = ({ drawing }: { drawing: Drawing }) => {
    const { user } = useUser()
    console.log('drawing', drawing)
    console.log(
        'url',
        `https://${process.env.NEXT_PUBLIC_CLOUD_API_URL}/drawings/${drawing.id}/{z}/{x}/{y}`
    )
    return (
        <MapContainer
            center={[0, -0]}
            zoom={1}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url={`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/drawings/${drawing.id}/{z}/{x}/{y}`}
            />
        </MapContainer>
    )
}

export default TiledDrawing
