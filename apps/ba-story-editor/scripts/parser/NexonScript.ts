import yuuka from '../yuuka.json'
import type { NexonJSONStory } from './type'

const STARTUP_INDENT = '   '
const langKeys = ['TextJp', 'TextCn']
const scriptKeys = ['BGMId', 'Sound', 'Transition', 'BGName', 'BGEffect', 'PopupFileName', 'VoiceJp']

function encodeEscape(text: string): string {
  return text.replaceAll('\n', '\\n').replaceAll('\r', '\\r').replaceAll('\'', '\\\'').replaceAll('\"', '\\\"')
}

function decodeEscape(text: string): string {
  return text.replaceAll('\\n', '\n').replaceAll('\\r', '\r').replaceAll('\\\'', '\'').replaceAll('\\\"', '\"')
}

export function buildNexonScript(json: NexonJSONStory) {
  let result = ''
  json.content.forEach((each) => {
    let attrText = ''
    for (const scriptKey of scriptKeys) {
      const temp = Reflect.get(each, scriptKey)
      if (temp)
        attrText += ` @${scriptKey}="${encodeEscape(String(temp))}"`
    }

    const splitKr = each.ScriptKr.split('\n')
    const splitLangs: Record<string, string[]> = {}

    for (const langKey of langKeys) {
      const temp = String(Reflect.get(each, langKey))
      splitLangs[langKey] = temp.split('\n')
    }
    for (let i = 0; i < splitKr.length; i++) {
      let temp = i === 0 && each.SelectionGroup ? `${each.SelectionGroup}: ` : STARTUP_INDENT
      temp += splitKr[i]
      if (i === 0)
        temp += attrText
      Object.keys(splitLangs).forEach((langKey) => {
        if (splitLangs[langKey][i])
          temp += ` @${langKey}="${encodeEscape(splitLangs[langKey][i])}"`
      })
      result += `${temp}\n`
    }
  })
  return result
}

console.log(buildNexonScript(yuuka))
