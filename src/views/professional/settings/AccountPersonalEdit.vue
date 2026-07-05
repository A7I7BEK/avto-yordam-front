<script
  setup
  lang="ts"
>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const fullName = ref('Aziz Ismoilov');
const dateOfBirth = ref('14 / 02 / 1991');
const specialization = ref('European brands · Engine & diagnostics');
const workingHours = ref('Mon–Sat · 09:00–19:00');
const yearsOfExperience = ref('8');
const bio = ref(
  'European car specialist with 8 years of hands-on experience in engine diagnostics, brake systems, and electrical repairs. Passionate about delivering quality service.',
);

function goToPreview() {
  router.push({
    path: route.path,
    query: { tab: 'personal', mode: 'preview' },
  });
}

function saveChanges() {
  // Mock save
  goToPreview();
}
</script>

<template>
  <div class="section">
    <div class="section-header">
      <div class="section-title-group">
        <span class="section-title">Edit personal information</span>
        <span class="section-desc">Update your profile details below.</span>
      </div>
      <button
        class="cancel-btn"
        type="button"
        @click="goToPreview"
      >
        Cancel
      </button>
    </div>

    <!-- Profile Header -->
    <div class="profile-header">
      <div class="profile-avatar">AI</div>
      <div class="profile-info">
        <span class="profile-name">Aziz Ismoilov</span>
        <button
          class="change-photo"
          type="button"
        >
          Change photo
        </button>
      </div>
    </div>

    <!-- Form -->
    <div class="form-grid">
      <div class="field-group">
        <label class="field-label">Full name</label>
        <input
          v-model="fullName"
          class="field-input"
          type="text"
        >
      </div>
      <div class="field-group">
        <label class="field-label">Date of birth</label>
        <input
          v-model="dateOfBirth"
          class="field-input"
          type="text"
        >
      </div>
      <div class="field-group">
        <label class="field-label">Specialization</label>
        <input
          v-model="specialization"
          class="field-input"
          type="text"
        >
      </div>
      <div class="field-group">
        <label class="field-label">Working hours</label>
        <input
          v-model="workingHours"
          class="field-input"
          type="text"
        >
      </div>
      <div class="field-group">
        <label class="field-label">Years of experience</label>
        <input
          v-model="yearsOfExperience"
          class="field-input"
          type="number"
        >
      </div>
    </div>

    <!-- Bio -->
    <div class="field-group">
      <label class="field-label">Short bio</label>
      <textarea
        v-model="bio"
        class="field-textarea"
        placeholder="Tell clients about your experience..."
      />
    </div>

    <!-- Footer -->
    <div class="form-footer">
      <button
        class="btn btn-cancel"
        type="button"
        @click="goToPreview"
      >
        Cancel
      </button>
      <button
        class="btn btn-save"
        type="button"
        @click="saveChanges"
      >
        Save changes
      </button>
    </div>
  </div>
</template>

<style scoped>
.section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 24px;
}

.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.section-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2a2933;
}

.section-desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #616167;
}

.cancel-btn {
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #2a2933;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.profile-header {
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

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-name {
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #2a2933;
}

.change-photo {
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #5749f4;
  text-align: left;
  cursor: pointer;
  background: none;
  border: none;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #2a2933;
}

.field-input {
  box-sizing: border-box;
  width: 100%;
  padding: 12px 16px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #2a2933;
  outline: none;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.field-textarea {
  box-sizing: border-box;
  width: 100%;
  min-height: 120px;
  padding: 14px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #2a2933;
  resize: vertical;
  outline: none;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
  border-radius: 12px;
}

.form-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 999px;
}

.btn-cancel {
  color: #2a2933;
  background: transparent;
  border: 1px solid #c5c5cb;
}

.btn-save {
  color: #ffffff;
  background: #5749f4;
}
</style>
