<script
  setup
  lang="ts"
>
import {
  Activity,
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  Hash,
  Key,
  KeyRound,
  LogIn,
  Mail,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Phone,
  Shield,
  ShieldCheck,
  Smartphone,
  Trash2,
  TrendingUp,
  User,
  Wrench,
} from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DeleteEmployeeModal from '@/components/business/DeleteEmployeeModal.vue';
import ResetPasswordModal from '@/components/business/ResetPasswordModal.vue';
import { getEmployee } from '@/services/employeesService';
import type { Employee } from '@/types/business';

const route = useRoute();
const router = useRouter();

const employee = ref<Employee | null>(null);
const loading = ref(true);
const activeTab = ref<'account' | 'activity' | 'security'>('account');
const showDeleteModal = ref(false);
const showResetModal = ref(false);

onMounted(async () => {
  try {
    const id = route.params.id as string;
    employee.value = await getEmployee(id);
  } finally {
    loading.value = false;
  }
});

function goBack() {
  router.push('/business/team/employees');
}

function editEmployee() {
  if (!employee.value) {
    return;
  }
  router.push(`/business/team/employees/${employee.value.id}/edit`);
}

function resetPassword() {
  showResetModal.value = true;
}

function deleteEmployee() {
  showDeleteModal.value = true;
}

function confirmDelete() {
  showDeleteModal.value = false;
  router.push('/business/team/employees');
}
</script>

<template>
  <div
    v-if="loading"
    class="loading-state"
  >
    Loading...
  </div>

  <div
    v-else-if="!employee"
    class="loading-state"
  >
    Employee not found
  </div>

  <div
    v-else
    class="view-page"
  >
    <!-- Back link -->
    <button
      type="button"
      class="back-link"
      @click="goBack"
    >
      <ArrowLeft :size="14" />
      Back
    </button>

    <!-- Header -->
    <div class="page-header">
      <div class="header-text">
        <h1 class="page-title">Employee details</h1>
        <p class="page-subtitle">
          View profile, role and account access for this team member.
        </p>
      </div>
      <div class="header-actions">
        <button
          type="button"
          class="btn btn--outline"
          @click="resetPassword"
        >
          <KeyRound :size="14" />
          Reset password
        </button>
        <button
          type="button"
          class="btn btn--destructive-outline"
          @click="deleteEmployee"
        >
          <Trash2 :size="14" />
          Delete
        </button>
        <button
          type="button"
          class="btn btn--primary"
          @click="editEmployee"
        >
          <Pencil :size="14" />
          Edit employee
        </button>
      </div>
    </div>

    <!-- Profile Card -->
    <div class="profile-card">
      <!-- Hero Section -->
      <div class="hero">
        <!-- Identity Row -->
        <div class="identity-row">
          <div class="avatar-wrapper">
            <div
              class="avatar-circle"
              :style="{ background: employee.avatarColor }"
            >
              <span class="avatar-initials">{{ employee.initials }}</span>
            </div>
            <div class="status-ring" />
          </div>

          <div class="name-block">
            <span class="emp-name">{{ employee.name }}</span>
            <div class="contact-line">
              <Mail :size="13" />
              <span>saida.karimova@autofix.uz</span>
              <span class="dot-sep">·</span>
              <Phone :size="13" />
              <span>{{ employee.phone }}</span>
            </div>
            <div class="badges-row">
              <span class="badge badge--info">
                <Wrench :size="12" />
                {{ employee.role }}
              </span>
              <span class="badge badge--success">
                <span class="badge-dot badge-dot--success" />
                Active
              </span>
              <span class="badge badge--outline">
                <MapPin :size="12" />
                Tashkent
              </span>
            </div>
          </div>

          <div class="quick-actions">
            <button
              type="button"
              class="qa-btn"
              title="Message"
            >
              <MessageCircle :size="16" />
            </button>
            <button
              type="button"
              class="qa-btn"
              title="Call"
            >
              <Phone :size="16" />
            </button>
            <button
              type="button"
              class="qa-btn"
              title="More"
            >
              <MoreHorizontal :size="16" />
            </button>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-label">
              <Wrench :size="13" />
              Bookings completed
            </div>
            <div class="stat-value-row">
              <span class="stat-number">247</span>
              <span class="stat-trend">
                <TrendingUp :size="10" />
                +12%
              </span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">
              <Calendar :size="13" />
              Member since
            </div>
            <span class="stat-number stat-number--md">Apr 2, 2023</span>
          </div>
          <div class="stat-card">
            <div class="stat-label">
              <Clock :size="13" />
              Last active
            </div>
            <div class="stat-value-row">
              <span class="badge-dot badge-dot--success" />
              <span class="stat-number stat-number--md">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-row">
        <button
          type="button"
          class="tab"
          :class="{ 'tab--active': activeTab === 'account' }"
          @click="activeTab = 'account'"
        >
          <User :size="14" />
          Account
        </button>
        <button
          type="button"
          class="tab"
          :class="{ 'tab--active': activeTab === 'activity' }"
          @click="activeTab = 'activity'"
        >
          <Activity :size="14" />
          Activity
          <span class="tab-badge">12</span>
        </button>
        <button
          type="button"
          class="tab"
          :class="{ 'tab--active': activeTab === 'security' }"
          @click="activeTab = 'security'"
        >
          <ShieldCheck :size="14" />
          Security
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <div class="section-header">
          <div class="section-header-text">
            <span class="section-title">Account details</span>
            <span class="section-desc">
              Essential profile and access information.
            </span>
          </div>
          <button
            type="button"
            class="btn btn--copy"
          >
            <Copy :size="12" />
            Copy profile link
          </button>
        </div>

        <!-- Info Grid Row 1 -->
        <div class="info-grid">
          <div class="info-field">
            <div class="info-label">
              <Hash :size="12" />
              Employee ID
            </div>
            <span class="info-value">EMP-04915</span>
          </div>
          <div class="info-field">
            <div class="info-label">
              <Briefcase :size="12" />
              Department
            </div>
            <span class="info-value">Service Bay 2</span>
          </div>
          <div class="info-field">
            <div class="info-label">
              <Shield :size="12" />
              Access level
            </div>
            <span class="info-value">Standard</span>
          </div>
        </div>

        <!-- Info Grid Row 2 -->
        <div class="info-grid">
          <div class="info-field">
            <div class="info-label">
              <LogIn :size="12" />
              Last sign-in
            </div>
            <span class="info-value">Today, 09:14 — Tashkent</span>
          </div>
          <div class="info-field">
            <div class="info-label">
              <Key :size="12" />
              Password updated
            </div>
            <span class="info-value">Mar 30, 2025</span>
          </div>
          <div class="info-field">
            <div class="info-label">
              <Smartphone :size="12" />
              Two-factor auth
            </div>
            <div class="info-value-row">
              <CheckCircle2
                :size="14"
                class="text-success"
              />
              <span class="info-value">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <DeleteEmployeeModal
      :is-open="showDeleteModal"
      :employee="employee"
      @cancel="showDeleteModal = false"
      @confirm="confirmDelete"
    />

    <ResetPasswordModal
      :is-open="showResetModal"
      :employee="employee"
      @cancel="showResetModal = false"
      @confirm="showResetModal = false"
    />
  </div>
</template>

<style scoped>
/* ===== Loading ===== */
.loading-state {
  padding: 40px 32px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: var(--muted-foreground);
}

/* ===== Page layout ===== */
.view-page {
  padding: 24px 32px;
}

/* ===== Back link ===== */
.back-link {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 0;
  margin-bottom: 18px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
  cursor: pointer;
  background: none;
  border: none;
}

.back-link:hover {
  color: var(--foreground);
}

/* ===== Header ===== */
.page-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
}

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* ===== Buttons ===== */
.btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-pill);
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s,
    opacity 0.15s;
}

.btn--primary {
  color: var(--primary-foreground);
  background: var(--primary);
}

.btn--primary:hover {
  opacity: 0.9;
}

.btn--outline {
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
}

.btn--outline:hover {
  background: var(--accent);
  border-color: var(--foreground);
}

.btn--destructive-outline {
  color: var(--destructive);
  background: transparent;
  border: 1px solid var(--destructive);
}

.btn--destructive-outline:hover {
  color: var(--primary-foreground);
  background: var(--destructive);
}

.btn--copy {
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  background: var(--accent);
  border: 1px solid var(--border);
}

.btn--copy:hover {
  border-color: var(--foreground);
}

/* ===== Profile Card ===== */
.profile-card {
  overflow: hidden;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

/* ===== Hero Section ===== */
.hero {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 28px;
}

/* ===== Identity Row ===== */
.identity-row {
  display: flex;
  gap: 24px;
  align-items: center;
}

.avatar-wrapper {
  position: relative;
  width: 96px;
  height: 96px;
}

.avatar-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  border-radius: var(--radius-pill);
}

.avatar-initials {
  font-family: Inter, sans-serif;
  font-size: 34px;
  font-weight: 700;
  color: var(--primary-foreground);
}

.status-ring {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 22px;
  height: 22px;
  background: var(--background);
  border-radius: var(--radius-pill);
}

.status-ring::after {
  position: absolute;
  inset: 4px;
  display: block;
  content: "";
  background: var(--success);
  border-radius: var(--radius-pill);
}

.name-block {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.emp-name {
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--foreground);
}

.contact-line {
  display: flex;
  gap: 8px;
  align-items: center;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.dot-sep {
  font-weight: 700;
}

.badges-row {
  display: flex;
  gap: 8px;
}

.badge {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 5px 12px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  border-radius: var(--radius-pill);
}

.badge--info {
  color: var(--color-info-foreground);
  background: var(--color-info);
}

.badge--success {
  color: var(--color-success-foreground);
  background: var(--color-success);
}

.badge--outline {
  font-weight: 500;
  color: var(--foreground);
  background: var(--accent);
  border: 1px solid var(--border);
}

.badge-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: var(--radius-pill);
}

.badge-dot--success {
  background: var(--success);
}

/* ===== Quick Actions ===== */
.quick-actions {
  display: flex;
  gap: 8px;
}

.qa-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--foreground);
  cursor: pointer;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  transition: border-color 0.15s;
}

.qa-btn:hover {
  border-color: var(--foreground);
}

/* ===== Stats Row ===== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 88px;
  padding: 16px;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.stat-label {
  display: flex;
  gap: 6px;
  align-items: center;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
}

.stat-number {
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--foreground);
}

.stat-number--md {
  font-size: 16px;
}

.stat-value-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

.stat-trend {
  display: inline-flex;
  gap: 2px;
  align-items: center;
  padding: 2px 6px;
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: var(--color-success-foreground);
  background: var(--color-success);
  border-radius: var(--radius-pill);
}

/* ===== Tabs Row ===== */
.tabs-row {
  display: flex;
  gap: 4px;
  padding: 0 28px;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.tab {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
  padding: 14px 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted-foreground);
  cursor: pointer;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  transition: color 0.15s;
}

.tab:hover {
  color: var(--foreground);
}

.tab--active {
  font-weight: 600;
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 1px 7px;
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: var(--muted-foreground);
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
}

/* ===== Tab Content ===== */
.tab-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 28px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.section-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
}

.section-desc {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Info Grid ===== */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.info-label {
  display: flex;
  gap: 6px;
  align-items: center;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.info-value {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.info-value-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

.text-success {
  color: var(--success);
}

@media (max-width: 768px) {
  .view-page {
    padding: 16px 12px;
  }

  .page-header {
    flex-direction: column;
    gap: 12px;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .btn {
    flex: 1;
    justify-content: center;
  }

  .hero {
    padding: 20px 16px;
  }

  .identity-row {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .stats-row {
    grid-template-columns: 1fr;
  }

  .tabs-row {
    padding: 0 16px;
  }

  .tab-content {
    padding: 20px 16px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
