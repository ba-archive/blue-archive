export function cloneJSON<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function encodeEscape(text: string): string {
  return text.replaceAll('\n', '\\n').replaceAll('\r', '\\r').replaceAll('\'', '\\\'').replaceAll('\"', '\\\"')
}

export function decodeEscape(text: string): string {
  return text.replaceAll('\\n', '\n').replaceAll('\\r', '\r').replaceAll('\\\'', '\'').replaceAll('\\\"', '\"')
}
