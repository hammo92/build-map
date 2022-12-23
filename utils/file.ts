export const getPdfPages = (file: File) => {
    return new Promise<number>((resolve, reject) => {
        if (file.type !== 'application/pdf') reject
        const reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onloadend = () => {
            const result = reader.result as string
            resolve(result.match(/\/Type[\s]*\/Page[^s]/g)?.length ?? 0)
        }
        reader.onerror = reject
    })
}
