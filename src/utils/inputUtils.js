export function trimString(value) {
    if (value == null) return '';
    return typeof value === 'string' ? value.trim() : value;
}

export function trimFields(source, fields) {
    return fields.reduce((result, field) => ({
        ...result,
        [field]: trimString(source[field])
    }), {});
}
