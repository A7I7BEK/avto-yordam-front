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

const isEdit = computed(() => !!route.params.id);
const roleName = ref('');
const description = ref('');
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
    name: 'Roles & Permissions',
    permissions: [
      { key: 'roles.view', label: 'View roles', checked: false },
      { key: 'roles.create', label: 'Create roles', checked: false },
      { key: 'roles.edit', label: 'Edit roles', checked: false },
      { key: 'roles.delete', label: 'Delete roles', checked: false },
    ],
  },
];

onMounted(async () => {
  if (isEdit.value && route.params.id) {
    const role = await getRole(route.params.id as string);
    if (role) {
      roleName.value = role.name;
      description.value = role.description;
    }
  }
  loading.value = false;
});

function save() {
  // Save logic
  router.push('/business/roles-permissions');
}

function cancel() {
  router.push('/business/roles-permissions');
}
</script>

<template>
  <div class="form-page">
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
      <span class="breadcrumb-item breadcrumb-item--current">
        {{ isEdit ? `Edit ${roleName}` : 'Create role' }}
      </span>
    </div>

    <div
      v-if="loading"
      class="loading-state"
    >
      Loading...
    </div>

    <template v-else>
      <h1 class="page-title">
        {{ isEdit ? `Edit ${roleName}` : 'Create role' }}
      </h1>

      <!-- Form -->
      <div class="form-card">
        <div class="form-group">
          <label
            for="roleName"
            class="form-label"
            >Role name</label
          >
          <input
            id="roleName"
            v-model="roleName"
            type="text"
            class="form-input"
            placeholder="e.g. Senior Master"
          >
        </div>

        <div class="form-group">
          <label
            for="description"
            class="form-label"
            >Description</label
          >
          <textarea
            id="description"
            v-model="description"
            class="form-textarea"
            placeholder="Describe this role's responsibilities..."
            rows="3"
          />
        </div>

        <!-- Permissions -->
        <div class="form-group">
          <span class="form-label">Permissions</span>
          <div class="permissions-list">
            <div
              v-for="category in permissionCategories"
              :key="category.name"
              class="perm-category"
            >
              <h4 class="perm-category__title">{{ category.name }}</h4>
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
        </div>

        <!-- Actions -->
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
.form-page {
  max-width: 720px;
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
  gap: 20px;
  padding: 24px;
  border: 1px solid #d9d9db;
  border-radius: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #2a2933;
}

.form-input,
.form-textarea {
  padding: 10px 14px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #2a2933;
  outline: none;
  background: #ffffff;
  border: 1px solid #d9d9db;
  border-radius: 8px;
  transition: border-color 0.15s;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #5749f4;
}

.form-textarea {
  resize: vertical;
}

.permissions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.perm-category {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.perm-category__title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #2a2933;
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
  padding-top: 8px;
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
