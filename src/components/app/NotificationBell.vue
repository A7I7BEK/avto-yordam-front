<script
  setup
  lang="ts"
>
import { Bell } from 'lucide-vue-next';
import { useProfessionalAppStore } from '@/stores/professionalApp';

const store = useProfessionalAppStore();
</script>

<template>
  <div class="bell-container">
    <Bell
      :size="16"
      color="#2A2933"
    />
    <span
      v-if="store.notificationCount > 0"
      class="badge"
    >
      {{ store.notificationCount }}
    </span>
  </div>
</template>

<style scoped>
.bell-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  cursor: pointer;
  background: #f5f5f5;
  border-radius: 999px;
}

.badge {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  font-family: Inter, sans-serif;
  font-size: 9px;
  font-weight: 700;
  color: #ffffff;
  background: #cc3314;
  border-radius: 999px;
}
</style>
