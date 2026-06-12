<script
  setup
  lang="ts"
>
import { Star } from '@lucide/vue';
</script>

<template>
  <div class="reviews-page">
    <div class="reviews-header">
      <h1 class="page-title">Reviews</h1>
      <p class="page-subtitle">Customer feedback and ratings</p>
    </div>
    <div class="empty-state">
      <Star
        :size="48"
        color="#939399"
      />
      <h3>No reviews yet</h3>
      <p>Customer reviews will appear here once they start coming in.</p>
    </div>
  </div>
</template>

<style scoped>
.reviews-page {
  padding: 24px 32px;
  font-family: var(--font-primary);
  color: var(--foreground);
}

.reviews-header {
  margin-bottom: 40px;
}

.page-title {
  margin: 0 0 4px;
  font-size: 22px;
  font-weight: 700;
  color: var(--foreground);
}

.page-subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--muted-foreground);
}

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
  color: var(--foreground);
}

.empty-state p {
  max-width: 360px;
  margin: 0;
  font-size: 14px;
  color: var(--muted-foreground);
}
</style>
