/**
 * Converts a Firestore Timestamp or a plain JS Date to a JS Date.
 * Needed because newly added records are dispatched with plain JS Dates,
 * while records loaded from Firestore have Timestamp objects with .toDate().
 */
export const toDate = (value) => {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value.toDate === 'function') return value.toDate();
    return new Date(value);
};
