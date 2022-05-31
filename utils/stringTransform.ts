export function capitalise(string: string, type: "first" | "all" = "first") {
    if ((type = "first")) {
        return string.trim().replace(/^\w/, (c) => c.toUpperCase());
    }
    return string
        .trim()
        .toLowerCase()
        .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
}

export function splitCamel(string: string) {
    return string.replace(/([a-z])([A-Z])/g, "$1 $2");
}
