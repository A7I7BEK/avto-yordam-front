<script
  setup
  lang="ts"
>
import BusinessHeader from '@/components/business/BusinessHeader.vue';
import BusinessSidebar from '@/components/business/BusinessSidebar.vue';
</script>

<template>
  <div class="app-shell">
    <BusinessSidebar class="app-shell__sidebar" />
    <div class="app-shell__main">
      <BusinessHeader class="app-shell__header" />
      <main class="app-shell__content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.app-shell__sidebar {
  flex-shrink: 0;
  width: 256px;
}
.app-shell__main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}
.app-shell__header {
  flex-shrink: 0;
  height: 80px;
}
.app-shell__content {
  flex: 1;
  overflow-y: auto;
  background: #ffffff;
}
</style>
