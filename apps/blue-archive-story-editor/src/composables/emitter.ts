import mitt from 'mitt'

// eslint-disable-next-line ts/consistent-type-definitions
export type Events = {
  'editor.reload': void
  'editor.edit_story_property': void
  'editor.save': void
}

export const emitter = mitt<Events>()
emitter.on('*', (type, event) => {
  console.log(`emitter: ${type} ${event}`)
})

export function useEmitter() {
  return emitter
}
