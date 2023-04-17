export function randomString() {
    return Math.random().toString(36).slice(2, 12);
}

export function generateId() {
    return `${Date.now()}${randomString()}`;
}
