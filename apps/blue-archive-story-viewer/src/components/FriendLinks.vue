<script setup lang="ts">
interface FriendLink {
  title: string;
  url: string;
  logo: string;
  logoDescription: string;
  shouldReverseOnDarkTheme?: boolean;
  description: string;
}
const links: FriendLink[] = [
  {
    title: "本镜像仓库",
    url: "https://github.com/xiaofeiTM233/blue-archive",
    logo: "/image/contributor/github-logo.svg",
    logoDescription: "GitHub logo",
    shouldReverseOnDarkTheme: true,
    description: "本镜像仓库",
  },
  {
    title: "原项目仓库",
    url: "https://github.com/ba-archive/blue-archive",
    logo: "/image/contributor/github-logo.svg",
    logoDescription: "GitHub logo",
    shouldReverseOnDarkTheme: true,
    description: "原项目仓库",
  },
];
</script>

<template>
  <div class="flex-vertical">
    <article>
      <h2>友情链接</h2>
      <div class="contribution-wall">
        <a
          v-for="link in links"
          :href="link.url"
          target="_blank"
          class="contribution-brick rounded-small shadow-near"
          :key="link.url"
          v-once
        >
          <img
            class="logo"
            :class="{ 'should-reverse-on-dark': link.shouldReverseOnDarkTheme }"
            :src="link.logo"
            :alt="link.logoDescription"
          />
          <h4>{{ link.title }}</h4>
          <p>{{ link.description }}</p>
        </a>
      </div>
    </article>
  </div>
</template>

<style scoped lang="scss">
article {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: min(50rem, 90%);
}

.contribution-wall {
  grid-gap: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, 16rem);
  margin-top: 1rem;
  width: 100%;
}

.contribution-brick {
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
  max-width: 16rem;
  color: var(--color-text-main);
  text-decoration: none;

  &:hover {
    box-shadow: var(--style-shadow-farther);
  }

  .logo {
    grid-area: avatar;
    border-radius: 50%;
    width: 2.5rem;
  }

  h4 {
    grid-area: title;
  }

  p {
    grid-area: description;
    color: #bababa;
    font-size: 0.9rem;
  }
}

html[data-theme="dark"] {
  .should-reverse-on-dark {
    filter: invert(1);
  }
}

h2 {
  transition: color 0.375s ease-in-out;
  margin: 2rem auto 0.5rem;
}

@media screen and (max-width: 768px) {
  article {
    width: fit-content;
  }

  .contribution-wall {
    grid-template-columns: min-content;
  }

  .contribution-brick {
    width: calc(100vw - 2rem);
    max-width: unset;
  }
}
</style>
