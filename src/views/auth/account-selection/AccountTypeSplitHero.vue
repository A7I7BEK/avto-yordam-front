<script
  setup
  lang="ts"
>
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Check,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wallet,
  Wrench,
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

function goToProfessional() {
  router.push({ name: 'professional-auth' });
}

function goToBusiness() {
  router.push({ name: 'business-auth' });
}
</script>

<template>
  <div class="page">
    <!-- Left Panel - Branding Hero -->
    <div class="left-panel">
      <div class="glow glow-1" />
      <div class="glow glow-2" />
      <div class="ring" />

      <div class="left-content">
        <!-- Brand Section -->
        <div class="brand-section">
          <div class="logo-box">
            <Wrench
              :size="20"
              color="#5749F4"
            />
          </div>
          <span class="brand-name">Professional</span>
        </div>

        <!-- Middle Section -->
        <div class="middle-section">
          <div class="eyebrow-chip">
            <Sparkles
              :size="14"
              color="#FFFFFF"
            />
            <span>Welcome to Avto Yordam</span>
          </div>

          <h1 class="headline">Your craft. Your hours. Your income.</h1>

          <p class="hero-paragraph">
            Masters connects skilled repair professionals and growing businesses
            with the customers who need them — across the whole city, every day.
          </p>

          <div class="bullets">
            <div class="bullet-row">
              <div class="bullet-icon-box">
                <CalendarCheck
                  :size="18"
                  color="#FFFFFF"
                />
              </div>
              <span>Work on a schedule that fits your life</span>
            </div>
            <div class="bullet-row">
              <div class="bullet-icon-box">
                <Wallet
                  :size="18"
                  color="#FFFFFF"
                />
              </div>
              <span>Get paid quickly after every job</span>
            </div>
            <div class="bullet-row">
              <div class="bullet-icon-box">
                <ShieldCheck
                  :size="18"
                  color="#FFFFFF"
                />
              </div>
              <span>Join a verified, trusted community</span>
            </div>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="stats-section">
          <div class="stat">
            <span class="stat-value">12K+</span>
            <span class="stat-label">Active masters</span>
          </div>
          <div class="stat-divider" />
          <div class="stat">
            <span class="stat-value">4.9</span>
            <span class="stat-label">Average rating</span>
          </div>
          <div class="stat-divider" />
          <div class="stat">
            <span class="stat-value">98%</span>
            <span class="stat-label">Jobs completed</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel - Account Selection -->
    <div class="right-panel">
      <!-- Cards -->
      <div class="right-cards">
        <!-- Professional Card -->
        <div class="card">
          <div class="card-header">
            <div class="icon-box icon-box-pro">
              <UserRound
                :size="28"
                color="#FFFFFF"
              />
            </div>
            <span class="badge">For individuals</span>
          </div>

          <h2 class="card-title">Professional</h2>
          <p class="card-desc">
            Work independently — accept jobs near you, set your own rates and
            grow your reputation.
          </p>

          <div class="divider" />

          <div class="features">
            <div class="feature-row">
              <div class="check-circle">
                <Check
                  :size="12"
                  color="#5749F4"
                />
              </div>
              <span>Set your own rates &amp; schedule</span>
            </div>
            <div class="feature-row">
              <div class="check-circle">
                <Check
                  :size="12"
                  color="#5749F4"
                />
              </div>
              <span>Get matched with nearby jobs</span>
            </div>
            <div class="feature-row">
              <div class="check-circle">
                <Check
                  :size="12"
                  color="#5749F4"
                />
              </div>
              <span>Fast payouts after every job</span>
            </div>
          </div>

          <button
            class="cta-button"
            type="button"
            @click="goToProfessional"
          >
            <span>Continue as Pro</span>
            <ArrowRight
              :size="18"
              color="#FFFFFF"
            />
          </button>
        </div>

        <!-- Business Card -->
        <div class="card">
          <div class="card-header">
            <div class="icon-box icon-box-biz">
              <Building2
                :size="28"
                color="#FFFFFF"
              />
            </div>
            <span class="badge">For companies</span>
          </div>

          <h2 class="card-title">Business</h2>
          <p class="card-desc">
            Manage your auto service — handle bookings, team, earnings and grow
            your business.
          </p>

          <div class="divider" />

          <div class="features">
            <div class="feature-row">
              <div class="check-circle">
                <Check
                  :size="12"
                  color="#5749F4"
                />
              </div>
              <span>Manage your team &amp; schedule</span>
            </div>
            <div class="feature-row">
              <div class="check-circle">
                <Check
                  :size="12"
                  color="#5749F4"
                />
              </div>
              <span>Track earnings &amp; transactions</span>
            </div>
            <div class="feature-row">
              <div class="check-circle">
                <Check
                  :size="12"
                  color="#5749F4"
                />
              </div>
              <span>Grow with customer reviews</span>
            </div>
          </div>

          <button
            class="cta-button"
            type="button"
            @click="goToBusiness"
          >
            <span>Continue as Business</span>
            <ArrowRight
              :size="18"
              color="#FFFFFF"
            />
          </button>
        </div>

        <!-- Footer -->
        <div class="footer">
          <span class="footer-text">Already have an account?</span>
          <button
            class="footer-link"
            type="button"
            @click="goToProfessional"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
}

/* Left Panel */
.left-panel {
  position: relative;
  flex-shrink: 0;
  width: 600px;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(225deg, #6b5ef9 0%, #5749f4 52%, #342b9e 100%);
}

.glow {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
}

.glow-1 {
  top: -190px;
  left: 300px;
  width: 480px;
  height: 480px;
  background: rgba(255, 255, 255, 0.078);
}

.glow-2 {
  top: 560px;
  left: 360px;
  width: 380px;
  height: 380px;
  background: rgba(255, 255, 255, 0.059);
}

.ring {
  position: absolute;
  top: 650px;
  left: -130px;
  width: 320px;
  height: 320px;
  pointer-events: none;
  border: 1.5px solid rgba(255, 255, 255, 0.169);
  border-radius: 50%;
}

.left-content {
  position: absolute;
  top: 56px;
  left: 56px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 488px;
  height: calc(100% - 112px);
}

.brand-section {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #ffffff;
  border-radius: 10px;
}

.brand-name {
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
}

.middle-section {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.eyebrow-chip {
  display: flex;
  gap: 8px;
  align-items: center;
  width: fit-content;
  padding: 7px 14px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.3px;
  background: rgba(255, 255, 255, 0.141);
  border-radius: 999px;
}

.headline {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 40px;
  font-weight: 700;
  line-height: 1.15;
  color: #ffffff;
}

.hero-paragraph {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.769);
}

.bullets {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bullet-row {
  display: flex;
  gap: 14px;
  align-items: center;
}

.bullet-icon-box {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: rgba(255, 255, 255, 0.122);
  border-radius: 12px;
}

.bullet-row span {
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.902);
}

.stats-section {
  display: flex;
  gap: 22px;
  align-items: center;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.stat-value {
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
}

.stat-label {
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.161);
}

/* Right Panel */
.right-panel {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 48px;
}

.right-cards {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  width: 100%;
  max-width: 460px;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 32px;
  background: #ffffff;
  border: 1px solid #c5c5cb;
  border-radius: 40px;
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.059);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 24px;
}

.icon-box-pro {
  background: #5749f4;
}

.icon-box-biz {
  background: #2a2933;
}

.badge {
  padding: 6px 12px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #616167;
  background: #f5f5f5;
  border-radius: 999px;
}

.card-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #2a2933;
}

.card-desc {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #616167;
}

.divider {
  width: 100%;
  height: 1px;
  background: #c5c5cb;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.feature-row span {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #2a2933;
}

.check-circle {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: rgba(87, 73, 244, 0.102);
  border-radius: 999px;
}

.cta-button {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px 20px;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  background: #5749f4;
  border: none;
  border-radius: 999px;
  transition: opacity 0.15s;
}

.cta-button:hover {
  opacity: 0.9;
}

.footer {
  display: flex;
  gap: 6px;
  align-items: center;
}

.footer-text {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #616167;
}

.footer-link {
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #5749f4;
  cursor: pointer;
  background: none;
  border: none;
}

.footer-link:hover {
  text-decoration: underline;
}
</style>
