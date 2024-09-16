<template>
  <e-h1 align="center" class="self-center mt-4">Spinner / 加载指示器 </e-h1>
  <div class="flex flex-col gap-4 pl-4 pr-4 items-start">
    <e-space
      align="start"
      vertical
      class="rounded-md border-1 border-solid border-[var(--arona-blue-6)] p-4"
    >
      <e-space>
        <e-spinner />
        <e-spinner :size="24" />
        <e-spinner :size="32" />
        <e-spinner :size="40" />
        <e-spinner :size="48" />
        <e-spinner
          :size="48"
          base-color="plana-pink-1"
          primary-color="plana-pink-6"
          secondary-color="plana-pink-3"
        />
      </e-space>
      <e-space>
        <e-spinner />
        <e-spinner :size="24" gray />
        <e-spinner :size="32" gray />
        <e-spinner :size="40" gray />
        <e-spinner :size="48" gray />
      </e-space>
    </e-space>
    <e-space
      align="end"
      class="rounded-md border-1 border-solid border-[var(--arona-blue-6)] p-4 bg-[var(--arona-blue-6)]"
    >
      <e-spinner white />
      <e-spinner :size="24" white />
      <e-spinner :size="32" white />
      <e-spinner :size="40" white />
      <e-spinner :size="48" white />
    </e-space>
  </div>
</template>

<style scoped lang="scss"></style>
