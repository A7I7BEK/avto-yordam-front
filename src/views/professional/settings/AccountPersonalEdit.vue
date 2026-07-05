<script
  setup
  lang="ts"
>
import { Calendar, Check, ChevronDown, Pencil, Upload } from '@lucide/vue';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const fullName = ref('Aziz Ismoilov');
const dateOfBirth = ref('14 / 02 / 1991');
const yearsOfExperience = ref('8');
const workFrom = ref('09:00');
const workTo = ref('19:00');
const bio = ref(
  'Master mechanic specializing in European brands. 8 years of hands-on garage experience in Tashkent.',
);

const specializationOptions = [
  { value: 'engine', label: 'Engine', selected: true },
  { value: 'transmission', label: 'Transmission', selected: false },
  { value: 'bodywork', label: 'Bodywork', selected: false },
  { value: 'paint', label: 'Paint', selected: false },
  { value: 'electrical', label: 'Electrical', selected: true },
  { value: 'diagnostics', label: 'Diagnostics', selected: true },
  { value: 'tires', label: 'Tires', selected: false },
  { value: 'ac', label: 'A/C', selected: false },
  { value: 'suspension', label: 'Suspension', selected: false },
  { value: 'glass', label: 'Glass', selected: false },
];

const selectedCount = ref(
  specializationOptions.filter((o) => o.selected).length,
);

function toggleSpecialization(opt: {
  value: string;
  label: string;
  selected: boolean;
}) {
  opt.selected = !opt.selected;
  selectedCount.value = specializationOptions.filter((o) => o.selected).length;
}

const days = reactive([
  { key: 'mon', label: 'Mon', active: true },
  { key: 'tue', label: 'Tue', active: true },
  { key: 'wed', label: 'Wed', active: true },
  { key: 'thu', label: 'Thu', active: true },
  { key: 'fri', label: 'Fri', active: true },
  { key: 'sat', label: 'Sat', active: true },
  { key: 'sun', label: 'Sun', active: false },
]);

function toggleDay(day: { key: string; label: string; active: boolean }) {
  day.active = !day.active;
}

function goToPreview() {
  router.push({
    path: route.path,
    query: { tab: 'personal', mode: 'preview' },
  });
}

function saveChanges() {
  goToPreview();
}
</script>

<template>
  <div class="card">
    <!-- Header -->
    <div class="card-header">
      <div class="header-title-group">
        <span class="header-title">Edit personal information</span>
        <span class="header-desc"
          >Update the details shown on your public profile.</span
        >
      </div>
      <div class="header-actions">
        <button
          class="btn-outline"
          type="button"
          @click="goToPreview"
        >
          Cancel
        </button>
        <button
          class="btn-primary"
          type="button"
          @click="saveChanges"
        >
          <Check :size="13" />
          <span>Save changes</span>
        </button>
      </div>
    </div>

    <!-- Profile Photo -->
    <div class="photo-section">
      <div class="profile-avatar">AI</div>
      <div class="photo-info">
        <span class="photo-title">Profile photo</span>
        <span class="photo-desc"
          >JPG or PNG, max 4 MB. Shown to customers and team members.</span
        >
      </div>
      <div class="photo-actions">
        <button
          class="btn-outline btn-sm"
          type="button"
        >
          <Upload :size="12" />
          <span>Replace</span>
        </button>
        <button
          class="btn-text"
          type="button"
        >
          Remove
        </button>
      </div>
    </div>

    <div class="divider" />

    <!-- Editable Details -->
    <div class="edit-section">
      <div class="section-heading">
        <Pencil :size="13" />
        <span>Editable details</span>
      </div>

      <!-- Full name & Date of birth -->
      <div class="two-col">
        <div class="field-vertical">
          <span class="field-label-sm">Full name</span>
          <input
            v-model="fullName"
            class="input-pill"
            type="text"
          >
        </div>
        <div class="field-vertical">
          <span class="field-label-sm">Date of birth</span>
          <div class="input-pill-wrapper">
            <input
              v-model="dateOfBirth"
              class="input-pill date-input"
              type="text"
            >
            <Calendar
              :size="14"
              color="#616167"
              class="input-icon"
            />
          </div>
        </div>
      </div>

      <!-- Specialization -->
      <div class="field-block">
        <div class="field-block-header">
          <div class="field-block-title">
            <span class="field-title">Specialization</span>
            <span class="field-desc"
              >Pick everything you confidently work on — you can adjust anytime.</span
            >
          </div>
          <span class="selected-count">{{ selectedCount }} selected</span>
        </div>
        <div class="chips-row">
          <button
            v-for="opt in specializationOptions.slice(0, 5)"
            :key="opt.value"
            class="chip"
            :class="{ active: opt.selected }"
            type="button"
            @click="toggleSpecialization(opt)"
          >
            <Check
              v-if="opt.selected"
              :size="12"
            />
            {{ opt.label }}
          </button>
        </div>
        <div class="chips-row">
          <button
            v-for="opt in specializationOptions.slice(5)"
            :key="opt.value"
            class="chip"
            :class="{ active: opt.selected }"
            type="button"
            @click="toggleSpecialization(opt)"
          >
            <Check
              v-if="opt.selected"
              :size="12"
            />
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- Years of experience -->
      <div class="field-block">
        <div class="field-block-title">
          <span class="field-title">Years of experience (self-reported)</span>
          <span class="field-desc"
            >Verified time on the platform is tracked separately and shown on
            your public profile.</span
          >
        </div>
        <div class="exp-pill">
          <input
            v-model="yearsOfExperience"
            class="exp-input"
            type="text"
          >
          <span class="exp-unit">years</span>
        </div>
      </div>

      <!-- Working time -->
      <div class="field-block">
        <div class="field-block-title">
          <span class="field-title">Working time</span>
          <span class="field-desc"
            >Your default working hours. Each organization you work for can
            override these on its own schedule.</span
          >
        </div>
        <div class="time-range">
          <div class="time-field">
            <span class="time-label">FROM</span>
            <div class="time-pill">
              <input
                v-model="workFrom"
                class="time-input"
                type="time"
              >
              <ChevronDown
                :size="14"
                color="#616167"
              />
            </div>
          </div>
          <span class="time-sep">&mdash;</span>
          <div class="time-field">
            <span class="time-label">TO</span>
            <div class="time-pill">
              <input
                v-model="workTo"
                class="time-input"
                type="time"
              >
              <ChevronDown
                :size="14"
                color="#616167"
              />
            </div>
          </div>
        </div>
        <div class="days-block">
          <span class="days-label">DAYS</span>
          <div class="days-row">
            <button
              v-for="day in days"
              :key="day.key"
              class="day-chip"
              :class="{ active: day.active }"
              type="button"
              @click="toggleDay(day)"
            >
              {{ day.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Short bio -->
      <div class="field-vertical">
        <span class="field-label-sm">Short bio</span>
        <textarea
          v-model="bio"
          class="bio-input"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 24px;
}

/* Header */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-title {
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2a2933;
}

.header-desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #616167;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* Buttons */
.btn-outline {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 16px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #616167;
  cursor: pointer;
  background: transparent;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.btn-primary {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 16px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  background: #5749f4;
  border: none;
  border-radius: 999px;
}

.btn-sm {
  padding: 8px 14px;
}

.btn-text {
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #616167;
  cursor: pointer;
  background: transparent;
  border: none;
}

/* Photo Section */
.photo-section {
  display: flex;
  gap: 18px;
  align-items: center;
}

.profile-avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  font-family: Inter, sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  background: #5749f4;
  border-radius: 999px;
}

.photo-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
}

.photo-title {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #2a2933;
}

.photo-desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #616167;
}

.photo-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* Divider */
.divider {
  width: 100%;
  height: 1px;
  background: #c5c5cb;
}

/* Edit Section */
.edit-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-heading {
  display: flex;
  gap: 6px;
  align-items: center;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #2a2933;
}

/* Two column layout */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Field vertical */
.field-vertical {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label-sm {
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #616167;
}

.input-pill {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #2a2933;
  outline: none;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.input-pill:focus {
  border-color: #5749f4;
}

.input-pill-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-pill-wrapper .input-pill {
  padding-right: 36px;
}

.input-pill-wrapper .input-icon {
  position: absolute;
  right: 14px;
  pointer-events: none;
}

/* Field block */
.field-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-block-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.field-block-title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.field-title {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #2a2933;
}

.field-desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #616167;
}

.selected-count {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-style: italic;
  color: #616167;
}

/* Specialization chips */
.chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #2a2933;
  cursor: pointer;
  background: transparent;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
  transition: all 0.15s;
}

.chip.active {
  color: #ffffff;
  background: #5749f4;
  border-color: #5749f4;
}

/* Experience pill */
.exp-pill {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 180px;
  padding: 10px 16px;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.exp-input {
  width: 40px;
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #2a2933;
  outline: none;
  background: transparent;
  border: none;
}

.exp-unit {
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
}

/* Working time */
.time-range {
  display: flex;
  gap: 12px;
  align-items: center;
}

.time-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time-label {
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: #616167;
  letter-spacing: 1.5px;
}

.time-pill {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  width: 140px;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #2a2933;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.time-input {
  width: 80px;
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #2a2933;
  outline: none;
  background: transparent;
  border: none;
}

.time-input::-webkit-calendar-picker-indicator {
  display: none;
}

.time-sep {
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: #616167;
}

/* Days */
.days-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.days-label {
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: #616167;
  letter-spacing: 1.5px;
}

.days-row {
  display: flex;
  gap: 6px;
}

.day-chip {
  padding: 8px 12px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #2a2933;
  cursor: pointer;
  background: transparent;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
  transition: all 0.15s;
}

.day-chip.active {
  color: #ffffff;
  background: #5749f4;
  border-color: #5749f4;
}

/* Bio display */
.bio-input {
  box-sizing: border-box;
  width: 100%;
  height: 52px;
  padding: 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #2a2933;
  resize: vertical;
  outline: none;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 6px;
}

.bio-input:focus {
  border-color: #5749f4;
}
</style>
