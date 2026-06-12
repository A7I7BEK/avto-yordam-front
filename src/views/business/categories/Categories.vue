<script
  setup
  lang="ts"
>
import { Clock, Search } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import BreadcrumbBar from '@/components/app/BreadcrumbBar.vue';
import ToggleSwitch from '@/components/app/ToggleSwitch.vue';
import PricingDialog from '@/components/categories/PricingDialog.vue';
import { getCategories } from '@/services/categoriesService';

interface Category {
  name: string;
  count: number;
  isActive: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  enabled: boolean;
  category: string;
  notes: string;
  suggestedPriceLow: number;
  suggestedPriceHigh: number;
  suggestedDurationLow: number;
  suggestedDurationHigh: number;
}

interface CategoriesData {
  categories: Category[];
  services: Service[];
}

const data = ref<CategoriesData | null>(null);
const loading = ref(true);
const searchQuery = ref('');
const filterStatus = ref('all');
const sortBy = ref('name');
const selectedCategory = ref('Engine');
interface PricingServiceData {
  serviceName: string;
  price: number;
  durationMinutes: number;
  notes: string;
  suggestedPriceLow: number;
  suggestedPriceHigh: number;
  suggestedDurationLow: number;
  suggestedDurationHigh: number;
}

const pricingService = ref<PricingServiceData | null>(null);

onMounted(async () => {
  try {
    const result = await getCategories();
    data.value = result as unknown as CategoriesData;
  } finally {
    loading.value = false;
  }
});

const filteredServices = computed(() => {
  if (!data.value) {
    return [];
  }
  let list = data.value.services.filter(
    (s) => s.category === selectedCategory.value,
  );

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q),
    );
  }

  if (filterStatus.value === 'enabled') {
    list = list.filter((s) => s.enabled);
  } else if (filterStatus.value === 'disabled') {
    list = list.filter((s) => !s.enabled);
  }

  if (sortBy.value === 'name') {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === 'price-asc') {
    list = [...list].sort(
      (a, b) =>
        (a.price || Number.POSITIVE_INFINITY) -
        (b.price || Number.POSITIVE_INFINITY),
    );
  } else if (sortBy.value === 'price-desc') {
    list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortBy.value === 'duration') {
    list = [...list].sort((a, b) => a.durationMinutes - b.durationMinutes);
  }

  return list;
});

function selectCategory(name: string) {
  selectedCategory.value = name;
  searchQuery.value = '';
  filterStatus.value = 'all';
  sortBy.value = 'name';
}

function openPricing(service: Service) {
  pricingService.value = {
    serviceName: service.name,
    price: service.price,
    durationMinutes: service.durationMinutes,
    notes: service.notes,
    suggestedPriceLow: service.suggestedPriceLow,
    suggestedPriceHigh: service.suggestedPriceHigh,
    suggestedDurationLow: service.suggestedDurationLow,
    suggestedDurationHigh: service.suggestedDurationHigh,
  };
}

function closePricing() {
  pricingService.value = null;
}

function savePricing(data_: {
  price: number;
  durationMinutes: number;
  notes: string;
}) {
  if (!pricingService.value) {
    return;
  }
  const svc = pricingService.value;
  svc.price = data_.price;
  svc.durationMinutes = data_.durationMinutes;
  svc.notes = data_.notes;
  pricingService.value = null;
}

function formatPrice(price: number): string {
  if (price <= 0) {
    return 'Not offered';
  }
  return `${price.toLocaleString('uz-UZ')} UZS`;
}
</script>

<template>
  <div
    v-if="loading"
    class="loading-state"
  >
    <span>Loading categories...</span>
  </div>

  <div
    v-else-if="data"
    class="categories-page"
  >
    <!-- Breadcrumb -->
    <BreadcrumbBar :items="['Home', 'Categories']" />

    <!-- Title Row -->
    <div class="title-row">
      <div class="title-left">
        <h1 class="page-title">Service Categories</h1>
        <span class="curated-badge">Curated</span>
        <span class="count-badge">{{ data.categories.length }} categories</span>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="search-wrapper">
        <Search
          :size="16"
          color="#939399"
        />
        <input
          v-model="searchQuery"
          class="search-input"
          type="text"
          placeholder="Search services..."
        >
      </div>
      <div class="toolbar-filters">
        <select
          v-model="filterStatus"
          class="filter-select"
        >
          <option value="all">All status</option>
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
        </select>
        <select
          v-model="sortBy"
          class="filter-select"
        >
          <option value="name">Sort by name</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="duration">Duration</option>
        </select>
      </div>
    </div>

    <!-- Two-column layout -->
    <div class="content-layout">
      <!-- Left: Category Tree -->
      <div class="category-tree">
        <button
          v-for="(cat, cIdx) in data.categories"
          :key="cIdx"
          class="category-item"
          :class="{ active: cat.name === selectedCategory }"
          type="button"
          @click="selectCategory(cat.name)"
        >
          <span class="category-name">{{ cat.name }}</span>
          <span class="category-count">{{ cat.count }}</span>
        </button>
      </div>

      <!-- Right: Service Cards -->
      <div class="service-list">
        <div
          v-for="service in filteredServices"
          :key="service.id"
          class="service-card"
        >
          <div class="service-main">
            <div class="service-info">
              <span class="service-name">{{ service.name }}</span>
              <span class="service-desc">{{ service.description }}</span>
              <div class="service-meta">
                <span class="meta-tag">
                  <Clock
                    :size="12"
                    color="#616167"
                  />
                  {{ service.durationMinutes }}
                  min
                </span>
                <span
                  class="meta-price"
                  :class="{ 'not-offered': service.price <= 0 }"
                >
                  {{ formatPrice(service.price) }}
                </span>
              </div>
            </div>
            <div class="service-controls">
              <ToggleSwitch v-model="service.enabled" />
              <button
                class="btn-edit-pricing"
                type="button"
                @click="openPricing(service)"
              >
                Edit pricing
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="filteredServices.length === 0"
          class="empty-state"
        >
          No services found in this category.
        </div>
      </div>
    </div>

    <!-- Pricing Dialog -->
    <PricingDialog
      v-if="pricingService"
      :service="pricingService"
      @close="closePricing"
      @save="savePricing"
    />
  </div>
</template>

<style scoped>
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #616167;
}

.categories-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 24px;
  font-family: Inter, sans-serif;
}

/* Title */
.title-row {
  display: flex;
  align-items: center;
}

.title-left {
  display: flex;
  gap: 10px;
  align-items: center;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #2a2933;
}

.curated-badge {
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 500;
  color: #5749f4;
  background: #eef0ff;
  border-radius: 999px;
}

.count-badge {
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 500;
  color: #616167;
  background: #f5f5f5;
  border: 1px solid #d9d9db;
  border-radius: 999px;
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-wrapper {
  display: flex;
  flex: 1;
  gap: 8px;
  align-items: center;
  max-width: 340px;
  padding: 8px 14px;
  background: #f5f5f5;
  border: 1px solid #d9d9db;
  border-radius: 999px;
}

.search-input {
  flex: 1;
  padding: 0;
  font-family: inherit;
  font-size: 13px;
  color: #2a2933;
  outline: none;
  background: transparent;
  border: none;
}

.search-input::placeholder {
  color: #939399;
}

.toolbar-filters {
  display: flex;
  gap: 8px;
}

.filter-select {
  padding: 8px 14px;
  font-family: inherit;
  font-size: 13px;
  color: #2a2933;
  cursor: pointer;
  outline: none;
  background: #ffffff;
  border: 1px solid #d9d9db;
  border-radius: 10px;
}

.filter-select:focus {
  border-color: #5749f4;
}

/* Content Layout */
.content-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 16px;
}

/* Category Tree */
.category-tree {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 24px;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 14px;
  font-family: inherit;
  font-size: 13px;
  color: #2a2933;
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 14px;
}

.category-item.active {
  font-weight: 600;
  color: #5749f4;
  background: #eef0ff;
}

.category-item:hover:not(.active) {
  background: #f5f5f5;
}

.category-count {
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  color: #616167;
  background: #f5f5f5;
  border-radius: 999px;
}

.category-item.active .category-count {
  color: #5749f4;
  background: #ffffff;
}

/* Service Cards */
.service-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.service-card {
  padding: 16px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 24px;
}

.service-main {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
}

.service-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
}

.service-name {
  font-size: 15px;
  font-weight: 600;
  color: #2a2933;
}

.service-desc {
  font-size: 13px;
  color: #616167;
}

.service-meta {
  display: flex;
  gap: 14px;
  align-items: center;
}

.meta-tag {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 12px;
  color: #616167;
}

.meta-price {
  font-size: 13px;
  font-weight: 600;
  color: #2a2933;
}

.meta-price.not-offered {
  font-weight: 500;
  color: #cc3314;
}

.service-controls {
  display: flex;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
}

.btn-edit-pricing {
  padding: 6px 14px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: #5749f4;
  white-space: nowrap;
  cursor: pointer;
  background: #eef0ff;
  border: none;
  border-radius: 8px;
}

.btn-edit-pricing:hover {
  background: #dfe1ff;
}

.empty-state {
  padding: 40px;
  font-size: 14px;
  color: #616167;
  text-align: center;
}
</style>
