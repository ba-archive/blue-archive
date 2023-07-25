export function cloneJSON<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
