<script
  setup
  lang="ts"
>
import { Image, Plus, Upload } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { getSettingsPhotos } from '@/services/settingsService';

const MAX_GALLERY_PHOTOS = 12;

interface Photo {
  id: string;
  url: string;
  name: string;
  uploadedAt: string;
}

const coverPhoto = ref<Photo | null>(null);
const galleryPhotos = ref<Photo[]>([]);

const emptySlots = computed(() =>
  Math.max(0, MAX_GALLERY_PHOTOS - galleryPhotos.value.length),
);

onMounted(async () => {
  const data = await getSettingsPhotos();
  if (data && data.length > 0) {
    coverPhoto.value = data[0] ?? null;
    galleryPhotos.value = data.slice(1);
  }
});

function uploadCover() {
  // Upload cover logic
}

function removeCover() {
  coverPhoto.value = null;
}

function addPhotos() {
  // Add photos logic
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

    <div class="cards-stack">
      <!-- Cover photo card -->
      <div class="card">
        <div class="cover-header">
          <h2 class="section-title">Cover photo</h2>
          <p class="section-desc">
            Displayed at the top of your public profile. Recommended 1600 × 400.
          </p>
        </div>

        <!-- Cover placeholder -->
        <div class="cover-placeholder">
          <Image
            :size="28"
            class="placeholder-icon"
          />
          <span class="cover-meta">1600 × 400 · JPG or PNG · max 5 MB</span>
        </div>

        <!-- Cover actions -->
        <div class="cover-actions">
          <button
            type="button"
            class="btn btn--outline"
            @click="uploadCover"
          >
            <Upload :size="13" />
            Upload new
          </button>
          <button
            type="button"
            class="btn btn--ghost"
            @click="removeCover"
          >
            Remove
          </button>
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
            @click="addPhotos"
          >
            <Plus :size="13" />
            Add photos
          </button>
        </div>

        <!-- Gallery grid -->
        <div class="gallery-grid">
          <div
            v-for="photo in galleryPhotos"
            :key="photo.id"
            class="gallery-item"
          >
            <Image
              :size="24"
              class="placeholder-icon"
            />
          </div>
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

/* ===== Cover placeholder ===== */
.cover-placeholder {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  height: 180px;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
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

.btn--primary {
  color: var(--primary-foreground);
  background: var(--primary);
}

.btn--primary:hover {
  background: #4639d4;
}

.btn--outline {
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
}

.btn--outline:hover {
  border-color: var(--primary);
}

.btn--ghost {
  color: var(--muted-foreground);
  background: transparent;
}

.btn--ghost:hover {
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
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  justify-content: center;
  height: 120px;
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
</style>
