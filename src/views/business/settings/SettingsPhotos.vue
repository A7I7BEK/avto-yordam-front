<script
  setup
  lang="ts"
>
import { Image, Plus, Trash2 } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { getSettingsPhotos } from '@/services/settingsService';

interface Photo {
  id: string;
  url: string;
  name: string;
  uploadedAt: string;
}

const photos = ref<Photo[]>([]);

onMounted(async () => {
  const data = await getSettingsPhotos();
  if (data) {
    photos.value = [...data];
  }
});

function addPhoto() {
  // Add photo logic
}

function deletePhoto(id: string) {
  photos.value = photos.value.filter((p) => p.id !== id);
}
</script>

<template>
  <div class="settings-page">
    <div class="header-row">
      <h1 class="page-title">Photos</h1>
      <button
        type="button"
        class="btn btn--primary"
        @click="addPhoto"
      >
        <Plus :size="16" />
        Add photo
      </button>
    </div>

    <div class="photos-grid">
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="photo-card"
      >
        <div class="photo-card__image">
          <Image
            :size="36"
            color="#d9d9db"
          />
        </div>
        <div class="photo-card__info">
          <span class="photo-card__name">{{ photo.name }}</span>
          <span class="photo-card__date">{{ photo.uploadedAt }}</span>
        </div>
        <button
          type="button"
          class="btn-icon"
          title="Delete photo"
          @click="deletePhoto(photo.id)"
        >
          <Trash2 :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  padding: 24px 32px;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #2a2933;
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

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.photo-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border: 1px solid #d9d9db;
  border-radius: 10px;
  transition: box-shadow 0.15s;
}

.photo-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.photo-card__image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 140px;
  background: #f5f5f5;
  border-radius: 8px;
}

.photo-card__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.photo-card__name {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #2a2933;
}

.photo-card__date {
  font-family: Inter, sans-serif;
  font-size: 11px;
  color: #939399;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  align-self: flex-end;
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
  color: #cc3314;
  background: #fee9e5;
}
</style>
