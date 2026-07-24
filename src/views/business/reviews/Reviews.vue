<script
  setup
  lang="ts"
>
import {
  ArrowLeft,
  ChevronRight,
  Loader2,
  MessageSquare,
  Star,
  Trash2,
  User,
  Wrench,
} from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { deleteReview, getReviews } from '@/services/reviewsService';
import type { ReviewResponse } from '@/types/user';

const reviews = ref<ReviewResponse[]>([]);
const loading = ref(true);
const selectedReview = ref<ReviewResponse | null>(null);

onMounted(async () => {
  try {
    reviews.value = await getReviews();
  } finally {
    loading.value = false;
  }
});

function selectReview(review: ReviewResponse) {
  selectedReview.value = review;
}

function goBack() {
  selectedReview.value = null;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function formatPrice(price: number | null): string {
  if (!price) {
    return '—';
  }
  return `${(price / 1000).toFixed(0)}K UZS`;
}

function renderStars(): number[] {
  return [1, 2, 3, 4, 5];
}

async function handleDelete(id: string) {
  await deleteReview(id);
  reviews.value = reviews.value.filter((r) => r.id !== id);
  if (selectedReview.value?.id === id) {
    selectedReview.value = null;
  }
}
</script>

<template>
  <div class="reviews-page">
    <!-- Header -->
    <div class="reviews-header">
      <h1 class="page-title">Reviews</h1>
      <p class="page-subtitle">Customer feedback and ratings</p>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="loading-state"
    >
      <Loader2
        :size="24"
        class="spin"
      />
      <span>Loading reviews...</span>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="reviews.length === 0 && !selectedReview"
      class="empty-state"
    >
      <Star
        :size="48"
        color="#939399"
      />
      <h3>No reviews yet</h3>
      <p>Customer reviews will appear here once they start coming in.</p>
    </div>

    <!-- Content -->
    <template v-else>
      <div class="reviews-layout">
        <!-- List panel -->
        <div
          v-if="!selectedReview"
          class="review-list"
        >
          <div
            v-for="review in reviews"
            :key="review.id"
            class="review-card"
            @click="selectReview(review)"
          >
            <div class="review-card__header">
              <div class="review-card__stars">
                <Star
                  v-for="s in renderStars()"
                  :key="s"
                  :size="14"
                  :class="s <= review.rating ? 'star-filled' : 'star-empty'"
                />
              </div>
              <span class="review-card__rating">{{ review.rating }}.0</span>
            </div>
            <span class="review-card__client">
              {{ review.order?.client?.fullName ?? 'Unknown' }}
            </span>
            <span class="review-card__service">
              {{ review.order?.organizationServices?.name ?? '—' }}
            </span>
            <p class="review-card__comment">
              {{ review.comment }}
            </p>
            <div class="review-card__footer">
              <span class="review-card__date">
                {{ review.order?.createdDate ? formatDate(review.order.createdDate) : '—' }}
              </span>
              <span class="review-card__master">
                <User :size="12" />
                {{ review.order?.master?.fullName ?? '—' }}
              </span>
            </div>
            <ChevronRight
              :size="16"
              class="review-card__chevron"
            />
          </div>
        </div>

        <!-- Detail panel -->
        <div
          v-if="selectedReview"
          class="review-detail"
        >
          <button
            class="back-btn"
            type="button"
            @click="goBack"
          >
            <ArrowLeft :size="16" />
            Back to reviews
          </button>

          <div class="detail-card">
            <!-- Rating -->
            <div class="detail-rating">
              <div class="detail-rating__stars">
                <Star
                  v-for="s in renderStars()"
                  :key="s"
                  :size="20"
                  :class="s <= selectedReview.rating ? 'star-filled' : 'star-empty'"
                />
              </div>
              <span class="detail-rating__value">
                {{ selectedReview.rating }}
                / 5
              </span>
            </div>

            <!-- Comment -->
            <div class="detail-section">
              <div class="detail-section__header">
                <MessageSquare :size="16" />
                <span>Customer comment</span>
              </div>
              <p class="detail-comment">{{ selectedReview.comment }}</p>
            </div>

            <div class="detail-divider" />

            <!-- Customer info -->
            <div class="detail-section">
              <div class="detail-section__header">
                <User :size="16" />
                <span>Customer</span>
              </div>
              <div class="detail-info-row">
                <span class="detail-label">Name</span>
                <span class="detail-value">
                  {{ selectedReview.order?.client?.fullName ?? '—' }}
                </span>
              </div>
              <div class="detail-info-row">
                <span class="detail-label">Phone</span>
                <span class="detail-value">
                  {{ selectedReview.order?.client?.phone ?? '—' }}
                </span>
              </div>
              <div class="detail-info-row">
                <span class="detail-label">Email</span>
                <span class="detail-value">
                  {{ selectedReview.order?.client?.email ?? '—' }}
                </span>
              </div>
            </div>

            <div class="detail-divider" />

            <!-- Order info -->
            <div class="detail-section">
              <div class="detail-section__header">
                <Wrench :size="16" />
                <span>Order details</span>
              </div>
              <div class="detail-info-row">
                <span class="detail-label">Service</span>
                <span class="detail-value">
                  {{ selectedReview.order?.organizationServices?.name ?? '—' }}
                </span>
              </div>
              <div class="detail-info-row">
                <span class="detail-label">Car</span>
                <span class="detail-value">
                  {{ selectedReview.order?.carDescription || '—' }}
                </span>
              </div>
              <div class="detail-info-row">
                <span class="detail-label">Problem</span>
                <span class="detail-value">
                  {{ selectedReview.order?.problemDescription || '—' }}
                </span>
              </div>
              <div class="detail-info-row">
                <span class="detail-label">Price</span>
                <span class="detail-value">
                  {{ formatPrice(selectedReview.order?.finalPrice ?? selectedReview.order?.estimatedPrice ?? null) }}
                </span>
              </div>
              <div class="detail-info-row">
                <span class="detail-label">Date</span>
                <span class="detail-value">
                  {{ selectedReview.order?.createdDate ? formatDate(selectedReview.order.createdDate) : '—' }}
                </span>
              </div>
              <div class="detail-info-row">
                <span class="detail-label">Status</span>
                <span class="detail-value detail-value--status">
                  {{ selectedReview.order?.status ?? '—' }}
                </span>
              </div>
            </div>

            <div class="detail-divider" />

            <!-- Master info -->
            <div class="detail-section">
              <div class="detail-section__header">
                <Wrench :size="16" />
                <span>Master</span>
              </div>
              <div class="detail-info-row">
                <span class="detail-label">Name</span>
                <span class="detail-value">
                  {{ selectedReview.order?.master?.fullName ?? '—' }}
                </span>
              </div>
              <div class="detail-info-row">
                <span class="detail-label">Phone</span>
                <span class="detail-value">
                  {{ selectedReview.order?.master?.phone ?? '—' }}
                </span>
              </div>
            </div>

            <!-- Delete -->
            <div class="detail-delete">
              <button
                class="delete-btn"
                type="button"
                @click="handleDelete(selectedReview.id)"
              >
                <Trash2 :size="14" />
                Delete review
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.reviews-page {
  height: 100%;
  padding: 24px 32px;
  font-family: Inter, sans-serif;
  color: #2a2933;
}

.reviews-header {
  margin-bottom: 24px;
}

.page-title {
  margin: 0 0 4px;
  font-size: 22px;
  font-weight: 700;
}

.page-subtitle {
  margin: 0;
  font-size: 14px;
  color: #616167;
}

/* Loading */
.loading-state {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  font-size: 14px;
  color: #616167;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Empty */
.empty-state {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  text-align: center;
}

.empty-state h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.empty-state p {
  max-width: 360px;
  margin: 0;
  font-size: 14px;
  color: #616167;
}

/* Layout */
.reviews-layout {
  height: calc(100% - 60px);
}

/* Review List */
.review-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  padding-right: 4px;
  overflow-y: auto;
}

.review-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 40px 16px 16px;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 16px;
  transition: border-color 0.15s;
}

.review-card:hover {
  border-color: #5749f4;
}

.review-card__header {
  display: flex;
  gap: 8px;
  align-items: center;
}

.review-card__stars {
  display: flex;
  gap: 2px;
}

.star-filled {
  color: #f59e0b;
  fill: #f59e0b;
}

.star-empty {
  color: #d1d5db;
}

.review-card__rating {
  font-size: 13px;
  font-weight: 600;
}

.review-card__client {
  font-size: 15px;
  font-weight: 600;
}

.review-card__service {
  font-size: 12px;
  color: #616167;
}

.review-card__comment {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  line-height: 1.4;
  color: #616167;
  white-space: nowrap;
}

.review-card__footer {
  display: flex;
  gap: 16px;
  align-items: center;
}

.review-card__date {
  font-size: 11px;
  color: #939399;
}

.review-card__master {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 11px;
  color: #939399;
}

.review-card__chevron {
  position: absolute;
  top: 50%;
  right: 16px;
  color: #c5c5cb;
  transform: translateY(-50%);
}

/* Detail Panel */
.review-detail {
  height: 100%;
  overflow-y: auto;
}

.back-btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 8px 14px;
  margin-bottom: 16px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #616167;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 999px;
}

.detail-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 24px;
}

.detail-rating {
  display: flex;
  gap: 12px;
  align-items: center;
}

.detail-rating__stars {
  display: flex;
  gap: 4px;
}

.detail-rating__value {
  font-size: 18px;
  font-weight: 700;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-section__header {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
}

.detail-comment {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #2a2933;
}

.detail-divider {
  width: 100%;
  height: 1px;
  background: #c5c5cb;
}

.detail-info-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.detail-label {
  flex-shrink: 0;
  width: 100px;
  font-size: 12px;
  font-weight: 500;
  color: #616167;
}

.detail-value {
  font-size: 13px;
  font-weight: 500;
}

.detail-value--status {
  text-transform: uppercase;
}

.detail-delete {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
}

.delete-btn {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 16px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #cc3314;
  cursor: pointer;
  background: transparent;
  border: 1px solid #cc3314;
  border-radius: 999px;
}

.delete-btn:hover {
  background: #fff5f5;
}
</style>
