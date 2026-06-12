<script
  setup
  lang="ts"
>
import { ArrowLeft, Copy, Edit3, ShieldCheck, UserPlus } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getRole } from '@/services/rolesService';
import type { Role } from '@/types/business';

const route = useRoute();
const router = useRouter();
const role = ref<Role | null>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const id = route.params.id as string;
    role.value = await getRole(id);
  } finally {
    loading.value = false;
  }
});

function goBack() {
  router.push('/business/roles-permissions');
}

function editRole() {
  if (role.value) {
    router.push(`/business/roles-permissions/${role.value.id}/edit`);
  }
}

function assignPermissions() {
  if (role.value) {
    router.push(`/business/roles-permissions/${role.value.id}/permissions`);
  }
}

function duplicateRole() {
  // Duplicate logic
}

const permissionsList = [
  {
    category: 'Orders',
    items: ['View orders', 'Create orders', 'Edit orders', 'Delete orders'],
  },
  {
    category: 'Team',
    items: ['View team', 'Invite members', 'Manage members'],
  },
  { category: 'Settings', items: ['View settings', 'Edit settings'] },
  { category: 'Earnings', items: ['View earnings', 'Export reports'] },
];
</script>

<template>
  <div class="detail-page">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <button
        type="button"
        class="breadcrumb-back"
        @click="goBack"
      >
        <ArrowLeft :size="16" />
      </button>
      <span class="breadcrumb-item">Roles & Permissions</span>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-item breadcrumb-item--current"
        >{{ role?.name || '...' }}</span
      >
    </div>

    <div
      v-if="loading"
      class="loading-state"
    >
      Loading...
    </div>

    <div
      v-else-if="!role"
      class="loading-state"
    >
      Role not found.
    </div>

    <template v-else>
      <!-- Header -->
      <div class="detail-header">
        <div class="detail-header__left">
          <div
            class="role-icon"
            :style="{ background: role.iconColor }"
          >
            <ShieldCheck
              :size="24"
              color="#ffffff"
            />
          </div>
          <div>
            <h1 class="detail-title">{{ role.name }}</h1>
            <span
              class="type-badge"
              :class="role.type === 'built-in' ? 'type-badge--built-in' : 'type-badge--custom'"
            >
              {{ role.type === 'built-in' ? 'Built-in' : 'Custom' }}
            </span>
          </div>
        </div>
        <div class="detail-header__actions">
          <button
            type="button"
            class="btn btn--outline"
            @click="editRole"
          >
            <Edit3 :size="16" />
            Edit
          </button>
          <button
            type="button"
            class="btn btn--primary"
            @click="assignPermissions"
          >
            <UserPlus :size="16" />
            Assign Permissions
          </button>
          <button
            type="button"
            class="btn btn--outline"
            @click="duplicateRole"
          >
            <Copy :size="16" />
            Duplicate
          </button>
        </div>
      </div>

      <!-- Role info -->
      <div class="info-grid">
        <div class="info-card">
          <span class="info-card__label">Description</span>
          <span class="info-card__value">{{ role.description }}</span>
        </div>
        <div class="info-card">
          <span class="info-card__label">Type</span>
          <span
            class="type-badge"
            :class="role.type === 'built-in' ? 'type-badge--built-in' : 'type-badge--custom'"
          >
            {{ role.type === 'built-in' ? 'Built-in' : 'Custom' }}
          </span>
        </div>
        <div class="info-card">
          <span class="info-card__label">Members</span>
          <span class="info-card__value"
            >{{ role.members }}
            {{ role.members === 1 ? 'member' : 'members' }}</span
          >
        </div>
      </div>

      <!-- Permissions -->
      <div class="section-card">
        <h2 class="section-title">Permissions</h2>
        <div class="section-body">
          <div
            v-for="permGroup in permissionsList"
            :key="permGroup.category"
            class="perm-group"
          >
            <h3 class="perm-group__title">{{ permGroup.category }}</h3>
            <ul class="perm-list">
              <li
                v-for="item in permGroup.items"
                :key="item"
                class="perm-item"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.detail-page {
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

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.detail-header__left {
  display: flex;
  gap: 14px;
  align-items: center;
}

.role-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
}

.detail-title {
  margin: 0 0 4px;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #2a2933;
}

.detail-header__actions {
  display: flex;
  gap: 8px;
}

.btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 9px 18px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 999px;
  transition: all 0.15s;
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  border: 1px solid #d9d9db;
  border-radius: 10px;
}

.info-card__label {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #939399;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-card__value {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #2a2933;
}

.type-badge {
  display: inline-flex;
  padding: 3px 10px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
}

.type-badge--built-in {
  color: #1e40af;
  background: #dbeafe;
}

.type-badge--custom {
  color: #5749f4;
  background: #eef0ff;
}

.section-card {
  overflow: hidden;
  border: 1px solid #d9d9db;
  border-radius: 10px;
}

.section-title {
  padding: 16px 20px;
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #2a2933;
  border-bottom: 1px solid #f0f0f0;
}

.section-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.perm-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.perm-group__title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #2a2933;
}

.perm-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.perm-item {
  padding: 4px 10px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #616167;
  background: #f5f5f5;
  border-radius: 6px;
}
</style>
