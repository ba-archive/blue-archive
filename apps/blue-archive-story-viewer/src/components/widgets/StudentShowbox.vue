<script setup lang="ts">
import { Directive, DirectiveBinding, PropType, computed } from 'vue';
import { useSettingsStore } from '../../store/settings';
import { Student } from '../../types/Student';

const props = defineProps({
  studentInfo: Object as PropType<Student>,
});

const settingsStore = useSettingsStore();
const selectedLang = computed(() => settingsStore.getLang.replace('zh', 'cn'));

const studentName = computed(() => {
  return (
    (props.studentInfo?.name[selectedLang.value as keyof Student['name']] as
      | string
      | undefined) || ''
  );
});

const vLazyLoad: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const img = new Image();
    img.src = binding.value;
    img.onload = function () {
      if (img.complete) {
        el.setAttribute('src', binding.value);
      }
    };
  },
};

function getImagePath(id: number | undefined): string {
  return `/image/avatar_students/${id}.webp`;
}
</script>

<template>
  <div class="student-container rounded-small">
    <img
      v-lazy-load="getImagePath(studentInfo?.id)"
      class="student-avatar"
      src="/src/assets/loading.webp"
      :alt="studentInfo?.name.cn"
    />
    <div class="name-tag">{{ studentName }}</div>
  </div>
</template>

<style scoped lang="scss">
.student-container {
  display: grid;
  position: relative;
  grid-template-areas: 'avatar';
  place-items: center;
  overflow: hidden;
  user-select: none;
}

.student-avatar {
  grid-area: avatar;
  width: 100%;
  object-fit: cover;
}

.name-tag {
  grid-area: avatar;
  align-self: end;
  transition: all 0.375s ease-in-out;
  border-radius: 0 0 0.5rem 0.5rem;
  background-color: var(--color-name-tag);
  padding: 0.2rem 0;
  width: 100%;
  color: var(--color-text-main);
  font-weight: bold;
  text-align: center;
}
</style>
