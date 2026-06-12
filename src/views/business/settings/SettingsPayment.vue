<script
  setup
  lang="ts"
>
import { onMounted, ref } from 'vue';
import { getSettingsPayment } from '@/services/settingsService';

interface Provider {
  id: string;
  name: string;
  enabled: boolean;
  fee: string;
  type: string;
}

const providers = ref<Provider[]>([]);

onMounted(async () => {
  const data = await getSettingsPayment();
  if (data) {
    providers.value = data.map((p) => ({ ...p }));
  }
});

function toggleProvider(id: string) {
  const provider = providers.value.find((p) => p.id === id);
  if (provider) {
    provider.enabled = !provider.enabled;
  }
}
</script>

<template>
  <div class="settings-page">
    <div class="header-row">
      <h1 class="page-title">Payment providers</h1>
    </div>

    <div class="providers-list">
      <div
        v-for="provider in providers"
        :key="provider.id"
        class="provider-card"
      >
        <div class="provider-card__left">
          <div class="provider-card__info">
            <h3 class="provider-name">{{ provider.name }}</h3>
            <div class="provider-meta">
              <span class="provider-meta__item">Fee: {{ provider.fee }}</span>
              <span class="provider-meta__sep">·</span>
              <span class="provider-meta__item"
                >{{ provider.type === 'online' ? 'Online' : 'Offline' }}</span
              >
            </div>
          </div>
        </div>
        <label class="toggle-switch">
          <input
            type="checkbox"
            :checked="provider.enabled"
            @change="toggleProvider(provider.id)"
          >
          <span class="toggle-slider" />
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  max-width: 600px;
  padding: 24px 32px;
}

.header-row {
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #2a2933;
}

.providers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.provider-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border: 1px solid #d9d9db;
  border-radius: 10px;
  transition: box-shadow 0.15s;
}

.provider-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.provider-card__left {
  display: flex;
  gap: 14px;
  align-items: center;
}

.provider-card__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.provider-name {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #2a2933;
}

.provider-meta {
  display: flex;
  gap: 6px;
  align-items: center;
}

.provider-meta__item {
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #939399;
}

.provider-meta__sep {
  color: #d9d9db;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  cursor: pointer;
}

.toggle-switch input {
  width: 0;
  height: 0;
  opacity: 0;
}

.toggle-slider {
  position: absolute;
  inset: 0;
  background: #d9d9db;
  border-radius: 22px;
  transition: background 0.2s;
}

.toggle-slider::before {
  position: absolute;
  bottom: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  content: "";
  background: #ffffff;
  border-radius: 50%;
  transition: transform 0.2s;
}

.toggle-switch input:checked + .toggle-slider {
  background: #5749f4;
}

.toggle-switch input:checked + .toggle-slider::before {
  transform: translateX(18px);
}
</style>
