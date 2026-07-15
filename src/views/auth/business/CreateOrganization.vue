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

const router = useRouter();
const currentStep = ref(1);
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
    passport: '',
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
    passportGivenDate: '',
    activityType: '',
    phoneNumber: '',
    address: '',
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
    value: 'YTT',
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
    } catch (_) {}
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
      form.selfEmployedDetails.phoneNumber = userRes.phone;
    }
  } catch (_) {
    router.push({ name: 'auth-login', query: { type: 'business' } });
  }

  if (currentStep.value === 1) {
    await nextTick();
    initMap();
  }
});

function validateStep1(): boolean {
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (!form.name.trim()) {
    errors.name = 'Organization name is required.';
  } else if (form.name.length < 2 || form.name.length > 255) {
    errors.name = 'Name must be between 2 and 255 characters.';
  }

  if (!form.address.trim()) {
    errors.address = 'Address is required.';
  }

  const cleanPhone = form.phone.replace(/[^0-9+]/g, '');
  const phoneRegex = /^\+998\d{9}$/;
  if (!cleanPhone) {
    errors.phone = 'Phone number is required.';
  } else if (!phoneRegex.test(cleanPhone)) {
    errors.phone = 'Phone must be in format +998XXXXXXXXX.';
  }

  const innRegex = /^\d{9}$/;
  if (!form.inn.trim()) {
    errors.inn = 'INN is required.';
  } else if (!innRegex.test(form.inn.trim())) {
    errors.inn = 'INN must be exactly 9 digits.';
  }

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Invalid email format.';
  }

  return Object.keys(errors).length === 0;
}

function validateStep2(): boolean {
  Object.keys(errors).forEach((key) => delete errors[key]);

  const pinflRegex = /^\d{14}$/;
  const passportRegex = /^[A-Z]{2}\d{7}$/;

  if (form.type === 'MCHJ') {
    const details = form.companyDetails;
    if (!details.directorFullName.trim()) {
      errors.directorFullName = 'Director full name is required.';
    }
    if (!details.directorPinfl.trim()) {
      errors.directorPinfl = 'Director PINFL is required.';
    } else if (!pinflRegex.test(details.directorPinfl.trim())) {
      errors.directorPinfl = 'PINFL must be exactly 14 digits.';
    }
    if (!details.registrationNumber.trim()) {
      errors.registrationNumber = 'Registration number is required.';
    }
    if (details.oked && !/^\d{4,5}$/.test(details.oked.trim())) {
      errors.oked = 'OKED must be 4 or 5 digits.';
    }
    if (details.charterCapital !== null && details.charterCapital <= 0) {
      errors.charterCapital = 'Charter capital must be positive.';
    }
  } else if (form.type === 'YATT') {
    const details = form.yattDetails;
    if (!details.fullName.trim()) {
      errors.yattFullName = 'Full name is required.';
    }
    if (!details.passport.trim()) {
      errors.yattPassport = 'Passport is required.';
    } else if (!passportRegex.test(details.passport.trim())) {
      errors.yattPassport = 'Passport must be in format AB1234567.';
    }
    if (!details.pinfl.trim()) {
      errors.yattPinfl = 'PINFL is required.';
    } else if (!pinflRegex.test(details.pinfl.trim())) {
      errors.yattPinfl = 'PINFL must be exactly 14 digits.';
    }
    if (!details.registrationNumber.trim()) {
      errors.yattRegistrationNumber = 'Registration number is required.';
    }
  } else if (form.type === 'SELF_EMPLOYED') {
    const details = form.selfEmployedDetails;
    if (!details.fullName.trim()) {
      errors.seFullName = 'Full name is required.';
    } else if (details.fullName.length < 2 || details.fullName.length > 255) {
      errors.seFullName = 'Full name must be between 2 and 255 characters.';
    }
    if (!details.pinfl.trim()) {
      errors.sePinfl = 'PINFL is required.';
    } else if (!pinflRegex.test(details.pinfl.trim())) {
      errors.sePinfl = 'PINFL must be exactly 14 digits.';
    }
    if (!details.passportSeries.trim()) {
      errors.sePassportSeries = 'Passport series is required.';
    } else if (!passportRegex.test(details.passportSeries.trim())) {
      errors.sePassportSeries = 'Passport must be in format AB1234567.';
    }
    if (!details.passportGivenDate) {
      errors.sePassportGivenDate = 'Passport given date is required.';
    }
    if (!details.activityType.trim()) {
      errors.seActivityType = 'Activity type is required.';
    }
    const cleanSePhone = details.phoneNumber.replace(/[^0-9+]/g, '');
    if (!cleanSePhone) {
      errors.sePhone = 'Phone number is required.';
    } else if (!/^\+998\d{9}$/.test(cleanSePhone)) {
      errors.sePhone = 'Phone must be in format +998XXXXXXXXX.';
    }
  }

  return Object.keys(errors).length === 0;
}

function validateStep3(): boolean {
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (form.bankAccount && !/^\d{20}$/.test(form.bankAccount.trim())) {
    errors.bankAccount = 'Bank account must be exactly 20 digits.';
  }
  if (form.mfo && !/^\d{5}$/.test(form.mfo.trim())) {
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
    latitude: form.latitude || null,
    longitude: form.longitude || null,
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
      passport: form.yattDetails.passport,
      pinfl: form.yattDetails.pinfl,
      registrationNumber: form.yattDetails.registrationNumber,
      registeredDate: form.yattDetails.registeredDate || null,
    };
  } else if (form.type === 'SELF_EMPLOYED') {
    const cleanSePhone = form.selfEmployedDetails.phoneNumber.replace(
      /[^0-9+]/g,
      '',
    );
    payload.selfEmployedDetails = {
      fullName: form.selfEmployedDetails.fullName,
      pinfl: form.selfEmployedDetails.pinfl,
      passportSeries: form.selfEmployedDetails.passportSeries,
      passportGivenDate: form.selfEmployedDetails.passportGivenDate || null,
      activityType: form.selfEmployedDetails.activityType,
      phoneNumber: cleanSePhone.startsWith('+')
        ? cleanSePhone
        : `+${cleanSePhone}`,
      address: form.selfEmployedDetails.address || null,
    };
  }

  try {
    await apiClient.post('/organization', payload);
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
            color="#FFFFFF"
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
        {{ currentStep === 1
            ? 'General Info'
            : currentStep === 2
              ? 'Legal Entity Details'
              : 'Bank Accounts' }}
      </h1>
      <p class="page-subtitle">
        {{ currentStep === 1
            ? 'Select your service center format and enter contact details.'
            : currentStep === 2
              ? 'Provide registered documentations associated with your format.'
              : 'Add banking details where payouts will settle (optional).' }}
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
                  :color="form.type === item.value ? '#FFFFFF' : '#2A2933'"
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
                  color="#FFFFFF"
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
                v-model="form.yattDetails.passport"
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
              <label class="field-label">Passport given date</label>
              <input
                v-model="form.selfEmployedDetails.passportGivenDate"
                class="field-input date-input"
                type="date"
              >
              <span
                v-if="errors.sePassportGivenDate"
                class="field-error"
                >{{ errors.sePassportGivenDate }}</span
              >
            </div>
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

          <div class="field-group">
            <label class="field-label">Phone number</label>
            <input
              v-model="form.selfEmployedDetails.phoneNumber"
              class="field-input"
              type="text"
              placeholder="+998 90 123 45 67"
            >
            <span
              v-if="errors.sePhone"
              class="field-error"
              >{{ errors.sePhone }}</span
            >
          </div>

          <div class="field-group">
            <label class="field-label">Address (optional)</label>
            <input
              v-model="form.selfEmployedDetails.address"
              class="field-input"
              type="text"
              placeholder="e.g. Tashkent, Yunusabad district"
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
            color="#FFFFFF"
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
  background: #2a2933;
  border-radius: 10px;
}

.brand-text {
  font-family: Inter, sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #2a2933;
}

.step-label {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #616167;
}

.progress-container {
  width: 100%;
  height: 6px;
  overflow: hidden;
  background: #eaeaea;
  border-radius: 3px;
}

.progress-bar-fill {
  height: 100%;
  background: #5749f4;
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
  color: #2a2933;
}

.page-subtitle {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #616167;
}

.error-notice {
  padding: 14px 20px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #c53030;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 12px;
}

.form-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding: 32px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
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
  color: #2a2933;
}

.field-input,
.field-textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 16px 20px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #2a2933;
  outline: none;
  background: #fcfcfc;
  border: 1px solid #c5c5cb;
  border-radius: 20px;
  transition: all 0.2s ease;
}

.field-textarea {
  resize: vertical;
}

.field-input:focus,
.field-textarea:focus {
  background: #ffffff;
  border-color: #5749f4;
  box-shadow: 0 0 0 4px rgba(87, 73, 244, 0.1);
}

.field-error {
  margin-top: 2px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #e53e3e;
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
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 24px;
  transition: all 0.2s ease;
}

.type-box:hover {
  background: #f9f9ff;
  border-color: #5749f4;
}

.type-box.selected {
  background: rgba(87, 73, 244, 0.04);
  border-color: #5749f4;
}

.type-box-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: #f5f5f7;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.type-box.selected .type-box-icon {
  background: #5749f4;
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
  color: #2a2933;
}

.type-desc {
  font-family: Inter, sans-serif;
  font-size: 12px;
  line-height: 1.4;
  color: #616167;
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
  background: #5749f4;
  border-radius: 50%;
}

.map-container {
  z-index: 1;
  width: 100%;
  height: 280px;
  margin-top: 6px;
  border: 1px solid #c5c5cb;
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
  color: #5749f4;
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
  color: #2a2933;
  background: #ffffff;
  border: 1px solid #c5c5cb;
}

.prev-btn:hover {
  background: #f5f5f7;
}

.next-btn {
  color: #ffffff;
  background: #2a2933;
  border: none;
}

.next-btn:hover {
  background: #1b1a20;
}

.submit-btn {
  flex: 1;
  color: #ffffff;
  background: #5749f4;
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
