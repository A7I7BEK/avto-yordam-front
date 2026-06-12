<script
  setup
  lang="ts"
>
import { ChevronDown } from 'lucide-vue-next';
import { useProfessionalAppStore } from '@/stores/professionalApp';

const store = useProfessionalAppStore();
</script>

<template>
  <button
    class="avatar-dropdown"
    type="button"
    title="Profile menu"
  >
    <div class="avatar-circle">
      {{ store.userInitials }}
    </div>
    <ChevronDown
      :size="14"
      color="#2A2933"
    />
  </button>
</template>

<style scoped>
.avatar-dropdown {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 4px 12px 4px 4px;
  cursor: pointer;
  background: #f5f5f5;
  border: none;
  border-radius: 999px;
  transition: background 0.15s;
}

.avatar-dropdown:hover {
  background: #e8e8e8;
}

.avatar-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  background: #5749f4;
  border-radius: 999px;
}
</style>
