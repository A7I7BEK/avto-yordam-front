<script
  setup
  lang="ts"
>
import { ArrowLeft } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getRole } from '@/services/rolesService';
import type { Role } from '@/types/business';

const route = useRoute();
const router = useRouter();
const role = ref<Role | null>(null);
const loading = ref(true);

const permissionCategories = [
  {
    name: 'Orders',
    permissions: [
      { key: 'orders.view', label: 'View orders', checked: false },
      { key: 'orders.create', label: 'Create orders', checked: false },
      { key: 'orders.edit', label: 'Edit orders', checked: false },
      { key: 'orders.delete', label: 'Delete orders', checked: false },
    ],
  },
  {
    name: 'Team',
    permissions: [
      { key: 'team.view', label: 'View team', checked: false },
      { key: 'team.invite', label: 'Invite members', checked: false },
      { key: 'team.manage', label: 'Manage members', checked: false },
    ],
  },
  {
    name: 'Settings',
    permissions: [
      { key: 'settings.view', label: 'View settings', checked: false },
      { key: 'settings.edit', label: 'Edit settings', checked: false },
    ],
  },
  {
    name: 'Earnings',
    permissions: [
      { key: 'earnings.view', label: 'View earnings', checked: false },
      { key: 'earnings.export', label: 'Export reports', checked: false },
    ],
  },
  {
    name: 'Reviews',
    permissions: [
      { key: 'reviews.view', label: 'View reviews', checked: false },
      { key: 'reviews.respond', label: 'Respond to reviews', checked: false },
    ],
  },
  {
    name: 'Transactions',
    permissions: [
      { key: 'transactions.view', label: 'View transactions', checked: false },
      {
        key: 'transactions.export',
        label: 'Export transactions',
        checked: false,
      },
    ],
  },
];

const roleName = computed(() => role.value?.name || '...');

onMounted(async () => {
  try {
    const id = route.params.id as string;
    role.value = await getRole(id);
  } finally {
    loading.value = false;
  }
});

function save() {
  // Save permissions logic
  router.push(`/business/roles-permissions/${route.params.id}`);
}

function cancel() {
  router.push(`/business/roles-permissions/${route.params.id}`);
}
</script>

<template>
  <div class="assign-page">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <button
        type="button"
        class="breadcrumb-back"
        @click="cancel"
      >
        <ArrowLeft :size="16" />
      </button>
      <span class="breadcrumb-item">Roles & Permissions</span>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-item">{{ roleName }}</span>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-item breadcrumb-item--current">Permissions</span>
    </div>

    <div
      v-if="loading"
      class="loading-state"
    >
      Loading...
    </div>

    <template v-else>
      <h1 class="page-title">Assign permissions — {{ roleName }}</h1>

      <div class="form-card">
        <div
          v-for="category in permissionCategories"
          :key="category.name"
          class="perm-category"
        >
          <h3 class="perm-category__title">{{ category.name }}</h3>
          <div class="perm-category__items">
            <label
              v-for="perm in category.permissions"
              :key="perm.key"
              class="perm-checkbox"
            >
              <input
                v-model="perm.checked"
                type="checkbox"
                class="checkbox"
              >
              <span class="checkbox-label">{{ perm.label }}</span>
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button
            type="button"
            class="btn btn--outline"
            @click="cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn--primary"
            @click="save"
          >
            Save
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.assign-page {
  max-width: 640px;
  padding: 24px 32px;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #939399;
}

.breadcrumb {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 20px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #939399;
}

.breadcrumb-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  color: #616167;
  cursor: pointer;
  background: #f5f5f5;
  border: none;
  border-radius: 6px;
  transition: background 0.15s;
}

.breadcrumb-back:hover {
  background: #e8e8e8;
}

.breadcrumb-item {
  color: #939399;
}

.breadcrumb-item--current {
  font-weight: 600;
  color: #2a2933;
}

.breadcrumb-sep {
  color: #d9d9db;
}

.page-title {
  margin: 0 0 24px;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #2a2933;
}

.form-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  border: 1px solid #d9d9db;
  border-radius: 10px;
}

.perm-category {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.perm-category__title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #2a2933;
}

.perm-category__items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 4px;
}

.perm-checkbox {
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
}

.checkbox {
  width: 16px;
  height: 16px;
  accent-color: #5749f4;
  cursor: pointer;
}

.checkbox-label {
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.btn {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 10px 20px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 999px;
  transition: background 0.15s;
}

.btn--primary {
  color: #ffffff;
  background: #5749f4;
}

.btn--primary:hover {
  background: #4639d4;
}

.btn--outline {
  color: #616167;
  background: #ffffff;
  border: 1px solid #d9d9db;
}

.btn--outline:hover {
  background: #f5f5f5;
}
</style>
