<script
  setup
  lang="ts"
>
import { ArrowRight, BadgeCheck } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthBrand from '@/components/auth/AuthBrand.vue';
import OnboardingStepper from '@/components/onboarding/OnboardingStepper.vue';
import { getFileUrl } from '@/services/documentsService';
import {
  deleteProfilePhoto,
  getUserProfile,
  uploadProfilePhoto,
} from '@/services/userService';
import { useProfessionalOnboardingStore } from '@/stores/onboarding';

const router = useRouter();
const store = useProfessionalOnboardingStore();

const fullName = ref(store.personalInfo.fullName);
const dateOfBirth = ref(store.personalInfo.dateOfBirth);
const phone = ref(store.personalInfo.phone);
const email = ref(store.personalInfo.email);
const yearsOfExperience = ref(store.personalInfo.yearsOfExperience);

const profilePhotoUrl = ref('');
const uploadingPhoto = ref(false);
const photoInputRef = ref<HTMLInputElement | null>(null);

const uploadLabel = computed(() => {
  if (uploadingPhoto.value) {
    return 'Uploading...';
  }
  return profilePhotoUrl.value ? 'Replace photo' : 'Upload photo';
});

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function triggerUploadPhoto() {
  photoInputRef.value?.click();
}

async function onPhotoSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return;
  }

  uploadingPhoto.value = true;
  try {
    const updated = await uploadProfilePhoto(file);
    profilePhotoUrl.value = updated.profilePhoto?.path
      ? getFileUrl(updated.profilePhoto.path)
      : '';
  } catch {
    // Upload failed — keep the current photo
  } finally {
    uploadingPhoto.value = false;
    input.value = '';
  }
}

async function removePhoto() {
  uploadingPhoto.value = true;
  try {
    await deleteProfilePhoto();
    profilePhotoUrl.value = '';
  } catch {
    // Removal failed — keep the current photo
  } finally {
    uploadingPhoto.value = false;
  }
}

onMounted(async () => {
  try {
    const user = await getUserProfile();
    if (!user) {
      return;
    }
    if (user.fullName) {
      fullName.value = user.fullName;
    }
    if (user.birthDay) {
      dateOfBirth.value = user.birthDay;
    }
    if (user.phone) {
      phone.value = user.phone;
    }
    if (user.email) {
      email.value = user.email;
    }
    profilePhotoUrl.value = user.profilePhoto?.path
      ? getFileUrl(user.profilePhoto.path)
      : '';
  } catch {
    // Keep the store values when the profile cannot be loaded
  }
});

function goBack() {
  router.push({ name: 'auth-register' });
}

function goNext() {
  store.updatePersonalInfo({
    fullName: fullName.value,
    dateOfBirth: dateOfBirth.value,
    phone: phone.value,
    email: email.value,
    yearsOfExperience: Number(yearsOfExperience.value) || 0,
  });
  router.push({ name: 'professional-onboarding-step2' });
}
</script>

<template>
  <div class="onboarding-page">
    <AuthBrand caption="Professional" />

    <OnboardingStepper :current-step="1" />

    <div class="onboarding-card">
      <div class="card-header-text">
        <h1 class="card-title">Tell us about yourself</h1>
        <p class="card-subtitle">
          This is your profile — shared with every organization you work with.
        </p>
      </div>

      <!-- Avatar -->
      <div class="avatar-row">
        <div
          v-if="profilePhotoUrl"
          class="avatar avatar--image"
        >
          <img
            :src="profilePhotoUrl"
            alt=""
            class="avatar-img"
          >
        </div>
        <div
          v-else
          class="avatar"
        >
          <span>{{ getInitials(fullName || 'Unknown User') }}</span>
        </div>
        <div class="upload-column">
          <input
            ref="photoInputRef"
            class="photo-input"
            type="file"
            accept="image/*"
            @change="onPhotoSelected"
          >
          <button
            class="btn-upload"
            type="button"
            :disabled="uploadingPhoto"
            @click="triggerUploadPhoto"
          >
            {{ uploadLabel }}
          </button>
          <span class="upload-hint">JPG or PNG, max 4 MB</span>
          <button
            v-if="profilePhotoUrl"
            class="btn-remove"
            type="button"
            :disabled="uploadingPhoto"
            @click="removePhoto"
          >
            Remove photo
          </button>
        </div>
      </div>

      <!-- Full Name -->
      <div class="field-group">
        <label class="field-label">Full name</label>
        <input
          v-model="fullName"
          class="field-input"
          type="text"
        >
      </div>

      <!-- Date of Birth -->
      <div class="field-group">
        <label class="field-label">Date of birth</label>
        <input
          v-model="dateOfBirth"
          class="field-input"
          type="date"
        >
      </div>

      <!-- Years of Experience -->
      <div class="field-group">
        <label class="field-label">Years of experience</label>
        <div class="experience-row">
          <div class="experience-input">
            <input
              v-model.number="yearsOfExperience"
              class="exp-number"
              type="number"
              min="0"
              max="70"
            >
            <span class="exp-label">years</span>
          </div>
          <span class="exp-hint">How long have you been doing this work?</span>
        </div>
      </div>

      <!-- Phone (verified) -->
      <div class="field-group">
        <div class="label-row">
          <label class="field-label">Phone (verified)</label>
          <BadgeCheck
            :size="14"
            color="var(--color-success-foreground)"
          />
          <span class="verified-text">Verified</span>
        </div>
        <input
          :value="phone"
          class="field-input field-input-readonly"
          type="tel"
          readonly
        >
      </div>

      <!-- Email -->
      <div class="field-group">
        <label class="field-label">Email</label>
        <input
          :value="email"
          class="field-input field-input-readonly"
          type="email"
          readonly
        >
      </div>

      <!-- Footer -->
      <div class="footer-buttons">
        <button
          class="btn btn-back"
          type="button"
          @click="goBack"
        >
          Back
        </button>
        <button
          class="btn btn-next"
          type="button"
          @click="goNext"
        >
          <span>Continue</span>
          <ArrowRight :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  padding: 40px 80px;
  background: var(--background);
}

.onboarding-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  max-width: 640px;
  padding: 32px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 40px;
  box-shadow: 0 10px 8.75px rgba(0, 0, 0, 0.039);
}

.card-header-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: var(--foreground);
}

.card-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--muted-foreground);
}

.avatar-row {
  display: flex;
  gap: 20px;
  align-items: center;
}

.avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  font-family: Inter, sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  background: var(--primary);
  border-radius: 999px;
}

.upload-column {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.btn-upload {
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  cursor: pointer;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
}

.upload-hint {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.avatar--image {
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-input {
  display: none;
}

.btn-upload:disabled {
  cursor: default;
  opacity: 0.6;
}

.btn-remove {
  align-self: flex-start;
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--destructive);
  cursor: pointer;
  background: transparent;
  border: none;
}

.btn-remove:hover:not(:disabled) {
  text-decoration: underline;
}

.btn-remove:disabled {
  cursor: default;
  opacity: 0.6;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.label-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

.field-label {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.verified-text {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-success-foreground);
}

.field-input {
  box-sizing: border-box;
  width: 100%;
  padding: 16px 20px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--foreground);
  outline: none;
  background: var(--muted);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
}

.field-input-readonly {
  cursor: not-allowed;
  opacity: 0.7;
}

.experience-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.experience-input {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 16px;
  background: var(--muted);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
}

.exp-number {
  width: 50px;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--foreground);
  text-align: center;
  outline: none;
  background: transparent;
  border: none;
}

.exp-number::-webkit-inner-spin-button,
.exp-number::-webkit-outer-spin-button {
  opacity: 1;
}

.exp-label {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.exp-hint {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-style: italic;
  color: var(--muted-foreground);
}

.chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 6px 14px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  transition: all 0.15s;
}

.chip.selected {
  color: #ffffff;
  background: var(--primary);
  border-color: var(--primary);
}

.footer-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 4px;
}

.btn {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 999px;
  transition: opacity 0.15s;
}

.btn-back {
  color: var(--foreground);
  background: var(--muted);
}

.btn-next {
  color: #ffffff;
  background: var(--primary);
}

@media (max-width: 640px) {
  .onboarding-page {
    padding: 24px 16px;
    gap: 20px;
  }

  .header-row {
    flex-wrap: wrap;
    gap: 8px;
  }

  .card-title {
    font-size: 20px;
  }

  .card-subtitle {
    font-size: 13px;
  }

  .avatar-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .footer-buttons {
    flex-direction: column-reverse;
    gap: 10px;
  }

  .btn {
    width: 100%;
  }
}
</style>
