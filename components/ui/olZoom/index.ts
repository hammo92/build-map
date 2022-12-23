// RichText.tsx in your components folder
import dynamic from 'next/dynamic'

export default dynamic(() => import('@components/ui/olZoom/olZoom'), {
    // Disable during server side rendering
    ssr: false,

    // Render anything as fallback on server, e.g. loader or html content without editor
    loading: () => null,
})
