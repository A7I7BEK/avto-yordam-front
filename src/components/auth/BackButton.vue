<script
  setup
  lang="ts"
>
import { ArrowLeft } from '@lucide/vue';

defineProps<{
  to?: string;
}>();

const emit = defineEmits<{
  click: [];
}>();

function handleClick() {
  emit('click');
}
</script>

<template>
  <button
    class="back-button"
    type="button"
    @click="handleClick"
  >
    <ArrowLeft
      :size="16"
      color="#616167"
    />
    <span>Back</span>
  </button>
</template>

<style scoped>
.back-button {
  display: flex;
  gap: 6px;
  align-items: center;
  align-self: flex-start;
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #616167;
  cursor: pointer;
  background: none;
  border: none;
}

.back-button:hover {
  opacity: 0.7;
}
</style>
