<script
  setup
  lang="ts"
>
defineProps<{
  tabs: { label: string; value: string }[];
  activeTab: string;
}>();

const emit = defineEmits<{
  switch: [value: string];
}>();
</script>

<template>
  <div class="tab-switcher">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      class="tab-item"
      :class="{ active: activeTab === tab.value }"
      type="button"
      @click="emit('switch', tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
.tab-switcher {
  display: flex;
  gap: 8px;
  width: 100%;
  height: 56px;
  padding: 8px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.tab-item {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #2a2933;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 999px;
  transition:
    background 0.15s,
    box-shadow 0.15s;
}

.tab-item.active {
  background: #d9d9db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
