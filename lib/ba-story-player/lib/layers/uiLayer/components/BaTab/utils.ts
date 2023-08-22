import { Ref, ref } from "vue";

export const CurrentActivePanel = ref<Map<string, Ref<string>>>(new Map());

function getUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (c === "x" ? (Math.random() * 16) | 0 : "r&0x3" | "0x8").toString(
      16
    );
  });
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
