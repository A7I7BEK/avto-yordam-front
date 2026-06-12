<script
  setup
  lang="ts"
>
import { Copy, Eye, Pencil, Plus, ShieldCheck } from '@lucide/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getRoles } from '@/services/rolesService';
import type { Role } from '@/types/business';

const router = useRouter();
const roles = ref<Role[]>([]);

async function loadRoles() {
  roles.value = await getRoles();
}
loadRoles();

function viewRole(id: string) {
  router.push(`/business/roles-permissions/${id}`);
}

function editRole(id: string) {
  router.push(`/business/roles-permissions/${id}/edit`);
}

function createRole() {
  router.push('/business/roles-permissions/new');
}

function duplicateRole(_id: string) {
  // Duplicate logic
}
</script>

<template>
  <div class="roles-page">
    <!-- Header -->
    <div class="header-row">
      <div class="header-row__left">
        <h1 class="page-title">Roles & Permissions</h1>
        <p class="page-subtitle">
          Manage roles and control access for your team
        </p>
      </div>
      <button
        type="button"
        class="btn btn--primary"
        @click="createRole"
      >
        <Plus :size="16" />
        Create role
      </button>
    </div>

    <!-- Role Cards -->
    <div class="roles-grid">
      <div
        v-for="role in roles"
        :key="role.id"
        class="role-card"
      >
        <div class="role-card__top">
          <div
            class="role-icon"
            :style="{ background: role.iconColor }"
          >
            <ShieldCheck
              :size="22"
              color="#ffffff"
            />
          </div>
          <div class="role-card__info">
            <h3 class="role-name">{{ role.name }}</h3>
            <p class="role-desc">{{ role.description }}</p>
          </div>
        </div>
        <div class="role-card__meta">
          <span class="member-badge">
            {{ role.members }} {{ role.members === 1 ? 'member' : 'members' }}
          </span>
          <span
            class="type-badge"
            :class="role.type === 'built-in' ? 'type-badge--built-in' : 'type-badge--custom'"
          >
            {{ role.type === 'built-in' ? 'Built-in' : 'Custom' }}
          </span>
        </div>
        <div class="role-card__actions">
          <button
            type="button"
            class="btn-icon"
            title="View role"
            @click="viewRole(role.id)"
          >
            <Eye :size="16" />
          </button>
          <button
            v-if="role.type === 'custom'"
            type="button"
            class="btn-icon"
            title="Edit role"
            @click="editRole(role.id)"
          >
            <Pencil :size="16" />
          </button>
          <button
            type="button"
            class="btn-icon"
            title="Duplicate role"
            @click="duplicateRole(role.id)"
          >
            <Copy :size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.roles-page {
  padding: 24px 32px;
}

.header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.header-row__left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #2a2933;
}

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #616167;
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

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.role-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  border: 1px solid #d9d9db;
  border-radius: 10px;
  transition: box-shadow 0.15s;
}

.role-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.role-card__top {
  display: flex;
  gap: 14px;
}

.role-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
}

.role-card__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.role-name {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #2a2933;
}

.role-desc {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
}

.role-card__meta {
  display: flex;
  gap: 8px;
}

.member-badge {
  display: inline-flex;
  padding: 3px 10px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #616167;
  background: #f5f5f5;
  border-radius: 999px;
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

.role-card__actions {
  display: flex;
  gap: 4px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: #939399;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 6px;
  transition: all 0.15s;
}

.btn-icon:hover {
  color: #2a2933;
  background: #f5f5f5;
}
</style>
