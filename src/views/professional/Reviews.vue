<script
  setup
  lang="ts"
>
import {
  ChevronDown,
  ChevronRight,
  CornerDownRight,
  Flag,
  Loader2,
  Star,
  ThumbsUp,
} from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import BreadcrumbBar from '@/components/app/BreadcrumbBar.vue';
import { getMyReviews } from '@/services/reviewsService';
import type { ReviewResponse } from '@/types/user';

interface DisplayReview {
  id: string;
  author: string;
  initials: string;
  rating: number;
  date: string;
  service: string;
  text: string;
}

const loading = ref(true);

const reviews = ref<ReviewResponse[]>([]);
const withTextOnly = ref(true);

const displayReviews = computed<DisplayReview[]>(() => {
  const filtered = withTextOnly.value
    ? reviews.value.filter((r) => r.comment?.trim())
    : reviews.value;
  return filtered.map((r) => {
    const author = r.order?.client?.fullName ?? 'Client';
    const initials = author
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    return {
      id: r.id,
      author,
      initials: initials || 'CL',
      rating: r.rating,
      date: r.order?.createdDate
        ? new Date(r.order.createdDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
          })
        : '',
      service: r.order?.organizationServices?.name ?? '',
      text: r.comment || 'No comment provided.',
    };
  });
});

const summary = computed(() => {
  const total = reviews.value.length;
  const average = total
    ? reviews.value.reduce((sum, r) => sum + r.rating, 0) / total
    : 0;
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.value.filter((r) => r.rating === stars).length;
    const pct = total ? Math.round((count / total) * 100) : 0;
    return { stars, pct, barWidth: pct };
  });
  return {
    averageRating: Number(average.toFixed(1)),
    totalReviews: total,
    distribution,
  };
});

function starArray(rating: number) {
  return Array.from({ length: 5 }, (_, i) => i < rating);
}

onMounted(async () => {
  try {
    reviews.value = await getMyReviews();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="page">
    <BreadcrumbBar :items="['Workspace', 'Reviews']" />

    <div class="page-header">
      <h1 class="page-title">Reviews received</h1>
      <p class="page-subtitle">Customer feedback for your work</p>
    </div>

    <!-- Summary Row -->
    <div class="summary-row">
      <!-- Big Stat -->
      <div class="stat-card">
        <span class="big-rating">{{ summary.averageRating }}</span>
        <div class="stars-row">
          <Star
            v-for="i in 5"
            :key="i"
            :size="16"
            :color="i <= Math.round(summary.averageRating) ? '#FBBF24' : 'var(--border-soft)'"
            :fill="i <= Math.round(summary.averageRating) ? '#FBBF24' : 'none'"
          />
        </div>
        <span class="review-count">{{ summary.totalReviews }} reviews</span>
      </div>

      <!-- Distribution -->
      <div class="dist-card">
        <span class="dist-title">Distribution</span>
        <div
          v-for="d in summary.distribution"
          :key="d.stars"
          class="dist-row"
        >
          <span class="dist-star-num">{{ d.stars }}</span>
          <Star
            :size="11"
            color="#FBBF24"
            fill="#FBBF24"
          />
          <div class="dist-bar-track">
            <div
              class="dist-bar-fill"
              :style="{ width: `${d.barWidth}%` }"
            />
          </div>
          <span class="dist-pct">{{ d.pct }}%</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-row">
      <div class="filter-pill">
        <span>Rating: All</span>
        <ChevronDown
          :size="13"
          color="var(--foreground)"
        />
      </div>
      <div class="filter-pill">
        <span>Last 30 days</span>
        <ChevronDown
          :size="13"
          color="var(--foreground)"
        />
      </div>
      <div class="filter-pill toggle-pill">
        <button
          class="toggle-switch"
          :class="{ on: withTextOnly }"
          type="button"
          @click="withTextOnly = !withTextOnly"
        >
          <div class="toggle-knob" />
        </button>
        <span>With text only</span>
      </div>
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
      <span>Loading reviews…</span>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="displayReviews.length === 0"
      class="empty-state"
    >
      No reviews yet. When customers review your work, they'll appear here.
    </div>

    <!-- Review Cards -->
    <div
      v-else
      class="reviews-list"
    >
      <article
        v-for="review in displayReviews"
        :key="review.id"
        class="review-card"
      >
        <div class="review-header">
          <div class="author-section">
            <div class="author-avatar">
              {{ review.initials }}
            </div>
            <div class="author-meta">
              <span class="author-name">{{ review.author }}</span>
              <div class="meta-row">
                <div class="stars-inline">
                  <Star
                    v-for="(filled, idx) in starArray(review.rating)"
                    :key="idx"
                    :size="12"
                    color="#FBBF24"
                    :fill="filled ? '#FBBF24' : 'none'"
                  />
                </div>
                <span class="meta-sep">·</span>
                <span class="meta-text">{{ review.date }}</span>
                <span class="meta-sep">·</span>
                <span class="meta-text">{{ review.service }}</span>
              </div>
            </div>
          </div>
        </div>

        <p class="review-text">{{ review.text }}</p>

        <!-- Actions -->
        <div class="actions-row">
          <button
            class="action-btn"
            type="button"
          >
            <ThumbsUp
              :size="14"
              color="var(--muted-foreground)"
            />
            <span>Helpful</span>
          </button>
          <button
            class="action-btn"
            type="button"
          >
            <CornerDownRight
              :size="14"
              color="var(--muted-foreground)"
            />
            <span>Reply</span>
          </button>
          <button
            class="action-btn"
            type="button"
          >
            <Flag
              :size="14"
              color="var(--muted-foreground)"
            />
            <span>Report</span>
          </button>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  padding: 24px;
  overflow-y: auto;
}

.page-header {
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
  color: var(--muted-foreground);
}

/* Loading / Empty */
.loading-state {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  font-size: 14px;
  color: var(--muted-foreground);
}

.empty-state {
  padding: 60px 16px;
  font-size: 13px;
  color: var(--muted-foreground);
  text-align: center;
}

.spin {
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Summary */
.summary-row {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 14px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 18px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
}

@media (max-width: 768px) {
  .reviews-page {
    padding: 16px 12px;
  }

  .summary-row {
    grid-template-columns: 1fr;
  }

  .filters-row {
    flex-wrap: wrap;
  }
}

.big-rating {
  font-family: Inter, sans-serif;
  font-size: 48px;
  font-weight: 800;
  color: var(--foreground);
  letter-spacing: -1px;
}

.stars-row {
  display: flex;
  gap: 3px;
}

.review-count {
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted-foreground);
}

.dist-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  padding: 18px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
}

.dist-title {
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: var(--muted-foreground);
  letter-spacing: 0.5px;
}

.dist-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.dist-star-num {
  width: 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--foreground);
}

.dist-bar-track {
  flex: 1;
  height: 8px;
  overflow: hidden;
  background: var(--muted);
  border-radius: 999px;
}

.dist-bar-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 999px;
}

.dist-pct {
  width: 36px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--foreground);
  text-align: right;
}

/* Filters */
.filters-row {
  display: flex;
  gap: 8px;
}

.filter-pill {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px 12px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
  background: var(--muted);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
}

.toggle-pill {
  gap: 8px;
}

.toggle-switch {
  display: flex;
  align-items: center;
  width: 28px;
  height: 16px;
  padding: 2px;
  cursor: pointer;
  border: none;
  border-radius: 999px;
  transition: background 0.15s;
}

.toggle-switch.on {
  justify-content: end;
  background: var(--primary);
}

.toggle-switch:not(.on) {
  justify-content: start;
  background: var(--border-soft);
}

.toggle-knob {
  width: 12px;
  height: 12px;
  background: var(--card);
  border-radius: 999px;
}

/* Reviews */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
}

.review-header {
  display: flex;
  justify-content: space-between;
}

.author-section {
  display: flex;
  gap: 12px;
}

.author-avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: var(--foreground);
  background: var(--border);
  border-radius: 999px;
}

.author-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.meta-row {
  display: flex;
  gap: 4px;
  align-items: center;
}

.stars-inline {
  display: flex;
  gap: 2px;
}

.meta-sep {
  font-family: Inter, sans-serif;
  font-size: 11px;
  color: var(--muted-foreground);
}

.meta-text {
  font-family: Inter, sans-serif;
  font-size: 11px;
  color: var(--muted-foreground);
}

.review-text {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: var(--foreground);
}

.photos-row {
  display: flex;
  gap: 6px;
}

.photo-thumb {
  width: 60px;
  height: 60px;
  background: #1f2937;
  border-radius: 8px;
}

.actions-row {
  display: flex;
  gap: 14px;
  align-items: center;
}

.action-btn {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: var(--muted-foreground);
  cursor: pointer;
  background: none;
  border: none;
}

.action-btn:hover {
  color: var(--primary);
}
</style>
