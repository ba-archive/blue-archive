import { v4 as uuidv4 } from "uuid";
import { Ref, ref } from "vue";

export const CurrentActivePanel = ref<Map<string, Ref<string>>>(new Map());

function getUUID() {
  return uuidv4();
}

export function useProgress(uuid?: string) {
  if (uuid) {
    return {
      _ref: CurrentActivePanel.value.get(uuid)!,
      uuid: uuid,
    };
  }
  const _ref = ref<string>("this is impossible");
  const _uuid = getUUID();
  CurrentActivePanel.value.set(_uuid, _ref);
  return {
    _ref,
    uuid: _uuid,
  };
}
