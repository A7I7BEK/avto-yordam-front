<script
  setup
  lang="ts"
>
import { Image, Loader2, Plus, Trash2, Upload, X } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import ConfirmDialog from '@/components/app/ConfirmDialog.vue';
import {
  deleteOrganizationFile,
  getDownloadUrl,
  getOrganizationFilesByType,
  type OrganizationFileResponse,
  updateOrganizationFile,
  uploadOrganizationFile,
} from '@/services/documentsService';

const MAX_GALLERY_PHOTOS = 12;

const coverPhoto = ref<OrganizationFileResponse | null>(null);
const galleryPhotos = ref<OrganizationFileResponse[]>([]);
const loading = ref(false);
const uploadingCover = ref(false);
const uploadingGallery = ref(false);
const deletingPhotoId = ref<string | null>(null);
const errorMsg = ref<string | null>(null);

const coverInputRef = ref<HTMLInputElement | null>(null);
const galleryInputRef = ref<HTMLInputElement | null>(null);

// Confirmation dialogs
const confirmRemoveCover = ref(false);
const confirmDeletePhotoId = ref<string | null>(null);

const emptySlots = computed(() =>
  Math.max(0, MAX_GALLERY_PHOTOS - galleryPhotos.value.length),
);

onMounted(async () => {
  await loadPhotos();
});

async function loadPhotos() {
  loading.value = true;
  errorMsg.value = null;
  try {
    const data = await getOrganizationFilesByType('PHOTO');
    coverPhoto.value = data.find((p) => p.isCover) ?? null;
    galleryPhotos.value = data.filter((p) => !p.isCover);
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : 'Failed to load photos';
  } finally {
    loading.value = false;
  }
}

function triggerUploadCover() {
  coverInputRef.value?.click();
}

async function onCoverSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return;
  }

  uploadingCover.value = true;
  errorMsg.value = null;
  try {
    if (coverPhoto.value) {
      // Replace the existing cover via the update endpoint
      const saved = await updateOrganizationFile(
        coverPhoto.value.id,
        file,
        'PHOTO',
        true,
      );
      coverPhoto.value = saved;
    } else {
      const saved = await uploadOrganizationFile(file, 'PHOTO', true);
      coverPhoto.value = saved;
    }
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : 'Cover upload failed';
  } finally {
    uploadingCover.value = false;
    input.value = '';
  }
}

function askRemoveCover() {
  if (coverPhoto.value) {
    confirmRemoveCover.value = true;
  }
}

async function performRemoveCover() {
  if (!coverPhoto.value) {
    return;
  }
  uploadingCover.value = true;
  errorMsg.value = null;
  try {
    await deleteOrganizationFile(coverPhoto.value.id);
    coverPhoto.value = null;
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : 'Failed to remove cover';
  } finally {
    uploadingCover.value = false;
    confirmRemoveCover.value = false;
  }
}

function triggerAddPhotos() {
  galleryInputRef.value?.click();
}

async function onGallerySelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files ?? []);
  if (files.length === 0) {
    return;
  }

  // Respect the gallery limit: only upload what fits in the remaining slots
  const availableSlots = MAX_GALLERY_PHOTOS - galleryPhotos.value.length;
  const toUpload = files.slice(0, availableSlots);

  uploadingGallery.value = true;
  errorMsg.value = null;
  try {
    for (const file of toUpload) {
      const saved = await uploadOrganizationFile(file, 'PHOTO', false);
      galleryPhotos.value.push(saved);
    }
    if (files.length > availableSlots) {
      errorMsg.value = `Maximum gallery photos is ${MAX_GALLERY_PHOTOS}`;
    }
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : 'Upload failed';
  } finally {
    uploadingGallery.value = false;
    input.value = '';
  }
}

function askDeletePhoto(id: string) {
  confirmDeletePhotoId.value = id;
}

async function performDeletePhoto() {
  const id = confirmDeletePhotoId.value;
  if (!id) {
    return;
  }
  deletingPhotoId.value = id;
  errorMsg.value = null;
  try {
    await deleteOrganizationFile(id);
    galleryPhotos.value = galleryPhotos.value.filter((p) => p.id !== id);
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : 'Failed to delete photo';
  } finally {
    deletingPhotoId.value = null;
    confirmDeletePhotoId.value = null;
  }
}
</script>

<template>
  <div class="operating-hours">
    <!-- Page header -->
    <div class="page-header">
      <h1 class="page-title">Photos</h1>
      <p class="page-subtitle">
        Photos shown on your public organization profile and to customers
        browsing service providers.
      </p>
    </div>

    <!-- Error banner -->
    <div
      v-if="errorMsg"
      class="error-banner"
    >
      <span>{{ errorMsg }}</span>
      <button
        type="button"
        class="error-dismiss"
        @click="errorMsg = null"
      >
        <X :size="14" />
      </button>
    </div>

    <!-- Loading state -->
    <div
      v-if="loading"
      class="loading-state"
    >
      <Loader2
        :size="28"
        class="spin"
      />
      <span>Loading photos…</span>
    </div>

    <div
      v-else
      class="cards-stack"
    >
      <!-- Cover photo card -->
      <div class="card">
        <div class="cover-header">
          <h2 class="section-title">Cover photo</h2>
          <p class="section-desc">
            Displayed at the top of your public profile. Recommended 1600 × 400.
          </p>
        </div>

        <!-- Cover placeholder or Image -->
        <div class="cover-container">
          <div
            v-if="coverPhoto"
            class="cover-image-wrapper"
          >
            <img
              :src="getDownloadUrl(coverPhoto.file.id)"
              alt="Cover"
              class="cover-image"
            >
          </div>
          <div
            v-else
            class="cover-placeholder"
          >
            <Loader2
              v-if="uploadingCover"
              :size="28"
              class="spin placeholder-icon"
            />
            <Image
              v-else
              :size="28"
              class="placeholder-icon"
            />
            <span class="cover-meta">
              {{ uploadingCover ? 'Uploading cover photo…' : '1600 × 400 · JPG or PNG · max 5 MB' }}
            </span>
          </div>
        </div>

        <!-- Cover actions -->
        <div class="cover-actions">
          <button
            type="button"
            class="btn btn--outline"
            :disabled="uploadingCover"
            @click="triggerUploadCover"
          >
            <Loader2
              v-if="uploadingCover"
              :size="13"
              class="spin"
            />
            <Upload
              v-else
              :size="13"
            />
            Upload new
          </button>
          <button
            v-if="coverPhoto"
            type="button"
            class="btn btn--ghost"
            :disabled="uploadingCover"
            @click="askRemoveCover"
          >
            Remove
          </button>
          <input
            ref="coverInputRef"
            type="file"
            accept="image/*"
            style="display: none"
            @change="onCoverSelected"
          >
        </div>
      </div>

      <!-- Gallery card -->
      <div class="card">
        <div class="gallery-header">
          <div class="gallery-header-text">
            <h2 class="section-title">Gallery</h2>
            <p class="section-desc">
              Up to 12 photos of your workshop, team and completed work.
            </p>
          </div>
          <button
            type="button"
            class="btn btn--primary"
            :disabled="uploadingGallery || galleryPhotos.length >= MAX_GALLERY_PHOTOS"
            @click="triggerAddPhotos"
          >
            <Loader2
              v-if="uploadingGallery"
              :size="13"
              class="spin"
            />
            <Plus
              v-else
              :size="13"
            />
            Add photos
          </button>
          <input
            ref="galleryInputRef"
            type="file"
            multiple
            accept="image/*"
            style="display: none"
            @change="onGallerySelected"
          >
        </div>

        <!-- Gallery grid -->
        <div class="gallery-grid">
          <!-- Loaded Gallery Images -->
          <div
            v-for="photo in galleryPhotos"
            :key="photo.id"
            class="gallery-item has-image"
          >
            <img
              :src="getDownloadUrl(photo.file.id)"
              alt="Gallery showcase"
              class="gallery-image"
            >
            <div class="gallery-item-overlay">
              <button
                type="button"
                class="delete-btn"
                :disabled="deletingPhotoId === photo.id"
                @click="askDeletePhoto(photo.id)"
              >
                <Loader2
                  v-if="deletingPhotoId === photo.id"
                  :size="14"
                  class="spin"
                />
                <Trash2
                  v-else
                  :size="14"
                />
              </button>
            </div>
          </div>
          <!-- Empty Slots -->
          <div
            v-for="n in emptySlots"
            :key="`empty-${n}`"
            class="gallery-item"
          >
            <Image
              :size="24"
              class="placeholder-icon"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Remove cover confirmation -->
    <ConfirmDialog
      :is-open="confirmRemoveCover"
      title="Remove cover photo?"
      message="This removes the cover photo from your public profile. You can upload a new one at any time."
      confirm-label="Remove"
      :loading="uploadingCover"
      @cancel="confirmRemoveCover = false"
      @confirm="performRemoveCover"
    />

    <!-- Delete gallery photo confirmation -->
    <ConfirmDialog
      :is-open="confirmDeletePhotoId !== null"
      title="Delete this photo?"
      message="This permanently removes the photo from your gallery. This action can't be undone."
      confirm-label="Delete"
      :loading="deletingPhotoId !== null"
      @cancel="confirmDeletePhotoId = null"
      @confirm="performDeletePhoto"
    />
  </div>
</template>

<style scoped>
/* ===== Page header ===== */
.page-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--foreground);
}

.page-subtitle {
  max-width: 720px;
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Error banner ===== */
.error-banner {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #7c1400;
  background: #fde8e3;
  border: 1px solid #f5bfb4;
  border-radius: 12px;
}

.error-dismiss {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  color: #7c1400;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 4px;
}

.error-dismiss:hover {
  background: #f5bfb4;
}

/* ===== Loading ===== */
.loading-state {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: var(--muted-foreground);
}

/* ===== Cards stack ===== */
.cards-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ===== Card ===== */
.card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

/* ===== Section titles ===== */
.cover-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.section-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
}

.section-desc {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted-foreground);
}

/* ===== Cover placeholder and Image ===== */
.cover-container {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.cover-image-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
  background: var(--accent);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  height: 180px;
  background: var(--accent);
}

.placeholder-icon {
  flex-shrink: 0;
  color: var(--muted-foreground);
}

.cover-meta {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
}

/* ===== Cover actions ===== */
.cover-actions {
  display: flex;
  gap: 8px;
}

/* ===== Buttons ===== */
.btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-pill);
  transition:
    background 0.15s,
    border-color 0.15s;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn--primary {
  color: var(--primary-foreground);
  background: var(--primary);
}

.btn--primary:not(:disabled):hover {
  background: #4639d4;
}

.btn--outline {
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
}

.btn--outline:not(:disabled):hover {
  border-color: var(--primary);
}

.btn--ghost {
  color: var(--muted-foreground);
  background: transparent;
}

.btn--ghost:not(:disabled):hover {
  color: var(--foreground);
  background: var(--accent);
}

/* ===== Gallery header ===== */
.gallery-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.gallery-header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* ===== Gallery grid ===== */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.gallery-item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  justify-content: center;
  height: 120px;
  overflow: hidden;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-item-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 40%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.gallery-item:hover .gallery-item-overlay {
  opacity: 1;
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: #fff;
  cursor: pointer;
  background: rgb(204 51 20 / 80%);
  border: none;
  border-radius: 50%;
  transition:
    background 0.2s,
    transform 0.2s;
}

.delete-btn:hover {
  background: rgb(204 51 20 / 100%);
  transform: scale(1.05);
}

.delete-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* ===== Spin animation ===== */
.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
