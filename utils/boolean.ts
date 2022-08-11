export function isBoolean(input: any): input is Boolean {
    return typeof input === "boolean";
}

export function printBool(bool: Boolean) {
    return bool.toString();
}
