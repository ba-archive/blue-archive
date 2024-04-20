export function cloneJSON<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function encodeEscape(text: string): string {
  return text.replaceAll('\n', '\\n').replaceAll('\r', '\\r').replaceAll('\'', '\\\'').replaceAll('\"', '\\\"')
}

export function decodeEscape(text: string): string {
  return text.replaceAll('\\n', '\n').replaceAll('\\r', '\r').replaceAll('\\\'', '\'').replaceAll('\\\"', '\"')
}

export function jloads(text: string): any {
  return JSON.parse(text)
}

export function jdumps(obj: any): string {
  return JSON.stringify(obj, null, 2) || ''
}

export async function dataURItoBlob(uri: string) {
  return fetch(uri).then(res => res.blob())
}
