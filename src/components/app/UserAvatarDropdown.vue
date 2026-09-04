<script
  setup
  lang="ts"
>
import { ChevronDown, LogOut, User } from '@lucide/vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProfessionalAppStore } from '@/stores/professionalApp';

const store = useProfessionalAppStore();
const router = useRouter();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function closeDropdown(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  window.removeEventListener('click', closeDropdown);
});

function goToProfile() {
  isOpen.value = false;
  if (router.currentRoute.value.path.startsWith('/business')) {
    router.push({ name: 'biz-settings-profile' });
  } else {
    router.push({ name: 'pro-settings' });
  }
}

function handleLogout() {
  isOpen.value = false;
  localStorage.removeItem('token');
  router.push('/auth/login');
}
</script>

<template>
  <div
    class="dropdown-container"
    ref="dropdownRef"
  >
    <button
      class="avatar-dropdown"
      type="button"
      title="Profile menu"
      @click.stop="toggleDropdown"
    >
      <div class="avatar-circle">
        {{ store.userInitials || 'U' }}
      </div>
      <ChevronDown
        :size="14"
        color="var(--foreground)"
        class="chevron"
        :class="{ 'rotate-icon': isOpen }"
      />
    </button>

    <transition name="fade-slide">
      <div
        v-if="isOpen"
        class="dropdown-menu"
      >
        <button
          class="menu-item"
          type="button"
          @click="goToProfile"
        >
          <User
            :size="16"
            class="menu-icon"
          />
          <span>Profile Settings</span>
        </button>
        <div class="menu-divider" />
        <button
          class="menu-item menu-item--danger"
          type="button"
          @click="handleLogout"
        >
          <LogOut
            :size="16"
            class="menu-icon"
          />
          <span>Log out</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.dropdown-container {
  position: relative;
  display: inline-block;
}

.avatar-dropdown {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 4px 12px 4px 4px;
  cursor: pointer;
  background: var(--muted);
  border: none;
  border-radius: 999px;
  transition: background 0.15s;
}

.avatar-dropdown:hover {
  background: var(--hover);
}

.avatar-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: var(--primary-foreground);
  background: var(--primary);
  border-radius: 999px;
}

.chevron {
  transition: transform 0.2s ease;
}

.rotate-icon {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 120%;
  right: 0;
  z-index: 1000;
  min-width: 180px;
  padding: 6px 0;
  margin-top: 4px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transform-origin: top right;
}

.menu-item {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  text-align: left;
  cursor: pointer;
  background: none;
  border: none;
  transition:
    background 0.15s,
    color 0.15s;
}

.menu-item:hover {
  background: var(--muted);
}

.menu-icon {
  color: var(--muted-foreground);
  transition: color 0.15s;
}

.menu-item:hover .menu-icon {
  color: var(--foreground);
}

.menu-divider {
  height: 1px;
  margin: 4px 0;
  background: var(--border);
}

.menu-item--danger {
  color: var(--destructive);
}

.menu-item--danger:hover {
  background: var(--destructive-soft);
}

.menu-item--danger:hover .menu-icon {
  color: var(--destructive);
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
</style>
