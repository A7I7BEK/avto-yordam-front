<script
  setup
  lang="ts"
>
import {
  ChevronDown,
  ChevronRight,
  CornerDownRight,
  Flag,
  Star,
  ThumbsUp,
} from 'lucide-vue-next';
import { ref } from 'vue';
import BreadcrumbBar from '@/components/app/BreadcrumbBar.vue';

const summary = {
  averageRating: 4.8,
  totalReviews: 327,
  distribution: [
    { stars: 5, pct: 82, barWidth: 82 },
    { stars: 4, pct: 13, barWidth: 13 },
    { stars: 3, pct: 3, barWidth: 3 },
    { stars: 2, pct: 1, barWidth: 1 },
    { stars: 1, pct: 1, barWidth: 1 },
  ],
};

const reviews = [
  {
    id: 1,
    author: 'Nilufar Umarova',
    initials: 'NU',
    rating: 5,
    date: '10 May',
    service: 'Brake pads exchange',
    text: "Akmal did a thorough job on my Cobalt's front brakes. He explained what was worn out and showed me the old pads before throwing them away. Honest pricing, fast turnaround. Will come back for the rear set when due.",
    photos: 2,
    helpfulCount: 12,
  },
  {
    id: 2,
    author: 'Bekzod Aliyev',
    initials: 'BA',
    rating: 5,
    date: '8 May',
    service: 'Engine diagnostic',
    text: 'Very professional. Found the issue immediately and fixed it same day. Reasonable prices. Highly recommended.',
    photos: 0,
    helpfulCount: 8,
  },
  {
    id: 3,
    author: 'Sabina Rahimova',
    initials: 'SR',
    rating: 4,
    date: '5 May',
    service: 'A/C service',
    text: 'Did a good job with the A/C recharge. Took a bit longer than expected but the result is perfect. Car is ice cold now.',
    photos: 1,
    helpfulCount: 3,
  },
  {
    id: 4,
    author: 'Jahongir Sotimov',
    initials: 'JS',
    rating: 5,
    date: '2 May',
    service: 'Transmission flush',
    text: "Best mechanic I've worked with in Tashkent. Explained everything clearly and the price was fair. Will definitely return.",
    photos: 0,
    helpfulCount: 15,
  },
];

const withTextOnly = ref(true);

function starArray(rating: number) {
  return Array.from({ length: 5 }, (_, i) => i < rating);
}
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
            :color="i <= Math.round(summary.averageRating) ? '#FBBF24' : '#C5C5CB'"
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
          color="#2A2933"
        />
      </div>
      <div class="filter-pill">
        <span>Last 30 days</span>
        <ChevronDown
          :size="13"
          color="#2A2933"
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

    <!-- Review Cards -->
    <div class="reviews-list">
      <article
        v-for="review in reviews"
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

        <!-- Photos -->
        <div
          v-if="review.photos > 0"
          class="photos-row"
        >
          <div
            v-for="p in review.photos"
            :key="p"
            class="photo-thumb"
          />
        </div>

        <!-- Actions -->
        <div class="actions-row">
          <button
            class="action-btn"
            type="button"
          >
            <ThumbsUp
              :size="14"
              color="#616167"
            />
            <span>Helpful ({{ review.helpfulCount }})</span>
          </button>
          <button
            class="action-btn"
            type="button"
          >
            <CornerDownRight
              :size="14"
              color="#616167"
            />
            <span>Reply</span>
          </button>
          <button
            class="action-btn"
            type="button"
          >
            <Flag
              :size="14"
              color="#616167"
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
  color: #2a2933;
}

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #616167;
}

/* Summary */
.summary-row {
  display: flex;
  gap: 14px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  justify-content: center;
  width: 280px;
  padding: 18px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 16px;
}

.big-rating {
  font-family: Inter, sans-serif;
  font-size: 48px;
  font-weight: 800;
  color: #2a2933;
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
  color: #616167;
}

.dist-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  padding: 18px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 16px;
}

.dist-title {
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: #616167;
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
  color: #2a2933;
}

.dist-bar-track {
  flex: 1;
  height: 8px;
  overflow: hidden;
  background: #f5f5f5;
  border-radius: 999px;
}

.dist-bar-fill {
  height: 100%;
  background: #5749f4;
  border-radius: 999px;
}

.dist-pct {
  width: 36px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #2a2933;
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
  color: #2a2933;
  background: #f5f5f5;
  border: 1px solid #c5c5cb;
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
  background: #5749f4;
}

.toggle-switch:not(.on) {
  justify-content: start;
  background: #c5c5cb;
}

.toggle-knob {
  width: 12px;
  height: 12px;
  background: #ffffff;
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
  background: #ffffff;
  border: 1px solid #c5c5cb;
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
  color: #2a2933;
  background: #d9d9db;
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
  color: #2a2933;
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
  color: #616167;
}

.meta-text {
  font-family: Inter, sans-serif;
  font-size: 11px;
  color: #616167;
}

.review-text {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: #2a2933;
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
  color: #616167;
  cursor: pointer;
  background: none;
  border: none;
}

.action-btn:hover {
  color: #5749f4;
}
</style>
