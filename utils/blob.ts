var rImageType = /data:(image\/.+);base64,/;

export function base64ToBlob(data: string): Blob {
    var mimeString = "";
    var raw, uInt8Array, i, rawLength;

    raw = data.replace(rImageType, function (header: string, imageType: string) {
        mimeString = imageType;

        return "";
    });

    raw = atob(raw);
    rawLength = raw.length;
    uInt8Array = new Uint8Array(rawLength); // eslint-disable-line

    for (i = 0; i < rawLength; i += 1) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: mimeString });
}
