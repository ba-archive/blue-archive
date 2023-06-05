<script setup lang="ts">
import axios from 'axios';
import { computed, onBeforeMount, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useSettingsStore } from '../../store/settings';
import { useStudentStore } from '../../store/students';
import { AppliedFilter } from '../../types/AppliedFilter';
import {
  Student,
  StudentAttributeFilters,
  StudentAttributes,
  StudentNames,
} from '../../types/Student';
import { filterStudents } from '../../util/filterStudents';
import ErrorScreen from '../widgets/ErrorScreen.vue';
import ProgressBar from '../widgets/NeuUI/NeuProgressBar.vue';
import StudentShowbox from '../widgets/StudentShowbox.vue';

const route = useRoute();
const settingsStore = useSettingsStore();
const studentStore = useStudentStore();

const ready = ref(false);
const initProgress = ref(0);

/*
 * @namespace studentSelected
 * @summary 监听学生有没有被选中
 *              这段是历史遗留了，当时 router-view 不能正确隐藏选择面板，
 *              只能整一个这种扭曲的东西
 */
const studentSelected = computed(() => !/\/archive\/?$/.test(route.path));

// get 请求是否出错
const fetchError = ref(false);
const fetchErrorMessage = ref({});

axios
  .get('/config/json/students.json', {
    onDownloadProgress: progressEvent => {
      if (progressEvent.total) {
        initProgress.value = Math.floor(
          ((progressEvent.loaded || 0) * 100) / (progressEvent.total || 1)
        );
      } else {
        initProgress.value = Math.floor(
          ((progressEvent.loaded || 0) * 100) /
            ((progressEvent.loaded || 0) + 100)
        );
      }
    },
  })
  .then(response => {
    try {
      const students = response.data.sort((a: Student, b: Student) =>
        a.name.cn.localeCompare(b.name.cn, 'zh-Hans-CN', {
          sensitivity: 'accent',
        })
      );
      studentStore.setStudents(students);
    } catch (e) {
      // 用户浏览器不支持 localeCompare，则返回不排序的数组
      const students = response.data;
      studentStore.setStudents(students);
    }
    ready.value = true;
  })
  .catch(error => {
    console.error(error);
    fetchError.value = true;
    fetchErrorMessage.value = error;
    ready.value = true;
  });

const students = computed(() => studentStore.getAllStudents);

// 包含每个学生所有名字的 array，用于根据名字过滤
const studentsNameList = computed<StudentNames[]>(() => {
  return students.value.map(student => {
    return {
      id: student.id,
      allNames: [
        student.name.cn,
        student.name.jp,
        student.name.en,
        ...student.nickname,
      ],
    };
  });
});

// 获取不重复的某个学生属性，用于在边栏展示
function getCohortAttribute(
  attribute: keyof StudentAttributes,
  needSort = true
): (string | number)[] {
  const filtered: (string | number)[] = [];
  students.value.forEach((student: Student) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (![undefined, null].includes(student[attribute])) {
      if (!filtered.includes(student[attribute] as string | number)) {
        filtered.push(student[attribute] as string | number);
      }
    }
  });
  if (needSort) {
    try {
      return filtered.sort((a, b) =>
        a
          .toString()
          .localeCompare(b.toString(), 'zh-Hans-CN', { sensitivity: 'accent' })
      );
    } catch (e) {
      return filtered;
    }
  }
  return filtered;
}

/**
 * @namespace armorTypes
 * @summary 目前游戏内的三种装甲类型，order 字段用于排序
 */
const armorTypes = [
  { string: 'LightArmor', name: '轻装甲', order: 1 },
  { string: 'HeavyArmor', name: '重装甲', order: 2 },
  { string: 'Unarmed', name: '神秘装甲', order: 3 },
  { string: 'ElasticArmor', name: '弹性装甲', order: 4 },
];

// TODO: Sound 译名待定
/**
 * @namespace bulletTypes
 * @summary 目前游戏内的三种子弹类型，order 字段用于排序
 */
const bulletTypes = [
  { string: 'Explosion', name: '爆发', order: 1 },
  { string: 'Pierce', name: '贯通', order: 2 },
  { string: 'Mystic', name: '神秘', order: 3 },
  { string: 'Sound', name: '振动', order: 4 },
];

// 因为约定俗成的装甲属性排列是 轻装甲-重装甲-神秘装甲，所以根据这个顺序进行排序
function sortArmorType(
  a: string | number | undefined,
  b: string | number | undefined
): number {
  const armorTypeA = armorTypes.find(type => type.string === a) || {
    name: '0',
  };
  const armorTypeB = armorTypes.find(type => type.string === b) || {
    name: '1',
  };
  return armorTypeA.name.localeCompare(armorTypeB.name, 'zh-Hans-CN', {
    sensitivity: 'accent',
  });
}

// 按照 爆发-贯通-神秘子弹 进行排序
function sortBulletType(
  a: string | number | undefined,
  b: string | number | undefined
): number {
  const bulletTypeA = bulletTypes.find(type => type.string === a) || {
    name: '0',
  };
  const bulletTypeB = bulletTypes.find(type => type.string === b) || {
    name: '1',
  };
  return bulletTypeA.name.localeCompare(bulletTypeB.name, 'zh-Hans-CN', {
    sensitivity: 'accent',
  });
}

// 获取全部学生的不重复的属性用于边栏展示

const studentRarities = computed(() => getCohortAttribute('rarity', false));
const studentClubs = computed(() => getCohortAttribute('club'));
const studentAffiliations = computed(() => getCohortAttribute('affiliation'));
const studentTypes = computed(() => getCohortAttribute('type', false));
const studentArmorTypes = computed(() =>
  getCohortAttribute('armorType', false).sort((a, b) => sortArmorType(a, b))
);
const studentBulletTypes = computed(() =>
  getCohortAttribute('bulletType', false).sort((a, b) => sortBulletType(a, b))
);

const studentNameFilter = ref('');
// 学生属性过滤器
const appliedFilters = computed<AppliedFilter>(() => {
  return {
    searchString: studentNameFilter.value,
    rarity: settingsStore.getRarityFilter,
    club: settingsStore.getClubFilter,
    affiliation: settingsStore.getAffiliationFilter,
    type: settingsStore.getTypeFilter,
    armorType: settingsStore.getArmorTypeFilter,
    bulletType: settingsStore.getBulletTypeFilter,
  };
});

// 检测当前过滤器（不含搜索栏）是否为空
const isEmptyFilter = computed(() => {
  return (
    appliedFilters.value.rarity.length === 0 &&
    appliedFilters.value.club.length === 0 &&
    appliedFilters.value.affiliation.length === 0 &&
    appliedFilters.value.type.length === 0 &&
    appliedFilters.value.armorType.length === 0 &&
    appliedFilters.value.bulletType &&
    appliedFilters.value.bulletType?.length === 0
  );
});

// 查询一个 tag 是否被选中
function isActivate(property: string, value: string | number | undefined) {
  if (undefined === value) return '';
  return (
    appliedFilters.value[property as keyof AppliedFilter] as (string | number)[]
  ).includes(value)
    ? 'active'
    : '';
}

// 处理学生属性过滤器的状态变化，把新的状态存入 settingsStore 并更新过滤后的学生列表
function handleFilter(property: keyof AppliedFilter, value: string | number) {
  if ((appliedFilters.value[property] as (string | number)[]).includes(value)) {
    (appliedFilters.value[property] as (string | number)[]) = (
      appliedFilters.value[property] as (string | number)[]
    ).filter((item: string | number) => item !== value);
  } else {
    (appliedFilters.value[property] as (string | number)[]).push(value);
  }
  settingsStore.setStudentFilters(appliedFilters.value);
}

const filteredStudents = computed<number[]>(() => {
  return filterStudents(
    appliedFilters.value,
    studentsNameList.value,
    students.value
  );
});

function handleFocus(event: Event) {
  (event.target as HTMLInputElement).select();
}

const showFilter = ref(true);

// 处理视口尺寸变化（响应式布局）
// FIXME: 当视口宽度多次变化时会失效
let currentWidth = window.innerWidth;
let ticking = false;
function updateShowFilter() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    if (currentWidth === window.innerWidth) return;
    // 仅在视口宽度发生变化时更新 showFilter 状态
    currentWidth = window.innerWidth;
    showFilter.value = window.innerWidth > 768;
    ticking = false;
  });
}

// 重置过滤器
function handleClearFilterAttribute(property: keyof StudentAttributeFilters) {
  settingsStore.clearStudentFilter(property);
}

onBeforeMount(() => {
  if (window.innerWidth <= 768) {
    showFilter.value = false;
  }

  window.addEventListener('resize', updateShowFilter);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateShowFilter);
});
</script>

<template>
  <error-screen
    v-if="fetchError"
    :error-message="fetchErrorMessage"
    :route-path="route.path"
  />
  <div class="loading-container" v-if="!ready">
    <progress-bar :show-percentage="true" :progress="initProgress" />
  </div>
  <div id="student-selector-container" v-if="ready && !studentSelected">
    <div class="filter-banner">
      <input
        type="text"
        id="name-filter"
        :placeholder="studentNameFilter ? '' : '在学生姓名/黑话内搜索…'"
        v-model="studentNameFilter"
        @focus="handleFocus"
        autocomplete="off"
      />
      <div
        class="clear-filter-icon"
        v-if="!isEmptyFilter"
        @click="settingsStore.clearStudentFilters"
      >
        <img
          v-show="!isEmptyFilter"
          src="/src/assets/clear-filter.svg"
          alt="Clear all filters"
        />
      </div>

      <div
        class="filter-options-icon-mobile rounded-small"
        @click="showFilter = !showFilter"
      >
        <img src="/src/assets/filter-options.svg" alt="Filter options" />
      </div>
    </div>
    <div class="student-filter" v-show="showFilter">
      <div class="filter-group">
        <h2 class="filter-label">
          <span>稀有度</span>
          <span
            class="clear-filter-button"
            role="button"
            tabindex="0"
            v-show="0 !== appliedFilters.rarity.length"
            @click="handleClearFilterAttribute('rarity')"
          ></span>
        </h2>
        <div class="filter-options">
          <div
            class="filter-tag rounded-small"
            role="checkbox"
            v-for="rarity in studentRarities"
            :class="isActivate('rarity', rarity)"
            :key="rarity"
            @click="handleFilter('rarity', rarity)"
          >
            ★ {{ rarity }}
          </div>
        </div>
      </div>

      <div class="filter-group">
        <h2 class="filter-label">
          <span>学校</span>
          <span
            class="clear-filter-button"
            role="button"
            tabindex="0"
            v-show="0 !== appliedFilters.affiliation.length"
            @click="handleClearFilterAttribute('affiliation')"
          ></span>
        </h2>
        <div class="filter-options">
          <div
            class="filter-tag rounded-small"
            role="checkbox"
            v-for="affiliation in studentAffiliations"
            :class="isActivate('affiliation', affiliation)"
            :key="affiliation"
            @click="handleFilter('affiliation', affiliation)"
          >
            {{ affiliation }}
          </div>
        </div>
      </div>
      <div class="filter-group">
        <h2 class="filter-label">
          <span>战术作用</span>
          <span
            class="clear-filter-button"
            role="button"
            tabindex="0"
            v-show="0 !== appliedFilters.type.length"
            @click="handleClearFilterAttribute('type')"
          ></span>
        </h2>
        <div class="filter-options">
          <div
            class="filter-tag tactic-type rounded-small"
            :class="`${studentType.toString().toLowerCase()} ${isActivate(
              'type',
              studentType
            )}`"
            role="checkbox"
            v-for="studentType in studentTypes"
            :key="studentType"
            @click="handleFilter('type', studentType)"
          >
            {{ studentType }}
          </div>
        </div>
      </div>

      <div class="filter-group" v-if="studentBulletTypes?.length > 0">
        <h2 class="filter-label">
          <span>攻击类型</span>
          <span
            class="clear-filter-button"
            role="button"
            tabindex="0"
            v-show="0 !== appliedFilters.bulletType?.length"
            @click="handleClearFilterAttribute('bulletType')"
          ></span>
        </h2>
        <div class="filter-options">
          <div
            v-for="bulletType in studentBulletTypes"
            class="filter-tag bullet-type rounded-small"
            :class="`${bulletType.toString().toLowerCase()} ${isActivate(
              'bulletType',
              bulletType
            )}`"
            role="checkbox"
            :key="bulletType"
            @click="handleFilter('bulletType', bulletType)"
          >
            {{
              bulletTypes.find(el => bulletType === el.string)?.name ||
              bulletType
            }}
          </div>
        </div>
      </div>

      <div class="filter-group">
        <h2 class="filter-label">
          <span>装甲类型</span>
          <span
            class="clear-filter-button"
            role="button"
            tabindex="0"
            v-show="0 !== appliedFilters.armorType.length"
            @click="handleClearFilterAttribute('armorType')"
          ></span>
        </h2>
        <div class="filter-options">
          <div
            v-for="armorType in studentArmorTypes"
            class="filter-tag armor-type rounded-small"
            :class="`${armorType.toString().toLowerCase()} ${isActivate(
              'armorType',
              armorType
            )}`"
            role="checkbox"
            :key="armorType"
            @click="handleFilter('armorType', armorType)"
          >
            {{
              armorTypes.find(el => armorType === el.string)?.name || armorType
            }}
          </div>
        </div>
      </div>

      <div class="filter-group">
        <h2 class="filter-label">
          <span>社团</span>
          <span
            class="clear-filter-button"
            role="button"
            tabindex="0"
            v-show="0 !== appliedFilters.club.length"
            @click="handleClearFilterAttribute('club')"
          ></span>
        </h2>
        <div class="filter-options">
          <div
            class="filter-tag rounded-small"
            role="checkbox"
            v-for="club in studentClubs"
            :class="isActivate('club', club)"
            :key="club"
            @click="handleFilter('club', club)"
          >
            {{ club }}
          </div>
        </div>
      </div>
    </div>

    <div id="student-list">
      <router-link
        class="student-showcase rounded-small"
        v-for="student in students"
        :key="student.id"
        :to="`/archive/${student.id}/momotalk`"
        v-show="filteredStudents.includes(student.id)"
      >
        <StudentShowbox :student-info="student" />
      </router-link>
    </div>
  </div>
  <router-view v-if="studentSelected" />
</template>

<style scoped lang="scss">
#student-selector-container {
  display: grid;
  grid-template-rows: min-content auto;
  grid-template-columns: min-content auto;
  grid-template-areas:
    'name-filter name-filter'
    'filter list';
  justify-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.filter-banner {
  display: grid;
  grid-template-columns: min-content auto;
  grid-template-areas: 'filter-icon input-area';
  grid-area: name-filter;
  align-items: center;
  justify-items: stretch;
  margin: 1.5rem 1rem 1rem 1rem;
  border-radius: 1rem;
  background-color: var(--color-student-filter-background);
  width: calc(100% - 2rem);
  height: fit-content;
  overflow: hidden;

  .filter-options-icon-mobile {
    display: none;
  }

  .clear-filter-icon {
    display: flex;
    grid-area: filter-icon;
    align-items: center;
    align-self: stretch;
    transition: all 0.375s ease-in-out;
    cursor: pointer;
    padding: 0 0.2rem 0 0.6rem;

    img {
      width: 1.5rem;
      height: 1.5rem;
    }

    &:hover {
      filter: brightness(0.8);
      -webkit-filter: brightness(0.8);
      background-color: #f7f7f8;
    }
  }

  #name-filter {
    grid-area: input-area;
    transition: all 0.175s ease-in-out;
    border: none;
    background-color: transparent;
    padding: 0.5rem;
    width: 100%;
    color: var(--color-text-glass-panel);
    font-size: 1.5rem;
    text-align: center;

    &:focus {
      outline: none;
      box-shadow: var(--style-shadow-near) inset;
    }
  }
}

#student-container {
  display: flex;
  flex: 1;
  flex-direction: row;
  width: 100%;
}

.student-filter {
  display: flex;
  grid-area: filter;
  flex-direction: column;
  padding-left: 1rem;
  width: 20rem;
  overflow-y: scroll;
}

.filter-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.filter-label {
  display: flex;
  align-items: center;
  transition: all 0.375s ease-in-out;
  color: var(--color-text-main);
  user-select: none;

  .clear-filter-button {
    mask-image: url('/src/assets/bin.svg');
    -webkit-mask-image: url('/src/assets/bin.svg');
    mask-position: bottom;
    -webkit-mask-position: bottom;
    mask-size: 1rem;
    -webkit-mask-size: 1rem;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    cursor: pointer;
    margin-left: 0.4rem;
    background-color: var(--color-text-main);
    width: 1rem;
    height: 1.25rem;
  }
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.filter-tag {
  transition: all 0.175s ease-in-out;
  cursor: pointer;
  margin: 0.25rem;
  box-shadow: var(--style-shadow-far);
  background-color: var(--color-tag-background);
  padding: 0.25rem 0.5rem;
  color: var(--color-text-main);
  font-weight: bold;
  font-size: 1rem;
  user-select: none;

  &.active {
    box-shadow: 0 0 0 transparent;
    background-color: var(--color-tag-active-background);
    color: var(--color-tag-active);
  }
}

.tactic-type {
  font-weight: bolder;
  font-family: Bender, sans-serif;
  text-transform: uppercase;

  &.striker {
    color: var(--color-text-striker);

    &.active {
      background-color: var(--color-text-striker);
      color: var(--color-text-contrast);
    }
  }

  &.special {
    color: var(--color-text-special);

    &.active {
      background-color: var(--color-text-special);
      color: var(--color-text-contrast);
    }
  }
}

.armor-type,
.bullet-type {
  &.lightarmor,
  &.explosion {
    color: var(--color-text-light-armor);

    &.active {
      background-color: var(--color-text-light-armor);
      color: var(--color-text-contrast);
    }
  }
  &.heavyarmor,
  &.pierce {
    color: var(--color-text-heavy-armor);

    &.active {
      background-color: var(--color-text-heavy-armor);
      color: var(--color-text-contrast);
    }
  }
  &.unarmed,
  &.mystic {
    color: var(--color-text-unarmed);

    &.active {
      background-color: var(--color-text-unarmed);
      color: var(--color-text-contrast);
    }
  }

  &.elasticarmor,
  &.sound {
    color: var(--color-text-elastic-armor);

    &.active {
      background-color: var(--color-text-elastic-armor);
      color: var(--color-text-contrast);
    }
  }
}

#student-list {
  grid-gap: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, 7rem);
  grid-auto-rows: min-content;
  grid-area: list;
  justify-content: space-between;
  content-visibility: auto;
  padding: 0 1rem 1rem 1rem;
  width: 100%;
  overflow-y: scroll;
}

.student-showcase {
  display: inline-block;
  transition: all 0.375s ease-in-out;
  box-shadow: var(--style-shadow-far);
  width: fit-content;
  height: fit-content;
  text-decoration: none;

  &:hover {
    scale: 1.01;
    box-shadow: var(--style-shadow-farther);
  }
}

@media screen and (max-width: 768px) {
  #student-selector-container {
    display: flex;
    flex-direction: column;
  }

  .filter-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0;
    background-color: transparent;
    .clear-filter-icon {
      margin-right: 0.5rem;
      border-radius: 0.5rem;
      -webkit-border-radius: 0.5rem;
      background-color: #d7d9e1b3;
      padding: 0.5rem 0.5rem 0.5rem 0.6rem;
    }

    #name-filter {
      margin-right: 0.5rem;
      border-radius: 0.5rem;
      -webkit-border-radius: 0.5rem;
      background-color: #d7d9e1b3;
      width: 100%;
      font-size: 1.25rem;
    }

    .filter-options-icon-mobile {
      display: flex;
      grid-area: filter-options;
      justify-content: center;
      align-items: center;
      align-self: stretch;
      transition: all 0.375s ease-in-out;
      cursor: pointer;
      background-color: #d7d9e1b3;
      padding: 0.5rem 0.5rem 0.5rem 0.6rem;

      img {
        width: 1.5rem;
        height: 1.5rem;
      }

      &:hover {
        filter: brightness(0.8);
        -webkit-filter: brightness(0.8);
      }
    }
  }

  .student-filter {
    grid-area: filter;
    padding-left: 0;
  }

  #student-list {
    grid-template-columns: repeat(auto-fill, 5rem);
  }
}
</style>
