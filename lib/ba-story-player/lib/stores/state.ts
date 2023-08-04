import { ref } from "vue";
import { UiState } from "@/types/state";

const UiState: UiState = {
  autoMode: ref(false),
  tabActivated: ref(false),
};

export function useUiState() {
  return UiState;
}