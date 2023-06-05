<template>
  <div id="settings-home" class="flex-vertical center fill-screen">
    <div class="settings-panel flex-vertical rounded-medium">
      <div class="settings-panel__row">
        <div class="settings-panel__row__text">
          <p>{{ getI18nString(userLanguage, 'settings.language') }}</p>
        </div>
        <div class="settings-panel__row__action">
          <language-selector />
        </div>
      </div>
      <div class="settings-panel__row">
        <div class="settings-panel__row__text">
          <p>{{ getI18nString(userLanguage, 'settings.useMp3Title') }}</p>
          <p class="settings-panel__row__text__description">
            {{ getI18nString(userLanguage, 'settings.useMp3Description') }}
          </p>
        </div>
        <div class="settings-panel__row__action">
          <neu-switch
            :checked="useMp3SwitchValue"
            @update:value="handleAppleCompatibleSwitchChange"
          />
        </div>
      </div>
      <div class="settings-panel__row">
        <div class="settings-panel__row__text">
          <p>
            {{ getI18nString(userLanguage, 'settings.useSuperSamplingTitle') }}
          </p>
          <p class="settings-panel__row__text__description">
            {{
              getI18nString(
                userLanguage,
                'settings.useSuperSamplingDescription'
              )
            }}
          </p>
        </div>
        <div class="settings-panel__row__action">
          <neu-radio-group>
            <neu-radio
              :value="false"
              :activated="!useSuperSamplingValue"
              @click="handleSuperSamplingSwitchChange('')"
              >off</neu-radio
            >
            <neu-radio
              value="2x"
              :activated="'2' === useSuperSamplingValue"
              @click="handleSuperSamplingSwitchChange('2')"
              >2x</neu-radio
            >
            <neu-radio
              value="4x"
              v-if="!checkMobile() && false"
              :activated="'4' === useSuperSamplingValue"
              @click="handleSuperSamplingSwitchChange('4')"
              >4x</neu-radio
            >
          </neu-radio-group>
        </div>
      </div>
      <div class="settings-panel__row">
        <div class="settings-panel__row__text">
          <p>{{ getI18nString(userLanguage, 'settings.clearCacheTitle') }}</p>
          <p class="settings-panel__row__text__description">
            {{ getI18nString(userLanguage, 'settings.clearCacheDescription') }}
          </p>
        </div>
        <div class="settings-panel__row__action">
          <div
            class="user-action-button rounded-small"
            role="button"
            @click="handleClearCache"
          >
            {{ getI18nString(userLanguage, 'settings.clearCacheActionText') }}
          </div>
        </div>
      </div>
      <div class="settings-panel__row">
        <div class="settings-panel__row__text">
          <p>{{ getI18nString(userLanguage, 'settings.unregisterSWTitle') }}</p>
          <p class="settings-panel__row__text__description">
            {{
              getI18nString(userLanguage, 'settings.unregisterSWDescription')
            }}
          </p>
        </div>
        <div class="settings-panel__row__action">
          <div
            class="user-action-button rounded-small danger"
            role="button"
            @click="handleUnregisterSW"
          >
            {{ getI18nString(userLanguage, 'settings.unregisterSWActionText') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import isMobile from 'ismobilejs';
import { Ref, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getI18nString } from '../../i18n/getI18nString';
import { useSettingsStore } from '../../store/settings';
import LanguageSelector from '../widgets/LanguageSelector.vue';
import NeuRadio from '../widgets/NeuUI/NeuRadio.vue';
import NeuRadioGroup from '../widgets/NeuUI/NeuRadioGroup.vue';
import NeuSwitch from '../widgets/NeuUI/NeuSwitch.vue';

const settingsStore = useSettingsStore();
const router = useRouter();
const userLanguage = computed(() => settingsStore.getLang);

const useMp3SwitchValue: Ref<boolean> = ref(settingsStore.getUseMp3);
const useSuperSamplingValue = computed<'' | '2' | '4' | undefined>(
  () => settingsStore.getUseSuperSampling
);

function handleAppleCompatibleSwitchChange(value: boolean) {
  settingsStore.setUseMp3(value);
}

function handleSuperSamplingSwitchChange(value: '' | '2' | '4') {
  settingsStore.setUseSuperSampling(value);
}

function handleClearCache() {
  caches.keys().then(cacheNames => {
    const clearedCacheList: string[] = [];
    const clearableCaches = cacheNames.filter(
      cacheName => !cacheName.startsWith('workbox')
    );
    clearableCaches.forEach(cacheName => {
      console.log('Deleting cache: ' + cacheName);
      caches.delete(cacheName);
      clearedCacheList.push(cacheName);
    });

    alert('Cache cleared!\n' + clearedCacheList.join('\n'));
  });
}

function handleUnregisterSW() {
  navigator.serviceWorker
    .getRegistrations()
    .then(registrations => {
      for (const registration of registrations) {
        registration.unregister();
      }
    })
    .then(() => {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    })
    .then(() => {
      alert('已重置应用状态，即将刷新页面');
      router.go(0);
    });
}

function checkMobile() {
  return isMobile(window.navigator).any;
}
</script>

<style scoped lang="scss">
.settings-panel {
  align-items: stretch;
  gap: 1rem;
  transition: all 0.375s ease-in-out;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  background-color: var(--color-card-background);
  padding: 20px;
  width: 100%;
  max-width: 600px;

  &__row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;

    &__text {
      max-width: 75%;
      font-weight: bold;

      &__description {
        color: #999;
        font-weight: normal;
        font-size: 0.8rem;
      }
    }

    &__action {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      align-items: center;
      width: fit-content;
    }
  }
}
</style>
