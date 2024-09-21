export function cloneObject<T>(org: T): T {
    return JSON.parse(JSON.stringify(org));
} 
