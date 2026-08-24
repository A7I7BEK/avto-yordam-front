<script
  setup
  lang="ts"
>
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  Save,
  Sparkles,
  UserRound,
} from '@lucide/vue';
import { nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { apiClient } from '@/api/client';
import { refreshAccessToken } from '@/services/auth/tokenService';

const PHONE_REGEX = /^\+998\d{9}$/;
const INN_REGEX = /^\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PINFL_REGEX = /^\d{14}$/;
const PASSPORT_REGEX = /^[A-Z]{2}\d{7}$/;
const OKED_REGEX = /^\d{4,5}$/;
const BANK_ACCOUNT_REGEX = /^\d{20}$/;
const MFO_REGEX = /^\d{5}$/;

const router = useRouter();
const currentStep = ref(1);

function stepTitleFor(step: number): string {
  if (step === 1) {
    return 'General Info';
  }
  if (step === 2) {
    return 'Legal Entity Details';
  }
  return 'Bank Accounts';
}

function stepSubtitleFor(step: number): string {
  if (step === 1) {
    return 'Select your service center format and enter contact details.';
  }
  if (step === 2) {
    return 'Provide registered documentations associated with your format.';
  }
  return 'Add banking details where payouts will settle (optional).';
}
const isLoading = ref(false);
const errorMessage = ref('');
const userId = ref('');

const form = reactive({
  type: 'MCHJ', // MCHJ, YATT, SELF_EMPLOYED
  name: '',
  description: '',
  phone: '',
  email: '',
  latitude: '',
  longitude: '',
  address: '',
  inn: '',
  bankAccount: '',
  mfo: '',
  bankName: '',
  yattDetails: {
    fullName: '',
    passportSeries: '',
    pinfl: '',
    registrationNumber: '',
    registeredDate: '',
  },
  companyDetails: {
    directorFullName: '',
    directorPinfl: '',
    registrationNumber: '',
    registeredDate: '',
    oked: '',
    charterCapital: null as number | null,
  },
  selfEmployedDetails: {
    fullName: '',
    pinfl: '',
    passportSeries: '',
    activityType: '',
  },
});

const errors = reactive<Record<string, string>>({});

const orgTypes = [
  {
    value: 'MCHJ',
    label: 'Limited Liability Company (MCHJ)',
    desc: 'Standard legal entity structure for repair centers & businesses.',
    icon: Building2,
  },
  {
    value: 'YATT',
    label: 'Individual Entrepreneur (YTT)',
    desc: 'Sole-proprietor setup with private business structure.',
    icon: Briefcase,
  },
  {
    value: 'SELF_EMPLOYED',
    label: 'Self Employed (Solo Master)',
    desc: 'Independent master working without a commercial entity.',
    icon: UserRound,
  },
];

let mapInstance: any = null;
let markerInstance: any = null;

const loadLeaflet = () =>
  new Promise<void>((resolve) => {
    if ((window as any).L) {
      resolve();
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => resolve();
    document.head.appendChild(script);
  });

const initMap = async () => {
  await loadLeaflet();

  const L = (window as any).L;
  if (!L) {
    return;
  }

  if (mapInstance) {
    try {
      mapInstance.remove();
    } catch {
      // The previous map instance may already be detached from the DOM.
    }
    mapInstance = null;
  }

  const defaultLat = form.latitude
    ? Number.parseFloat(form.latitude)
    : 41.311_081;
  const defaultLng = form.longitude
    ? Number.parseFloat(form.longitude)
    : 69.240_562;

  form.latitude = defaultLat.toFixed(6);
  form.longitude = defaultLng.toFixed(6);

  mapInstance = L.map('map').setView([defaultLat, defaultLng], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(mapInstance);

  markerInstance = L.marker([defaultLat, defaultLng], {
    draggable: true,
  }).addTo(mapInstance);

  const updateCoordinates = (lat: number, lng: number) => {
    form.latitude = lat.toFixed(6);
    form.longitude = lng.toFixed(6);
  };

  markerInstance.on('dragend', () => {
    const position = markerInstance.getLatLng();
    updateCoordinates(position.lat, position.lng);
  });

  mapInstance.on('click', (e: any) => {
    const latlng = e.latlng;
    markerInstance.setLatLng(latlng);
    updateCoordinates(latlng.lat, latlng.lng);
  });
};

watch(currentStep, async (newStep) => {
  if (newStep === 1) {
    await nextTick();
    initMap();
  }
});

onMounted(async () => {
  try {
    const userRes = await apiClient.get('/user/me');
    userId.value = userRes.id;
    if (userRes.phone) {
      form.phone = userRes.phone;
    }
  } catch {
    router.push({ name: 'auth-login', query: { type: 'business' } });
  }

  if (currentStep.value === 1) {
    await nextTick();
    initMap();
  }
});

function validateStep1(): boolean {
  for (const key of Object.keys(errors)) {
    delete errors[key];
  }

  if (!form.name.trim()) {
    errors.name = 'Organization name is required.';
  } else if (form.name.length < 2 || form.name.length > 255) {
    errors.name = 'Name must be between 2 and 255 characters.';
  }

  if (!form.address.trim()) {
    errors.address = 'Address is required.';
  }

  const cleanPhone = form.phone.replace(/[^0-9+]/g, '');
  if (!cleanPhone) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_REGEX.test(cleanPhone)) {
    errors.phone = 'Phone must be in format +998XXXXXXXXX.';
  }

  if (!form.inn.trim()) {
    errors.inn = 'INN is required.';
  } else if (!INN_REGEX.test(form.inn.trim())) {
    errors.inn = 'INN must be exactly 9 digits.';
  }

  if (form.email && !EMAIL_REGEX.test(form.email)) {
    errors.email = 'Invalid email format.';
  }

  return Object.keys(errors).length === 0;
}

function validateMchjStep2(): void {
  const details = form.companyDetails;
  if (!details.directorFullName.trim()) {
    errors.directorFullName = 'Director full name is required.';
  }
  if (!details.directorPinfl.trim()) {
    errors.directorPinfl = 'Director PINFL is required.';
  } else if (!PINFL_REGEX.test(details.directorPinfl.trim())) {
    errors.directorPinfl = 'PINFL must be exactly 14 digits.';
  }
  if (!details.registrationNumber.trim()) {
    errors.registrationNumber = 'Registration number is required.';
  }
  if (details.oked && !OKED_REGEX.test(details.oked.trim())) {
    errors.oked = 'OKED must be 4 or 5 digits.';
  }
  if (details.charterCapital !== null && details.charterCapital <= 0) {
    errors.charterCapital = 'Charter capital must be positive.';
  }
}

function validateYattStep2(): void {
  const details = form.yattDetails;
  if (!details.fullName.trim()) {
    errors.yattFullName = 'Full name is required.';
  }
  if (!details.passportSeries.trim()) {
    errors.yattPassport = 'Passport series is required.';
  } else if (!PASSPORT_REGEX.test(details.passportSeries.trim())) {
    errors.yattPassport = 'Passport must be in format AB1234567.';
  }
  if (!details.pinfl.trim()) {
    errors.yattPinfl = 'PINFL is required.';
  } else if (!PINFL_REGEX.test(details.pinfl.trim())) {
    errors.yattPinfl = 'PINFL must be exactly 14 digits.';
  }
  if (!details.registrationNumber.trim()) {
    errors.yattRegistrationNumber = 'Registration number is required.';
  }
}

function validateSelfEmployedStep2(): void {
  const details = form.selfEmployedDetails;
  if (!details.fullName.trim()) {
    errors.seFullName = 'Full name is required.';
  } else if (details.fullName.length < 2 || details.fullName.length > 255) {
    errors.seFullName = 'Full name must be between 2 and 255 characters.';
  }
  if (!details.pinfl.trim()) {
    errors.sePinfl = 'PINFL is required.';
  } else if (!PINFL_REGEX.test(details.pinfl.trim())) {
    errors.sePinfl = 'PINFL must be exactly 14 digits.';
  }
  if (!details.passportSeries.trim()) {
    errors.sePassportSeries = 'Passport series is required.';
  } else if (!PASSPORT_REGEX.test(details.passportSeries.trim())) {
    errors.sePassportSeries = 'Passport must be in format AB1234567.';
  }
  if (!details.activityType.trim()) {
    errors.seActivityType = 'Activity type is required.';
  }
}

function validateStep2(): boolean {
  for (const key of Object.keys(errors)) {
    delete errors[key];
  }

  if (form.type === 'MCHJ') {
    validateMchjStep2();
  } else if (form.type === 'YATT') {
    validateYattStep2();
  } else if (form.type === 'SELF_EMPLOYED') {
    validateSelfEmployedStep2();
  }

  return Object.keys(errors).length === 0;
}

function validateStep3(): boolean {
  for (const key of Object.keys(errors)) {
    delete errors[key];
  }

  if (form.bankAccount && !BANK_ACCOUNT_REGEX.test(form.bankAccount.trim())) {
    errors.bankAccount = 'Bank account must be exactly 20 digits.';
  }
  if (form.mfo && !MFO_REGEX.test(form.mfo.trim())) {
    errors.mfo = 'MFO must be exactly 5 digits.';
  }

  return Object.keys(errors).length === 0;
}

function goNext() {
  if (currentStep.value === 1) {
    if (validateStep1()) {
      currentStep.value = 2;
    }
  } else if (currentStep.value === 2 && validateStep2()) {
    currentStep.value = 3;
  }
}

function goBack() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

async function submit() {
  if (!validateStep3()) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  const cleanPhone = form.phone.replace(/[^0-9+]/g, '');
  const cleanPhoneFormatted = cleanPhone.startsWith('+')
    ? cleanPhone
    : `+${cleanPhone}`;

  const payload: any = {
    type: form.type,
    name: form.name,
    description: form.description || null,
    phone: cleanPhoneFormatted,
    email: form.email || null,
    latitude: form.latitude ? Number(form.latitude) : null,
    longitude: form.longitude ? Number(form.longitude) : null,
    address: form.address,
    ownerId: userId.value,
    inn: form.inn,
    bankAccount: form.bankAccount || null,
    mfo: form.mfo || null,
    bankName: form.bankName || null,
  };

  if (form.type === 'MCHJ') {
    payload.companyDetails = {
      directorFullName: form.companyDetails.directorFullName,
      directorPinfl: form.companyDetails.directorPinfl,
      registrationNumber: form.companyDetails.registrationNumber,
      registeredDate: form.companyDetails.registeredDate || null,
      oked: form.companyDetails.oked || null,
      charterCapital: form.companyDetails.charterCapital || null,
    };
  } else if (form.type === 'YATT') {
    payload.yattDetails = {
      fullName: form.yattDetails.fullName,
      passportSeries: form.yattDetails.passportSeries,
      pinfl: form.yattDetails.pinfl,
      registrationNumber: form.yattDetails.registrationNumber,
      registeredDate: form.yattDetails.registeredDate || null,
    };
  } else if (form.type === 'SELF_EMPLOYED') {
    payload.selfEmployedDetails = {
      fullName: form.selfEmployedDetails.fullName,
      pinfl: form.selfEmployedDetails.pinfl,
      passportSeries: form.selfEmployedDetails.passportSeries,
      activityType: form.selfEmployedDetails.activityType,
    };
  }

  try {
    await apiClient.post('/organization', payload);
    await refreshAccessToken();
    router.push({ name: 'biz-dashboard-overview' });
  } catch (e: any) {
    errorMessage.value =
      e.message || 'Failed to create organization. Please review fields.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="onboarding-page">
    <!-- Header -->
    <div class="header-row">
      <div class="brand-header">
        <div class="brand-icon-box">
          <Building2
            :size="20"
            color="var(--background)"
          />
        </div>
        <span class="brand-text">Business Center</span>
      </div>
      <span class="step-label">Step {{ currentStep }} of 3</span>
    </div>

    <!-- Stepper Progress Bar -->
    <div class="progress-container">
      <div
        class="progress-bar-fill"
        :style="{ width: `${(currentStep / 3) * 100}%` }"
      />
    </div>

    <!-- Title Section -->
    <div class="title-section">
      <h1 class="page-title">
        {{ stepTitleFor(currentStep) }}
      </h1>
      <p class="page-subtitle">
        {{ stepSubtitleFor(currentStep) }}
      </p>
    </div>

    <div
      v-if="errorMessage"
      class="error-notice"
    >
      <span>{{ errorMessage }}</span>
    </div>

    <!-- MAIN FORM CONTAINER -->
    <div class="form-card">
      <!-- STEP 1: GENERAL INFO -->
      <div
        v-if="currentStep === 1"
        class="step-content"
      >
        <div class="field-group">
          <label class="field-label">Service center format</label>
          <div class="types-grid">
            <div
              v-for="item in orgTypes"
              :key="item.value"
              class="type-box"
              :class="{ selected: form.type === item.value }"
              role="button"
              tabindex="0"
              @click="form.type = item.value"
              @keydown.enter="form.type = item.value"
            >
              <div class="type-box-icon">
                <component
                  :is="item.icon"
                  :size="22"
                  :color="form.type === item.value ? 'var(--primary-foreground)' : 'var(--foreground)'"
                />
              </div>
              <div class="type-box-text">
                <span class="type-title">{{ item.label }}</span>
                <span class="type-desc">{{ item.desc }}</span>
              </div>
              <div
                v-if="form.type === item.value"
                class="checked-badge"
              >
                <Check
                  :size="12"
                  color="var(--primary-foreground)"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Organization name</label>
          <input
            v-model="form.name"
            class="field-input"
            type="text"
            placeholder="e.g. Premium AutoFix MCHJ"
          >
          <span
            v-if="errors.name"
            class="field-error"
            >{{ errors.name }}</span
          >
        </div>

        <div class="row">
          <div class="field-group">
            <label class="field-label">Contact phone number</label>
            <input
              v-model="form.phone"
              class="field-input"
              type="text"
              placeholder="+998 90 123 45 67"
            >
            <span
              v-if="errors.phone"
              class="field-error"
              >{{ errors.phone }}</span
            >
          </div>

          <div class="field-group">
            <label class="field-label">INN (Tax identification number)</label>
            <input
              v-model="form.inn"
              class="field-input"
              type="text"
              placeholder="9 digits (e.g. 307284921)"
            >
            <span
              v-if="errors.inn"
              class="field-error"
              >{{ errors.inn }}</span
            >
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Email address (optional)</label>
          <input
            v-model="form.email"
            class="field-input"
            type="email"
            placeholder="workspace@autofix.uz"
          >
          <span
            v-if="errors.email"
            class="field-error"
            >{{ errors.email }}</span
          >
        </div>

        <div class="field-group">
          <label class="field-label">Address</label>
          <input
            v-model="form.address"
            class="field-input"
            type="text"
            placeholder="e.g. Tashkent, Yunusabad district, Block 12, 14"
          >
          <span
            v-if="errors.address"
            class="field-error"
            >{{ errors.address }}</span
          >
        </div>

        <!-- Leaflet map element instead of coordinates inputs -->
        <div class="field-group">
          <label class="field-label">Pin location on map</label>
          <div
            id="map"
            class="map-container"
          />
          <div
            v-if="form.latitude && form.longitude"
            class="coordinates-badge"
          >
            Selected coordinates: {{ form.latitude }}, {{ form.longitude }}
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Description (optional)</label>
          <textarea
            v-model="form.description"
            class="field-textarea"
            rows="3"
            placeholder="Provide a brief summary of the services offered."
          />
        </div>
      </div>

      <!-- STEP 2: LEGAL DETAILS -->
      <div
        v-if="currentStep === 2"
        class="step-content"
      >
        <!-- MCHJ (Company Details) -->
        <div
          v-if="form.type === 'MCHJ'"
          class="details-block"
        >
          <div class="field-group">
            <label class="field-label">Director full name</label>
            <input
              v-model="form.companyDetails.directorFullName"
              class="field-input"
              type="text"
              placeholder="e.g. Rustam Karimov"
            >
            <span
              v-if="errors.directorFullName"
              class="field-error"
              >{{ errors.directorFullName }}</span
            >
          </div>

          <div class="field-group">
            <label class="field-label">Director PINFL (14 digits)</label>
            <input
              v-model="form.companyDetails.directorPinfl"
              class="field-input"
              type="text"
              placeholder="e.g. 31402914820192"
            >
            <span
              v-if="errors.directorPinfl"
              class="field-error"
              >{{ errors.directorPinfl }}</span
            >
          </div>

          <div class="row">
            <div class="field-group">
              <label class="field-label">Registration number</label>
              <input
                v-model="form.companyDetails.registrationNumber"
                class="field-input"
                type="text"
                placeholder="e.g. REG-847291"
              >
              <span
                v-if="errors.registrationNumber"
                class="field-error"
                >{{ errors.registrationNumber }}</span
              >
            </div>

            <div class="field-group">
              <label class="field-label">Registration date</label>
              <input
                v-model="form.companyDetails.registeredDate"
                class="field-input date-input"
                type="date"
              >
            </div>
          </div>

          <div class="row">
            <div class="field-group">
              <label class="field-label">OKED (4-5 digits, optional)</label>
              <input
                v-model="form.companyDetails.oked"
                class="field-input"
                type="text"
                placeholder="e.g. 45200"
              >
              <span
                v-if="errors.oked"
                class="field-error"
                >{{ errors.oked }}</span
              >
            </div>

            <div class="field-group">
              <label class="field-label">Charter capital (UZS, optional)</label>
              <input
                v-model.number="form.companyDetails.charterCapital"
                class="field-input"
                type="number"
                placeholder="e.g. 10000000"
              >
              <span
                v-if="errors.charterCapital"
                class="field-error"
                >{{ errors.charterCapital }}</span
              >
            </div>
          </div>
        </div>

        <!-- YATT Details -->
        <div
          v-if="form.type === 'YATT'"
          class="details-block"
        >
          <div class="field-group">
            <label class="field-label">Full name</label>
            <input
              v-model="form.yattDetails.fullName"
              class="field-input"
              type="text"
              placeholder="e.g. Sherzod Alimov"
            >
            <span
              v-if="errors.yattFullName"
              class="field-error"
              >{{ errors.yattFullName }}</span
            >
          </div>

          <div class="row">
            <div class="field-group">
              <label class="field-label">Passport series & number</label>
              <input
                v-model="form.yattDetails.passportSeries"
                class="field-input"
                type="text"
                placeholder="e.g. AA1234567"
              >
              <span
                v-if="errors.yattPassport"
                class="field-error"
                >{{ errors.yattPassport }}</span
              >
            </div>

            <div class="field-group">
              <label class="field-label">PINFL (14 digits)</label>
              <input
                v-model="form.yattDetails.pinfl"
                class="field-input"
                type="text"
                placeholder="e.g. 31402914820192"
              >
              <span
                v-if="errors.yattPinfl"
                class="field-error"
                >{{ errors.yattPinfl }}</span
              >
            </div>
          </div>

          <div class="row">
            <div class="field-group">
              <label class="field-label">Registration number</label>
              <input
                v-model="form.yattDetails.registrationNumber"
                class="field-input"
                type="text"
                placeholder="e.g. YTT-948291"
              >
              <span
                v-if="errors.yattRegistrationNumber"
                class="field-error"
                >{{ errors.yattRegistrationNumber }}</span
              >
            </div>

            <div class="field-group">
              <label class="field-label">Registration date</label>
              <input
                v-model="form.yattDetails.registeredDate"
                class="field-input date-input"
                type="date"
              >
            </div>
          </div>
        </div>

        <!-- SELF_EMPLOYED Details -->
        <div
          v-if="form.type === 'SELF_EMPLOYED'"
          class="details-block"
        >
          <div class="field-group">
            <label class="field-label">Full name</label>
            <input
              v-model="form.selfEmployedDetails.fullName"
              class="field-input"
              type="text"
              placeholder="e.g. Aziz Karimov"
            >
            <span
              v-if="errors.seFullName"
              class="field-error"
              >{{ errors.seFullName }}</span
            >
          </div>

          <div class="row">
            <div class="field-group">
              <label class="field-label">Passport series & number</label>
              <input
                v-model="form.selfEmployedDetails.passportSeries"
                class="field-input"
                type="text"
                placeholder="e.g. AA1234567"
              >
              <span
                v-if="errors.sePassportSeries"
                class="field-error"
                >{{ errors.sePassportSeries }}</span
              >
            </div>

            <div class="field-group">
              <label class="field-label">PINFL (14 digits)</label>
              <input
                v-model="form.selfEmployedDetails.pinfl"
                class="field-input"
                type="text"
                placeholder="e.g. 31402914820192"
              >
              <span
                v-if="errors.sePinfl"
                class="field-error"
                >{{ errors.sePinfl }}</span
              >
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Activity type</label>
            <input
              v-model="form.selfEmployedDetails.activityType"
              class="field-input"
              type="text"
              placeholder="e.g. Auto repair service, diagnostics"
            >
            <span
              v-if="errors.seActivityType"
              class="field-error"
              >{{ errors.seActivityType }}</span
            >
          </div>
        </div>
      </div>

      <!-- STEP 3: BANK DETAILS (OPTIONAL) -->
      <div
        v-if="currentStep === 3"
        class="step-content"
      >
        <div class="field-group">
          <label class="field-label">Bank name</label>
          <input
            v-model="form.bankName"
            class="field-input"
            type="text"
            placeholder="e.g. Hamkorbank — Tashkent City"
          >
        </div>

        <div class="field-group">
          <label class="field-label">Bank account number (20 digits)</label>
          <input
            v-model="form.bankAccount"
            class="field-input"
            type="text"
            placeholder="e.g. 20208000900123478965"
          >
          <span
            v-if="errors.bankAccount"
            class="field-error"
            >{{ errors.bankAccount }}</span
          >
        </div>

        <div class="field-group">
          <label class="field-label">MFO code (5 digits)</label>
          <input
            v-model="form.mfo"
            class="field-input"
            type="text"
            placeholder="e.g. 00832"
          >
          <span
            v-if="errors.mfo"
            class="field-error"
            >{{ errors.mfo }}</span
          >
        </div>
      </div>

      <!-- NAV CONTROLS -->
      <div class="actions-row">
        <button
          v-if="currentStep > 1"
          class="nav-button prev-btn"
          type="button"
          @click="goBack"
        >
          <ArrowLeft :size="16" />
          <span>Back</span>
        </button>

        <button
          v-if="currentStep < 3"
          class="nav-button next-btn"
          type="button"
          @click="goNext"
        >
          <span>Next step</span>
          <ArrowRight :size="16" />
        </button>

        <button
          v-else
          class="submit-btn"
          type="button"
          :disabled="isLoading"
          @click="submit"
        >
          <component
            :is="isLoading ? Sparkles : Save"
            :size="18"
            color="var(--primary-foreground)"
          />
          <span
            >{{ isLoading ? 'Creating Organization...' : 'Create & Complete' }}</span
          >
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding-page {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 36px;
  width: 100%;
  max-width: 680px;
  min-height: 100vh;
  padding: 40px 24px;
  margin: 0 auto;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.brand-header {
  display: flex;
  gap: 10px;
  align-items: center;
}

.brand-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--foreground);
  border-radius: 10px;
}

.brand-text {
  font-family: Inter, sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
}

.step-label {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--muted-foreground);
}

.progress-container {
  width: 100%;
  height: 6px;
  overflow: hidden;
  background: var(--muted);
  border-radius: 3px;
}

.progress-bar-fill {
  height: 100%;
  background: var(--primary);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: var(--foreground);
}

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--muted-foreground);
}

.error-notice {
  padding: 14px 20px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: var(--destructive);
  background: var(--destructive-soft);
  border: 1px solid var(--destructive-soft);
  border-radius: 12px;
}

.form-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding: 32px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 40px;
  box-shadow: 0 10px 8.75px rgba(0, 0, 0, 0.039);
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field-group {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.field-input,
.field-textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 16px 20px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--foreground);
  outline: none;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 20px;
  transition: all 0.2s ease;
}

.field-textarea {
  resize: vertical;
}

.field-input:focus,
.field-textarea:focus {
  background: var(--card);
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(87, 73, 244, 0.1);
}

.field-error {
  margin-top: 2px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: var(--destructive);
}

.row {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

@media (max-width: 640px) {
  .row {
    flex-direction: column;
    gap: 20px;
  }
}

.types-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.type-box {
  position: relative;
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 18px;
  cursor: pointer;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 24px;
  transition: all 0.2s ease;
}

.type-box:hover {
  background: var(--primary-tint);
  border-color: var(--primary);
}

.type-box.selected {
  background: rgba(87, 73, 244, 0.04);
  border-color: var(--primary);
}

.type-box-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--accent);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.type-box.selected .type-box-icon {
  background: var(--primary);
}

.type-box-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.type-title {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.type-desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  line-height: 1.4;
  color: var(--muted-foreground);
}

.checked-badge {
  position: absolute;
  top: 18px;
  right: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: var(--primary);
  border-radius: 50%;
}

.map-container {
  z-index: 1;
  width: 100%;
  height: 280px;
  margin-top: 6px;
  border: 1px solid var(--border-soft);
  border-radius: 24px;
}

.coordinates-badge {
  display: inline-block;
  align-self: flex-start;
  padding: 6px 12px;
  margin-top: 8px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--primary);
  background: rgba(87, 73, 244, 0.08);
  border-radius: 12px;
}

.date-input {
  cursor: pointer;
}

.details-block {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.actions-row {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  width: 100%;
  margin-top: 10px;
}

.nav-button,
.submit-btn {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: 0 24px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 20px;
  transition: all 0.2s ease;
}

.prev-btn {
  color: var(--foreground);
  background: var(--card);
  border: 1px solid var(--border-soft);
}

.prev-btn:hover {
  background: var(--accent);
}

.next-btn {
  color: var(--background);
  background: var(--foreground);
  border: none;
}

.next-btn:hover {
  background: #1b1a20;
}

.submit-btn {
  flex: 1;
  color: var(--primary-foreground);
  background: var(--primary);
  border: none;
}

.submit-btn:hover:not(:disabled) {
  background: #4739d4;
}

.submit-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
