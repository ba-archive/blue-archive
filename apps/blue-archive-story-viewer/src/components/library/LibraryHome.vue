<script setup lang="ts">
import { libraryIndex } from "@index/libraryIndex";
</script>

<template>
  <div class="flex-vertical">
    <div class="flex-vertical" style="width: min(50rem, 90%)">
      <h2 class="color-transition">档案库</h2>
      <!-- eslint-disable-next-line vue/require-v-for-key -->
      <div class="library flex-vertical">
        <div
          class="library__section flex-vertical"
          v-for="librarySection in libraryIndex"
          v-once
        >
          <h3 class="library__section__title">{{ librarySection.type }}</h3>
          <div class="library__section__content">
            <!-- eslint-disable-next-line vue/require-v-for-key -->
            <a
              v-for="libraryItem in librarySection.contents"
              :href="libraryItem.link"
              target="_blank"
              class="library__section__content__item rounded-small shadow-near"
              :title="libraryItem.description"
              v-once
            >
              <img
                class="library__section__content__item__icon"
                :src="libraryItem.avatar"
                :alt="libraryItem.title"
              />
              <h4
                class="library__section__content__item__title color-transition"
              >
                {{ libraryItem.title }}
              </h4>
              <p
                class="library__section__content__item__description color-transition"
              >
                {{ libraryItem.description }}
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
h2 {
  margin: 2rem auto 1rem;
}

a {
  color: var(--color-text-main);
  text-decoration: none;
}

.library {
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2rem;
  width: 100%;

  &__section {
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1rem;

    &__content {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1rem;
      width: 100%;

      &__item {
        grid-column-gap: 1rem;
        display: grid;
        grid-template-rows: max-content auto;
        grid-template-columns: min-content auto;
        grid-template-areas:
          "avatar title"
          ". description";
        align-items: center;
        transition: all 0.375s ease-in-out;
        background-color: var(--color-card-background);
        padding: 1rem;
        width: 16rem;
        color: var(--color-text-main);
        text-decoration: none;

        &__icon {
          grid-area: avatar;
          border-radius: 50%;
          width: 2.5rem;
        }

        &__title {
          grid-area: title;
        }

        &__description {
          grid-area: description;
          overflow: hidden;
          color: #bababa;
          font-size: 0.9rem;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        &:hover {
          box-shadow: var(--style-shadow-farther);
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .library {
    &__section {
      &__content {
        &__item {
          width: 100%;
        }
      }
    }
  }
}
</style>
