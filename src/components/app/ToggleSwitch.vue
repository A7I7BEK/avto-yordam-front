<script
  setup
  lang="ts"
>
const model = defineModel<boolean>({ required: true });
</script>

<template>
  <button
    class="toggle-switch"
    :class="{ on: model }"
    type="button"
    :aria-pressed="model"
    @click="model = !model"
  >
    <div class="knob" />
  </button>
</template>

<style scoped>
.toggle-switch {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  width: 40px;
  height: 24px;
  padding: 4px;
  cursor: pointer;
  border: none;
  border-radius: 999px;
  transition: background 0.15s;
}

.toggle-switch.on {
  justify-content: end;
  background: #5749f4;
}

.toggle-switch:not(.on) {
  justify-content: start;
  background: #c5c5cb;
}

.knob {
  width: 16px;
  height: 16px;
  background: #ffffff;
  border-radius: 999px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
