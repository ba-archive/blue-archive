<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string
}>(), {
  label: '',
})

const model = defineModel<string>()

</script>

<template>
  <div class="the-input">
    <label flex>
      <span w-20 flex items-center>
        {{ props.label }}
      </span>
      <input
        id="input"
        v-model="model"
        type="text"
        v-bind="$attrs"
        autocomplete="off"
        p="x-2 y-1"
        w-auto
        flex-1
        text="left"
        bg="transparent"
        border="~ rounded gray-200 dark:gray-700"
        outline="none active:none"
      >
    </label>
  </div>
</template>
