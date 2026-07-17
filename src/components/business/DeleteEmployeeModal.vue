<script
  setup
  lang="ts"
>
import { OctagonAlert, Trash2, Wrench } from '@lucide/vue';
import { computed } from 'vue';

interface EmployeeData {
  id: string;
  name: string;
  initials: string;
  email?: string;
  role: string;
  avatarColor: string;
}

const props = defineProps<{
  isOpen: boolean;
  employee: EmployeeData | null;
}>();

const emit = defineEmits<{
  cancel: [];
  confirm: [id: string];
}>();

const orgName = 'AutoFix MCHJ';

const employeeEmail = computed(() => {
  if (!props.employee) {
    return '';
  }
  return (
    props.employee.email ??
    `${props.employee.name.toLowerCase().replace(/\s+/g, '.')}@autofix.uz`
  );
});

function onCancel() {
  emit('cancel');
}

function onConfirm() {
  if (props.employee) {
    emit('confirm', props.employee.id);
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen && employee"
      class="modal-overlay"
      @click.self="onCancel"
    >
      <div class="modal-card">
        <!-- Icon -->
        <div class="icon-circle">
          <Trash2 :size="28" />
        </div>

        <!-- Title and description -->
        <div class="modal-text">
          <h2 class="modal-title">Delete this employee?</h2>
          <p class="modal-desc">
            This permanently removes {{ employee.name }}'s account from
            {{ orgName }}
            and revokes all workspace access. This action can't be undone.
          </p>
        </div>

        <!-- Employee info card -->
        <div class="employee-card">
          <div class="emp-card-left">
            <div
              class="emp-avatar"
              :style="{ background: employee.avatarColor }"
            >
              {{ employee.initials }}
            </div>
            <div class="emp-info">
              <span class="emp-name">{{ employee.name }}</span>
              <span class="emp-email">{{ employeeEmail }}</span>
            </div>
          </div>
          <div class="emp-role-badge">
            <Wrench :size="12" />
            {{ employee.role }}
          </div>
        </div>

        <!-- Warning banner -->
        <div class="warning-banner">
          <OctagonAlert :size="16" />
          <span class="warning-text">
            Access ends immediately and any jobs currently assigned to this
            employee will be unassigned.
          </span>
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button
            type="button"
            class="btn btn--secondary"
            @click="onCancel"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn--destructive"
            @click="onConfirm"
          >
            <Trash2 :size="16" />
            Delete employee
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* ===== Overlay ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.6);
}

/* ===== Modal card ===== */
.modal-card {
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 520px;
  max-width: 90vw;
  padding: 40px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

/* ===== Icon circle ===== */
.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin: auto;
  color: #590f00;
  background: #ffbfb2;
  border-radius: var(--radius-pill);
}

/* ===== Modal text ===== */
.modal-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
}

.modal-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--foreground);
}

.modal-desc {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--muted-foreground);
}

/* ===== Employee card ===== */
.employee-card {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  background: var(--accent);
  border-radius: var(--radius-xl);
}

.emp-card-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.emp-avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--primary-foreground);
  background: var(--primary);
  border-radius: var(--radius-pill);
}

.emp-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.emp-name {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.emp-email {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.emp-role-badge {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 5px 12px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #001133;
  white-space: nowrap;
  background: #c9d6f0;
  border-radius: var(--radius-pill);
}

/* ===== Warning banner ===== */
.warning-banner {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px 14px;
  color: #590f00;
  background: #ffbfb2;
  border-radius: var(--radius-xl);
}

.warning-text {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.45;
  color: #590f00;
}

/* ===== Actions ===== */
.modal-actions {
  display: flex;
  gap: 12px;
}

.btn {
  display: inline-flex;
  flex: 1;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-pill);
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s,
    opacity 0.15s;
}

.btn--secondary {
  color: var(--foreground);
  background: var(--accent);
}

.btn--secondary:hover {
  background: color-mix(in srgb, var(--accent) 97%, black);
}

.btn--destructive {
  font-weight: 600;
  color: var(--primary-foreground);
  background: var(--destructive);
}

.btn--destructive:hover {
  background: color-mix(in srgb, var(--destructive) 85%, black);
}
</style>
