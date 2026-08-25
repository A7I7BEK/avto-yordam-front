<script
  setup
  lang="ts"
>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import BusinessHeader from '@/components/business/BusinessHeader.vue';
import BusinessSidebar from '@/components/business/BusinessSidebar.vue';
import { useBusinessAppStore } from '@/stores/businessApp';

const store = useBusinessAppStore();
const route = useRoute();

// Close mobile sidebar on route change
watch(
  () => route.fullPath,
  () => {
    store.closeMobileSidebar();
  },
);
</script>

<template>
  <div class="app-shell">
    <div
      v-if="store.isMobileSidebarOpen"
      class="app-shell__backdrop"
      @click="store.closeMobileSidebar"
    />
    <BusinessSidebar
      class="app-shell__sidebar"
      :class="{ 'app-shell__sidebar--open': store.isMobileSidebarOpen }"
    />
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
  position: relative;
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.app-shell__backdrop {
  position: fixed;
  inset: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.app-shell__sidebar {
  flex-shrink: 0;
  width: 256px;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.app-shell__main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.app-shell__content {
  flex: 1;
  overflow-y: auto;
  background: var(--content-bg);
}

@media (max-width: 1023px) {
  .app-shell__sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25);
    transform: translateX(-100%);
  }

  .app-shell__sidebar--open {
    transform: translateX(0);
  }
}
</style>
