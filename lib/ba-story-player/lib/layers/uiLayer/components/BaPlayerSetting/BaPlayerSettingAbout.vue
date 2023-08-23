<script setup lang="ts">
import { inject } from "vue";
import { getUiI18n } from "../../utils";
import { Language } from "@/types/store";

const language = inject<Language>("language", "Cn");
defineOptions({
  name: "BaPlayerSettingAbout",
});
</script>

<template>
  <p>{{ getUiI18n("about-inside", language) }}</p>
</template>

<style scoped lang="scss">
p {
  text-align: center;
}
</style>
